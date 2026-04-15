'use client';

import { Swords, Zap, Briefcase, Users, Castle, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

type Tab = 'combat' | 'skills' | 'inventory' | 'shop' | 'social' | 'castle';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  showSkillNotification?: boolean;
}

export function Navigation({ activeTab, onTabChange, showSkillNotification }: NavigationProps) {
  const tabs = [
    { id: 'combat', icon: Swords, label: 'Битва', notification: false },
    { id: 'skills', icon: Zap, label: 'Навыки', notification: !!showSkillNotification },
    { id: 'inventory', icon: Briefcase, label: 'Вещи', notification: false },
    { id: 'shop', icon: ShoppingBag, label: 'Магазин', notification: false },
    { id: 'social', icon: Users, label: 'Гильдия', notification: false },
    { id: 'castle', icon: Castle, label: 'Замок', notification: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t-2 border-zinc-800 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as Tab)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-all relative",
                isActive ? "text-yellow-500 scale-110" : "text-zinc-600 hover:text-zinc-400"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-sm transition-all relative",
                isActive && "bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.2)] border border-yellow-500/30"
              )}>
                <Icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
                {tab.notification && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-zinc-950 animate-bounce" />
                )}
              </div>
              <span className={cn(
                "text-[8px] font-black uppercase tracking-widest",
                isActive ? "text-yellow-500" : "text-zinc-600"
              )}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="nav-indicator"
                  className="absolute -top-0.5 w-8 h-1 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" 
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
