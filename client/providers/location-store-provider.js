// providers/location-store-provider.js
'use client';
import { createContext, useContext, useRef, useEffect } from 'react';
import { useStore } from 'zustand';
import { createLocationStore } from '@/stores/location-store';

const LocationStoreContext = createContext(null);

export function LocationStoreProvider({ children, serverSelectedLocation }) {
  const storeRef = useRef();

  if (!storeRef.current) {
    storeRef.current = createLocationStore({
      selectedLocation: serverSelectedLocation || null,
    });
  }

  // Sync with server data on mount
  useEffect(() => {
    if (serverSelectedLocation && storeRef.current) {
      storeRef.current.getState().setSelectedLocation(serverSelectedLocation);
    }
  }, [serverSelectedLocation]);

  return (
    <LocationStoreContext.Provider value={storeRef.current}>
      {children}
    </LocationStoreContext.Provider>
  );
}

export function useLocationStore(selector) {
  const store = useContext(LocationStoreContext);
  if (!store) {
    throw new Error('Missing LocationStoreProvider');
  }
  return useStore(store, selector);
}