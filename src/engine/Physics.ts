import { PlayerData, AttackData, GROUND_Y, PLAYER_WIDTH, PLAYER_HEIGHT, GAME_WIDTH } from './types';

export function applyPhysics(player: PlayerData): void {
  // Gravity
  if (!player.isGrounded) {
    player.vy += 0.6;
    player.y += player.vy;
  }

  // Ground collision
  const groundLevel = GROUND_Y - player.height;
  if (player.y >= groundLevel) {
    player.y = groundLevel;
    player.vy = 0;
    player.isGrounded = true;
  }

  // Horizontal movement
  player.x += player.vx;

  // Wall bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > GAME_WIDTH) player.x = GAME_WIDTH - player.width;

  // Friction
  if (player.isGrounded && player.state !== 'walking') {
    player.vx *= 0.85;
  }
}

export function checkAttackHit(attack: AttackData, target: PlayerData): boolean {
  const ax = attack.x;
  const ay = attack.y;
  const aw = attack.width;
  const ah = attack.height;
  const tx = target.x;
  const ty = target.y;
  const tw = target.width;
  const th = target.height;

  return ax < tx + tw && ax + aw > tx && ay < ty + th && ay + ah > ty;
}

export function checkPlayerCollision(p1: PlayerData, p2: PlayerData): void {
  const p1cx = p1.x + p1.width / 2;
  const p2cx = p2.x + p2.width / 2;
  const overlapX = p1.width / 2 + p2.width / 2 - Math.abs(p1cx - p2cx);

  if (overlapX > 0) {
    // Check vertical overlap for standing collision
    const p1Bottom = p1.y + p1.height;
    const p2Bottom = p2.y + p2.height;
    const overlapY = Math.min(p1Bottom, p2Bottom) - Math.max(p1.y, p2.y);

    if (overlapY > 0) {
      const pushX = overlapX / 2;
      if (p1cx < p2cx) {
        p1.x -= pushX;
        p2.x += pushX;
      } else {
        p1.x += pushX;
        p2.x -= pushX;
      }

      // Clamp positions
      if (p1.x < 0) p1.x = 0;
      if (p2.x < 0) p2.x = 0;
      if (p1.x + p1.width > GAME_WIDTH) p1.x = GAME_WIDTH - p1.width;
      if (p2.x + p2.width > GAME_WIDTH) p2.x = GAME_WIDTH - p2.width;
    }
  }
}

export function createAttackHitbox(player: PlayerData, type: 'normal' | 'special'): AttackData {
  const range = type === 'normal' ? 60 : 100;
  const width = type === 'normal' ? 55 : 70;
  const height = type === 'normal' ? 40 : 50;
  const damage = type === 'normal'
    ? 8 + Math.floor(Math.random() * 5)
    : 15 + Math.floor(Math.random() * 6);
  const knockback = type === 'normal' ? 30 : 80;
  const maxTimer = type === 'normal' ? 10 : 20;

  let x: number;
  if (player.facingRight) {
    x = player.x + player.width;
  } else {
    x = player.x - range;
  }

  return {
    type,
    x,
    y: player.y + player.height * 0.3,
    width,
    height,
    damage,
    knockback,
    ownerId: player.id,
    timer: maxTimer,
    maxTimer,
  };
}