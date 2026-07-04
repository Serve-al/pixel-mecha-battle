import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCanvas from '../components/GameCanvas';
import HUD from '../components/HUD';
import { PlayerData, Particle, AttackData } from '../engine/types';
import { GameEngine } from '../engine/GameEngine';
import { useGameStore } from '../store/gameStore';

export default function GamePage() {
  const navigate = useNavigate();
  const { setPhase, setWinner } = useGameStore();
  const engineRef = useRef<GameEngine | null>(null);

  const [p1, setP1] = useState<PlayerData | null>(null);
  const [p2, setP2] = useState<PlayerData | null>(null);
  const [timer, setTimer] = useState(0);
  const [paused, setPaused] = useState(false);

  const handleUpdate = useCallback((p1: PlayerData, p2: PlayerData, _particles: Particle[], _attacks: AttackData[], timer: number) => {
    setP1({ ...p1 });
    setP2({ ...p2 });
    setTimer(timer);
  }, []);

  const handleGameOver = useCallback((winner: 1 | 2) => {
    setWinner(winner);
    setPhase('gameover');
    navigate('/gameover');
  }, [navigate, setPhase, setWinner]);

  const handlePause = () => {
    if (engineRef.current) {
      engineRef.current.stop();
      setPaused(true);
    }
  };

  const handleResume = () => {
    if (engineRef.current) {
      setPaused(false);
      // Restart the engine
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center relative">
      <div className="relative inline-block">
        <GameCanvas onUpdate={handleUpdate} onGameOver={handleGameOver} engineRef={engineRef} />

        {/* HUD Overlay */}
        {p1 && p2 && <HUD player1={p1} player2={p2} timer={timer} />}

        {/* Pause button */}
        <button
          onClick={paused ? handleResume : handlePause}
          className="absolute top-16 right-4 font-['Press_Start_2P'] text-[10px] text-[#ffdd44] bg-[#0d0d20]/80 border-2 border-[#ffdd44] px-3 py-1 hover:bg-[#ffdd44]/20 transition-colors"
        >
          {paused ? '▶ 继续' : '❚❚ 暂停'}
        </button>
      </div>

      {/* Pause overlay */}
      {paused && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="font-['Press_Start_2P'] text-[24px] text-[#ffdd44] mb-4 drop-shadow-[0_0_10px_rgba(255,221,68,0.5)]">
              暂停
            </div>
            <button
              onClick={handleResume}
              className="font-['Press_Start_2P'] text-[12px] text-[#33ff66] bg-[#0d0d20] border-2 border-[#33ff66] px-6 py-2 hover:bg-[#33ff66]/20 transition-colors"
            >
              ▶ 继续
            </button>
          </div>
        </div>
      )}
    </div>
  );
}