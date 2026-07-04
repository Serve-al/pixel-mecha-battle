export interface Vec2 {
  x: number;
  y: number;
}

export type PlayerState = 'idle' | 'walking' | 'jumping' | 'attacking' | 'blocking' | 'special' | 'hurt';

export interface PlayerData {
  id: 1 | 2;
  name: string;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  isBlocking: boolean;
  facingRight: boolean;
  state: PlayerState;
  stateTimer: number;
  attackCooldown: number;
  specialCooldown: number;
  animFrame: number;
  animTimer: number;
  color: string;
  accentColor: string;
}

export interface AttackData {
  type: 'normal' | 'special';
  x: number;
  y: number;
  width: number;
  height: number;
  damage: number;
  knockback: number;
  ownerId: 1 | 2;
  timer: number;
  maxTimer: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'spark' | 'energy' | 'block';
}

export interface GameState {
  phase: 'menu' | 'playing' | 'paused' | 'gameover';
  player1: PlayerData;
  player2: PlayerData;
  winner: 1 | 2 | null;
  timer: number;
  particles: Particle[];
  attacks: AttackData[];
}

export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  attack: boolean;
  special: boolean;
  block: boolean;
}

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const GROUND_Y = 600;
export const GRAVITY = 0.6;
export const MOVE_SPEED = 4;
export const JUMP_FORCE = -12;
export const MAX_HP = 100;
export const MAX_ENERGY = 100;
export const ENERGY_REGEN = 0.033; // per frame at 60fps ≈ 2/sec
export const ATTACK_COOLDOWN = 30; // frames at 60fps ≈ 500ms
export const SPECIAL_COOLDOWN = 90; // frames at 60fps ≈ 1500ms
export const ATTACK_DURATION = 10;
export const SPECIAL_DURATION = 20;
export const HURT_DURATION = 15;
export const BLOCK_REDUCTION = 0.7;
export const NORMAL_DAMAGE_MIN = 8;
export const NORMAL_DAMAGE_MAX = 12;
export const SPECIAL_DAMAGE_MIN = 15;
export const SPECIAL_DAMAGE_MAX = 20;
export const SPECIAL_ENERGY_COST = 20;
export const NORMAL_KNOCKBACK = 30;
export const SPECIAL_KNOCKBACK = 80;
export const ATTACK_RANGE = 60;
export const PLAYER_WIDTH = 50;
export const PLAYER_HEIGHT = 70;