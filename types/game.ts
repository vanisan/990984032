export type PlayerClass = 'fighter' | 'warrior' | 'mage' | 'archer';

export interface PlayerStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  energy: number;
  maxEnergy: number;
  gold: number;
  attack: number;
  defense: number;
  criticalChance: number;
  criticalMultiplier: number;
  class: PlayerClass;
}

export interface Equipment {
  weapon: Item | null;
  armor: Item | null;
  helmet: Item | null;
  boots: Item | null;
  ring: Item | null;
  pet: Item | null;
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  rewardXp: number;
  rewardGold: number;
  image: string;
  type: 'mob' | 'boss' | 'raid';
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  lastUsed: number;
  manaCost: number;
  damageMultiplier: number;
  icon: string;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'helmet' | 'boots' | 'ring' | 'consumable' | 'stone' | 'pet';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  stats?: Partial<PlayerStats>;
  dps?: number;
  description: string;
  image: string;
  level: number;
  price: number;
  gemSlots?: (Item | null)[];
}

export interface GameState {
  player: PlayerStats;
  currentEnemy: Enemy | null;
  inventory: Item[];
  equipment: Equipment;
  skills: Skill[];
  activeBuffs: string[];
}
