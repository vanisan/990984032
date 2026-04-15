'use client';

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Enemy, Skill } from '@/types/game';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface CombatViewProps {
  enemy: Enemy | null;
  onTap: (x: number, y: number) => void;
  damageNumbers: { id: number; value: number; x: number; y: number; isCrit: boolean }[];
  onDamageComplete: (id: number) => void;
  skills: Skill[];
  onUseSkill: (skillId: string) => void;
}

export function CombatView({ enemy, onTap, damageNumbers, onDamageComplete, skills, onUseSkill }: CombatViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent tap if clicking a skill button
    if ((e.target as HTMLElement).closest('.skill-button')) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    onTap(x, y);
  };

  if (!enemy) return (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted-foreground animate-pulse">Searching for enemies...</p>
    </div>
  );

  const hpPercentage = (enemy.hp / enemy.maxHp) * 100;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none touch-none bg-[radial-gradient(circle_at_center,rgba(40,0,0,0.4)_0%,transparent_70%)]"
      onClick={handleClick}
    >
      {/* Enemy Info */}
      <div className="absolute top-8 w-full px-8 text-center space-y-3">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase">
            {enemy.name}
          </h2>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Уровень {enemy.level}</p>
        </div>
        
        <div className="relative w-full max-w-xs mx-auto h-6 bg-zinc-900 border-2 border-zinc-800 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div 
            className="absolute inset-y-0 left-0 bg-red-600 border-r border-red-400 transition-all duration-300 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]" 
            style={{ width: `${hpPercentage}%` }} 
          />
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white uppercase tracking-tighter drop-shadow-md">
            {Math.ceil(enemy.hp)} / {enemy.maxHp}
          </span>
        </div>
      </div>

      {/* Enemy Sprite */}
      <motion.div
        key={enemy.id}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileTap={{ scale: 0.95, rotate: [0, -2, 2, 0] }}
        className="relative w-24 h-24"
      >
        <Image
          src={enemy.image}
          alt={enemy.name}
          fill
          className="object-contain drop-shadow-[0_0_30px_rgba(255,0,0,0.2)]"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      {/* Skills in Combat */}
      <div className="absolute bottom-24 flex gap-4">
        {skills.map((skill) => {
          const now = Date.now();
          const timeSinceLastUse = now - skill.lastUsed;
          const cooldownRemaining = Math.max(0, skill.cooldown * 1000 - timeSinceLastUse);
          const isOnCooldown = cooldownRemaining > 0;

          return (
            <button
              key={skill.id}
              onClick={(e) => {
                e.stopPropagation();
                onUseSkill(skill.id);
              }}
              disabled={isOnCooldown}
              className={cn(
                "skill-button relative w-16 h-16 bg-zinc-900 border-2 rounded-xl flex items-center justify-center transition-all active:scale-90 overflow-hidden",
                isOnCooldown ? "border-zinc-800 grayscale" : "border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
              )}
            >
              <Image 
                src={skill.icon} 
                alt={skill.name} 
                fill 
                className="object-contain p-2" 
                referrerPolicy="no-referrer"
              />
              {isOnCooldown && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-black text-lg">
                  {Math.ceil(cooldownRemaining / 1000)}
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 bg-blue-600 text-[8px] px-1 font-black rounded-tl">
                {skill.manaCost}
              </div>
            </button>
          );
        })}
      </div>

      {/* Damage Numbers */}
      <AnimatePresence>
        {damageNumbers.map((dmg) => (
          <motion.div
            key={dmg.id}
            initial={{ opacity: 1, y: dmg.y, x: dmg.x, scale: 0.5 }}
            animate={{ opacity: 0, y: dmg.y - 120, scale: 2 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => onDamageComplete(dmg.id)}
            className={`absolute pointer-events-none font-black text-3xl italic ${
              dmg.isCrit ? 'text-yellow-400' : 'text-red-500'
            }`}
            style={{ 
              textShadow: '3px 3px 0px rgba(0,0,0,1), -1px -1px 0px rgba(0,0,0,1), 1px -1px 0px rgba(0,0,0,1), -1px 1px 0px rgba(0,0,0,1), 1px 1px 0px rgba(0,0,0,1)',
              left: dmg.x - 20,
              top: dmg.y - 20
            }}
          >
            {dmg.value}{dmg.isCrit ? '!' : ''}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Tap Hint */}
      <div className="absolute bottom-16 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] animate-pulse">
        Нажимай для атаки
      </div>
    </div>
  );
}
