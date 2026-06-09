import { create } from "zustand";

export const useAquaStore = create((set) => ({
  temp: 0,
  ph: 0,
  pumpStatus: "OFF",

  minTemp: 26,
  maxTemp: 30,
  minPH: 6.5,
  maxPH: 7.5,

  setStore: (data) => set((state) => ({ ...state, ...data })),
}));