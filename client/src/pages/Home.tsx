import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ChessBoard from "@/components/ChessBoard";
import GameControls from "@/components/GameControls";
import GameInfo from "@/components/GameInfo";

export default function Home() {
  const [gameMode, setGameMode] = useState<"menu" | "pvp" | "pvc">("menu");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [gameKey, setGameKey] = useState(0);

  const handleStartGame = (mode: "pvp" | "pvc", diff?: "easy" | "medium" | "hard") => {
    setGameMode(mode);
    if (diff) setDifficulty(diff);
    setGameKey(prev => prev + 1);
  };

  const handleBackToMenu = () => {
    setGameMode("menu");
    setGameKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-2">♟ Chess Game ♟</h1>
        <p className="text-slate-300">Play chess online with AI or a friend</p>
      </div>

      {/* Main Content */}
      {gameMode === "menu" ? (
        <div className="bg-slate-800 rounded-lg shadow-2xl p-8 max-w-md w-full border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Select Game Mode</h2>
          <div className="space-y-4">
            <Button
              onClick={() => handleStartGame("pvp")}
              className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              👥 Player vs Player
            </Button>
            <Button
              onClick={() => setGameMode("pvc")}
              className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-700 text-white"
            >
              🤖 Play vs AI
            </Button>
          </div>
        </div>
      ) : gameMode === "pvc" ? (
        <div className="bg-slate-800 rounded-lg shadow-2xl p-8 max-w-md w-full border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Select Difficulty</h2>
          <div className="space-y-4">
            {(["easy", "medium", "hard"] as const).map((diff) => (
              <Button
                key={diff}
                onClick={() => handleStartGame("pvc", diff)}
                className="w-full py-6 text-lg bg-green-600 hover:bg-green-700 text-white capitalize"
              >
                {diff === "easy" ? "🟢" : diff === "medium" ? "🟡" : "🔴"} {diff}
              </Button>
            ))}
            <Button
              onClick={handleBackToMenu}
              className="w-full py-6 text-lg bg-slate-600 hover:bg-slate-700 text-white"
            >
              ← Back
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Chess Board */}
            <div className="flex-1 flex justify-center">
              <ChessBoard
                key={gameKey}
                gameMode={gameMode}
                difficulty={difficulty}
                onGameEnd={handleBackToMenu}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 space-y-6">
              <GameInfo gameMode={gameMode} />
              <GameControls onBackToMenu={handleBackToMenu} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
