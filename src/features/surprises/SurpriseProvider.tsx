
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { persistence } from '../../lib/persistence';
import { ACHIEVEMENTS, THEMES, COLLECTIBLES, KONAMI_SEQUENCE } from './data';
import type { AchievementDef } from './types';

interface SurpriseState {
  achievements: Record<string, boolean>;
  themeId: string;
  unlockedThemes: string[];
  collected: string[];
  dayMode: boolean;
}

interface SurpriseContextValue extends SurpriseState {
  toasts: AchievementDef[];
  menuOpen: boolean;
  terminalOpen: boolean;
  secretRoomOpen: boolean;
  miniGameOpen: boolean;
  devMode: boolean;
  themePanelOpen: boolean;
  achPanelOpen: boolean;
  konamiFlash: boolean;

  unlock: (id: string) => void;
  has: (id: string) => boolean;
  setTheme: (id: string) => void;
  unlockTheme: (id: string) => void;
  toggleDay: () => void;
  collect: (id: string) => void;
  setDevMode: (v: boolean) => void;
  toggleMenu: (v?: boolean) => void;
  toggleTerminal: (v?: boolean) => void;
  toggleSecretRoom: (v?: boolean) => void;
  toggleMiniGame: (v?: boolean) => void;
  toggleThemePanel: (v?: boolean) => void;
  toggleAchPanel: (v?: boolean) => void;
  triggerKonami: () => void;
  clearKonamiFlash: () => void;
  dismissToast: (id: string) => void;
  runCommand: (raw: string) => string[];
}

const Ctx = createContext<SurpriseContextValue | null>(null);

export function useSurprises(): SurpriseContextValue {
  const c = useContext(Ctx);
  if (!c) throw new Error('useSurprises must be used within SurpriseProvider');
  return c;
}

const DEFAULT_STATE: SurpriseState = {
  achievements: {},
  themeId: 'cyber',
  unlockedThemes: ['cyber'],
  collected: [],
  dayMode: false,
};

