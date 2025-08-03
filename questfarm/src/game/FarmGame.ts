import Phaser from 'phaser';
import { FarmTile, Crop, GameState } from '../types/game';

export class FarmGameScene extends Phaser.Scene {
  private farmTiles: FarmTile[] = [];
  private tileSprites: Phaser.GameObjects.Rectangle[] = [];
  private cropSprites: Phaser.GameObjects.Text[] = [];
  private gameState: GameState;
  private onStateUpdate: (state: GameState) => void;

  constructor() {
    super({ key: 'FarmGame' });
    this.gameState = this.getInitialGameState();
    this.onStateUpdate = () => {};
  }

  setStateUpdateCallback(callback: (state: GameState) => void) {
    this.onStateUpdate = callback;
  }

  setGameState(state: GameState) {
    this.gameState = state;
    this.farmTiles = state.farmTiles;
    this.updateVisuals();
  }

  preload() {
    // No assets needed, using simple shapes and text
  }

  create() {
    this.createFarmGrid();
    this.updateVisuals();
  }

  private getInitialGameState(): GameState {
    const tiles: FarmTile[] = [];
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        tiles.push({
          id: y * 5 + x,
          x,
          y,
          crop: null,
          isEmpty: true,
        });
      }
    }

    return {
      farmTiles: tiles,
      tokens: 0,
      quests: [
        { id: 1, description: "Plant 10 seeds", reward: 10, boost: true, completed: false, progress: 0, target: 10 },
        { id: 2, description: "Harvest 5 crops", reward: 15, boost: true, completed: false, progress: 0, target: 5 },
        { id: 3, description: "Find the secret chest", reward: 20, boost: false, completed: false, progress: 0, target: 1 }
      ],
      seedsPlanted: 0,
      cropsHarvested: 0,
      secretChestFound: false,
    };
  }

  private createFarmGrid() {
    const tileSize = 80;
    const startX = 50;
    const startY = 50;

    this.farmTiles = this.gameState.farmTiles;

    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const tileX = startX + x * tileSize;
        const tileY = startY + y * tileSize;
        
        // Create tile background
        const tile = this.add.rectangle(tileX, tileY, tileSize - 2, tileSize - 2, 0x8B4513);
        tile.setStrokeStyle(2, 0x654321);
        tile.setInteractive();
        
        // Add click handler
        tile.on('pointerdown', () => this.handleTileClick(x, y));
        
        this.tileSprites.push(tile);

        // Create crop sprite placeholder
        const cropText = this.add.text(tileX, tileY, '', {
          fontSize: '32px',
          color: '#000000'
        });
        cropText.setOrigin(0.5);
        this.cropSprites.push(cropText);
      }
    }

    // Add secret chest in bottom-right corner (4,4)
    const chestX = startX + 4 * tileSize;
    const chestY = startY + 4 * tileSize;
    const chest = this.add.text(chestX + 25, chestY - 25, '📦', {
      fontSize: '16px'
    });
    chest.setInteractive();
    chest.on('pointerdown', () => this.handleChestClick());
  }

  private handleTileClick(x: number, y: number) {
    const tileIndex = y * 5 + x;
    const tile = this.farmTiles[tileIndex];

    if (!tile) return;

    if (tile.isEmpty && !tile.crop) {
      // Plant wheat
      this.plantCrop(tile);
    } else if (tile.crop && tile.crop.isReady) {
      // Harvest crop
      this.harvestCrop(tile);
    }
  }

  private handleChestClick() {
    if (!this.gameState.secretChestFound) {
      this.gameState.secretChestFound = true;
      this.gameState.tokens += 20;
      
      // Update quest progress
      const chestQuest = this.gameState.quests.find(q => q.id === 3);
      if (chestQuest && !chestQuest.completed) {
        chestQuest.progress = 1;
        chestQuest.completed = true;
        this.gameState.tokens += chestQuest.reward;
      }

      this.onStateUpdate(this.gameState);
    }
  }

  private plantCrop(tile: FarmTile) {
    const now = Date.now();
    tile.crop = {
      type: 'wheat',
      plantedAt: now,
      isReady: false,
      harvestableAt: now + 30000, // 30 seconds
    };
    tile.isEmpty = false;

    this.gameState.seedsPlanted++;

    // Update quest progress
    const plantQuest = this.gameState.quests.find(q => q.id === 1);
    if (plantQuest && !plantQuest.completed) {
      plantQuest.progress = this.gameState.seedsPlanted;
      if (plantQuest.progress >= plantQuest.target) {
        plantQuest.completed = true;
        this.gameState.tokens += plantQuest.reward;
      }
    }

    this.updateVisuals();
    this.onStateUpdate(this.gameState);

    // Set timer for crop to become ready
    this.time.delayedCall(30000, () => {
      if (tile.crop) {
        tile.crop.isReady = true;
        this.updateVisuals();
      }
    });
  }

  private harvestCrop(tile: FarmTile) {
    if (tile.crop && tile.crop.isReady) {
      tile.crop = null;
      tile.isEmpty = true;
      
      this.gameState.tokens += 1;
      this.gameState.cropsHarvested++;

      // Update quest progress
      const harvestQuest = this.gameState.quests.find(q => q.id === 2);
      if (harvestQuest && !harvestQuest.completed) {
        harvestQuest.progress = this.gameState.cropsHarvested;
        if (harvestQuest.progress >= harvestQuest.target) {
          harvestQuest.completed = true;
          this.gameState.tokens += harvestQuest.reward;
        }
      }

      this.updateVisuals();
      this.onStateUpdate(this.gameState);
    }
  }

  private updateVisuals() {
    this.farmTiles.forEach((tile, index) => {
      const cropSprite = this.cropSprites[index];
      const tileSprite = this.tileSprites[index];
      
      if (tile.crop) {
        if (tile.crop.isReady) {
          cropSprite.setText('🌾');
          tileSprite.setFillStyle(0x90EE90); // Light green for ready crops
        } else {
          cropSprite.setText('🌱');
          tileSprite.setFillStyle(0x98FB98); // Pale green for growing crops
        }
      } else {
        cropSprite.setText('');
        tileSprite.setFillStyle(0x8B4513); // Brown for empty soil
      }
    });
  }

  update() {
    // Update crop readiness
    const now = Date.now();
    let needsUpdate = false;

    this.farmTiles.forEach(tile => {
      if (tile.crop && !tile.crop.isReady && now >= tile.crop.harvestableAt) {
        tile.crop.isReady = true;
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      this.updateVisuals();
    }
  }

  getGameState(): GameState {
    return this.gameState;
  }
}