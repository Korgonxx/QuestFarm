import Irys from '@irys/sdk';
import { PlayerData } from '../types/game';

class IrysService {
  private irys: Irys | null = null;
  private initialized = false;

  async initialize(): Promise<boolean> {
    try {
      // Initialize with Irys node
      this.irys = new Irys({
        network: 'devnet', // Use devnet for testing
        token: 'arweave',
        key: 'use_wallet', // Will use wallet connection
      });

      this.initialized = true;
      return true;
    } catch (error) {
      console.warn('Irys initialization failed, using localStorage fallback:', error);
      return false;
    }
  }

  async savePlayerData(playerData: PlayerData): Promise<string | null> {
    try {
      if (!this.initialized || !this.irys) {
        // Fallback to localStorage
        localStorage.setItem('questfarm_playerdata', JSON.stringify(playerData));
        return 'localStorage_backup';
      }

      const tags = [
        { name: 'Content-Type', value: 'application/json' },
        { name: 'App-Name', value: 'QuestFarm' },
        { name: 'Data-Type', value: 'PlayerData' },
        { name: 'Version', value: '1.0' },
      ];

      const receipt = await this.irys.upload(JSON.stringify(playerData), { tags });
      return receipt.id;
    } catch (error) {
      console.error('Failed to save to Irys, using localStorage:', error);
      localStorage.setItem('questfarm_playerdata', JSON.stringify(playerData));
      return 'localStorage_backup';
    }
  }

  async loadPlayerData(dataId?: string): Promise<PlayerData | null> {
    try {
      if (!this.initialized || !this.irys || !dataId || dataId === 'localStorage_backup') {
        // Try localStorage fallback
        const stored = localStorage.getItem('questfarm_playerdata');
        return stored ? JSON.parse(stored) : null;
      }

      const response = await fetch(`https://gateway.irys.xyz/${dataId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch from Irys');
      }

      const data = await response.json();
      return data as PlayerData;
    } catch (error) {
      console.error('Failed to load from Irys, trying localStorage:', error);
      const stored = localStorage.getItem('questfarm_playerdata');
      return stored ? JSON.parse(stored) : null;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const irysService = new IrysService();