
import { GameState, Ghost, Direction, Position, CellType } from "./types";
import { directionToDelta, getOppositeDirection } from "./utils";
import { findGhostSpawn } from "./levels";
import { GHOST_SPEED_MULTIPLIER } from "./constants";

// Calculate target positions for ghosts based on their type
export const calculateGhostTarget = (ghost: Ghost, pacman: GameState["pacman"], grid: CellType[][]): Position => {
  if (ghost.isReturningHome) {
    const ghostSpawn = findGhostSpawn(grid);
    return { ...ghostSpawn };
  }
  
  switch (ghost.type) {
    case "BLINKY":
      // Blinky targets Pac-Man directly
      return { ...pacman.position };
    case "PINKY":
      // Pinky targets 4 tiles ahead of Pac-Man
      const delta = directionToDelta(pacman.direction);
      return {
        x: pacman.position.x + delta.x * 4,
        y: pacman.position.y + delta.y * 4,
      };
    case "INKY":
      // Inky has more complex behavior, for now just targets a spot near Pac-Man
      return {
        x: pacman.position.x + (Math.random() > 0.5 ? 2 : -2),
        y: pacman.position.y + (Math.random() > 0.5 ? 2 : -2),
      };
    case "CLYDE":
      // Clyde targets Pac-Man if far, scatters if close
      const distance = Math.sqrt(
        Math.pow(ghost.position.x - pacman.position.x, 2) +
        Math.pow(ghost.position.y - pacman.position.y, 2)
      );
      if (distance > 8) {
        return { ...pacman.position };
      } else {
        // Scatter to a corner
        return { x: 1, y: grid.length - 2 };
      }
    default:
      return { ...pacman.position };
  }
};

// Get possible directions for a ghost to move
export const getPossibleDirections = (ghost: Ghost, grid: CellType[][]): Direction[] => {
  const possibleDirections: Direction[] = [];
  const { x, y } = ghost.position;
  
  // Don't allow ghosts to reverse direction unless vulnerable
  const oppositeDirection = getOppositeDirection(ghost.direction);
  
  if (y > 0 && grid[y - 1][x] !== CellType.WALL && (ghost.isVulnerable || ghost.direction !== Direction.DOWN)) {
    possibleDirections.push(Direction.UP);
  }
  if (y < grid.length - 1 && grid[y + 1][x] !== CellType.WALL && (ghost.isVulnerable || ghost.direction !== Direction.UP)) {
    possibleDirections.push(Direction.DOWN);
  }
  if (x > 0 && grid[y][x - 1] !== CellType.WALL && (ghost.isVulnerable || ghost.direction !== Direction.RIGHT)) {
    possibleDirections.push(Direction.LEFT);
  }
  if (x < grid[0].length - 1 && grid[y][x + 1] !== CellType.WALL && (ghost.isVulnerable || ghost.direction !== Direction.LEFT)) {
    possibleDirections.push(Direction.RIGHT);
  }
  
  return possibleDirections;
};

// Calculate the best direction for a ghost to reach its target
export const getBestDirection = (ghost: Ghost, target: Position, possibleDirections: Direction[]): Direction => {
  if (possibleDirections.length === 0) {
    return ghost.direction;
  }
  
  if (ghost.isVulnerable) {
    // When vulnerable, move randomly
    return possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
  }
  
  let bestDirection = possibleDirections[0];
  let shortestDistance = Number.MAX_VALUE;
  
  for (const direction of possibleDirections) {
    const delta = directionToDelta(direction);
    const nextPosition = {
      x: ghost.position.x + delta.x,
      y: ghost.position.y + delta.y,
    };
    
    const distance = Math.sqrt(
      Math.pow(nextPosition.x - target.x, 2) +
      Math.pow(nextPosition.y - target.y, 2)
    );
    
    if (distance < shortestDistance) {
      shortestDistance = distance;
      bestDirection = direction;
    }
  }
  
  return bestDirection;
};

// Move ghosts based on their targets
export const moveGhosts = (state: GameState, deltaTime: number): void => {
  const { ghosts, pacman, grid, level } = state;
  
  for (const ghost of ghosts) {
    // Skip if ghost is waiting to respawn
    if (ghost.isReturningHome && 
        ghost.position.x === findGhostSpawn(grid).x && 
        ghost.position.y === findGhostSpawn(grid).y) {
      ghost.isReturningHome = false;
      continue;
    }
    
    // Update ghost target
    ghost.targetPosition = calculateGhostTarget(ghost, pacman, grid);
    
    // Calculate move probability based on level speed multiplier
    const speedMultiplier = GHOST_SPEED_MULTIPLIER[Math.min(level - 1, GHOST_SPEED_MULTIPLIER.length - 1)];
    const moveProb = ghost.isReturningHome ? 1 : (ghost.isVulnerable ? 0.4 : speedMultiplier);
    
    // Only move sometimes based on probability
    if (Math.random() > moveProb) {
      continue;
    }
    
    // Get possible directions
    const possibleDirections = getPossibleDirections(ghost, grid);
    
    // Get best direction based on target
    const bestDirection = getBestDirection(ghost, ghost.targetPosition, possibleDirections);
    
    // Update ghost direction and position
    ghost.direction = bestDirection;
    const delta = directionToDelta(ghost.direction);
    ghost.position = {
      x: ghost.position.x + delta.x,
      y: ghost.position.y + delta.y,
    };
  }
};
