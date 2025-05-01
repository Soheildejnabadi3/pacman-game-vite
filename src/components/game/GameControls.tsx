
import React from "react";
import { Button } from "@/components/ui/button";

type GameControlsProps = {
  isPaused: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
};

const GameControls: React.FC<GameControlsProps> = ({ isPaused, onPlayPause, onRestart }) => {
  return (
    <div className="flex gap-4 my-2">
      <Button 
        onClick={onPlayPause} 
        variant="outline"
        className="bg-neon-purple text-white border-neon-purple hover:bg-purple-700"
      >
        {isPaused ? "Resume" : "Pause"}
      </Button>
      
      <Button 
        onClick={onRestart} 
        variant="outline"
        className="bg-neon-red text-white border-neon-red hover:bg-red-700"
      >
        Restart
      </Button>
    </div>
  );
};

export default GameControls;
