'use client';

import { useState } from 'react';
import { useGameState } from '@/hooks/use-game-state';
import { CombatView } from '@/components/game/CombatView';
import { PlayerStats } from '@/components/game/PlayerStats';
import { Navigation } from '@/components/game/Navigation';
import { LevelUp } from '@/components/game/LevelUp';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ItemDetails } from '@/components/game/ItemDetails';
import { ITEMS } from '@/lib/items';
import { Item, Equipment } from '@/types/game';
import Image from 'next/image';
import { ShoppingBag, Backpack, Sword, Shield, Footprints, CircleDot, Ghost, Zap, Sparkles, PawPrint } from 'lucide-react';

type Tab = 'combat' | 'skills' | 'inventory' | 'shop';

export default function GamePage() {
  const { 
    player, 
    currentEnemy, 
    inventory,
    equipment,
    skills,
    damageNumbers, 
    showLevelUp,
    setShowLevelUp,
    handleTap, 
    useSkill,
    equipItem,
    unequipItem,
    sellItem,
    buyItem,
    inlayStone: inlayStoneAction,
    clearDamageNumber,
    selectProfession
  } = useGameState();
  
  const [activeTab, setActiveTab] = useState<Tab>('combat');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shopCategory, setShopCategory] = useState<Item['type']>('weapon');
  const [stoneToInlay, setStoneToInlay] = useState<Item | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLDivElement;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeft(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = e.currentTarget as HTMLDivElement;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 2;
    el.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleItemClick = (item: Item) => {
    if (stoneToInlay) {
      if (item.type !== 'stone' && item.gemSlots && item.gemSlots.some(slot => slot === null)) {
        inlayStoneAction(stoneToInlay, item);
        setStoneToInlay(null);
      }
      return;
    }
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const isEquipped = (item: Item) => {
    return Object.values(equipment).some(e => e?.id === item.id);
  };

  const renderEquipmentSlot = (type: keyof Equipment, label: string, Icon: any) => {
    const item = equipment[type];
    return (
      <div 
        onClick={() => item && handleItemClick(item)}
        className="flex flex-col items-center gap-1"
      >
        <div className={cn(
          "w-14 h-14 bg-zinc-900 rounded-lg border flex items-center justify-center relative transition-all active:scale-95",
          item ? "border-blue-500 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.2)]" : "border-zinc-800 text-zinc-700",
          stoneToInlay && item && item.gemSlots && item.gemSlots.some(slot => slot === null) && "border-purple-500 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)] bg-purple-500/10"
        )}>
          {item ? (
            <Image 
              src={item.image} 
              alt={item.name} 
              fill 
              className="object-contain p-2" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <Icon className="w-6 h-6" />
          )}
        </div>
        <span className="text-[10px] text-zinc-500 font-bold uppercase">{label}</span>
      </div>
    );
  };

  return (
    <main className="flex flex-col h-screen bg-black text-white overflow-hidden font-sans">
      <LevelUp 
        level={player.level} 
        show={showLevelUp} 
        onComplete={() => setShowLevelUp(false)} 
      />

      <PlayerStats player={player} />

      <div className="flex-1 relative overflow-hidden">
        {stoneToInlay && (
          <div className="absolute top-4 left-0 right-0 z-50 px-4 pointer-events-none">
            <div className="bg-purple-900/90 border-2 border-purple-500 p-3 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-between pointer-events-auto animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 bg-black border border-purple-400 rounded-lg p-1.5 shadow-[inset_0_0_10px_rgba(168,85,247,0.2)]">
                  <Image src={stoneToInlay.image} alt={stoneToInlay.name} fill className="object-contain" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-tighter text-purple-100 leading-none mb-1">Режим вплавки</p>
                  <p className="text-[9px] font-bold text-purple-300 uppercase leading-none">Выберите вещь со свободным слотом</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setStoneToInlay(null)}
                className="h-8 w-8 p-0 hover:bg-purple-800 text-purple-200"
              >
                ✕
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'combat' && (
          <CombatView 
            enemy={currentEnemy} 
            onTap={handleTap}
            damageNumbers={damageNumbers}
            onDamageComplete={clearDamageNumber}
            skills={skills}
            onUseSkill={useSkill}
          />
        )}

        {activeTab === 'skills' && (
          <ScrollArea className="h-full p-4 pb-20">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight">Способности</h2>
            
            {player.level >= 10 && player.class === 'fighter' ? (
              <div className="space-y-6 max-w-md mx-auto">
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg text-center">
                  <h3 className="text-yellow-500 font-bold uppercase text-sm mb-1">Выберите профессию</h3>
                  <p className="text-[10px] text-zinc-400">Вы достигли 10 уровня! Выберите свой путь развития.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'warrior', name: 'Воин', icon: '/classes/warrior-2.webp', desc: 'Мастер ближнего боя и защиты.' },
                    { id: 'mage', name: 'Маг', icon: '/classes/mage-2.webp', desc: 'Повелитель стихий и мощных заклинаний.' },
                    { id: 'archer', name: 'Лучник', icon: '/classes/archer-2.webp', desc: 'Снайпер, поражающий врагов издалека.' },
                  ].map((prof) => (
                    <button
                      key={prof.id}
                      onClick={() => selectProfession(prof.id as any)}
                      className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-3 rounded-xl hover:border-yellow-500/50 transition-all active:scale-95"
                    >
                      <div className="relative w-12 h-12 bg-black border border-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                        <Image 
                          src={prof.icon} 
                          alt={prof.name} 
                          fill 
                          className="object-contain p-1" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-sm text-white">{prof.name}</h4>
                        <p className="text-[10px] text-zinc-500">{prof.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid gap-4 max-w-md mx-auto">
                {skills.map((skill) => (
                  <Card key={skill.id} className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-black border border-zinc-800 rounded overflow-hidden flex-shrink-0">
                          <Image 
                            src={skill.icon} 
                            alt={skill.name} 
                            fill 
                            className="object-contain p-1" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <CardTitle className="text-sm flex-1 flex justify-between items-center">
                          <span>{skill.name}</span>
                          <Badge variant="secondary" className="text-[10px]">Ур.1</Badge>
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-xs text-muted-foreground mb-2">{skill.description}</p>
                      <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {skill.manaCost} MP</span>
                        <span>КД: {skill.cooldown}с</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        )}

        {activeTab === 'inventory' && (
          <ScrollArea className="h-full p-4 pb-20">
            <div className="space-y-6 max-w-md mx-auto">
              {/* Character Doll */}
              <section className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                <h2 className="text-[10px] font-bold mb-4 uppercase tracking-widest text-zinc-500 text-center">Экипировка</h2>
                <div className="flex flex-col items-center gap-2">
                  {/* Helmet */}
                  {renderEquipmentSlot('helmet', 'Шлем', Ghost)}
                  
                  <div className="flex justify-center gap-4">
                    {/* Weapon */}
                    {renderEquipmentSlot('weapon', 'Оружие', Sword)}
                    
                    {/* Armor */}
                    {renderEquipmentSlot('armor', 'Броня', Shield)}
                    
                    {/* Ring */}
                    {renderEquipmentSlot('ring', 'Кольцо', CircleDot)}
                  </div>
                  
                  {/* Boots */}
                  {renderEquipmentSlot('boots', 'Сапоги', Footprints)}
                  
                  {/* Pet */}
                  <div className="mt-2">
                    {renderEquipmentSlot('pet', 'Питомец', PawPrint)}
                  </div>
                </div>
              </section>

              {/* Inventory Grid */}
              <section>
                <h2 className="text-[10px] font-bold mb-3 uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Backpack className="w-3 h-3" /> Рюкзак
                </h2>
                <div className="grid grid-cols-6 gap-1.5">
                  {inventory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        "w-12 h-12 bg-zinc-900 border rounded flex flex-col items-center justify-center transition-all active:scale-90 relative overflow-hidden",
                        isEquipped(item) ? "border-blue-500 bg-blue-500/20" : "border-zinc-800",
                        stoneToInlay && item.type !== 'stone' && item.gemSlots && item.gemSlots.some(slot => slot === null) && "border-purple-500 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)] bg-purple-500/10",
                        item.rarity === 'legendary' && "border-orange-500/50",
                        item.rarity === 'epic' && "border-purple-500/50",
                        item.rarity === 'rare' && "border-blue-500/50"
                      )}
                    >
                      <div className="relative w-full h-full p-1">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-contain" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      {isEquipped(item) && (
                        <div className="absolute top-0 right-0 bg-blue-500 text-[7px] px-0.5 font-bold leading-none py-0.5 rounded-bl">E</div>
                      )}
                    </button>
                  ))}
                  {[...Array(Math.max(0, 24 - inventory.length))].map((_, i) => (
                    <div key={i} className="w-12 h-12 bg-zinc-900/30 border border-zinc-800/50 rounded" />
                  ))}
                </div>
              </section>
            </div>
          </ScrollArea>
        )}

        {activeTab === 'shop' && (
          <ScrollArea className="h-full p-4 pb-20">
            <div className="space-y-4 max-w-md mx-auto">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-yellow-500" /> Магазин
                </h2>
                <div className="text-xs font-bold text-yellow-500 flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                  💰 {player.gold.toLocaleString()}
                </div>
              </div>
              
              {/* Shop Categories */}
              <div 
                className="flex gap-2 overflow-x-auto pb-2 no-scrollbar bg-zinc-900/50 p-1 rounded-lg border border-zinc-800 cursor-grab active:cursor-grabbing touch-pan-x select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
              >
                {[
                  { id: 'weapon', label: 'Оружие', icon: Sword },
                  { id: 'armor', label: 'Броня', icon: Shield },
                  { id: 'helmet', label: 'Шлем', icon: Ghost },
                  { id: 'boots', label: 'Сапоги', icon: Footprints },
                  { id: 'ring', label: 'Кольца', icon: CircleDot },
                  { id: 'stone', label: 'Камни', icon: Sparkles },
                  { id: 'pet', label: 'Питомцы', icon: PawPrint },
                ].map((cat) => (
                  <Button
                    key={cat.id}
                    variant={shopCategory === cat.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setShopCategory(cat.id as any)}
                    className={cn(
                       "flex-shrink-0 gap-2 h-9 text-[10px] px-3 font-black uppercase tracking-wider transition-all",
                      shopCategory === cat.id ? "bg-yellow-600 hover:bg-yellow-700 text-white shadow-[0_0_10px_rgba(202,138,4,0.3)]" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                    )}
                  >
                    <cat.icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {ITEMS.filter(i => i.type === shopCategory).map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "w-14 h-14 bg-zinc-900 border rounded flex flex-col items-center justify-center transition-all active:scale-95 relative overflow-hidden",
                      item.rarity === 'legendary' ? "border-orange-500/50 bg-orange-500/5" :
                      item.rarity === 'epic' ? "border-purple-500/50 bg-purple-500/5" :
                      item.rarity === 'rare' ? "border-blue-500/50 bg-blue-500/5" : "border-zinc-800"
                    )}
                  >
                    <div className="relative w-full h-full p-1.5">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-contain" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5">
                      <p className="text-[7px] font-bold text-center text-yellow-500 truncate px-0.5">
                        {item.price}
                      </p>
                    </div>
                    <div className="absolute top-0 left-0 bg-zinc-800/80 text-[6px] px-0.5 font-bold rounded-br">
                      {item.level}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </ScrollArea>
        )}
      </div>

      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        showSkillNotification={player.level >= 10 && player.class === 'fighter'}
      />

      <ItemDetails
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEquip={equipItem}
        onUnequip={unequipItem}
        onSell={sellItem}
        onBuy={activeTab === 'shop' ? buyItem : undefined}
        onInlay={(stone) => setStoneToInlay(stone)}
        isEquipped={selectedItem ? isEquipped(selectedItem) : false}
        canBuy={selectedItem ? player.gold >= selectedItem.price : false}
      />
    </main>
  );
}
