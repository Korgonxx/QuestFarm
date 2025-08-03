# 🌾 QuestFarm - Web3 Farming Game

A quest-driven 2D farming game built with React, Phaser.js, and Irys for permanent data storage.

## 🎮 Features

### Farming System
- **5x5 Farm Grid**: Interactive farm tiles rendered with Phaser.js
- **Plant & Harvest**: Click empty tiles to plant wheat, wait 30 seconds for crops to grow
- **Visual Feedback**: Different tile colors and emojis for empty soil (🌱), growing crops, and ready harvests (🌾)
- **Token Rewards**: Earn 1 QFT token per harvested crop

### Quest System
- **3 Sample Quests**:
  1. Plant 10 seeds (10 QFT reward + boost)
  2. Harvest 5 crops (15 QFT reward + boost)
  3. Find the secret chest (20 QFT reward)
- **Progress Tracking**: Real-time quest progress with visual progress bars
- **Automatic Completion**: Quests auto-complete when targets are reached

### Token System
- **QFT Tokens**: In-game currency earned through farming and quests
- **Multiple Sources**: Earn tokens from harvesting (1 QFT) and completing quests (10-20 QFT)
- **Live Counter**: Real-time token balance display

### Permanent Data Storage
- **Irys Integration**: Game state saved permanently on Arweave via Irys
- **LocalStorage Fallback**: Automatic fallback to browser storage if Irys is unavailable
- **Save/Load System**: Manual save and load functionality with status feedback

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone and setup the project:**
```bash
cd questfarm
npm install
```

2. **Start the development server:**
```bash
npm start
```

3. **Open your browser:**
Navigate to `http://localhost:3000` to play the game!

## 🎯 How to Play

1. **Plant Seeds**: Click on empty brown tiles to plant wheat seeds (🌱)
2. **Wait for Growth**: Crops take 30 seconds to mature into harvestable wheat (🌾)
3. **Harvest Crops**: Click on mature crops to harvest them and earn 1 QFT token
4. **Complete Quests**: Track your progress in the quest panel and earn bonus tokens
5. **Find Secrets**: Look for the secret chest (📦) in the bottom-right corner
6. **Save Progress**: Use the Save/Load buttons to preserve your game state

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18**: UI framework with TypeScript
- **Phaser.js 3**: 2D game engine for the farm grid
- **Custom CSS**: Responsive styling with farming theme

### Data Storage
- **Irys SDK**: Permanent data storage on Arweave
- **LocalStorage**: Fallback storage mechanism
- **JSON Format**: Structured game state serialization

### Game Logic
- **State Management**: Centralized game state with React hooks
- **Real-time Updates**: Live synchronization between Phaser game and React UI
- **Timer System**: Phaser-based crop growth timers

## 📁 Project Structure

```
questfarm/
├── src/
│   ├── components/
│   │   └── GameUI.tsx          # React UI components
│   ├── game/
│   │   └── FarmGame.ts         # Phaser game scene
│   ├── services/
│   │   └── IrysService.ts      # Data storage service
│   ├── types/
│   │   └── game.ts             # TypeScript interfaces
│   ├── App.tsx                 # Main application component
│   ├── App.css                 # Styling
│   └── index.tsx               # Entry point
├── package.json
└── README.md
```

## 🔧 Configuration

### Irys Settings
The game uses Irys devnet by default. To configure for production:

```typescript
// In src/services/IrysService.ts
this.irys = new Irys({
  network: 'mainnet', // Change to 'mainnet' for production
  token: 'arweave',
  key: 'use_wallet',
});
```

### Game Parameters
Crop growth time and rewards can be adjusted in `src/game/FarmGame.ts`:

```typescript
// Crop growth time (currently 30 seconds)
harvestableAt: now + 30000,

// Token reward per harvest (currently 1 QFT)
this.gameState.tokens += 1;
```

## 🌐 Web3 Integration

- **Permanent Storage**: Game data stored permanently on Arweave via Irys
- **Decentralized**: No central server required for data persistence
- **Transparent**: All game saves are publicly verifiable on the blockchain

## 🐛 Troubleshooting

### Common Issues

1. **Irys Connection Failed**
   - Game automatically falls back to localStorage
   - Check console for detailed error messages

2. **Game Not Loading**
   - Ensure all dependencies are installed: `npm install`
   - Check browser console for errors

3. **Save/Load Not Working**
   - Verify localStorage permissions in browser
   - Try refreshing the page and loading again

## 🛠️ Development

### Available Scripts
- `npm start`: Run development server
- `npm build`: Build for production
- `npm test`: Run test suite

### Adding New Features
1. Define new types in `src/types/game.ts`
2. Update game logic in `src/game/FarmGame.ts`
3. Add UI components in `src/components/`
4. Update data storage in `src/services/IrysService.ts`

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Happy Farming! 🌾**
