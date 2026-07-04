import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import PixelButton from '../components/PixelButton';

export default function GameOverPage() {
  const navigate = useNavigate();
  const { winner, setPhase } = useGameStore();

  const winnerName = winner === 1 ? '机甲·苍蓝' : '机甲·赤焰';
  const winnerColor = winner === 1 ? '#4488ff' : '#ff4444';
  const loserName = winner === 1 ? '机甲·赤焰' : '机甲·苍蓝';

  const handleRestart = () => {
    setPhase('playing');
    navigate('/game');
  };

  const handleMenu = () => {
    setPhase('menu');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(51,255,102,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(51,255,102,0.3) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Victory particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${4 + Math.random() * 6}px`,
              height: `${4 + Math.random() * 6}px`,
              backgroundColor: winnerColor,
              opacity: 0.5 + Math.random() * 0.5,
              animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        {/* Winner */}
        <div className="font-['Press_Start_2P'] text-[14px] text-[#ffdd44] mb-4 tracking-wider">
          K.O.!
        </div>
        <div
          className="font-['Press_Start_2P'] text-[36px] mb-2"
          style={{
            color: winnerColor,
            textShadow: `0 0 20px ${winnerColor}80`,
          }}
        >
          {winnerName}
        </div>
        <div className="font-['Press_Start_2P'] text-[16px] text-[#ffdd44] mb-10">
          胜利！
        </div>

        {/* Stats */}
        <div className="bg-[#0d0d20]/90 border-2 border-[#333] p-6 mb-8 inline-block">
          <div className="font-['Press_Start_2P'] text-[10px] text-[#8899aa] mb-3">战斗结果</div>
          <div className="font-['Press_Start_2P'] text-[9px] space-y-2">
            <div className="flex justify-between gap-8">
              <span style={{ color: winnerColor }}>胜者: {winnerName}</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="text-[#8899aa]">败者: {loserName}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <PixelButton variant="primary" size="md" onClick={handleRestart}>
            ▶ 再来一局
          </PixelButton>
          <PixelButton variant="secondary" size="md" onClick={handleMenu}>
            ◀ 返回菜单
          </PixelButton>
        </div>
      </div>
    </div>
  );
}