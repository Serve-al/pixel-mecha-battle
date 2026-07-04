import { PlayerData, PlayerState, MAX_HP, MAX_ENERGY, ENERGY_REGEN, PLAYER_WIDTH, PLAYER_HEIGHT, GAME_WIDTH } from './types';

export function createPlayer(id: 1 | 2, name: string, color: string, accentColor: string): PlayerData {
  const x = id === 1 ? 200 : GAME_WIDTH - 200 - PLAYER_WIDTH;
  return {
    id,
    name,
    hp: MAX_HP,
    maxHp: MAX_HP,
    energy: MAX_ENERGY,
    maxEnergy: MAX_ENERGY,
    x,
    y: 0,
    vx: 0,
    vy: 0,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    isGrounded: false,
    isBlocking: false,
    facingRight: id === 1,
    state: 'idle',
    stateTimer: 0,
    attackCooldown: 0,
    specialCooldown: 0,
    animFrame: 0,
    animTimer: 0,
    color,
    accentColor,
  };
}

export function updatePlayerState(player: PlayerData, input: {
  left: boolean; right: boolean; up: boolean; attack: boolean; special: boolean; block: boolean;
}, attackConsumed: boolean, specialConsumed: boolean): void {
  // Cooldowns
  if (player.attackCooldown > 0) player.attackCooldown--;
  if (player.specialCooldown > 0) player.specialCooldown--;

  // Energy regen
  if (player.energy < player.maxEnergy) {
    player.energy = Math.min(player.maxEnergy, player.energy + ENERGY_REGEN);
  }

  // State timer
  if (player.stateTimer > 0) {
    player.stateTimer--;
    if (player.stateTimer === 0 && (player.state === 'attacking' || player.state === 'special' || player.state === 'hurt')) {
      player.state = 'idle';
    }
  }

  // Blocking
  player.isBlocking = input.block && player.isGrounded && player.state !== 'attacking' && player.state !== 'special' && player.state !== 'hurt';
  if (player.isBlocking) {
    player.state = 'blocking';
    player.vx = 0;
    return;
  }

  // Don't process movement during attack/hurt states
  if (player.state === 'attacking' || player.state === 'special' || player.state === 'hurt') {
    return;
  }

  // Special attack
  if (specialConsumed && player.specialCooldown <= 0 && player.energy >= 20) {
    player.state = 'special';
    player.stateTimer = 20;
    player.specialCooldown = 90;
    player.energy -= 20;
    player.vx = 0;
    return;
  }

  // Normal attack
  if (attackConsumed && player.attackCooldown <= 0) {
    player.state = 'attacking';
    player.stateTimer = 10;
    player.attackCooldown = 30;
    player.vx = 0;
    return;
  }

  // Movement
  let moving = false;
  if (input.left) {
    player.vx = -4;
    player.facingRight = false;
    moving = true;
  }
  if (input.right) {
    player.vx = 4;
    player.facingRight = true;
    moving = true;
  }
  if (!input.left && !input.right) {
    player.vx = 0;
  }

  // Jump
  if (input.up && player.isGrounded) {
    player.vy = -12;
    player.isGrounded = false;
  }

  // Set state
  if (!player.isGrounded) {
    player.state = 'jumping';
  } else if (moving) {
    player.state = 'walking';
  } else {
    player.state = 'idle';
  }

  // Animation
  player.animTimer++;
  if (player.animTimer > 8) {
    player.animTimer = 0;
    player.animFrame = (player.animFrame + 1) % 4;
  }
}

export function applyDamage(player: PlayerData, damage: number, knockback: number, attackerX: number): void {
  const actualDamage = player.isBlocking ? Math.floor(damage * 0.3) : damage;
  player.hp = Math.max(0, player.hp - actualDamage);

  const knockDir = player.x < attackerX ? 1 : -1;
  player.vx = knockDir * knockback * 0.3;
  player.vy = -3;

  if (player.isGrounded) {
    player.isGrounded = false;
  }

  player.state = 'hurt';
  player.stateTimer = 15;
  player.isBlocking = false;
}