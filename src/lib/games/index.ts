import type { GameModule } from './GameModule';
import { ImpostorGame } from './impostor';

export const games: GameModule[] = [new ImpostorGame()];
