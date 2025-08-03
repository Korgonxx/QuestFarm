import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { FarmGameScene } from './game/FarmGame';
import GameUI from './components/GameUI';
import { irysService } from './services/IrysService';
import { GameState, PlayerData } from './types/game';
import './App.css';

function App() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<FarmGameScene | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('');

  useEffect(() => {
    // Initialize Irys service
    irysService.initialize().then(() => {
      console.log('Irys service initialized');
    });

    // Initialize Phaser game
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 500,
      height: 500,
      parent: 'game-container',
      backgroundColor: '#87CEEB',
      scene: FarmGameScene,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0, x: 0 },
          debug: false
        }
      }
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Get reference to the scene
    game.events.once('ready', () => {
      const scene = game.scene.getScene('FarmGame') as FarmGameScene;
      sceneRef.current = scene;
      
      // Set up state callback
      scene.setStateUpdateCallback((newState: GameState) => {
        setGameState({ ...newState });
      });

      // Initialize game state
      setGameState(scene.getGameState());

      // Try to load saved game
      loadGame();
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, []);

  const saveGame = async () => {
    if (!gameState || !sceneRef.current) return;

    setSaveStatus('Saving...');
    try {
      const playerData: PlayerData = {
        gameState: sceneRef.current.getGameState(),
        lastSaved: Date.now()
      };

      const dataId = await irysService.savePlayerData(playerData);
      if (dataId) {
        localStorage.setItem('questfarm_saveid', dataId);
        setSaveStatus(dataId === 'localStorage_backup' 
          ? 'Saved locally (Irys unavailable)' 
          : 'Saved to Irys permanently!'
        );
      } else {
        setSaveStatus('Error: Failed to save game');
      }
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('Error: Save failed');
    }

    // Clear status after 3 seconds
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const loadGame = async () => {
    setSaveStatus('Loading...');
    try {
      const saveId = localStorage.getItem('questfarm_saveid');
      const playerData = await irysService.loadPlayerData(saveId || undefined);
      
      if (playerData && sceneRef.current) {
        sceneRef.current.setGameState(playerData.gameState);
        setGameState({ ...playerData.gameState });
        setSaveStatus('Game loaded successfully!');
      } else {
        setSaveStatus('No saved game found');
      }
    } catch (error) {
      console.error('Load failed:', error);
      setSaveStatus('Error: Load failed');
    }

    // Clear status after 3 seconds
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="App">
      <div style={{ 
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(to bottom, #87CEEB 0%, #98FB98 100%)',
        overflow: 'hidden'
      }}>
        {/* Game Title */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#2c5234',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          zIndex: 10
        }}>
          🌾 QuestFarm
        </div>

        {/* Game Canvas Container */}
        <div
          id="game-container"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            border: '3px solid #8B4513',
            borderRadius: '10px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
            background: '#87CEEB'
          }}
        />

        {/* Game UI */}
        {gameState && (
          <GameUI
            gameState={gameState}
            onSaveGame={saveGame}
            onLoadGame={loadGame}
            saveStatus={saveStatus}
          />
        )}

        {/* Footer */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#2c5234',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          <div>A Web3 farming game with permanent data storage on Irys</div>
          <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>
            Plant 🌱 → Wait 30s → Harvest 🌾 → Earn QFT tokens → Complete quests!
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
