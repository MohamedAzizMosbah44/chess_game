# Chess Game - Web Version

A fully functional chess game built with React, TypeScript, and Tailwind CSS. Play against an AI opponent or with a friend locally.

## Features

- **Two Game Modes:**
  - Player vs Player (local multiplayer)
  - Player vs AI (with 3 difficulty levels: Easy, Medium, Hard)

- **Complete Chess Rules:**
  - All piece movements (pawns, rooks, knights, bishops, queens, kings)
  - Check and checkmate detection
  - Stalemate detection
  - Pawn promotion
  - Move validation and legal move filtering

- **AI Engine:**
  - Intelligent move evaluation based on piece capture value
  - Difficulty levels that affect move selection strategy
  - Responsive AI with 500ms delay for better UX

- **Modern UI:**
  - Clean, dark-themed interface
  - Interactive chessboard with visual feedback
  - Move highlighting and selection indicators
  - Game status display

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

The app will be available at `http://localhost:3000`

## How to Play

1. **Select Game Mode:** Choose between Player vs Player or Player vs AI
2. **Select Difficulty (AI mode):** Choose Easy, Medium, or Hard
3. **Make Moves:** 
   - Click on a piece to select it (valid moves will be highlighted)
   - Click on a highlighted square to move the piece
   - Capture opponent pieces to gain advantage
4. **Win Conditions:**
   - Checkmate your opponent to win
   - Stalemate results in a draw

## Project Structure

```
client/
  src/
    pages/
      Home.tsx          - Main game page with mode selection
    components/
      ChessBoard.tsx    - Interactive chess board component
      GameInfo.tsx      - Game information sidebar
      GameControls.tsx  - Game control buttons
    lib/
      chess-engine.ts   - Chess game logic and AI engine
    App.tsx             - Main app component
    index.css           - Global styles
```

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Vite** - Build tool

## License

MIT
