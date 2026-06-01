import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ChessBoard from "@/components/ChessBoard";
import GameControls from "@/components/GameControls";
import GameInfo from "@/components/GameInfo";

export type TimeControl = "classical" | "rapid" | "blitz" | "bullet";

export default function Home() {
  const [gameMode, setGameMode] = useState<"menu" | "pvp" | "pvc" | "difficulty" | "timecontrol">("menu");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [timeControl, setTimeControl] = useState<TimeControl>("classical");
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

  const handleBackToMenu = () => {
    setGameMode("menu");
    setGameKey(prev => prev + 1);
  };

  const timeControlOptions: Array<{ label: string; value: TimeControl; icon: string; description: string }> = [
    { label: "Classical", value: "classical", icon: "🐢", description: "10 min per player" },
    { label: "Rapid", value: "rapid", icon: "🚶", description: "5 min per player" },
    { label: "Blitz", value: "blitz", icon: "🏃", description: "3 min per player" },
    { label: "Bullet", value: "bullet", icon: "⚡", description: "1 min per player" },
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
          </div>
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
                onClick={() => handleStartGame("pvc", diff, timeControl)}
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
