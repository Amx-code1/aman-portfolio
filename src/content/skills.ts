
export type SkillGroup = 'animation' | 'art' | 'tech' | 'studio';

export interface SkillNode {
  id: string;
  name: string;
  xp: number;
  group: SkillGroup;
  desc: string;
  symbol: string;
  x: number;
  y: number;
}

export interface SkillBranch {
  id: string;
  label: string;
  group: SkillGroup;
  color: string;
  kanji: string;
  root: SkillNode;
  nodes: SkillNode[];
}

export const skillGroups: Record<SkillGroup, { label: string; color: string; kanji: string }> = {
  animation: { label: 'Animation', color: '#00f0ff', kanji: '動' },
  art: { label: 'Art', color: '#9b5de5', kanji: '美' },
  tech: { label: 'Tech', color: '#ff5c8a', kanji: '術' },
  studio: { label: 'Studio', color: '#4cc9f0', kanji: '風' },
};

export const skillCore: SkillNode = {
  id: 'core',
  name: 'KAZE Core',
  xp: 0,
  group: 'studio',
  desc: 'The source of all craft. Channel powers to raise your mastery.',
  symbol: '風',
  x: 50,
  y: 50,
};

export const skillBranches: SkillBranch[] = [
  {
    id: 'animation',
    label: 'Animation',
    group: 'animation',
    color: skillGroups.animation.color,
    kanji: skillGroups.animation.kanji,
    root: {
      id: 'anim-root',
      name: 'Animation',
      xp: 94,
      group: 'animation',
      desc: 'The breath held between every frame.',
      symbol: '動',
      x: 50,
      y: 20,
    },
    nodes: [
      {
        id: 'keyframe',
        name: 'Keyframe Craft',
        xp: 96,
        group: 'animation',
        desc: 'Hand-led motion with intent in every in-between.',
        symbol: '鍵',
        x: 32,
        y: 9,
      },
      {
        id: 'worldbuild',
        name: 'World Building',
        xp: 92,
        group: 'animation',
        desc: 'Spaces that breathe and react to the story.',
        symbol: '界',
        x: 68,
        y: 9,
      },
    ],
  },
  {
    id: 'art',
    label: 'Art',
    group: 'art',
    color: skillGroups.art.color,
    kanji: skillGroups.art.kanji,
    root: {
      id: 'art-root',
      name: 'Art',
      xp: 90,
      group: 'art',
      desc: 'A visual language painted light by light.',
      symbol: '美',
      x: 80,
      y: 50,
    },
    nodes: [
      {
        id: 'character',
        name: 'Character Design',
        xp: 90,
        group: 'art',
        desc: 'Silhouettes that tell a story at a glance.',
        symbol: '人',
        x: 90,
        y: 33,
      },
      {
        id: 'color',
        name: 'Color Scripting',
        xp: 88,
        group: 'art',
        desc: 'Emotion engineered through palette.',
        symbol: '彩',
        x: 90,
        y: 67,
      },
    ],
  },
  {
    id: 'tech',
    label: 'Tech',
    group: 'tech',
    color: skillGroups.tech.color,
    kanji: skillGroups.tech.kanji,
    root: {
      id: 'tech-root',
      name: 'Tech',
      xp: 82,
      group: 'tech',
      desc: 'Where code becomes weather, light and matter.',
      symbol: '術',
      x: 50,
      y: 80,
    },
    nodes: [
      {
        id: 'vfx',
        name: 'VFX & Simulation',
        xp: 84,
        group: 'tech',
        desc: 'Generative systems, particles and physics.',
        symbol: '幻',
        x: 68,
        y: 91,
      },
      {
        id: 'sound',
        name: 'Sound Design',
        xp: 78,
        group: 'tech',
        desc: 'Frequencies that shape the weight of a frame.',
        symbol: '音',
        x: 32,
        y: 91,
      },
    ],
  },
  {
    id: 'studio',
    label: 'Studio',
    group: 'studio',
    color: skillGroups.studio.color,
    kanji: skillGroups.studio.kanji,
    root: {
      id: 'studio-root',
      name: 'Studio',
      xp: 94,
      group: 'studio',
      desc: 'The hand that guides the larger vision.',
      symbol: '風',
      x: 20,
      y: 50,
    },
    nodes: [
      {
        id: 'direction',
        name: 'Direction',
        xp: 94,
        group: 'studio',
        desc: 'Deciding what the audience feels, and when.',
        symbol: '導',
        x: 10,
        y: 33,
      },
      {
        id: 'story',
        name: 'Storyboarding',
        xp: 89,
        group: 'studio',
        desc: 'The blueprint beneath every cut.',
        symbol: '絵',
        x: 10,
        y: 67,
      },
    ],
  },
];
