
import React from "react";

const GameInstructions: React.FC = () => {
  return (
    <div className="mt-1 px-4 max-w-3xl text-center mb-4">
      <h2 className="text-neon-yellow text-lg mb-1 neon-text">How to Play</h2>
      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-2 mb-2 shadow-lg">
        <p className="mb-1 text-sm">Use <span className="text-neon-yellow">arrow keys</span> or <span className="text-neon-yellow">WASD</span> to move Pac-Man.</p>
        <p className="mb-1 text-sm">Eat all dots to complete the level. Power pellets make ghosts vulnerable.</p>
        <p className="text-sm">Press <span className="text-neon-yellow">P</span> to pause the game.</p>
      </div>
    </div>
  );
};

export default GameInstructions;
