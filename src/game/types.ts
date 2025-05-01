
export enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  NONE = "NONE"
}

export type Position = {
  x: number;
  y: number;
};

export type Cell = {
  x: number;
  y: number;
  type: CellType;
};

export enum CellType {
  EMPTY = 0,
  WALL = 1,
  DOT = 2,
  POWER_PELLET = 3,
  GHOST_SPAWN = 4,
  PACMAN_SPAWN = 5
}

export enum GhostType {
  BLINKY = "BLINKY", // Red
  PINKY = "PINKY",   // Pink
  INKY = "INKY",     // Cyan
  CLYDE = "CLYDE"    // Orange
}

export type Ghost = {
  position: Position;
  type: GhostType;
  direction: Direction;
  targetPosition: Position;
  isVulnerable: boolean;
  isReturningHome: boolean;
};

export type GameState = {
  level: number;
  score: number;
  lives: number;
  grid: CellType[][];
  pacman: {
    position: Position;
    direction: Direction;
    nextDirection: Direction;
    isAlive: boolean;
    isChomping: boolean;
  };
  ghosts: Ghost[];
  dotsRemaining: number;
  powerPelletActive: boolean;
  powerPelletTimer: number;
  gameStatus: "START" | "PLAYING" | "PAUSED" | "GAME_OVER" | "LEVEL_COMPLETE";
};
