
import type { NavItem, Stat } from '../types';

export const siteConfig = {
  name: 'KAZE 風',
  studio: 'KAZE',
  jp: '風',
  email: 'hello@kaze.studio',
  url: 'https://kaze.studio',
  nav: [
    { label: 'Works', href: '#works' },
    { label: 'Studio', href: '#studio' },
    { label: 'Motion', href: '#lab' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ] as NavItem[],
};

export const stats: Stat[] = [
  { value: 48, label: 'Projects Shipped' },
  { value: 12, label: 'Awards Won' },
  { value: 9, label: 'Years of Craft' },
  { value: 32, label: 'Million Frames', suffix: 'M' },
];
