import { useEffect, useRef, useCallback } from 'react';
import { GameEngine } from '../engine/GameEngine';
import { PlayerData, Particle, AttackData, GAME_WIDTH, GAME_HEIGHT } from '../engine/types';

interface GameCanvasProps {
  onUpdate: (p1: PlayerData, p2: PlayerData, particles: Particle[], attacks: AttackData[], timer: number) => void;
  onGameOver: (winner: 1 | 2) => void;
  engineRef: React.MutableRefObject<GameEngine | null>;
}

export default function GameCanvas({ onUpdate, onGameOver, engineRef }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine = useRef<GameEngine | null>(null);

  const renderLoop = useCallback(() => {
    const eng = engine.current;
    const canvas = canvasRef.current;
    if (!eng || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    eng.render(ctx);
    requestAnimationFrame(renderLoop);
  }, []);

  useEffect(() => {
    const eng = new GameEngine();
    engine.current = eng;
    engineRef.current = eng;

    eng.setOnUpdate(onUpdate);
    eng.setOnGameOver(onGameOver);
    eng.start();

    requestAnimationFrame(renderLoop);

    return () => {
      eng.stop();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      className="block mx-auto"
      style={{
        imageRendering: 'pixelated',
        maxWidth: '100%',
        maxHeight: '100%',
        aspectRatio: `${GAME_WIDTH}/${GAME_HEIGHT}`,
      }}
    />
  );
}