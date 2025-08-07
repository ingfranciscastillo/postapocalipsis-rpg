import { create } from "zustand";
import { GameState, Player, Enemy, SurvivorTypeKey } from "@/types/gameTypes";
import { locations } from "../data/locations";
import { survivorTypes } from "../data/survivorTypes";
import { allItems } from "../data/items";

interface GameStore extends GameState {
  // Actions
  initializeGame: () => void;
  createPlayer: (name: string, type: SurvivorTypeKey) => void;
  addToLog: (message: string) => void;
  clearLog: () => void;
  setCurrentEnemy: (enemy: Enemy | null) => void;
  setInCombat: (inCombat: boolean) => void;
  updatePlayer: (updates: Partial<Player>) => void;
  saveGame: () => void;
  loadGame: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  player: null,
  currentEnemy: null,
  inCombat: false,
  gameLog: [],
  locations: locations,
  gameStarted: false,

  // Actions
  initializeGame: () => {
    const savedGame = localStorage.getItem("wasteland-rpg-save");
    if (savedGame) {
      try {
        const parsedSave = JSON.parse(savedGame);
        set(parsedSave);
        get().addToLog("✓ Partida cargada desde el almacenamiento local.");
      } catch (error) {
        console.error("Error loading save:", error);
        get().addToLog("✗ Error al cargar la partida guardada.");
      }
    }
  },

  createPlayer: (name: string, type: SurvivorTypeKey) => {
    const survivorType = survivorTypes[type];
    const startingItems = survivorType.startingItems
      .map((itemId: string) => allItems[itemId])
      .filter(Boolean);

    const newPlayer: Player = {
      name,
      type,
      level: 1,
      experience: 0,
      experienceToNext: 100,
      health: 100,
      maxHealth: 100,
      stamina: 100,
      maxStamina: 100,
      stats: { ...survivorType.stats },
      inventory: startingItems,
      equippedWeapon: null,
      equippedArmor: null,
      location: "bunker_entrance",
    };

    set({
      player: newPlayer,
      gameStarted: true,
      gameLog: [
        "=== DIARIO DEL SUPERVIVIENTE ===",
        "",
        `Nombre: ${name}`,
        `Clase: ${survivorType.name}`,
        `${survivorType.description}`,
        "",
        "El búnker que ha sido tu hogar durante años finalmente se está quedando sin recursos.",
        "Es hora de aventurarse al exterior y enfrentar los horrores del mundo post-apocalíptico.",
        "Tu supervivencia depende de cada decisión que tomes.",
        "",
        "Escribe '/help' para ver los comandos disponibles.",
        "",
      ],
    });
  },

  addToLog: (message: string) => {
    set((state) => ({
      gameLog: [...state.gameLog, message],
    }));
  },

  clearLog: () => {
    set({ gameLog: [] });
  },

  setCurrentEnemy: (enemy: Enemy | null) => {
    set({ currentEnemy: enemy });
  },

  setInCombat: (inCombat: boolean) => {
    set({ inCombat });
  },

  updatePlayer: (updates: Partial<Player>) => {
    set((state) => ({
      player: state.player ? { ...state.player, ...updates } : null,
    }));
  },

  saveGame: () => {
    const state = get();
    const saveData = {
      player: state.player,
      currentEnemy: state.currentEnemy,
      inCombat: state.inCombat,
      gameLog: state.gameLog,
      locations: state.locations,
      gameStarted: state.gameStarted,
    };

    localStorage.setItem("wasteland-rpg-save", JSON.stringify(saveData));
    get().addToLog("✓ Juego guardado correctamente.");
  },

  loadGame: () => {
    get().initializeGame();
  },

  resetGame: () => {
    localStorage.removeItem("wasteland-rpg-save");
    set({
      player: null,
      currentEnemy: null,
      inCombat: false,
      gameLog: [],
      locations: locations,
      gameStarted: false,
    });
  },
}));
