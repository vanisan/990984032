'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PlayerStats, Enemy, Skill, Item, Equipment, PlayerClass } from '@/types/game';
import { ITEMS } from '@/lib/items';

const CLASS_SKILLS: Record<PlayerClass, Skill> = {
  fighter: {
    id: 'fighter-skill',
    name: 'Сильный удар',
    description: 'Наносит 150% урона',
    cooldown: 5,
    lastUsed: 0,
    manaCost: 10,
    damageMultiplier: 1.5,
    icon: '/skills/fighterskill-1.webp'
  },
  warrior: {
    id: 'warrior-skill',
    name: 'Ярость воина',
    description: 'Наносит 250% урона',
    cooldown: 8,
    lastUsed: 0,
    manaCost: 20,
    damageMultiplier: 2.5,
    icon: '/skills/warriorskill-1.webp'
  },
  mage: {
    id: 'mage-skill',
    name: 'Огненный шар',
    description: 'Наносит 300% урона',
    cooldown: 10,
    lastUsed: 0,
    manaCost: 30,
    damageMultiplier: 3.0,
    icon: '/skills/mageskill-1.webp'
  },
  archer: {
    id: 'archer-skill',
    name: 'Точный выстрел',
    description: 'Наносит 200% урона',
    cooldown: 6,
    lastUsed: 0,
    manaCost: 15,
    damageMultiplier: 2.0,
    icon: '/skills/archerskill-1.webp'
  }
};

const INITIAL_PLAYER: PlayerStats = {
  level: 1,
  xp: 0,
  nextLevelXp: 100,
  hp: 100,
  maxHp: 100,
  mana: 50,
  maxMana: 50,
  energy: 100,
  maxEnergy: 100,
  gold: 200,
  attack: 10,
  defense: 5,
  criticalChance: 0.1,
  criticalMultiplier: 2.0,
  class: 'fighter',
};

const ENEMIES: Enemy[] = [
  { id: '1', name: 'Слизь', level: 1, hp: 50, maxHp: 50, rewardXp: 20, rewardGold: 5, image: '/mobs/mob1.webp', type: 'mob' },
  { id: '2', name: 'Лесной волк', level: 4, hp: 150, maxHp: 150, rewardXp: 60, rewardGold: 20, image: '/mobs/mob-4.webp', type: 'mob' },
  { id: '3', name: 'Гоблин-разведчик', level: 6, hp: 250, maxHp: 250, rewardXp: 100, rewardGold: 35, image: '/mobs/mob-6.webp', type: 'mob' },
  { id: '4', name: 'Орк-налетчик', level: 10, hp: 500, maxHp: 500, rewardXp: 250, rewardGold: 80, image: '/mobs/mob-10.webp', type: 'mob' },
  { id: '5', name: 'Скелет-воин', level: 13, hp: 800, maxHp: 800, rewardXp: 400, rewardGold: 120, image: '/mobs/mob-13.webp', type: 'mob' },
  { id: '6', name: 'Темный рыцарь', level: 15, hp: 1200, maxHp: 1200, rewardXp: 600, rewardGold: 200, image: '/mobs/mob-15.webp', type: 'mob' },
  { id: '7', name: 'Огненный бес', level: 18, hp: 1800, maxHp: 1800, rewardXp: 900, rewardGold: 300, image: '/mobs/mob-18.webp', type: 'mob' },
  { id: '8', name: 'Минотавр', level: 22, hp: 2500, maxHp: 2500, rewardXp: 1300, rewardGold: 450, image: '/mobs/mob-22.webp', type: 'mob' },
  { id: '9', name: 'Ледяной великан', level: 25, hp: 3500, maxHp: 3500, rewardXp: 1800, rewardGold: 600, image: '/mobs/mob-25.webp', type: 'mob' },
  { id: '10', name: 'Древний голем', level: 28, hp: 5000, maxHp: 5000, rewardXp: 2500, rewardGold: 850, image: '/mobs/mob-28.webp', type: 'mob' },
  { id: '11', name: 'Хранитель бездны', level: 35, hp: 8000, maxHp: 8000, rewardXp: 4000, rewardGold: 1500, image: '/mobs/mob-35.webp', type: 'mob' },
  { id: '12', name: 'Лорд демонов', level: 39, hp: 12000, maxHp: 12000, rewardXp: 6000, rewardGold: 2500, image: '/mobs/mob-39.webp', type: 'mob' },
  { id: '13', name: 'Архимаг смерти', level: 42, hp: 18000, maxHp: 18000, rewardXp: 9000, rewardGold: 4000, image: '/mobs/mob-42.webp', type: 'mob' },
  { id: '14', name: 'Пожиратель миров', level: 45, hp: 25000, maxHp: 25000, rewardXp: 13000, rewardGold: 6000, image: '/mobs/mob-45.webp', type: 'mob' },
  { id: '15', name: 'Бог хаоса', level: 50, hp: 50000, maxHp: 50000, rewardXp: 25000, rewardGold: 15000, image: '/mobs/mob-50.webp', type: 'boss' },
];

