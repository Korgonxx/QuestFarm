import React from 'react';
import { GameState, Quest } from '../types/game';

interface GameUIProps {
  gameState: GameState;
  onSaveGame: () => void;
  onLoadGame: () => void;
  saveStatus: string;
}

const GameUI: React.FC<GameUIProps> = ({ gameState, onSaveGame, onLoadGame, saveStatus }) => {
  return (
    <div style={{ 
      position: 'absolute', 
      top: '10px', 
      right: '10px', 
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '20px',
      borderRadius: '10px',
      minWidth: '250px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ margin: '0 0 15px 0', color: '#2c5234' }}>🌾 QuestFarm</h2>
      
      {/* Token Display */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f39c12' }}>
          🪙 QFT Tokens: {gameState.tokens}
        </div>
      </div>

      {/* Statistics */}
      <div style={{ marginBottom: '15px', fontSize: '14px', color: '#555' }}>
        <div>🌱 Seeds Planted: {gameState.seedsPlanted}</div>
        <div>🌾 Crops Harvested: {gameState.cropsHarvested}</div>
        {gameState.secretChestFound && <div>📦 Secret Chest Found!</div>}
      </div>

      {/* Quests */}
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#2c5234' }}>📋 Quests</h3>
        {gameState.quests.map((quest: Quest) => (
          <QuestItem key={quest.id} quest={quest} />
        ))}
      </div>

      {/* Controls */}
      <div style={{ marginBottom: '10px' }}>
        <button
          onClick={onSaveGame}
          style={{
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            marginRight: '8px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          💾 Save Game
        </button>
        <button
          onClick={onLoadGame}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          📂 Load Game
        </button>
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div style={{ 
          fontSize: '12px', 
          color: saveStatus.includes('Error') ? '#e74c3c' : '#27ae60',
          marginTop: '5px'
        }}>
          {saveStatus}
        </div>
      )}

      {/* Instructions */}
      <div style={{ 
        marginTop: '15px', 
        fontSize: '12px', 
        color: '#7f8c8d',
        borderTop: '1px solid #ecf0f1',
        paddingTop: '10px'
      }}>
        <div>🎮 <strong>How to Play:</strong></div>
        <div>• Click empty tiles to plant wheat</div>
        <div>• Wait 30 seconds for crops to grow</div>
        <div>• Click mature crops (🌾) to harvest</div>
        <div>• Find the secret chest (📦)</div>
        <div>• Complete quests for bonus tokens!</div>
      </div>
    </div>
  );
};

const QuestItem: React.FC<{ quest: Quest }> = ({ quest }) => {
  const progressPercentage = Math.min((quest.progress / quest.target) * 100, 100);
  
  return (
    <div style={{ 
      marginBottom: '8px', 
      padding: '8px', 
      backgroundColor: quest.completed ? '#d5f4e6' : '#f8f9fa',
      borderRadius: '5px',
      border: `1px solid ${quest.completed ? '#27ae60' : '#e9ecef'}`
    }}>
      <div style={{ 
        fontSize: '13px', 
        fontWeight: 'bold',
        color: quest.completed ? '#27ae60' : '#2c3e50'
      }}>
        {quest.completed ? '✅' : '📝'} {quest.description}
      </div>
      <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
        Progress: {quest.progress}/{quest.target} • Reward: {quest.reward} QFT
        {quest.boost && <span style={{ color: '#f39c12' }}> ⚡ Boost</span>}
      </div>
      {!quest.completed && (
        <div style={{ 
          marginTop: '4px', 
          height: '4px', 
          backgroundColor: '#e9ecef', 
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            height: '100%', 
            width: `${progressPercentage}%`, 
            backgroundColor: '#3498db',
            transition: 'width 0.3s ease'
          }} />
        </div>
      )}
    </div>
  );
};

export default GameUI;