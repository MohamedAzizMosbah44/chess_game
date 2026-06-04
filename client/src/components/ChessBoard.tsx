import { useState, useEffect } from "react";
import { ChessEngine } from "@/lib/chess-engine";
import { Button } from "@/components/ui/button";
import { getThemeSymbol, type PieceTheme } from "@/lib/piece-themes";
import { getThemeColors, type BoardTheme } from "@/lib/board-themes";
import type { TimeControl } from "@/pages/Home";

interface ChessBoardProps {
  gameMode: "pvp" | "pvc";
  difficulty: "easy" | "medium" | "hard";
  timeControl: TimeControl;
  pieceTheme: PieceTheme;
  boardTheme: BoardTheme;
  onGameEnd: () => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function ChessBoard({ gameMode, difficulty, timeControl, pieceTheme, boardTheme, onGameEnd }: ChessBoardProps) {
  const [engine] = useState(() => new ChessEngine(gameMode, difficulty));
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [gameStatus, setGameStatus] = useState("white");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ from: [number, number]; to: [number, number] } | null>(null);
  const [, setRenderKey] = useState(0);

  // Time control
  const getInitialTime = (): number => {
    switch (timeControl) {
      case "classical": return 7200; // 120 minutes
      case "rapid10": return 600; // 10 minutes
      case "rapid15": return 900; // 15 minutes
      case "rapid30": return 1800; // 30 minutes
      case "blitz3": return 180; // 3 minutes
      case "blitz5": return 300; // 5 minutes
      case "bullet": return 60; // 1 minute
    }
  };

  const [whiteTime, setWhiteTime] = useState(getInitialTime());
  const [blackTime, setBlackTime] = useState(getInitialTime());
  const [squareSize, setSquareSize] = useState(60);

  // Timer effect
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      if (engine.currentPlayer === "white") {
        setWhiteTime(prev => {
          if (prev <= 1) {
            setGameOver(true);
            setWinner("Black");
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) {
            setGameOver(true);
            setWinner("White");
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver, engine.currentPlayer]);

  // Responsive sizing
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setSquareSize(35); // Mobile
      } else if (width < 1024) {
        setSquareSize(45); // Tablet
      } else {
        setSquareSize(60); // Desktop
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const BOARD_SIZE = 8;
  const colors = getThemeColors(boardTheme);

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

    let bgColor = isLight ? colors.light : colors.dark;
    if (isSelected) bgColor = colors.selected;
    if (isLastMove) bgColor = colors.lastMove;

    const piece = engine.getPieceAt([row, col]);
    const pieceSymbol = piece
      ? getThemeSymbol(pieceTheme, piece.color, piece.type as any)
      : null;

    return (
      <div
        key={`${row}-${col}`}
        onClick={() => handleSquareClick(row, col)}
        className="relative cursor-pointer hover:opacity-80 transition-opacity"
        style={{
          width: squareSize,
          height: squareSize,
          backgroundColor: bgColor,
          border: "1px solid #999",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: squareSize > 50 ? "32px" : "20px",
          fontWeight: "bold",
        }}
      >
        {isValidMove && (
          <div
            style={{
              width: squareSize > 50 ? 12 : 8,
              height: squareSize > 50 ? 12 : 8,
              backgroundColor: colors.validMove,
              borderRadius: "50%",
            }}
          />
        )}
        {pieceSymbol && <span>{pieceSymbol}</span>}
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

  const timeWarning = (time: number) => {
    if (time < 10) return "text-red-500";
    if (time < 30) return "text-yellow-500";
    return "text-white";
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full px-2 sm:px-4">
      {/* Timers - Top */}
      <div className="w-full max-w-2xl grid grid-cols-2 gap-4 mb-2">
        <div className="bg-slate-700 rounded p-3 text-center">
          <p className="text-xs sm:text-sm text-slate-400 mb-1">Black</p>
          <p className={`text-lg sm:text-2xl font-bold font-mono ${timeWarning(blackTime)}`}>
            {formatTime(blackTime)}
          </p>
        </div>
        <div className="bg-slate-700 rounded p-3 text-center">
          <p className="text-xs sm:text-sm text-slate-400 mb-1">White</p>
          <p className={`text-lg sm:text-2xl font-bold font-mono ${timeWarning(whiteTime)}`}>
            {formatTime(whiteTime)}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          {gameOver ? (
            <span className="text-yellow-400">
              {winner === "Draw (Stalemate)" ? `Game Over - ${winner}` : `Game Over - ${winner} Wins!`}
            </span>
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
          gridTemplateColumns: `repeat(8, ${squareSize}px)`,
          gap: "0",
          border: "2px solid #333",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        {renderBoard()}
      </div>

      {/* Controls */}
      <div className="flex gap-2 sm:gap-4 mt-4 flex-wrap justify-center">
        <Button onClick={onGameEnd} className="bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base">
          Back to Menu
        </Button>
        {gameOver && (
          <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base">
            Play Again
          </Button>
        )}
      </div>
    </div>
  );
}
