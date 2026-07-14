
export interface AboutProfile {
  episode: string;
  title: string;
  subtitle: string;
}

export interface Mission {
  body: string;
  narration: string;
}

export interface Dream {
  statement: string;
  sub: string;
  narration: string;
}

export interface AboutValue {
  id: string;
  kanji: string;
  title: string;
  short: string;
  long: string;
  tone: string;
}

export interface Achievement {
  value: number;
  suffix?: string;
  label: string;
  note: string;
}

export interface JourneyBeat {
  id: string;
  chapter: string;
  kanji: string;
  title: string;
  body: string;
}

export const aboutProfile: AboutProfile = {
  episode: 'Episode 01',
  title: 'KAZE 風 — The Studio',
  subtitle: 'A cinematic portrait of the collective behind the frames.',
};

export const mission: Mission = {
  body: 'We exist to make stillness move. Every frame we touch is a held breath — a heartbeat stretched across time, crafted so the world on screen feels more alive than the one beyond it.',
  narration:
    'We exist to make stillness move. Every frame we touch is a held breath, a heartbeat stretched across time, crafted so that the world on screen feels more alive than the one beyond it.',
};

export const dream: Dream = {
  statement: 'To build worlds that outlive the screen.',
  sub: 'A place where a single line drawn at 3am becomes a universe someone carries for the rest of their life.',
  narration:
    'To build worlds that outlive the screen. A place where a single line drawn at three in the morning becomes a universe someone carries for the rest of their life.',
};

export const values: AboutValue[] = [
  {
    id: 'motion',
    kanji: '動',
    title: 'Motion is Emotion',
    short: 'Feeling first.',
    long: 'We lead with intent. Every keyframe carries a feeling and every cut is a heartbeat. If it does not move you, it does not ship.',
    tone: 'var(--c-cyan)',
  },
  {
    id: 'craft',
    kanji: '工',
    title: 'Frame-First Craft',
    short: 'Built to move.',
    long: 'Characters, worlds, and color scripts are designed frame-first — every asset made to breathe, never merely to sit still.',
    tone: 'var(--c-purple)',
  },
  {
    id: 'story',
    kanji: '語',
    title: 'Story Above All',
    short: 'Narrative core.',
    long: 'Technology is our brush, never our master. The story always leads; spectacle only earns its place in service of it.',
    tone: 'var(--c-pink)',
  },
  {
    id: 'winds',
    kanji: '風',
    title: 'The Open Wind',
    short: 'Always learning.',
    long: 'We stay restless like the wind — borrowing from games, film, and fine art to keep our visual language evolving.',
    tone: 'var(--c-cyan)',
  },
];

export const achievements: Achievement[] = [
  { value: 48, label: 'Projects Shipped', note: 'From festival shorts to global series.' },
  { value: 12, label: 'Awards Won', note: 'Including two international grand prizes.' },
  { value: 9, label: 'Years of Craft', note: 'Since our very first frame in 2016.' },
  { value: 32, suffix: 'M', label: 'Frames Drawn', note: 'Hand-led, simulated, and loved.' },
];

export const journey: JourneyBeat[] = [
  {
    id: 'first',
    chapter: 'I',
    kanji: '始',
    title: 'The First Light',
    body: 'Three artists, one faulty lightbox, and a stubborn belief that motion could carry meaning. KAZE begins.',
  },
  {
    id: 'voice',
    chapter: 'II',
    kanji: '声',
    title: 'Finding a Voice',
    body: 'A debut short screens worldwide. We learn that quiet stories can still roar across every language.',
  },
  {
    id: 'worlds',
    chapter: 'III',
    kanji: '界',
    title: 'Building Worlds',
    body: 'Our first original series ships — a neon city rendered frame by frame, painted with light leaks.',
  },
  {
    id: 'beyond',
    chapter: 'IV',
    kanji: '風',
    title: 'Beyond Borders',
    body: 'The collective grows to thirty, spanning Tokyo, Kyoto, and remote — but the wind stays one.',
  },
  {
    id: 'next',
    chapter: 'V',
    kanji: '次',
    title: 'The Next Opening',
    body: 'We open our doors to new partners and the next generation of frame-makers. The episode continues.',
  },
];
