import { Button } from "@/components/ui/button";

interface GameControlsProps {
  onBackToMenu: () => void;
}

export default function GameControls({ onBackToMenu }: GameControlsProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Controls</h3>
      
      <div className="space-y-3">
        <Button
          onClick={onBackToMenu}
          className="w-full bg-slate-600 hover:bg-slate-700 text-white"
        >
          ← Back to Menu
        </Button>
      </div>
    </div>
  );
}
