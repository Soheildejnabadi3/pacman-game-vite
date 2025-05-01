
import { Direction, Position, CellType, GameState, Ghost, GhostType } from "./types";
import { getLevelLayout, countDots, findPacmanSpawn, findGhostSpawn } from "./levels";
import { movePacman, processInput } from "./pacmanLogic";
import { moveGhosts } from "./ghostLogic";
import { checkCollisions } from "./collisionLogic";
import { POWER_PELLET_DURATION } from "./constants";

// Initialize the game state
export const initializeGameState = (level: number = 1): GameState => {
  const grid = getLevelLayout(level);
  const pacmanSpawn = findPacmanSpawn(grid);
  const ghostSpawn = findGhostSpawn(grid);
  
  const gameState: GameState = {
    level,
    score: 0,
    lives: 3,
    grid,
    pacman: {
      position: { ...pacmanSpawn },
      direction: Direction.NONE,
      nextDirection: Direction.NONE,
      isAlive: true,
      isChomping: false,
    },
    ghosts: [
      {
        position: { ...ghostSpawn },
        type: GhostType.BLINKY,
        direction: Direction.LEFT,
        targetPosition: { ...pacmanSpawn },
        isVulnerable: false,
        isReturningHome: false,
      },
      {
        position: { x: ghostSpawn.x - 1, y: ghostSpawn.y },
        type: GhostType.PINKY,
        direction: Direction.RIGHT,
        targetPosition: { ...pacmanSpawn },
        isVulnerable: false,
        isReturningHome: false,
      },
      {
        position: { x: ghostSpawn.x + 1, y: ghostSpawn.y },
        type: GhostType.INKY,
        direction: Direction.UP,
        targetPosition: { ...pacmanSpawn },
        isVulnerable: false,
        isReturningHome: false,
      },
      {
        position: { x: ghostSpawn.x, y: ghostSpawn.y + 1 },
        type: GhostType.CLYDE,
        direction: Direction.DOWN,
        targetPosition: { ...pacmanSpawn },
        isVulnerable: false,
        isReturningHome: false,
      },
    ],
    dotsRemaining: countDots(grid),
    powerPelletActive: false,
    powerPelletTimer: 0,
    gameStatus: "START",
  };

  return gameState;
};

// Update game state based on elapsed time
export const updateGameState = (state: GameState, deltaTime: number): GameState => {
  if (state.gameStatus !== "PLAYING") {
    return state;
  }

  const newState = { ...state };

  // Update power pellet timer
  if (newState.powerPelletActive) {
    newState.powerPelletTimer -= deltaTime;
    if (newState.powerPelletTimer <= 0) {
      newState.powerPelletActive = false;
      newState.ghosts = newState.ghosts.map(ghost => ({
        ...ghost,
        isVulnerable: false,
      }));
    }
  }

  // Update Pac-Man position
  movePacman(newState);

  // Check for collisions with dots, power pellets, and ghosts
  checkCollisions(newState);

  // Update ghost positions
  moveGhosts(newState, deltaTime);

  // Check if level is complete
  if (newState.dotsRemaining === 0) {
    newState.gameStatus = "LEVEL_COMPLETE";
  }

  return newState;
};

export const advanceLevel = (state: GameState): GameState => {
  const nextLevel = state.level + 1;
  const newState = initializeGameState(nextLevel);
  
  // Carry over score and lives
  newState.score = state.score;
  newState.lives = state.lives;
  
  return newState;
};

export const restartGame = (): GameState => {
  return initializeGameState(1);
};

// Re-export the processInput function to maintain the public API
export { processInput } from "./pacmanLogic";
