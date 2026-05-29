interface GameInfoProps {
  gameMode: "pvp" | "pvc";
}

export default function GameInfo({ gameMode }: GameInfoProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Game Info</h3>
      
      <div className="space-y-3 text-slate-300">
        <div>
          <p className="text-sm font-semibold text-slate-400">Mode</p>
          <p className="text-lg">{gameMode === "pvp" ? "Player vs Player" : "Player vs AI"}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-400">How to Play</p>
          <ul className="text-sm space-y-1 mt-2">
            <li>• Click a piece to select it</li>
            <li>• Click a highlighted square to move</li>
            <li>• Capture opponent pieces to win</li>
            <li>• Checkmate wins the game</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-400">Piece Values</p>
          <ul className="text-sm space-y-1 mt-2">
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
