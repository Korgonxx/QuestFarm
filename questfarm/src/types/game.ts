export interface FarmTile {
  id: number;
  x: number;
  y: number;
  crop: Crop | null;
  isEmpty: boolean;
}

export interface Crop {
  type: 'wheat';
  plantedAt: number;
  isReady: boolean;
  harvestableAt: number;
}

export interface Quest {
  id: number;
  description: string;
  reward: number;
  boost: boolean;
  completed: boolean;
  progress: number;
  target: number;
}

export interface GameState {
  farmTiles: FarmTile[];
  tokens: number;
  quests: Quest[];
  seedsPlanted: number;
  cropsHarvested: number;
  secretChestFound: boolean;
}

export interface PlayerData {
  gameState: GameState;
  lastSaved: number;
}