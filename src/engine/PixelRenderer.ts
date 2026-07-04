import { PlayerData, Particle, AttackData, GAME_WIDTH, GAME_HEIGHT, GROUND_Y } from './types';

const PIXEL = 4;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d')!;
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
ctx.imageSmoothingEnabled = false;

export class PixelRenderer {
  private bgStars: { x: number; y: number; size: number; brightness: number }[] = [];

  constructor() {
    // Generate stars
    for (let i = 0; i < 80; i++) {
      this.bgStars.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GROUND_Y * 0.7,
        size: 1 + Math.random() * 2,
        brightness: 0.3 + Math.random() * 0.7,
      });
    }
  }

  render(targetCtx: CanvasRenderingContext2D, p1: PlayerData, p2: PlayerData, particles: Particle[], attacks: AttackData[]) {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.drawBackground(ctx);
    this.drawGround(ctx);
    this.drawParticles(ctx, particles);
    this.drawAttacks(ctx, attacks);
    this.drawPlayer(ctx, p1);
    this.drawPlayer(ctx, p2);

    // Copy to target canvas
    targetCtx.imageSmoothingEnabled = false;
    targetCtx.drawImage(canvas, 0, 0, GAME_WIDTH, GAME_HEIGHT);
  }

  private drawBackground(ctx: CanvasRenderingContext2D) {
    // Sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    grad.addColorStop(0, '#0a0a1a');
    grad.addColorStop(0.5, '#1a1a3e');
    grad.addColorStop(1, '#2a1a3e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, GAME_WIDTH, GROUND_Y);

    // Stars
    for (const star of this.bgStars) {
      ctx.fillStyle = `rgba(255,255,255,${star.brightness})`;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }

    // City skyline silhouette
    ctx.fillStyle = '#0d0d20';
    const buildings = [
      { x: 50, w: 60, h: 180 }, { x: 130, w: 40, h: 120 },
      { x: 190, w: 80, h: 220 }, { x: 290, w: 50, h: 150 },
      { x: 360, w: 70, h: 200 }, { x: 450, w: 45, h: 140 },
      { x: 510, w: 90, h: 250 }, { x: 620, w: 55, h: 170 },
      { x: 690, w: 65, h: 190 }, { x: 770, w: 75, h: 210 },
      { x: 860, w: 50, h: 130 }, { x: 930, w: 85, h: 230 },
      { x: 1030, w: 60, h: 160 }, { x: 1110, w: 70, h: 200 },
      { x: 1200, w: 50, h: 140 },
    ];

    for (const b of buildings) {
      ctx.fillRect(b.x, GROUND_Y - b.h, b.w, b.h);

      // Windows
      ctx.fillStyle = '#ffdd44';
      for (let wy = GROUND_Y - b.h + 10; wy < GROUND_Y - 10; wy += 18) {
        for (let wx = b.x + 8; wx < b.x + b.w - 8; wx += 14) {
          if (Math.random() > 0.35) {
            ctx.fillRect(wx, wy, 4, 5);
          }
        }
      }
      ctx.fillStyle = '#0d0d20';
    }

    // Moon
    ctx.fillStyle = '#eee';
    ctx.beginPath();
    ctx.arc(1080, 80, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0a0a1a';
    ctx.beginPath();
    ctx.arc(1095, 72, 30, 0, Math.PI * 2);
    ctx.fill();

    // Telecommunication tower
    ctx.fillStyle = '#0d0d20';
    ctx.fillRect(620, GROUND_Y - 300, 4, 300);
    ctx.fillRect(618, GROUND_Y - 300, 8, 6);
    ctx.fillRect(610, GROUND_Y - 260, 24, 4);
    ctx.fillRect(610, GROUND_Y - 210, 24, 4);
    ctx.fillStyle = '#ff2222';
    ctx.fillRect(620, GROUND_Y - 300, 4, 4);
  }

  private drawGround(ctx: CanvasRenderingContext2D) {
    // Ground
    ctx.fillStyle = '#1a2a1a';
    ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);

    // Ground line
    ctx.fillStyle = '#33ff66';
    ctx.fillRect(0, GROUND_Y, GAME_WIDTH, 2);

    // Grid lines
    ctx.strokeStyle = 'rgba(51, 255, 102, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < GAME_WIDTH; x += PIXEL * 8) {
      ctx.beginPath();
      ctx.moveTo(x, GROUND_Y);
      ctx.lineTo(x, GAME_HEIGHT);
      ctx.stroke();
    }
    for (let y = GROUND_Y; y < GAME_HEIGHT; y += PIXEL * 8) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(GAME_WIDTH, y);
      ctx.stroke();
    }
  }

  private drawPlayer(ctx: CanvasRenderingContext2D, p: PlayerData) {
    ctx.save();
    const cx = p.x + p.width / 2;
    const cy = p.y + p.height / 2;

    ctx.translate(cx, cy);
    if (!p.facingRight) {
      ctx.scale(-1, 1);
    }

    const px = -p.width / 2;
    const py = -p.height / 2;
    const w = p.width;
    const h = p.height;
    const mainColor = p.color;
    const accent = p.accentColor;
    const dark = p.color === '#4488ff' ? '#2244aa' : '#aa2222';
    const light = p.color === '#4488ff' ? '#88bbff' : '#ff8888';

    const frame = p.animFrame;
    const bobOffset = p.state === 'walking' ? Math.sin(frame * Math.PI / 2) * 2 : 0;
    const hurtFlash = p.state === 'hurt' && p.stateTimer % 4 < 2;

    const drawMecha = (offsetY: number, armAngle: number, armAngle2: number) => {
      const c = hurtFlash ? '#ffffff' : mainColor;
      const a = hurtFlash ? '#ffffff' : accent;
      const d = hurtFlash ? '#cccccc' : dark;
      const l = hurtFlash ? '#ffffff' : light;

      // Legs
      ctx.fillStyle = d;
      ctx.fillRect(px + 8, py + h - 24, 10, 24);
      ctx.fillRect(px + w - 18, py + h - 24, 10, 24);

      // Feet
      ctx.fillStyle = '#555';
      ctx.fillRect(px + 4, py + h - 4, 16, 4);
      ctx.fillRect(px + w - 20, py + h - 4, 16, 4);

      // Body
      ctx.fillStyle = c;
      ctx.fillRect(px + 6, py + 12, w - 12, h - 30);

      // Chest detail
      ctx.fillStyle = a;
      ctx.fillRect(px + 12, py + 18, w - 24, 8);
      ctx.fillStyle = l;
      ctx.fillRect(px + 16, py + 20, 4, 4);
      ctx.fillRect(px + w - 20, py + 20, 4, 4);

      // Shoulders
      ctx.fillStyle = d;
      ctx.fillRect(px, py + 10, 10, 10);
      ctx.fillRect(px + w - 10, py + 10, 10, 10);

      // Arms
      ctx.save();
      ctx.translate(px + 5, py + 20);
      ctx.rotate(armAngle);
      ctx.fillStyle = c;
      ctx.fillRect(-4, 0, 8, 18);
      ctx.fillStyle = '#555';
      ctx.fillRect(-5, 18, 10, 6);
      ctx.restore();

      ctx.save();
      ctx.translate(px + w - 5, py + 20);
      ctx.rotate(armAngle2);
      ctx.fillStyle = c;
      ctx.fillRect(-4, 0, 8, 18);
      ctx.fillStyle = '#555';
      ctx.fillRect(-5, 18, 10, 6);
      ctx.restore();

      // Head
      ctx.fillStyle = d;
      ctx.fillRect(px + 10, py, w - 20, 14);
      ctx.fillStyle = a;
      ctx.fillRect(px + 12, py + 2, w - 24, 4);

      // Eyes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px + 14, py + 6, 6, 4);
      ctx.fillRect(px + w - 20, py + 6, 6, 4);
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(px + 16, py + 7, 3, 2);
      ctx.fillRect(px + w - 18, py + 7, 3, 2);

      // Antenna
      ctx.fillStyle = a;
      ctx.fillRect(px + w / 2 - 1, py - 6, 2, 8);
      ctx.fillRect(px + w / 2 - 3, py - 8, 6, 3);
    };

    switch (p.state) {
      case 'idle':
        drawMecha(bobOffset, 0.1, -0.1);
        break;
      case 'walking':
        drawMecha(bobOffset, Math.sin(frame * Math.PI / 2) * 0.3, Math.sin(frame * Math.PI / 2 + Math.PI) * 0.3);
        break;
      case 'jumping':
        drawMecha(0, -0.5, -0.5);
        break;
      case 'attacking':
        drawMecha(0, -1.2, 0);
        break;
      case 'special':
        drawMecha(0, 0, 0);
        break;
      case 'blocking':
        drawMecha(0, 0.8, 0.8);
        break;
      case 'hurt':
        drawMecha(0, -0.3, 0.3);
        break;
    }

    ctx.restore();
  }

  private drawAttacks(ctx: CanvasRenderingContext2D, attacks: AttackData[]) {
    for (const atk of attacks) {
      const alpha = atk.timer / atk.maxTimer;
      if (atk.type === 'normal') {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        ctx.fillRect(atk.x, atk.y, atk.width, atk.height);
        ctx.strokeStyle = `rgba(255, 200, 0, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(atk.x, atk.y, atk.width, atk.height);
      } else {
        // Energy blast
        const cx = atk.x + atk.width / 2;
        const cy = atk.y + atk.height / 2;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, atk.width / 2);
        gradient.addColorStop(0, `rgba(0, 255, 255, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(0, 150, 255, ${alpha * 0.7})`);
        gradient.addColorStop(1, `rgba(0, 50, 255, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(atk.x - 10, atk.y - 10, atk.width + 20, atk.height + 20);

        // Core
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.fillRect(atk.x + atk.width / 2 - 6, atk.y + atk.height / 2 - 6, 12, 12);
      }
    }
  }

  private drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
    for (const p of particles) {
      const alpha = p.life / p.maxLife;
      ctx.fillStyle = p.color.replace('1)', `${alpha})`).replace('rgb', 'rgba');
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
  }
}