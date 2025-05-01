
import { GameState, CellType, Direction } from "./types";
import { findPacmanSpawn, findGhostSpawn } from "./levels";
import { POINTS, POWER_PELLET_DURATION } from "./constants";

// Check for collisions with dots, power pellets, and ghosts
export const checkCollisions = (state: GameState): void => {
  const { pacman, grid, ghosts } = state;
  const { x, y } = pacman.position;
  
  // Check for dot or power pellet collision
  const cell = grid[y][x];
  if (cell === CellType.DOT) {
    grid[y][x] = CellType.EMPTY;
    state.score += POINTS.DOT;
    state.dotsRemaining--;
  } else if (cell === CellType.POWER_PELLET) {
    grid[y][x] = CellType.EMPTY;
    state.score += POINTS.POWER_PELLET;
    state.dotsRemaining--;
    state.powerPelletActive = true;
    state.powerPelletTimer = POWER_PELLET_DURATION[Math.min(state.level - 1, POWER_PELLET_DURATION.length - 1)];
    
    // Make all ghosts vulnerable
    ghosts.forEach(ghost => {
      ghost.isVulnerable = true;
      ghost.isReturningHome = false;
    });
  }
  
  // Check for ghost collision
  for (let i = 0; i < ghosts.length; i++) {
    const ghost = ghosts[i];
    if (ghost.position.x === pacman.position.x && ghost.position.y === pacman.position.y) {
      if (ghost.isVulnerable) {
        // Pac-Man eats ghost
        state.score += POINTS.GHOST;
        ghost.isVulnerable = false;
        ghost.isReturningHome = true;
      } else if (!ghost.isReturningHome) {
        // Ghost eats Pac-Man
        pacman.isAlive = false;
        state.lives--;
        
        if (state.lives <= 0) {
          state.gameStatus = "GAME_OVER";
        } else {
          // Reset positions after a short delay (handled in the game component)
          setTimeout(() => {
            const pacmanSpawn = findPacmanSpawn(grid);
            const ghostSpawn = findGhostSpawn(grid);
            
            pacman.position = { ...pacmanSpawn };
            pacman.direction = Direction.NONE;
            pacman.nextDirection = Direction.NONE;
            pacman.isAlive = true;
            
            for (let j = 0; j < ghosts.length; j++) {
              ghosts[j].position = {
                x: ghostSpawn.x + (j - 1),
                y: ghostSpawn.y,
              };
              ghosts[j].isReturningHome = false;
              ghosts[j].isVulnerable = false;
            }
          }, 1000);
        }
        break;
      }
    }
  }
};
