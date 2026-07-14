
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Thin wrapper around the Web Speech API. Provides a "voice narration" mode
 * so the About episode can be read aloud — an accessible, anime-OP style touch.
 */
export function useNarration() {
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const currentRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(
    (text: string, opts?: { rate?: number; pitch?: number }) => {
      if (!supported || !text) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = opts?.rate ?? 0.95;
      u.pitch = opts?.pitch ?? 1;
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      currentRef.current = u;
      setSpeaking(true);
      window.speechSynthesis.speak(u);
    },
    [supported]
  );

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  return { speak, stop, speaking, supported };
}
