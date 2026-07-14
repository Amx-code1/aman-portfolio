
export interface WorkMetric {
  value: number;
  suffix?: string;
  label: string;
}

export interface WorkPhase {
  phase: string;
  duration: string;
  desc: string;
}

export interface WorkGalleryItem {
  id: string;
  variant: number;
  caption: string;
}

export interface TechItem {
  name: string;
  role: string;
}

export interface AnimItem {
  name: string;
  note: string;
}

export interface PrototypeConfig {
  type: 'parallax' | 'character' | 'color';
  hint: string;
}

export interface Work {
  id: string;
  title: string;
  category: string;
  year: string;
  role: string;
  description: string;
  theme: string;
  tagline: string;
  format?: string;
  duration?: string;
  liveDemo: string;
  github: string;
  techStack: TechItem[];
  animationTechniques: AnimItem[];
  metrics: WorkMetric[];
  timeline: WorkPhase[];
  challenge: string;
  solution: string;
  beforeCaption: string;
  afterCaption: string;
  gallery: WorkGalleryItem[];
  prototype: PrototypeConfig;
}

export interface Stat {
  value: number;
  label: string;
  suffix?: string;
}

export interface ProcessStep {
  index: string;
  title: string;
  description: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  studio: string;
  jp: string;
  tagline: string;
  email: string;
  location: string;
  established: number;
}
