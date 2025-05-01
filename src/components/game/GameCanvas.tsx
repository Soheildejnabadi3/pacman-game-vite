
import React, { useRef, useEffect } from "react";
import { GameState, Direction, CellType } from "@/game/types";
import { CELL_SIZE } from "@/game/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileControls from "./MobileControls";

type GameCanvasProps = {
  gameState: GameState;
  isPaused: boolean;
  onDirectionChange: (direction: Direction) => void;
};

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, isPaused, onDirectionChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  
  // Game dimensions
  const gameWidth = gameState.grid[0].length * CELL_SIZE;
  const gameHeight = gameState.grid.length * CELL_SIZE;
  
  const drawGame = (ctx: CanvasRenderingContext2D, state: GameState) => {
    const { grid, pacman, ghosts } = state;
    
    // Clear canvas
    ctx.fillStyle = "#1A1F2C";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw maze
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const cellType = grid[y][x];
        const cellX = x * CELL_SIZE;
        const cellY = y * CELL_SIZE;
        
        switch (cellType) {
          case CellType.WALL:
            ctx.fillStyle = "#8B5CF6";
            ctx.shadowColor = "#8B5CF6";
            ctx.shadowBlur = 10;
            ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
            ctx.shadowBlur = 0;
            break;
          case CellType.DOT:
            ctx.fillStyle = "#FFBA08";
            ctx.beginPath();
            ctx.arc(
              cellX + CELL_SIZE / 2,
              cellY + CELL_SIZE / 2,
              CELL_SIZE / 10,
              0,
              Math.PI * 2
            );
            ctx.fill();
            break;
          case CellType.POWER_PELLET:
            ctx.fillStyle = "#FFBA08";
            ctx.shadowColor = "#FFBA08";
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(
              cellX + CELL_SIZE / 2,
              cellY + CELL_SIZE / 2,
              CELL_SIZE / 4,
              0,
              Math.PI * 2
            );
            ctx.fill();
            ctx.shadowBlur = 0;
            break;
          default:
            break;
        }
      }
    }
    
    // Draw Pac-Man
    if (pacman.isAlive) {
      const pacmanX = pacman.position.x * CELL_SIZE + CELL_SIZE / 2;
      const pacmanY = pacman.position.y * CELL_SIZE + CELL_SIZE / 2;
      const pacmanRadius = CELL_SIZE / 2 - 2;
      
      ctx.fillStyle = "#FFFF00";
      ctx.shadowColor = "#FFFF00";
      ctx.shadowBlur = 5;
      ctx.beginPath();
      
      // Calculate mouth angle based on direction
      let startAngle = 0.2;
      let endAngle = 1.8 * Math.PI;
      
      if (pacman.direction === Direction.RIGHT) {
        startAngle = 0.2 * Math.PI;
        endAngle = 1.8 * Math.PI;
      } else if (pacman.direction === Direction.LEFT) {
        startAngle = 1.2 * Math.PI;
        endAngle = 0.8 * Math.PI;
      } else if (pacman.direction === Direction.UP) {
        startAngle = 1.7 * Math.PI;
        endAngle = 1.3 * Math.PI;
      } else if (pacman.direction === Direction.DOWN) {
        startAngle = 0.7 * Math.PI;
        endAngle = 0.3 * Math.PI;
      }
      
      // Add chomping animation
      if (pacman.isChomping) {
        startAngle += 0.1 * Math.PI;
        endAngle -= 0.1 * Math.PI;
      }
      
      ctx.arc(pacmanX, pacmanY, pacmanRadius, startAngle, endAngle);
      ctx.lineTo(pacmanX, pacmanY);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    
    // Draw ghosts
    for (const ghost of ghosts) {
      const ghostX = ghost.position.x * CELL_SIZE + CELL_SIZE / 2;
      const ghostY = ghost.position.y * CELL_SIZE + CELL_SIZE / 2;
      
      // Set ghost color based on type and state
      let color = "#FF0000"; // Default red
      
      if (ghost.isVulnerable) {
        // Flashing blue/white when vulnerable timer is low
        color = state.powerPelletTimer < 2000 && Math.floor(Date.now() / 200) % 2 === 0
          ? "#FFFFFF"
          : "#0000FF";
      } else if (ghost.isReturningHome) {
        color = "#888888"; // Gray when returning to spawn
      } else {
        // Normal colors based on ghost type
        switch (ghost.type) {
          case "BLINKY":
            color = "#FF0000"; // Red
            break;
          case "PINKY":
            color = "#D946EF"; // Pink
            break;
          case "INKY":
            color = "#00FFFF"; // Cyan
            break;
          case "CLYDE":
            color = "#F97316"; // Orange
            break;
        }
      }
      
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      
      // Ghost body
      ctx.beginPath();
      ctx.arc(
        ghostX,
        ghostY - 2,
        CELL_SIZE / 2.5,
        Math.PI,
        0,
        false
      );
      
      // Ghost bottom with "tentacles"
      const ghostWidth = CELL_SIZE / 1.25;
      const tentacleHeight = CELL_SIZE / 5;
      
      ctx.lineTo(ghostX + ghostWidth / 2, ghostY - 2);
      ctx.lineTo(ghostX + ghostWidth / 2, ghostY + tentacleHeight);
      ctx.lineTo(ghostX + ghostWidth / 3, ghostY);
      ctx.lineTo(ghostX + ghostWidth / 6, ghostY + tentacleHeight);
      ctx.lineTo(ghostX, ghostY);
      ctx.lineTo(ghostX - ghostWidth / 6, ghostY + tentacleHeight);
      ctx.lineTo(ghostX - ghostWidth / 3, ghostY);
      ctx.lineTo(ghostX - ghostWidth / 2, ghostY + tentacleHeight);
      ctx.lineTo(ghostX - ghostWidth / 2, ghostY - 2);
      
      ctx.fill();
      
      // Ghost eyes
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowBlur = 0;
      
      // Calculate eye position based on direction
      let eyeOffsetX = 0;
      let eyeOffsetY = 0;
      
      switch (ghost.direction) {
        case Direction.LEFT:
          eyeOffsetX = -1;
          break;
        case Direction.RIGHT:
          eyeOffsetX = 1;
          break;
        case Direction.UP:
          eyeOffsetY = -1;
          break;
        case Direction.DOWN:
          eyeOffsetY = 1;
          break;
      }
      
      // Left eye
      ctx.beginPath();
      ctx.arc(
        ghostX - CELL_SIZE / 6,
        ghostY - CELL_SIZE / 6,
        CELL_SIZE / 8,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Right eye
      ctx.beginPath();
      ctx.arc(
        ghostX + CELL_SIZE / 6,
        ghostY - CELL_SIZE / 6,
        CELL_SIZE / 8,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Pupils
      if (!ghost.isVulnerable) {
        ctx.fillStyle = "#0000FF";
        
        // Left pupil
        ctx.beginPath();
        ctx.arc(
          ghostX - CELL_SIZE / 6 + eyeOffsetX * 2,
          ghostY - CELL_SIZE / 6 + eyeOffsetY * 2,
          CELL_SIZE / 16,
          0,
          Math.PI * 2
        );
        ctx.fill();
        
        // Right pupil
        ctx.beginPath();
        ctx.arc(
          ghostX + CELL_SIZE / 6 + eyeOffsetX * 2,
          ghostY - CELL_SIZE / 6 + eyeOffsetY * 2,
          CELL_SIZE / 16,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
    
    // Draw score and level
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px 'Press Start 2P', monospace";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${state.score}`, 10, 30);
    ctx.fillText(`Level: ${state.level}`, 10, 60);
    
    // Draw lives
    ctx.fillText("Lives:", 10, 90);
    
    for (let i = 0; i < state.lives; i++) {
      ctx.fillStyle = "#FFFF00";
      ctx.beginPath();
      ctx.arc(100 + i * 30, 82, 10, 0.2 * Math.PI, 1.8 * Math.PI);
      ctx.lineTo(100 + i * 30, 82);
      ctx.closePath();
      ctx.fill();
    }
    
    // Draw game status messages
    if (state.gameStatus === "START") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      
      ctx.fillStyle = "#FFFF00";
      ctx.font = "30px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.fillText("PAC-MAN", ctx.canvas.width / 2, ctx.canvas.height / 2 - 50);
      ctx.font = "16px 'Press Start 2P', monospace";
      ctx.fillText("Press any arrow key to start", ctx.canvas.width / 2, ctx.canvas.height / 2);
      ctx.fillText("Level " + state.level, ctx.canvas.width / 2, ctx.canvas.height / 2 + 50);
    } else if (state.gameStatus === "GAME_OVER") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      
      ctx.fillStyle = "#FF0000";
      ctx.font = "30px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", ctx.canvas.width / 2, ctx.canvas.height / 2 - 30);
      ctx.font = "20px 'Press Start 2P', monospace";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(`Final Score: ${state.score}`, ctx.canvas.width / 2, ctx.canvas.height / 2 + 20);
    } else if (state.gameStatus === "LEVEL_COMPLETE") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      
      ctx.fillStyle = "#00FF00";
      ctx.font = "25px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.fillText(`LEVEL ${state.level} COMPLETE!`, ctx.canvas.width / 2, ctx.canvas.height / 2 - 30);
      ctx.font = "16px 'Press Start 2P', monospace";
      ctx.fillText(`Score: ${state.score}`, ctx.canvas.width / 2, ctx.canvas.height / 2 + 20);
      ctx.fillText("Loading next level...", ctx.canvas.width / 2, ctx.canvas.height / 2 + 60);
    } else if (isPaused) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "30px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.fillText("PAUSED", ctx.canvas.width / 2, ctx.canvas.height / 2);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    
    drawGame(ctx, gameState);
  }, [gameState, isPaused]);

  return (
    <div className="relative mb-2">
      <canvas 
        ref={canvasRef} 
        width={gameWidth} 
        height={gameHeight}
        className="border border-purple-500 rounded-lg shadow-lg"
        style={{ 
          maxWidth: "100%",
          maxHeight: "55vh",
          objectFit: "contain"
        }}
      />
      
      {/* Mobile Controls */}
      {isMobile && <MobileControls onDirectionChange={onDirectionChange} />}
    </div>
  );
};

export default GameCanvas;