export function SurpriseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SurpriseState>(DEFAULT_STATE);
  const [toasts, setToasts] = useState<AchievementDef[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [secretRoomOpen, setSecretRoomOpen] = useState(false);
  const [miniGameOpen, setMiniGameOpen] = useState(false);
  const [devMode, setDevModeState] = useState(false);
  const [themePanelOpen, setThemePanelOpen] = useState(false);
  const [achPanelOpen, setAchPanelOpen] = useState(false);
  const [konamiFlash, setKonamiFlash] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const stateRef = useRef(state);
  stateRef.current = state;
  const devRef = useRef(devMode);
  devRef.current = devMode;

  /* ---------- persistence ---------- */
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [a, t, u, c, d] = await Promise.all([
          persistence.getItem('kaze_achievements'),
          persistence.getItem('kaze_theme'),
          persistence.getItem('kaze_unlocked_themes'),
          persistence.getItem('kaze_collected'),
          persistence.getItem('kaze_day'),
        ]);
        if (!active) return;
        const next: SurpriseState = { ...DEFAULT_STATE };
        if (a) next.achievements = JSON.parse(a);
        if (t && THEMES.some((x) => x.id === t)) next.themeId = t;
        if (u) next.unlockedThemes = JSON.parse(u);
        if (c) next.collected = JSON.parse(c).filter((id: string) => COLLECTIBLES.some((x) => x.id === id));
        if (d) next.dayMode = d === 'true';
        setState(next);
        if (!next.achievements['awaken']) {
          // unlock first breath after load
          queueMicrotask(() => unlockRef.current('awaken'));
        }
      } catch {
        /* ignore */
      } finally {
        if (active) setLoaded(true);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = useCallback((s: SurpriseState) => {
    persistence.setItem('kaze_achievements', JSON.stringify(s.achievements));
    persistence.setItem('kaze_theme', s.themeId);
    persistence.setItem('kaze_unlocked_themes', JSON.stringify(s.unlockedThemes));
    persistence.setItem('kaze_collected', JSON.stringify(s.collected));
    persistence.setItem('kaze_day', String(s.dayMode));
  }, []);

  const update = useCallback(
    (patch: Partial<SurpriseState>) => {
      setState((prev) => {
        const next = { ...prev, ...patch };
        save(next);
        return next;
      });
    },
    [save]
  );

  /* ---------- theme + day application ---------- */
  useEffect(() => {
    if (!loaded) return;
    const root = document.documentElement;
    THEMES.forEach((t) => {
      if (t.vars) Object.keys(t.vars).forEach((k) => root.style.removeProperty(k));
    });
    const theme = THEMES.find((t) => t.id === state.themeId) ?? THEMES[0];
    if (theme.vars) Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
    document.body.classList.toggle('surprise-day', state.dayMode);
  }, [state.themeId, state.dayMode, loaded]);

  /* ---------- achievements ---------- */
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const unlockRef = useRef<(id: string) => void>(() => {});
  const unlock = useCallback(
    (id: string) => {
      const def = ACHIEVEMENTS.find((a) => a.id === id);
      if (!def) return;
      if (stateRef.current.achievements[id]) return;
      update({ achievements: { ...stateRef.current.achievements, [id]: true } });
      setToasts((prev) => (prev.some((t) => t.id === id) ? prev : [...prev, def]));
      window.setTimeout(() => dismissToast(id), 5200);
    },
    [update, dismissToast]
  );
  unlockRef.current = unlock;

  const has = useCallback((id: string) => !!stateRef.current.achievements[id], []);

  /* ---------- themes ---------- */
  const setTheme = useCallback(
    (id: string) => {
      const t = THEMES.find((x) => x.id === id);
      if (!t) return;
      if (t.secret && !stateRef.current.unlockedThemes.includes(id)) return;
      update({ themeId: id });
      if (id !== 'cyber' && !stateRef.current.achievements['chromatic']) unlock('chromatic');
    },
    [update, unlock]
  );

  const unlockTheme = useCallback(
    (id: string) => {
      const t = THEMES.find((x) => x.id === id);
      if (!t || stateRef.current.unlockedThemes.includes(id)) return;
      update({ unlockedThemes: [...stateRef.current.unlockedThemes, id] });
    },
    [update]
  );

  const toggleDay = useCallback(() => {
    const next = !stateRef.current.dayMode;
    update({ dayMode: next });
    if (next && !stateRef.current.achievements['hikari']) unlock('hikari');
  }, [update, unlock]);

  /* ---------- collectibles ---------- */
  const collect = useCallback(
    (id: string) => {
      if (stateRef.current.collected.includes(id)) return;
      const next = [...stateRef.current.collected, id];
      update({ collected: next });
      if (next.length >= COLLECTIBLES.length && !stateRef.current.achievements['collector']) {
        unlock('collector');
      }
    },
    [update, unlock]
  );

  /* ---------- ui toggles ---------- */
  const setDevMode = useCallback(
    (v: boolean) => {
      setDevModeState(v);
      if (v && !stateRef.current.achievements['dev']) unlock('dev');
    },
    [unlock]
  );

  const toggleMenu = useCallback((v?: boolean) => setMenuOpen((o) => (v === undefined ? !o : v)), []);
  const toggleTerminal = useCallback(
    (v?: boolean) => {
      setTerminalOpen((o) => (v === undefined ? !o : v));
      if (v && !stateRef.current.achievements['terminal']) unlock('terminal');
    },
    [unlock]
  );
  const toggleSecretRoom = useCallback(
    (v?: boolean) => {
      setSecretRoomOpen((o) => (v === undefined ? !o : v));
      if (v && !stateRef.current.achievements['explorer']) unlock('explorer');
    },
    [unlock]
  );
  const toggleMiniGame = useCallback((v?: boolean) => setMiniGameOpen((o) => (v === undefined ? !o : v)), []);
  const toggleThemePanel = useCallback((v?: boolean) => setThemePanelOpen((o) => (v === undefined ? !o : v)), []);
  const toggleAchPanel = useCallback((v?: boolean) => setAchPanelOpen((o) => (v === undefined ? !o : v)), []);

  /* ---------- konami ---------- */
  const triggerKonami = useCallback(() => {
    setKonamiFlash(true);
    if (!stateRef.current.achievements['konami']) unlock('konami');
    // reward: unlock all secret themes + switch to sakura
    const secret = THEMES.filter((t) => t.secret).map((t) => t.id);
    const merged = Array.from(new Set([...stateRef.current.unlockedThemes, ...secret]));
    update({ unlockedThemes: merged, themeId: 'sakura' });
    if (!stateRef.current.achievements['chromatic']) unlock('chromatic');
  }, [unlock, update]);

  const clearKonamiFlash = useCallback(() => setKonamiFlash(false), []);

  /* ---------- konami listener ---------- */
  useEffect(() => {
    let buf: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buf.push(k);
      if (buf.length > KONAMI_SEQUENCE.length) buf = buf.slice(-KONAMI_SEQUENCE.length);
      if (buf.length === KONAMI_SEQUENCE.length && buf.every((v, i) => v === KONAMI_SEQUENCE[i])) {
        buf = [];
        triggerKonami();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [triggerKonami]);

  /* ---------- terminal backtick + escape ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '`' && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        toggleTerminal();
      } else if (e.key === 'Escape') {
        setTerminalOpen(false);
        setSecretRoomOpen(false);
        setMiniGameOpen(false);
        setMenuOpen(false);
        setThemePanelOpen(false);
        setAchPanelOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleTerminal]);

  /* ---------- command runner ---------- */
  const runCommand = useCallback(
    (raw: string): string[] => {
      const cmd = raw.trim().toLowerCase();
      if (!cmd) return [];
      const [name, ...rest] = cmd.split(/\s+/);
      const arg = rest.join(' ');
      const s = stateRef.current;
      const out: string[] = [];
      switch (name) {
        case 'help':
          out.push('KAZE TERMINAL — commands:');
          out.push('  help              this list');
          out.push('  themes            list palettes');
          out.push('  theme <id>        apply a palette');
          out.push('  unlock <id>       unlock a secret palette');
          out.push('  day / night       toggle Hikari (day) mode');
          out.push('  secret            enter the hidden sanctuary');
          out.push('  game              play Sakura Catch');
          out.push('  dev               toggle developer mode');
          out.push('  achievements      list unlocked awards');
          out.push('  collect           hint about hidden sakura');
          out.push('  konami            ...try the controller');
          out.push('  nani / kaze       ?');
          out.push('  clear             clear the screen');
          break;
        case 'clear':
          return ['__CLEAR__'];
        case 'themes':
          out.push('Available palettes:');
          THEMES.forEach((t) => {
            const unlocked = t.id === 'cyber' || s.unlockedThemes.includes(t.id);
            out.push(`  ${t.id.padEnd(10)} ${t.name}${t.secret && !unlocked ? '  [LOCKED]' : ''}`);
          });
          break;
        case 'theme':
          if (!arg) {
            out.push('Usage: theme <id> — try "themes"');
            break;
          }
          {
            const t = THEMES.find((x) => x.id === arg);
            if (!t) out.push(`Unknown theme: ${arg}`);
            else if (t.secret && !s.unlockedThemes.includes(t.id)) out.push(`"${t.name}" is locked.`);
            else {
              setTheme(t.id);
              out.push(`Palette set to ${t.name}.`);
            }
          }
          break;
        case 'unlock':
          if (!arg) out.push('Usage: unlock <id>');
          else {
            const t = THEMES.find((x) => x.id === arg);
            if (!t) out.push(`Unknown theme: ${arg}`);
            else if (s.unlockedThemes.includes(t.id)) out.push(`"${t.name}" already unlocked.`);
            else {
              unlockTheme(t.id);
              out.push(`Unlocked ${t.name}! Apply with "theme ${t.id}".`);
            }
          }
          break;
        case 'day':
        case 'night':
        case 'hikari':
          toggleDay();
          out.push(s.dayMode ? 'Hikari (day) mode ON.' : 'Twilight (night) mode ON.');
          break;
        case 'secret':
        case 'room':
        case 'sanctuary':
          toggleSecretRoom(true);
          out.push('Entering the hidden sanctuary...');
          break;
        case 'game':
        case 'play':
        case 'sakura':
          toggleMiniGame(true);
          out.push('Launching Sakura Catch...');
          break;
        case 'dev':
        case 'god':
          setDevMode(!devRef.current);
          out.push(devRef.current ? 'Developer mode ENABLED.' : 'Developer mode disabled.');
          break;
        case 'achievements':
        case 'ach':
        case 'awards':
          out.push('Achievements:');
          ACHIEVEMENTS.forEach((a) => {
            const got = s.achievements[a.id];
            out.push(`  ${got ? '✓' : '✗'} ${a.title}${a.secret && !got ? ' (secret)' : ''}`);
          });
          break;
        case 'collect':
        case 'petals':
          out.push('Hidden sakura drift through the page — click them to collect.');
          break;
        case 'konami':
          triggerKonami();
          out.push('↑↑↓↓←→←→ B A');
          break;
        case 'nani':
          unlock('otaku');
          out.push('NANI⁉️  (おたく detected)');
          break;
        case 'kaze':
          unlock('otaku');
          out.push('風 — the wind carries your curiosity.');
          break;
        case 'sudo':
          out.push('Nice try. You are not root here, but you are welcome. 🌸');
          break;
        case 'whoami':
          out.push('a wandering frame-maker');
          break;
        default:
          out.push(`command not found: ${name} — type "help"`);
      }
      return out;
    },
    [setTheme, unlockTheme, toggleDay, toggleSecretRoom, toggleMiniGame, setDevMode, unlock, triggerKonami]
  );

  const value: SurpriseContextValue = {
    ...state,
    toasts,
    menuOpen,
    terminalOpen,
    secretRoomOpen,
    miniGameOpen,
    devMode,
    themePanelOpen,
    achPanelOpen,
    konamiFlash,
    unlock,
    has,
    setTheme,
    unlockTheme,
    toggleDay,
    collect,
    setDevMode,
    toggleMenu,
    toggleTerminal,
    toggleSecretRoom,
    toggleMiniGame,
    toggleThemePanel,
    toggleAchPanel,
    triggerKonami,
    clearKonamiFlash,
    dismissToast,
    runCommand,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