export function useGameState() {
  const [basePlayer, setBasePlayer] = useState<PlayerStats>(INITIAL_PLAYER);
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [inventory, setInventory] = useState<Item[]>([
    ITEMS.find(i => i.id === 'weapon-1')!,
    ITEMS.find(i => i.id === 'armor-1')!,
    ITEMS.find(i => i.id === 'boots-1')!,
    ITEMS.find(i => i.id === 'ring-1')!,
  ]);
  const [equipment, setEquipment] = useState<Equipment>({
    weapon: null,
    armor: null,
    helmet: null,
    boots: null,
    ring: null,
    pet: null,
  });
  const [damageNumbers, setDamageNumbers] = useState<{ id: number; value: number; x: number; y: number; isCrit: boolean }[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const handleEnemyDefeat = useCallback((enemy: Enemy) => {
    setBasePlayer(p => {
      let newXp = p.xp + enemy.rewardXp;
      let newLevel = p.level;
      let newNextLevelXp = p.nextLevelXp;
      let newGold = p.gold + enemy.rewardGold;

      if (newXp >= newNextLevelXp) {
        newLevel += 1;
        newXp -= newNextLevelXp;
        newNextLevelXp = Math.floor(newNextLevelXp * 1.5);
        setShowLevelUp(true);
        return {
          ...p,
          level: newLevel,
          xp: newXp,
          nextLevelXp: newNextLevelXp,
          gold: newGold,
          maxHp: p.maxHp + 20,
          hp: p.maxHp + 20,
          attack: p.attack + 5,
          defense: p.defense + 2,
          maxMana: p.maxMana + 10,
          mana: p.maxMana + 10,
        };
      }

      return { ...p, xp: newXp, gold: newGold };
    });
    setCurrentEnemy(null);
  }, []);

  // Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setBasePlayer(prev => {
        if (prev.energy < prev.maxEnergy) {
          return { ...prev, energy: Math.min(prev.maxEnergy, prev.energy + 1) };
        }
        return prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Pet DPS
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentEnemy && equipment.pet?.dps) {
        const dps = equipment.pet.dps;
        const x = typeof window !== 'undefined' ? window.innerWidth / 2 + (Math.random() * 40 - 20) : 0;
        const y = typeof window !== 'undefined' ? window.innerHeight / 3 + (Math.random() * 40 - 20) : 0;
        
        setDamageNumbers(prev => [...prev, { id: Date.now(), value: dps, x, y, isCrit: false }]);

        setCurrentEnemy(prev => {
          if (!prev) return null;
          const newHp = prev.hp - dps;
          if (newHp <= 0) {
            handleEnemyDefeat(prev);
            return null;
          }
          return { ...prev, hp: newHp };
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentEnemy, equipment.pet, handleEnemyDefeat]);

  // Derived skills based on class
  const availableSkills = useMemo(() => {
    return [CLASS_SKILLS[basePlayer.class]];
  }, [basePlayer.class]);

  const selectProfession = useCallback((newClass: PlayerClass) => {
    if (basePlayer.level >= 10 && basePlayer.class === 'fighter') {
      setBasePlayer(prev => ({ ...prev, class: newClass }));
      return true;
    }
    return false;
  }, [basePlayer.level, basePlayer.class]);

  // Calculate total stats including equipment and stones
  const player = useMemo(() => {
    const stats = { ...basePlayer };
    const items = Object.values(equipment).filter(Boolean) as Item[];
    
    let flatAttack = 0;
    let flatDefense = 0;
    let flatMaxHp = 0;
    let flatMaxMana = 0;
    let flatCritChance = 0;
    let hpPercentBonus = 0;

    const processItem = (item: Item) => {
      if (item.stats) {
        if (item.stats.attack) flatAttack += item.stats.attack;
        if (item.stats.defense) flatDefense += item.stats.defense;
        if (item.stats.maxHp) {
          if (item.stats.maxHp < 1) hpPercentBonus += item.stats.maxHp;
          else flatMaxHp += item.stats.maxHp;
        }
        if (item.stats.maxMana) flatMaxMana += item.stats.maxMana;
        if (item.stats.criticalChance) flatCritChance += item.stats.criticalChance;
      }
      if (item.gemSlots) {
        item.gemSlots.forEach(stone => {
          if (stone && stone.stats) {
            if (stone.stats.attack) flatAttack += stone.stats.attack;
            if (stone.stats.defense) flatDefense += stone.stats.defense;
            if (stone.stats.maxHp) {
              if (stone.stats.maxHp < 1) hpPercentBonus += stone.stats.maxHp;
              else flatMaxHp += stone.stats.maxHp;
            }
            if (stone.stats.maxMana) flatMaxMana += stone.stats.maxMana;
            if (stone.stats.criticalChance) flatCritChance += stone.stats.criticalChance;
          }
        });
      }
    };

    items.forEach(processItem);

    stats.attack += flatAttack;
    stats.defense += flatDefense;
    stats.maxHp += flatMaxHp;
    stats.maxHp = Math.floor(stats.maxHp * (1 + hpPercentBonus));
    stats.maxMana += flatMaxMana;
    stats.criticalChance += flatCritChance;
    
    // Ensure current HP/Mana doesn't exceed new max
    stats.hp = Math.min(stats.hp, stats.maxHp);
    stats.mana = Math.min(stats.mana, stats.maxMana);
    
    return stats;
  }, [basePlayer, equipment]);

  // Spawn enemy
  const spawnEnemy = useCallback(() => {
    const availableEnemies = ENEMIES.filter(e => e.level <= player.level + 2);
    const randomEnemy = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
    setCurrentEnemy({ ...randomEnemy });
  }, [player.level]);

  useEffect(() => {
    if (!currentEnemy) {
      const timer = setTimeout(() => {
        spawnEnemy();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentEnemy, spawnEnemy]);

  const handleTap = useCallback((x: number, y: number) => {
    if (!currentEnemy || basePlayer.energy < 1) return;

    // Consume energy
    setBasePlayer(prev => ({ ...prev, energy: prev.energy - 1 }));

    const isCrit = Math.random() < player.criticalChance;
    const damage = isCrit ? player.attack * player.criticalMultiplier : player.attack;
    const actualDamage = Math.max(1, Math.floor(damage));

    setDamageNumbers(prev => [...prev, { id: Date.now(), value: actualDamage, x, y, isCrit }]);

    setCurrentEnemy(prev => {
      if (!prev) return null;
      const newHp = prev.hp - actualDamage;
      
      if (newHp <= 0) {
        handleEnemyDefeat(prev);
        return null;
      }

      return { ...prev, hp: newHp };
    });
  }, [currentEnemy, player, handleEnemyDefeat, basePlayer.energy]);

  const useSkill = useCallback((skillId: string) => {
    const skill = availableSkills.find(s => s.id === skillId);
    if (!skill || !currentEnemy || player.mana < skill.manaCost) return false;

    const now = Date.now();
    if (now - skill.lastUsed < skill.cooldown * 1000) return false;

    // Update skill last used
    skill.lastUsed = now;

    // Consume mana
    setBasePlayer(prev => ({ ...prev, mana: prev.mana - skill.manaCost }));

    const damage = player.attack * skill.damageMultiplier;
    const actualDamage = Math.floor(damage);

    setDamageNumbers(prev => [...prev, { 
      id: Date.now(), 
      value: actualDamage, 
      x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, 
      y: typeof window !== 'undefined' ? window.innerHeight / 3 : 0, 
      isCrit: true 
    }]);

    setCurrentEnemy(prev => {
      if (!prev) return null;
      const newHp = prev.hp - actualDamage;
      
      if (newHp <= 0) {
        handleEnemyDefeat(prev);
        return null;
      }

      return { ...prev, hp: newHp };
    });

    return true;
  }, [availableSkills, currentEnemy, player, handleEnemyDefeat]);

  const inlayStone = useCallback((stone: Item, targetItem: Item) => {
    const updateItem = (item: Item) => {
      if (item.id !== targetItem.id) return item;
      if (!item.gemSlots) return item;
      
      const emptySlotIndex = item.gemSlots.findIndex(slot => slot === null);
      if (emptySlotIndex === -1) return item;
      
      const newGemSlots = [...item.gemSlots];
      newGemSlots[emptySlotIndex] = stone;
      return { ...item, gemSlots: newGemSlots };
    };

    setInventory(prev => {
      const newInventory = prev.filter(i => i.id !== stone.id);
      return newInventory.map(updateItem);
    });

    setEquipment(prev => {
      const newEquipment = { ...prev };
      Object.keys(newEquipment).forEach(key => {
        const item = newEquipment[key as keyof Equipment];
        if (item) {
          (newEquipment as any)[key] = updateItem(item);
        }
      });
      return newEquipment;
    });
  }, []);

  const equipItem = useCallback((item: Item) => {
    setEquipment(prev => {
      const type = item.type as keyof Equipment;
      const oldItem = prev[type];
      
      setInventory(inv => {
        // Remove the new item from inventory
        let newInv = inv.filter(i => i.id !== item.id);
        // If there was an item in that slot, put it back in inventory
        if (oldItem) {
          newInv = [...newInv, oldItem];
        }
        return newInv;
      });
      
      return { ...prev, [type]: item };
    });
  }, []);

  const unequipItem = useCallback((type: keyof Equipment) => {
    setEquipment(prev => {
      const item = prev[type];
      if (item) {
        setInventory(inv => [...inv, item]);
      }
      return { ...prev, [type]: null };
    });
  }, []);

  const sellItem = useCallback((item: Item) => {
    setInventory(prev => prev.filter(i => i.id !== item.id));
    setEquipment(prev => {
      const newEquip = { ...prev };
      Object.keys(newEquip).forEach(key => {
        if (newEquip[key as keyof Equipment]?.id === item.id) {
          (newEquip as any)[key] = null;
        }
      });
      return newEquip;
    });
    setBasePlayer(p => ({ ...p, gold: p.gold + Math.floor(item.price * 0.5) }));
  }, []);

  const buyItem = useCallback((item: Item) => {
    if (basePlayer.gold >= item.price) {
      setBasePlayer(p => ({ ...p, gold: p.gold - item.price }));
      setInventory(prev => [...prev, { ...item, id: `${item.id}-${Date.now()}` }]);
      return true;
    }
    return false;
  }, [basePlayer.gold]);

  const clearDamageNumber = useCallback((id: number) => {
    setDamageNumbers(prev => prev.filter(d => d.id !== id));
  }, []);

  return {
    player,
    currentEnemy,
    inventory,
    equipment,
    skills: availableSkills,
    damageNumbers,
    showLevelUp,
    setShowLevelUp,
    handleTap,
    useSkill,
    equipItem,
    unequipItem,
    sellItem,
    buyItem,
    inlayStone,
    clearDamageNumber,
    selectProfession,
  };
}
