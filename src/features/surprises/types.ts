
export interface AchievementDef {
  id: string;
  title: string;
  desc: string;
  icon: string;
  secret?: boolean;
}

export interface ThemeDef {
  id: string;
  name: string;
  swatch: string;
  secret?: boolean;
  vars?: Record<string, string>;
}

export interface CollectibleDef {
  id: string;
  label: string;
}
