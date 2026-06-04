import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ChessBoard from "@/components/ChessBoard";
import GameControls from "@/components/GameControls";
import GameInfo from "@/components/GameInfo";
import type { PieceTheme } from "@/lib/piece-themes";
import type { BoardTheme } from "@/lib/board-themes";

export type TimeControl = "classical" | "rapid10" | "rapid15" | "rapid30" | "blitz3" | "blitz5" | "bullet";

export default function Home() {
  const [gameMode, setGameMode] = useState<"menu" | "pvp" | "pvc" | "difficulty" | "timecontrol" | "ai-timecontrol" | "piece-theme" | "board-theme">("menu");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [timeControl, setTimeControl] = useState<TimeControl>("classical");
  const [pieceTheme, setPieceTheme] = useState<PieceTheme>("unicode");
  const [boardTheme, setBoardTheme] = useState<BoardTheme>("classic");
  const [gameKey, setGameKey] = useState(0);

  const handleStartGame = (mode: "pvp" | "pvc", diff?: "easy" | "medium" | "hard", time?: TimeControl) => {
    setGameMode(mode);
    if (diff) setDifficulty(diff);
    if (time) setTimeControl(time);
    setGameKey(prev => prev + 1);
  };

  const handlePlayVsAI = () => {
    setGameMode("difficulty");
  };

  const handleSelectTimeControl = (time: TimeControl) => {
    setTimeControl(time);
    setGameMode("timecontrol");
  };

  const handleSelectAITimeControl = (time: TimeControl) => {
    setTimeControl(time);
    setGameMode("ai-timecontrol");
  };

  const handleSelectPieceTheme = (theme: PieceTheme) => {
    setPieceTheme(theme);
    setGameMode("board-theme");
  };

  const handleSelectBoardTheme = (theme: BoardTheme) => {
    setBoardTheme(theme);
    setGameMode("menu");
  };

  const handleBackToMenu = () => {
    setGameMode("menu");
    setGameKey(prev => prev + 1);
  };

  const timeControlOptions: Array<{ label: string; value: TimeControl; icon: string; description: string }> = [
    { label: "Classical", value: "classical", icon: "🐢", description: "120 min per player" },
    { label: "Rapid 10", value: "rapid10", icon: "🚶", description: "10 min per player" },
    { label: "Rapid 15", value: "rapid15", icon: "🚶", description: "15 min per player" },
    { label: "Rapid 30", value: "rapid30", icon: "🚶", description: "30 min per player" },
    { label: "Blitz 3", value: "blitz3", icon: "🏃", description: "3 min per player" },
    { label: "Blitz 5", value: "blitz5", icon: "🏃", description: "5 min per player" },
    { label: "Bullet", value: "bullet", icon: "⚡", description: "1 min per player" },
  ];

  const pieceThemeOptions: Array<{ label: string; value: PieceTheme; preview: string }> = [
    { label: "Unicode (Classic)", value: "unicode", preview: "♚ ♛ ♜ ♝ ♞ ♟" },
    { label: "ASCII", value: "ascii", preview: "K Q R B N P" },
    { label: "Symbols", value: "symbols", preview: "⚜️ 👑 🏰 🎯 🐴 ⚪" },
    { label: "Fancy", value: "fancy", preview: "◎ ◉ ◻ ◆ ◈ ◯" },
    { label: "Letters", value: "letters", preview: "♚︎ ♛︎ ♜︎ ♝︎ ♞︎ ♟︎" },
    { label: "Emoji", value: "emoji", preview: "🤴 👸 🏰 ⛪ 🦄 🤍" },
  ];

  const boardThemeOptions: Array<{ label: string; value: BoardTheme }> = [
    { label: "Classic", value: "classic" },
    { label: "Green", value: "green" },
    { label: "Blue", value: "blue" },
    { label: "Purple", value: "purple" },
    { label: "Wood", value: "wood" },
    { label: "Marble", value: "marble" },
    { label: "Ocean", value: "ocean" },
    { label: "Sunset", value: "sunset" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">♟ Chess Game ♟</h1>
        <p className="text-sm sm:text-base text-slate-300">Play chess online with AI or a friend</p>
      </div>

      {/* Main Content */}
      {gameMode === "menu" ? (
        <div className="bg-slate-800 rounded-lg shadow-2xl p-6 sm:p-8 max-w-sm w-full border border-slate-700">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">Select Game Mode</h2>
          <div className="space-y-4">
            <Button
              onClick={() => handleSelectTimeControl("classical")}
              className="w-full py-4 sm:py-6 text-base sm:text-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              👥 Player vs Player
            </Button>
            <Button
              onClick={handlePlayVsAI}
              className="w-full py-4 sm:py-6 text-base sm:text-lg bg-purple-600 hover:bg-purple-700 text-white"
            >
              🤖 Play vs AI
            </Button>
            <Button
              onClick={() => setGameMode("piece-theme")}
              className="w-full py-4 sm:py-6 text-base sm:text-lg bg-orange-600 hover:bg-orange-700 text-white"
            >
              🎨 Customize Themes
            </Button>
          </div>
        </div>
      ) : gameMode === "piece-theme" ? (
        <div className="bg-slate-800 rounded-lg shadow-2xl p-6 sm:p-8 max-w-2xl w-full border border-slate-700">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">Select Piece Theme</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {pieceThemeOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => handleSelectPieceTheme(option.value)}
                className={`py-3 sm:py-4 text-base sm:text-lg ${
                  pieceTheme === option.value
                    ? "bg-green-600 hover:bg-green-700 ring-2 ring-green-400"
                    : "bg-slate-600 hover:bg-slate-700"
                } text-white`}
              >
                <div className="flex flex-col items-center w-full">
                  <span className="text-lg sm:text-xl mb-1">{option.label}</span>
                  <span className="text-xs sm:text-sm text-slate-200">{option.preview}</span>
                </div>
              </Button>
            ))}
          </div>
          <Button
            onClick={handleBackToMenu}
            className="w-full py-4 sm:py-6 text-base sm:text-lg bg-slate-600 hover:bg-slate-700 text-white mt-4"
          >
            ← Back
          </Button>
        </div>
      ) : gameMode === "board-theme" ? (
        <div className="bg-slate-800 rounded-lg shadow-2xl p-6 sm:p-8 max-w-2xl w-full border border-slate-700">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">Select Board Theme</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {boardThemeOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => handleSelectBoardTheme(option.value)}
                className={`py-3 sm:py-4 text-base sm:text-lg ${
                  boardTheme === option.value
                    ? "bg-green-600 hover:bg-green-700 ring-2 ring-green-400"
                    : "bg-slate-600 hover:bg-slate-700"
                } text-white`}
              >
                <span className="text-xs sm:text-sm">{option.label}</span>
              </Button>
            ))}
          </div>
          <Button
            onClick={() => setGameMode("piece-theme")}
            className="w-full py-4 sm:py-6 text-base sm:text-lg bg-slate-600 hover:bg-slate-700 text-white mt-4"
          >
            ← Back
          </Button>
        </div>
      ) : gameMode === "timecontrol" ? (
        <div className="bg-slate-800 rounded-lg shadow-2xl p-6 sm:p-8 max-w-sm w-full border border-slate-700">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">Select Time Control</h2>
          <div className="space-y-3 sm:space-y-4">
            {timeControlOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => handleStartGame("pvp", undefined, option.value)}
                className="w-full py-3 sm:py-4 text-base sm:text-lg bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <div className="flex flex-col items-start w-full">
                  <span className="text-lg sm:text-xl">{option.icon} {option.label}</span>
                  <span className="text-xs sm:text-sm text-indigo-200">{option.description}</span>
                </div>
              </Button>
            ))}
            <Button
              onClick={handleBackToMenu}
              className="w-full py-4 sm:py-6 text-base sm:text-lg bg-slate-600 hover:bg-slate-700 text-white"
            >
              ← Back
            </Button>
          </div>
        </div>
      ) : gameMode === "difficulty" ? (
        <div className="bg-slate-800 rounded-lg shadow-2xl p-6 sm:p-8 max-w-sm w-full border border-slate-700">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">Select Difficulty</h2>
          <div className="space-y-3 sm:space-y-4">
            {(["easy", "medium", "hard"] as const).map((diff) => (
              <Button
                key={diff}
                onClick={() => {
                  setDifficulty(diff);
                  handleSelectAITimeControl("classical");
                }}
                className="w-full py-3 sm:py-6 text-base sm:text-lg bg-green-600 hover:bg-green-700 text-white capitalize"
              >
                {diff === "easy" ? "🟢" : diff === "medium" ? "🟡" : "🔴"} {diff}
              </Button>
            ))}
            <Button
              onClick={handleBackToMenu}
              className="w-full py-4 sm:py-6 text-base sm:text-lg bg-slate-600 hover:bg-slate-700 text-white"
            >
              ← Back
            </Button>
          </div>
        </div>
      ) : gameMode === "ai-timecontrol" ? (
        <div className="bg-slate-800 rounded-lg shadow-2xl p-6 sm:p-8 max-w-sm w-full border border-slate-700">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">Select Time Control</h2>
          <div className="space-y-3 sm:space-y-4">
            {timeControlOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => handleStartGame("pvc", difficulty, option.value)}
                className="w-full py-3 sm:py-4 text-base sm:text-lg bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <div className="flex flex-col items-start w-full">
                  <span className="text-lg sm:text-xl">{option.icon} {option.label}</span>
                  <span className="text-xs sm:text-sm text-indigo-200">{option.description}</span>
                </div>
              </Button>
            ))}
            <Button
              onClick={handleBackToMenu}
              className="w-full py-4 sm:py-6 text-base sm:text-lg bg-slate-600 hover:bg-slate-700 text-white"
            >
              ← Back
            </Button>
          </div>
        </div>
      ) : gameMode === "pvp" || gameMode === "pvc" ? (
        <div className="w-full max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
            {/* Chess Board */}
            <div className="flex-1 flex justify-center overflow-x-auto">
              <ChessBoard
                key={gameKey}
                gameMode={gameMode}
                difficulty={difficulty}
                timeControl={timeControl}
                pieceTheme={pieceTheme}
                boardTheme={boardTheme}
                onGameEnd={handleBackToMenu}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 space-y-4 sm:space-y-6 px-2 sm:px-0">
              <GameInfo gameMode={gameMode} timeControl={timeControl} />
              <GameControls onBackToMenu={handleBackToMenu} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
