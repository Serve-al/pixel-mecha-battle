import { create } from 'zustand';
import { GameState, Particle, AttackData, MAX_HP, MAX_ENERGY, GAME_WIDTH, GROUND_Y, PLAYER_WIDTH, PLAYER_HEIGHT } from '../engine/types';

interface GameStore {
  phase: 'menu' | 'playing' | 'paused' | 'gameover';
  winner: 1 | 2 | null;
  timer: number;
  setPhase: (phase: 'menu' | 'playing' | 'paused' | 'gameover') => void;
  setWinner: (winner: 1 | 2 | null) => void;
  setTimer: (timer: number) => void;
  resetTimer: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  phase: 'menu',
  winner: null,
  timer: 0,
  setPhase: (phase) => set({ phase }),
  setWinner: (winner) => set({ winner }),
  setTimer: (timer) => set({ timer }),
  resetTimer: () => set({ timer: 0 }),
}));