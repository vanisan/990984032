'use client';

import { Item, PlayerStats } from '@/types/game';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sword, Shield, Heart, Zap, Target, Coins, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ItemDetailsProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
  onEquip?: (item: Item) => void;
  onUnequip?: (type: any) => void;
  onSell?: (item: Item) => void;
  onBuy?: (item: Item) => void;
  onInlay?: (stone: Item) => void;
  isEquipped?: boolean;
  canBuy?: boolean;
}

export function ItemDetails({
  item,
  isOpen,
  onClose,
  onEquip,
  onUnequip,
  onSell,
  onBuy,
  onInlay,
  isEquipped,
  canBuy
}: ItemDetailsProps) {
  if (!item) return null;

  const getStatIcon = (stat: string) => {
    switch (stat) {
      case 'attack': return <Sword className="w-4 h-4 text-red-500" />;
      case 'defense': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'maxHp': return <Heart className="w-4 h-4 text-green-500" />;
      case 'maxMana': return <Zap className="w-4 h-4 text-purple-500" />;
      case 'criticalChance': return <Target className="w-4 h-4 text-yellow-500" />;
      case 'dps': return <Zap className="w-4 h-4 text-orange-500" />;
      default: return null;
    }
  };

  const getStatLabel = (stat: string) => {
    switch (stat) {
      case 'attack': return 'Урон';
      case 'defense': return 'Защита';
      case 'maxHp': return 'Жизни';
      case 'maxMana': return 'Мана';
      case 'criticalChance': return 'Крит';
      case 'dps': return 'Урон/сек';
      default: return stat;
    }
  };

  const formatValue = (stat: string, value: number) => {
    if (stat === 'criticalChance') return `+${(value * 100).toFixed(0)}%`;
    return `+${value}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-[320px] p-0 overflow-hidden rounded-none border-2">
        <div className="bg-zinc-900/80 p-3 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">Информация о вещи</h3>
          <Badge className={`text-[10px] uppercase ${
            item.rarity === 'legendary' ? 'bg-orange-600' :
            item.rarity === 'epic' ? 'bg-purple-600' :
            item.rarity === 'rare' ? 'bg-blue-600' : 'bg-zinc-600'
          }`}>
            {item.rarity}
          </Badge>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex gap-4">
            <div className="relative w-20 h-20 bg-black border border-zinc-800 flex items-center justify-center shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-contain p-2"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="text-lg font-black leading-tight mb-1">{item.name}</h4>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">Уровень: {item.level}</p>
            </div>
          </div>

          <div className="bg-zinc-900/30 p-3 border border-zinc-800/50 rounded-sm">
            <p className="text-xs text-zinc-400 italic leading-relaxed">"{item.description}"</p>
          </div>
          
          <div className="grid grid-cols-1 gap-1.5">
            {item.dps && (
              <div className="flex items-center justify-between bg-zinc-900/50 px-3 py-2 border border-zinc-800/30">
                <div className="flex items-center gap-2">
                  {getStatIcon('dps')}
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">{getStatLabel('dps')}</span>
                </div>
                <span className="text-xs font-black text-white">+{item.dps}</span>
              </div>
            )}
            {item.stats && Object.entries(item.stats).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between bg-zinc-900/50 px-3 py-2 border border-zinc-800/30">
                <div className="flex items-center gap-2">
                  {getStatIcon(key)}
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">{getStatLabel(key)}</span>
                </div>
                <span className="text-xs font-black text-white">{formatValue(key, value as number)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h4 className="text-[9px] font-bold text-zinc-500 uppercase flex items-center gap-1">
              <Gem className="w-3 h-3" /> Слоты усиления
            </h4>
            <div className="flex gap-2">
              {item.gemSlots?.map((stone, idx) => (
                <div key={idx} className="w-8 h-8 border border-zinc-800 flex items-center justify-center bg-black relative">
                  {stone ? (
                    <Image 
                      src={stone.image} 
                      alt={stone.name} 
                      fill 
                      className="object-contain p-1" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                  )}
                </div>
              )) || <span className="text-[10px] text-zinc-600">Нет доступных слотов</span>}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            {onBuy ? (
              <Button 
                onClick={() => { onBuy(item); onClose(); }} 
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-black uppercase text-xs h-10 rounded-none border-b-2 border-yellow-800"
                disabled={!canBuy}
              >
                <Coins className="w-4 h-4 mr-2" /> Купить за {item.price}
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {item.type === 'stone' ? (
                  <Button 
                    onClick={() => { onInlay?.(item); onClose(); }} 
                    className="col-span-1 bg-purple-600 hover:bg-purple-700 border-purple-800 font-black uppercase text-xs h-10 rounded-none border-b-2"
                  >
                    Вплавить
                  </Button>
                ) : (
                  <Button 
                    onClick={() => { isEquipped ? onUnequip?.(item.type) : onEquip?.(item); onClose(); }} 
                    className={`font-black uppercase text-xs h-10 rounded-none border-b-2 ${
                      isEquipped 
                        ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-950' 
                        : 'bg-blue-600 hover:bg-blue-700 border-blue-800'
                    }`}
                  >
                    {isEquipped ? 'Снять' : 'Надеть'}
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => { onSell?.(item); onClose(); }}
                  className={cn(
                    "border-red-900/50 hover:bg-red-900/20 text-red-500 font-black uppercase text-xs h-10 rounded-none",
                    item.type === 'stone' ? "col-span-1" : ""
                  )}
                >
                  Продать ({Math.floor(item.price * 0.5)})
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
