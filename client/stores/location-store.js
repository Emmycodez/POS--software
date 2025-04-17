// stores/location-store.js
import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';

export const defaultInitState = {
  selectedLocation: null,
};

export const createLocationStore = (initState = defaultInitState) => {
  return createStore(
    persist(
      (set) => ({
        ...initState,
        setSelectedLocation: (location) => set({ selectedLocation: location }),
        clearLocation: () => set({ selectedLocation: null }),
      }),
      {
        name: 'location-storage', // Unique key for storage
        storage: createJSONStorage(() => localStorage), // or sessionStorage
      }
    )
  );
};