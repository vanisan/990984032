'use client';

import { PlayerStats as PlayerStatsType, PlayerClass } from '@/types/game';
import { Progress } from '@/components/ui/progress';
import { Coins, Shield, Swords, Zap, Target, User } from 'lucide-react';
import { GameImage } from '@/components/ui/game-image';

const CLASS_ICONS: Record<PlayerClass, string> = {
  fighter: '/classes/fighter-1.webp',
  warrior: '/classes/warrior-2.webp',
  mage: '/classes/mage-2.webp',
  archer: '/classes/archer-2.webp',
};

const CLASS_NAMES: Record<PlayerClass, string> = {
  fighter: 'Боец',
  warrior: 'Воин',
  mage: 'Маг',
  archer: 'Лучник',
};

interface PlayerStatsProps {
  player: PlayerStatsType;
}

export function PlayerStats({ player }: PlayerStatsProps) {
  const xpPercentage = (player.xp / player.nextLevelXp) * 100;
  const hpPercentage = (player.hp / player.maxHp) * 100;
  const manaPercentage = (player.mana / player.maxMana) * 100;
  const energyPercentage = (player.energy / player.maxEnergy) * 100;

  return (
    <div className="w-full p-2 bg-zinc-950 border-b border-zinc-800 space-y-1.5">
      {/* Header: Level and Gold */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]">
            <GameImage 
              src={CLASS_ICONS[player.class]} 
              alt={player.class} 
              fill 
              className="p-1"
              fallbackIcon={<User className="w-5 h-5 opacity-20" />}
            />
            <div className="absolute -bottom-1 -right-1 bg-zinc-950 border border-zinc-800 w-5 h-5 flex items-center justify-center text-[10px] font-black text-white">
              {player.level}
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none">{CLASS_NAMES[player.class]}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-1">
                <Swords className="w-2.5 h-2.5 text-zinc-500" />
                <span className="text-[9px] font-black text-zinc-300">{player.attack}</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-zinc-500" />
                <span className="text-[9px] font-black text-zinc-300">{player.defense}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 bg-black px-2 py-1 border border-zinc-800">
          <Coins className="w-3 h-3 text-yellow-500" />
          <span className="text-[10px] font-black text-yellow-500 tabular-nums">{player.gold.toLocaleString()}</span>
        </div>
      </div>

      {/* Bars: HP, Mana, Energy */}
      <div className="grid grid-cols-3 gap-1.5">
        <div className="relative h-4 bg-zinc-900 border border-zinc-800 overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-red-700 border-r border-red-500 transition-all duration-300" 
            style={{ width: `${hpPercentage}%` }} 
          />
          <div className="absolute inset-0 flex items-center justify-between px-1.5 text-[8px] font-black text-white uppercase tracking-tighter drop-shadow-md">
            <span>HP</span>
            <span>{Math.ceil(player.hp)}</span>
          </div>
        </div>

        <div className="relative h-4 bg-zinc-900 border border-zinc-800 overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-blue-700 border-r border-blue-500 transition-all duration-300" 
            style={{ width: `${manaPercentage}%` }} 
          />
          <div className="absolute inset-0 flex items-center justify-between px-1.5 text-[8px] font-black text-white uppercase tracking-tighter drop-shadow-md">
            <span>MP</span>
            <span>{Math.ceil(player.mana)}</span>
          </div>
        </div>

        <div className="relative h-4 bg-zinc-900 border border-zinc-800 overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-yellow-600 border-r border-yellow-400 transition-all duration-300" 
            style={{ width: `${energyPercentage}%` }} 
          />
          <div className="absolute inset-0 flex items-center justify-between px-1.5 text-[8px] font-black text-white uppercase tracking-tighter drop-shadow-md">
            <span>EN</span>
            <span>{Math.ceil(player.energy)}</span>
          </div>
        </div>
      </div>

      <div className="relative h-0.5 bg-zinc-900 overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-zinc-500 transition-all duration-300" 
          style={{ width: `${xpPercentage}%` }} 
        />
      </div>
    </div>
  );
}
