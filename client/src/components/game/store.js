import { create } from "zustand";

// Zustand store for managing game state
export const useStore = create((set) => ({
  dummyLocations: {},
  bullets: {},
  bulletStates: {}, // Track bullet firing state and animation
  playerHP: { 1: 100, 2: 100, 3: 100, 4: 100, 5: 100, 6: 100, 7: 100, 8: 100, 9: 100, 10: 100 },
  
  setDummyLocation: (id, position) =>
    set((state) => ({
      dummyLocations: { ...state.dummyLocations, [id]: position },
    })),

  setBullet: (id, bulletIndex, position) =>
    set((state) => ({
      bullets: {
        ...state.bullets,
        [id]: {
          ...state.bullets[id],
          [bulletIndex]: position,
        },
      },
    })),

  fireBullets: (id) =>
    set((state) => ({
      bulletStates: {
        ...state.bulletStates,
        [id]: { 1: "firing", 2: "firing" }, // Start firing both bullets
      },
    })),

  updatePlayerHP: (id, damage) =>
    set((state) => ({
      playerHP: {
        ...state.playerHP,
        [id]: Math.max(state.playerHP[id] - damage, 0),
      },
    })),

  resetBulletStates: (id) =>
    set((state) => ({
      bulletStates: {
        ...state.bulletStates,
        [id]: { 1: "ready", 2: "ready" },
      },
    })),
}));


  
