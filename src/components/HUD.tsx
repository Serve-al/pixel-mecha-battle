import { PlayerData } from '../engine/types';

interface HUDProps {
  player1: PlayerData;
  player2: PlayerData;
  timer: number;
}

export default function HUD({ player1, player2, timer }: HUDProps) {
  const formatTime = (t: number) => {
    const mins = Math.floor(t / 60);
    const secs = t % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const PlayerBar = ({ player, isLeft }: { player: PlayerData; isLeft: boolean }) => {
    const hpPercent = (player.hp / player.maxHp) * 100;
    const energyPercent = (player.energy / player.maxEnergy) * 100;
    const hpColor = hpPercent > 50 ? 'bg-green-400' : hpPercent > 25 ? 'bg-yellow-400' : 'bg-red-500';
    const barDirection = isLeft ? '' : 'flex-row-reverse';

    return (
      <div className={`flex flex-col gap-1 ${isLeft ? 'items-start' : 'items-end'} min-w-[240px]`}>
        <div className="flex items-center gap-2">
          {isLeft && <div className="w-10 h-10 bg-[#2244aa] border-2 border-[#4488ff] flex items-center justify-center"><div className="w-6 h-6 bg-[#4488ff]"></div></div>}
          <div>
            <div className="font-['Press_Start_2P'] text-[8px] text-[#4488ff] mb-1">{player.name}</div>
            <div className="w-48 h-4 bg-[#111] border-2 border-[#333] relative">
              <div className={`h-full ${hpColor} transition-all duration-100`} style={{ width: `${hpPercent}%` }} />
              <div className="absolute inset-0 flex items-center justify-center font-['Press_Start_2P'] text-[7px] text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]">
                {player.hp}/{player.maxHp}
              </div>
            </div>
          </div>
          {!isLeft && <div className="w-10 h-10 bg-[#aa2222] border-2 border-[#ff4444] flex items-center justify-center"><div className="w-6 h-6 bg-[#ff4444]"></div></div>}
        </div>
        {/* Energy bar */}
        <div className="w-36 h-2 bg-[#111] border border-[#333]">
          <div className="h-full bg-cyan-400 transition-all duration-100" style={{ width: `${energyPercent}%` }} />
        </div>
      </div>
    );
  };

  return (
    <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
      <PlayerBar player={player1} isLeft={true} />
      <div className="font-['Press_Start_2P'] text-[#ffdd44] text-lg drop-shadow-[0_0_8px_rgba(255,221,68,0.5)]">
        {formatTime(timer)}
      </div>
      <PlayerBar player={player2} isLeft={false} />
    </div>
  );
}