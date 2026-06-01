import type { TimeControl } from "@/pages/Home";

interface GameInfoProps {
  gameMode: "pvp" | "pvc";
  timeControl: TimeControl;
}

export default function GameInfo({ gameMode, timeControl }: GameInfoProps) {
  const getTimeControlInfo = (tc: TimeControl) => {
    switch (tc) {
      case "classical":
        return { name: "Classical", time: "120 min", icon: "🐢" };
      case "rapid10":
        return { name: "Rapid 10", time: "10 min", icon: "🚶" };
      case "rapid15":
        return { name: "Rapid 15", time: "15 min", icon: "🚶" };
      case "rapid30":
        return { name: "Rapid 30", time: "30 min", icon: "🚶" };
      case "blitz3":
        return { name: "Blitz 3", time: "3 min", icon: "🏃" };
      case "blitz5":
        return { name: "Blitz 5", time: "5 min", icon: "🏃" };
      case "bullet":
        return { name: "Bullet", time: "1 min", icon: "⚡" };
    }
  };

  const tcInfo = getTimeControlInfo(timeControl);

  return (
    <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Game Info</h3>
      
      <div className="space-y-3 text-slate-300 text-sm sm:text-base">
        <div>
          <p className="text-xs sm:text-sm font-semibold text-slate-400">Mode</p>
          <p className="text-base sm:text-lg">{gameMode === "pvp" ? "Player vs Player" : "Player vs AI"}</p>
        </div>

        <div>
          <p className="text-xs sm:text-sm font-semibold text-slate-400">Time Control</p>
          <p className="text-base sm:text-lg">{tcInfo?.icon} {tcInfo?.name} ({tcInfo?.time})</p>
        </div>

        <div>
          <p className="text-xs sm:text-sm font-semibold text-slate-400">How to Play</p>
          <ul className="text-xs sm:text-sm space-y-1 mt-2">
            <li>• Click a piece to select it</li>
            <li>• Click a highlighted square to move</li>
            <li>• Capture opponent pieces to win</li>
            <li>• Checkmate wins the game</li>
          </ul>
        </div>

        <div>
          <p className="text-xs sm:text-sm font-semibold text-slate-400">Piece Values</p>
          <ul className="text-xs sm:text-sm space-y-1 mt-2">
            <li>♙ Pawn = 1</li>
            <li>♘ Knight = 3</li>
            <li>♗ Bishop = 3</li>
            <li>♖ Rook = 5</li>
            <li>♕ Queen = 9</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
