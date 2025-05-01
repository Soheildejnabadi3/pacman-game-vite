
import { GameState, Direction } from "./types";
import { isValidMove, directionToDelta } from "./utils";

// Move Pac-Man based on current direction and next direction
export const movePacman = (state: GameState): void => {
  const { pacman, grid } = state;
  
  // Try next direction first
  if (pacman.nextDirection !== Direction.NONE) {
    const delta = directionToDelta(pacman.nextDirection);
    const nextPosition = {
      x: pacman.position.x + delta.x,
      y: pacman.position.y + delta.y,
    };
    
    if (isValidMove(grid, nextPosition)) {
      pacman.position = nextPosition;
      pacman.direction = pacman.nextDirection;
      pacman.isChomping = !pacman.isChomping;
      return;
    }
  }
  
  // If next direction is not valid or not set, try current direction
  if (pacman.direction !== Direction.NONE) {
    const delta = directionToDelta(pacman.direction);
    const nextPosition = {
      x: pacman.position.x + delta.x,
      y: pacman.position.y + delta.y,
    };
    
    if (isValidMove(grid, nextPosition)) {
      pacman.position = nextPosition;
      pacman.isChomping = !pacman.isChomping;
      return;
    }
  }
  
  // If both directions are invalid, Pac-Man doesn't move
};

// Process player input
export const processInput = (state: GameState, direction: Direction): GameState => {
  if (state.gameStatus === "START") {
    return {
      ...state,
      gameStatus: "PLAYING",
      pacman: {
        ...state.pacman,
        nextDirection: direction,
      },
    };
  }

  if (state.gameStatus === "PLAYING") {
    return {
      ...state,
      pacman: {
        ...state.pacman,
        nextDirection: direction,
      },
    };
  }

  return state;
};
