'use client';

import { motion, AnimatePresence } from 'motion/react';

interface LevelUpProps {
  level: number;
  show: boolean;
  onComplete: () => void;
}

export function LevelUp({ level, show, onComplete }: LevelUpProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          onAnimationComplete={() => {
            setTimeout(onComplete, 2000);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="bg-black border-4 border-yellow-600 p-8 shadow-[0_0_100px_rgba(234,179,8,0.3)] text-center relative">
            <div className="absolute -inset-1 border border-yellow-400 pointer-events-none" />
            <motion.h2 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-5xl font-black text-yellow-500 uppercase tracking-tighter italic drop-shadow-[0_4px_0_rgba(0,0,0,1)]"
              style={{ textShadow: '4px 4px 0px rgba(0,0,0,1)' }}
            >
              Уровень повышен!
            </motion.h2>
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-600 to-transparent" />
              <p className="text-2xl font-black text-white uppercase tracking-widest">
                Уровень <span className="text-yellow-500">{level}</span>
              </p>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-600 to-transparent" />
            </div>
            <p className="mt-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Ваши силы растут</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
