
export interface TimelineEvent {
  year: string;
  title: string;
  desc: string;
  kanji: string;
  detail: string;
}

export const timelineEvents: TimelineEvent[] = [
  {
    year: '2016',
    title: 'The First Frame',
    desc: 'KAZE is founded in a Tokyo basement. Three artists, one faulty lightbox, and a stubborn belief in motion.',
    kanji: '始',
    detail: 'One shared sketchbook, a borrowed lens, and far too much coffee.',
  },
  {
    year: '2018',
    title: 'Silent Horizon',
    desc: 'Our debut short screens at international festivals, proving that quiet stories can still roar.',
    kanji: '声',
    detail: 'A wordless 7-minute meditation that traveled to 14 festivals.',
  },
  {
    year: '2020',
    title: 'Paper Moons',
    desc: 'Our first original OVA ships worldwide — a tender tale wrapped in cut-paper texture.',
    kanji: '月',
    detail: 'Stop-motion timing rebuilt entirely in digital 2.5D paper.',
  },
  {
    year: '2022',
    title: 'Beyond Borders',
    desc: 'The studio expands to Kyoto and remote, growing into a collective of thirty animators.',
    kanji: '風',
    detail: 'Thirty frame-makers, three cities, one current.',
  },
  {
    year: '2024',
    title: 'Neon Drifter',
    desc: 'Our 12-episode cyberpunk series airs globally, defining the studio’s neon visual signature.',
    kanji: '霓',
    detail: '62 million hand-led frames across a living generative city.',
  },
  {
    year: '2025',
    title: 'The Next Opening',
    desc: 'We open our doors to new worlds, new partners, and the next generation of frame-makers.',
    kanji: '次',
    detail: 'The episode continues — the wind carries on.',
  },
];
