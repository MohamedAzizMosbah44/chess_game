import { useState, useEffect } from "react";
import { ChessEngine } from "@/lib/chess-engine";
import { Button } from "@/components/ui/button";

interface ChessBoardProps {
  gameMode: "pvp" | "pvc";
  difficulty: "easy" | "medium" | "hard";
  onGameEnd: () => void;
}

export default function ChessBoard({ gameMode, difficulty, onGameEnd }: ChessBoardProps) {
  const [engine] = useState(() => new ChessEngine(gameMode, difficulty));
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [gameStatus, setGameStatus] = useState("white");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ from: [number, number]; to: [number, number] } | null>(null);
  const [, setRenderKey] = useState(0);

  const SQUARE_SIZE = 60;
  const BOARD_SIZE = 8;

  const handleSquareClick = (row: number, col: number) => {
    if (gameOver) return;

    // If it's AI's turn in PvC mode, don't allow clicks
    if (gameMode === "pvc" && engine.currentPlayer === "black") return;

    const clickedSquare: [number, number] = [row, col];

    // If a piece is already selected
    if (selectedSquare) {
      // Try to move the piece
      if (engine.movePiece(selectedSquare, clickedSquare)) {
        setLastMove({ from: selectedSquare, to: clickedSquare });
        setSelectedSquare(null);
        setValidMoves([]);

        // Check for game end
        if (engine.isCheckmate(engine.currentPlayer)) {
          setGameOver(true);
          setWinner(engine.currentPlayer === "white" ? "Black" : "White");
          return;
        }

        if (engine.isStalemate(engine.currentPlayer)) {
          setGameOver(true);
          setWinner("Draw (Stalemate)");
          return;
        }

        setGameStatus(engine.currentPlayer === "white" ? "White's Turn" : "Black's Turn");
        setRenderKey(prev => prev + 1);

        // If AI's turn in PvC mode
        if (gameMode === "pvc" && engine.currentPlayer === "black") {
          setTimeout(() => {
            const aiMove = engine.getAIMove();
            if (aiMove) {
              const [from, to] = aiMove;
              engine.movePiece(from, to);
              setLastMove({ from, to });

              // Check for game end after AI move
              if (engine.isCheckmate(engine.currentPlayer)) {
                setGameOver(true);
                setWinner(engine.currentPlayer === "white" ? "Black" : "White");
                return;
              }

              if (engine.isStalemate(engine.currentPlayer)) {
                setGameOver(true);
                setWinner("Draw (Stalemate)");
                return;
              }

              setGameStatus(engine.currentPlayer === "white" ? "White's Turn" : "Black's Turn");
              setRenderKey(prev => prev + 1);
            }
          }, 500);
        }
      } else {
        // If clicking on another piece of the same player, select it instead
        const piece = engine.getPieceAt(clickedSquare);
        if (piece && piece.color === engine.currentPlayer) {
          setSelectedSquare(clickedSquare);
          setValidMoves(engine.getValidMoves(clickedSquare));
        } else {
          setSelectedSquare(null);
          setValidMoves([]);
        }
      }
    } else {
      // Select a piece
      const piece = engine.getPieceAt(clickedSquare);
      if (piece && piece.color === engine.currentPlayer) {
        setSelectedSquare(clickedSquare);
        setValidMoves(engine.getValidMoves(clickedSquare));
      }
    }
  };

  const renderSquare = (row: number, col: number) => {
    const isLight = (row + col) % 2 === 0;
    const isSelected = selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
    const isValidMove = validMoves.some(m => m[0] === row && m[1] === col);
    const isLastMove = lastMove && (
      (lastMove.from[0] === row && lastMove.from[1] === col) ||
      (lastMove.to[0] === row && lastMove.to[1] === col)
    );

    let bgColor = isLight ? "#f0d9b5" : "#b58863";
    if (isSelected) bgColor = "#baca44";
    if (isLastMove) bgColor = "#ffe135";

    const piece = engine.getPieceAt([row, col]);

    return (
      <div
        key={`${row}-${col}`}
        onClick={() => handleSquareClick(row, col)}
        className="relative cursor-pointer hover:opacity-80 transition-opacity"
        style={{
          width: SQUARE_SIZE,
          height: SQUARE_SIZE,
          backgroundColor: bgColor,
          border: "1px solid #999",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
          fontWeight: "bold",
        }}
      >
        {isValidMove && (
          <div
            style={{
              width: "12px",
              height: "12px",
              backgroundColor: "#4169e1",
              borderRadius: "50%",
            }}
          />
        )}
        {piece && <span>{piece.symbol}</span>}
      </div>
    );
  };

  const renderBoard = () => {
    const squares = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        squares.push(renderSquare(row, col));
      }
    }
    return squares;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Status */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {gameOver ? (
            <span className="text-yellow-400">Game Over - {winner} Wins!</span>
          ) : (
            <span className={engine.currentPlayer === "white" ? "text-white" : "text-gray-300"}>
              {gameStatus}
            </span>
          )}
        </h2>
      </div>

      {/* Board */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(8, ${SQUARE_SIZE}px)`,
          gap: "0",
          border: "2px solid #333",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        {renderBoard()}
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-4">
        <Button onClick={onGameEnd} className="bg-red-600 hover:bg-red-700 text-white">
          Back to Menu
        </Button>
        {gameOver && (
          <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700 text-white">
            Play Again
          </Button>
        )}
      </div>
    </div>
  );
}
