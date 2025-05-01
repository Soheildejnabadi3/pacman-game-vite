
import React from "react";
import { Direction } from "@/game/types";

type MobileControlsProps = {
  onDirectionChange: (direction: Direction) => void;
};

const MobileControls: React.FC<MobileControlsProps> = ({ onDirectionChange }) => {
  return (
    <div className="mt-2 mb-2">
      <div className="grid grid-cols-3 gap-2 mx-auto w-48">
        {/* Top row with Up arrow */}
        <div className="col-span-1"></div>
        <button 
          className="mobile-control bg-purple-600/70 backdrop-blur-sm text-white text-2xl flex items-center justify-center shadow-lg"
          onClick={() => onDirectionChange(Direction.UP)}
          aria-label="Up"
        >
          ↑
        </button>
        <div className="col-span-1"></div>
        
        {/* Middle row with Left and Right arrows */}
        <button 
          className="mobile-control bg-purple-600/70 backdrop-blur-sm text-white text-2xl flex items-center justify-center shadow-lg"
          onClick={() => onDirectionChange(Direction.LEFT)}
          aria-label="Left"
        >
          ←
        </button>
        <div className="col-span-1"></div>
        <button 
          className="mobile-control bg-purple-600/70 backdrop-blur-sm text-white text-2xl flex items-center justify-center shadow-lg"
          onClick={() => onDirectionChange(Direction.RIGHT)}
          aria-label="Right"
        >
          →
        </button>
        
        {/* Bottom row with Down arrow */}
        <div className="col-span-1"></div>
        <button 
          className="mobile-control bg-purple-600/70 backdrop-blur-sm text-white text-2xl flex items-center justify-center shadow-lg"
          onClick={() => onDirectionChange(Direction.DOWN)}
          aria-label="Down"
        >
          ↓
        </button>
        <div className="col-span-1"></div>
      </div>
    </div>
  );
};

export default MobileControls;
