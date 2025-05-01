
import { Direction, Position, CellType } from "./types";

// Helper function to check if a move is valid
export const isValidMove = (grid: CellType[][], position: Position): boolean => {
  const { x, y } = position;
  
  // Check boundaries
  if (y < 0 || y >= grid.length || x < 0 || x >= grid[0].length) {
    return false;
  }
  
  // Check if position is not a wall
  return grid[y][x] !== CellType.WALL;
};

// Convert direction to position delta
export const directionToDelta = (direction: Direction): Position => {
  switch (direction) {
    case Direction.UP:
      return { x: 0, y: -1 };
    case Direction.DOWN:
      return { x: 0, y: 1 };
    case Direction.LEFT:
      return { x: -1, y: 0 };
    case Direction.RIGHT:
      return { x: 1, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
};

// Get the opposite direction
export const getOppositeDirection = (direction: Direction): Direction => {
  switch (direction) {
    case Direction.UP:
      return Direction.DOWN;
    case Direction.DOWN:
      return Direction.UP;
    case Direction.LEFT:
      return Direction.RIGHT;
    case Direction.RIGHT:
      return Direction.LEFT;
    default:
      return Direction.NONE;
  }
};
