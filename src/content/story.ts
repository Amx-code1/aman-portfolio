
export interface StoryChapter {
  id: string;
  chapter: string;
  title: string;
  body: string;
  align: 'left' | 'right' | 'center';
}

export const storyChapters: StoryChapter[] = [
  {
    id: 'silence',
    chapter: 'I',
    title: 'The Silence',
    body: 'In the space between two frames, a single breath holds the weight of a universe. We begin where most stories end — in stillness.',
    align: 'left',
  },
  {
    id: 'spark',
    chapter: 'II',
    title: 'The Spark',
    body: 'A line drawn at 3am becomes a heartbeat. A color, chosen with care, becomes a memory that outlives the screen it was painted on.',
    align: 'right',
  },
  {
    id: 'wind',
    chapter: 'III',
    title: 'The Wind',
    body: 'We are KAZE — the current that carries fleeting ideas into living, breathing worlds. Motion is our language; emotion, our grammar.',
    align: 'center',
  },
  {
    id: 'opening',
    chapter: 'IV',
    title: 'The Opening',
    body: 'Every great tale begins with movement. Press play, and let the frames speak louder than words ever could.',
    align: 'left',
  },
];
