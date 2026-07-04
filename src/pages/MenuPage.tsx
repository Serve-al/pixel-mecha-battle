import { useNavigate } from 'react-router-dom';
import PixelButton from '../components/PixelButton';

export default function MenuPage() {
  const navigate = useNavigate();

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

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              opacity: 0.3 + Math.random() * 0.7,
              animation: `blink ${2 + Math.random() * 3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div className="relative z-10 text-center mb-12">
        <div className="font-['Press_Start_2P'] text-[14px] text-[#ffdd44] mb-4 tracking-wider animate-pulse">
          PIXEL MECHA
        </div>
        <h1
          className="font-['Press_Start_2P'] text-[48px] leading-tight"
          style={{
            color: '#00ccff',
            textShadow: '0 0 20px rgba(0,204,255,0.5), 0 4px 0 #005588, 4px 0 0 #003366',
            letterSpacing: '4px',
          }}
        >
          机甲对决
        </h1>
        <div
          className="font-['Press_Start_2P'] text-[10px] mt-3"
          style={{ color: '#ff4466', textShadow: '0 0 10px rgba(255,68,102,0.5)' }}
        >
          MECHA BATTLE
        </div>
      </div>

      {/* Buttons */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <PixelButton size="lg" onClick={() => navigate('/game')}>
          ▶ 开始对战
        </PixelButton>
      </div>

      {/* Controls info */}
      <div className="relative z-10 mt-12 flex gap-12">
        <div className="bg-[#0d0d20]/90 border-2 border-[#4488ff] p-5">
          <div className="font-['Press_Start_2P'] text-[10px] text-[#4488ff] mb-3">P1 机甲·苍蓝</div>
          <div className="font-['Press_Start_2P'] text-[8px] text-[#8899bb] space-y-1.5">
            <div>A/D - 移动</div>
            <div>W - 跳跃</div>
            <div>F - 攻击</div>
            <div>G - 能量炮</div>
            <div>E - 防御</div>
          </div>
        </div>
        <div className="bg-[#0d0d20]/90 border-2 border-[#ff4444] p-5">
          <div className="font-['Press_Start_2P'] text-[10px] text-[#ff4444] mb-3">P2 机甲·赤焰</div>
          <div className="font-['Press_Start_2P'] text-[8px] text-[#bb8899] space-y-1.5">
            <div>←/→ - 移动</div>
            <div>↑ - 跳跃</div>
            <div>K - 攻击</div>
            <div>L - 能量炮</div>
            <div>O - 防御</div>
          </div>
        </div>
      </div>
    </div>
  );
}