import { PlayerData, Particle, AttackData, GAME_WIDTH, GAME_HEIGHT, GROUND_Y } from './types';
import { createPlayer, updatePlayerState, applyDamage } from './Player';
import { InputManager } from './InputManager';
import { PixelRenderer } from './PixelRenderer';
import { applyPhysics, checkAttackHit, checkPlayerCollision, createAttackHitbox } from './Physics';

export class GameEngine {
  private player1: PlayerData;
  private player2: PlayerData;
  private particles: Particle[] = [];
  private attacks: AttackData[] = [];
  private input: InputManager;
  private renderer: PixelRenderer;
  private animFrameId: number | null = null;
  private lastTime = 0;
  private timer = 0;
  private frameCount = 0;
  private onUpdate: ((p1: PlayerData, p2: PlayerData, particles: Particle[], attacks: AttackData[], timer: number) => void) | null = null;
  private onGameOver: ((winner: 1 | 2) => void) | null = null;
  private isRunning = false;

  constructor() {
    this.player1 = createPlayer(1, '机甲·苍蓝', '#4488ff', '#00ccff');
    this.player2 = createPlayer(2, '机甲·赤焰', '#ff4444', '#ff8800');
    this.input = new InputManager();
    this.renderer = new PixelRenderer();
  }

  setOnUpdate(cb: (p1: PlayerData, p2: PlayerData, particles: Particle[], attacks: AttackData[], timer: number) => void) {
    this.onUpdate = cb;
  }

  setOnGameOver(cb: (winner: 1 | 2) => void) {
    this.onGameOver = cb;
  }

  start() {
    this.reset();
    this.input.attach();
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  stop() {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.input.detach();
  }

  reset() {
    this.player1 = createPlayer(1, '机甲·苍蓝', '#4488ff', '#00ccff');
    this.player2 = createPlayer(2, '机甲·赤焰', '#ff4444', '#ff8800');
    this.particles = [];
    this.attacks = [];
    this.timer = 0;
    this.frameCount = 0;
  }

  private loop = (time: number) => {
    if (!this.isRunning) return;
    this.animFrameId = requestAnimationFrame(this.loop);

    const dt = time - this.lastTime;
    this.lastTime = time;

    // Fixed timestep (60fps equivalent)
    this.update();
    this.frameCount++;
    if (this.frameCount % 60 === 0) {
      this.timer++;
    }
  };

  private update() {
    const p1 = this.player1;
    const p2 = this.player2;

    // Get inputs
    const p1Input = this.input.getPlayer1();
    const p2Input = this.input.getPlayer2();
    const p1Attack = this.input.consumeP1Attack();
    const p1Special = this.input.consumeP1Special();
    const p2Attack = this.input.consumeP2Attack();
    const p2Special = this.input.consumeP2Special();

    // Update player states
    updatePlayerState(p1, p1Input, p1Attack, p1Special);
    updatePlayerState(p2, p2Input, p2Attack, p2Special);

    // Create attack hitboxes on first frame of attack state
    if (p1.state === 'attacking' && p1.stateTimer === 9) {
      this.attacks.push(createAttackHitbox(p1, 'normal'));
    }
    if (p1.state === 'special' && p1.stateTimer === 19) {
      this.attacks.push(createAttackHitbox(p1, 'special'));
    }
    if (p2.state === 'attacking' && p2.stateTimer === 9) {
      this.attacks.push(createAttackHitbox(p2, 'normal'));
    }
    if (p2.state === 'special' && p2.stateTimer === 19) {
      this.attacks.push(createAttackHitbox(p2, 'special'));
    }

    // Process attacks
    for (let i = this.attacks.length - 1; i >= 0; i--) {
      const atk = this.attacks[i];
      atk.timer--;

      if (atk.timer <= 0) {
        this.attacks.splice(i, 1);
        continue;
      }

      // Check hits
      const target = atk.ownerId === 1 ? p2 : p1;
      if (checkAttackHit(atk, target)) {
        // Only hit once per attack
        const alreadyHit = this.attacks.some(a => a !== atk && a.ownerId === atk.ownerId && a.timer === atk.timer);
        if (!alreadyHit) {
          applyDamage(target, atk.damage, atk.knockback, atk.ownerId === 1 ? p1.x : p2.x);
          this.spawnHitParticles(target.x + target.width / 2, target.y + target.height / 2, atk.type);
          this.attacks.splice(i, 1);

          // Check game over
          if (target.hp <= 0) {
            this.isRunning = false;
            this.onGameOver?.(atk.ownerId);
            return;
          }
        }
      }
    }

    // Apply physics
    applyPhysics(p1);
    applyPhysics(p2);
    checkPlayerCollision(p1, p2);

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Notify
    this.onUpdate?.(p1, p2, this.particles, this.attacks, this.timer);
  }

  private spawnHitParticles(x: number, y: number, type: 'normal' | 'special') {
    const count = type === 'normal' ? 8 : 16;
    const colors = type === 'normal'
      ? ['rgb(255,200,0)', 'rgb(255,150,0)', 'rgb(255,255,100)']
      : ['rgb(0,255,255)', 'rgb(0,150,255)', 'rgb(255,100,255)'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 15 + Math.random() * 15,
        maxLife: 30,
        size: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'spark',
      });
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    this.renderer.render(ctx, this.player1, this.player2, this.particles, this.attacks);
  }

  getPlayer1(): PlayerData { return this.player1; }
  getPlayer2(): PlayerData { return this.player2; }
  getTimer(): number { return this.timer; }
}