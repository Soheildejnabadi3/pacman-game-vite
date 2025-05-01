
import React, { useRef, useEffect, useState } from "react";
import { GameState, Direction } from "../game/types";
import { initializeGameState, updateGameState, processInput, advanceLevel, restartGame } from "../game/gameLogic";
import { toast } from "sonner";
import { FRAME_DURATION } from "@/game/constants";
import GameCanvas from "./game/GameCanvas";
import GameControls from "./game/GameControls";
import GameInstructions from "./game/GameInstructions";

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => initializeGameState());
  const [isPaused, setIsPaused] = useState(false);
  const lastUpdateTimeRef = useRef<number>(0);
  const requestIdRef = useRef<number>(0);
  
  useEffect(() => {
    // Handle keyboard input
    const handleKeyDown = (e: KeyboardEvent) => {
      let direction = Direction.NONE;
      
      switch (e.key) {
        case "ArrowUp":
        case "w":
          direction = Direction.UP;
          break;
        case "ArrowDown":
        case "s":
          direction = Direction.DOWN;
          break;
        case "ArrowLeft":
        case "a":
          direction = Direction.LEFT;
          break;
        case "ArrowRight":
        case "d":
          direction = Direction.RIGHT;
          break;
        case "p":
          setIsPaused(prev => !prev);
          return;
      }
      
      if (direction !== Direction.NONE) {
        setGameState(prevState => processInput(prevState, direction));
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (gameState.gameStatus === "LEVEL_COMPLETE") {
      toast.success(`Level ${gameState.level} Complete! Moving to Level ${gameState.level + 1}`);
      
      // Small delay before starting next level
      const timer = setTimeout(() => {
        setGameState(advanceLevel(gameState));
      }, 2000);
      
      return () => clearTimeout(timer);
    }
    
    if (gameState.gameStatus === "GAME_OVER") {
      toast.error("Game Over! Try again?");
    }
  }, [gameState.gameStatus, gameState.level]);

  const handleMobileDirection = (direction: Direction) => {
    setGameState(prevState => processInput(prevState, direction));
  };

  const handleRestart = () => {
    setGameState(restartGame());
    setIsPaused(false);
    toast.info("Game Restarted!");
  };

  const handlePlayPause = () => {
    setIsPaused(prev => !prev);
    toast(isPaused ? "Game Resumed" : "Game Paused");
  };

  const gameLoop = (timestamp: number) => {
    if (!lastUpdateTimeRef.current) {
      lastUpdateTimeRef.current = timestamp;
    }
    
    const deltaTime = timestamp - lastUpdateTimeRef.current;
    
    // Only update game state if enough time has passed and game is not paused
    if (deltaTime >= FRAME_DURATION && !isPaused) {
      if (gameState.gameStatus === "PLAYING") {
        setGameState(prevState => updateGameState(prevState, deltaTime));
      }
      lastUpdateTimeRef.current = timestamp;
    }
    
    // Continue the game loop
    requestIdRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    // Start game loop
    requestIdRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  }, [gameState, isPaused]);

  return (
    <div className="flex flex-col items-center w-full max-w-full overflow-hidden">
      <GameCanvas 
        gameState={gameState} 
        isPaused={isPaused}
        onDirectionChange={handleMobileDirection}
      />
      
      <GameControls 
        isPaused={isPaused}
        onPlayPause={handlePlayPause}
        onRestart={handleRestart}
      />
      
      <GameInstructions />
    </div>
  );
};

export default Game;
