// types/GameTypes.ts
export interface Player {
  name: string;
  type: "scavenger" | "soldier" | "medic";
  level: number;
  experience: number;
  experienceToNext: number;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    endurance: number;
  };
  inventory: Item[];
  equippedWeapon: Weapon | null;
  equippedArmor: Armor | null;
  location: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: "weapon" | "armor" | "consumable" | "misc";
  value?: number;
  stackable?: boolean;
  quantity?: number;
}

export interface Weapon extends Item {
  type: "weapon";
  damage: number;
  durability: number;
  maxDurability: number;
}

export interface Armor extends Item {
  type: "armor";
  defense: number;
  durability: number;
  maxDurability: number;
}

export interface Consumable extends Item {
  type: "consumable";
  value: number;
  effect: "heal" | "stamina" | "buff";
}

export interface Enemy {
  id: string;
  name: string;
  description: string;
  health: number;
  maxHealth: number;
  damage: number;
  defense: number;
  experience: number;
  loot: Item[];
}

export interface Location {
  id: string;
  name: string;
  description: string;
  exits: { [key: string]: string };
  enemies?: string[];
  items?: string[];
  visited?: boolean;
}

export interface SurvivorType {
  name: string;
  description: string;
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    endurance: number;
  };
  startingItems: string[];
}

export interface GameState {
  player: Player | null;
  currentEnemy: Enemy | null;
  inCombat: boolean;
  gameLog: string[];
  locations: { [key: string]: Location };
  gameStarted: boolean;
}

export type SurvivorTypeKey = "scavenger" | "soldier" | "medic";
export type Direction = "norte" | "sur" | "este" | "oeste";
export type CommandType =
  | "move"
  | "attack"
  | "use"
  | "equip"
  | "look"
  | "inventory"
  | "stats"
  | "flee"
  | "help"
  | "restart"
  | "search";

export interface GameCommand {
  action: CommandType;
  target?: string;
  raw: string;
}
