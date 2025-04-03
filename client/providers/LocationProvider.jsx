// app/providers/location-provider.js
'use client'

import { createContext, useContext, useState } from 'react'

// 1. Create Context
const LocationContext = createContext()

// 2. Provider Component
export function LocationProvider({ children, user }) {
  const [locationId, setLocationId] = useState(user.assignedLocation || null)

  // Cashiers can't change location
  const handleSetLocation = (id) => {
    if (user.role !== 'cashier') setLocationId(id)
  }

  return (
    <LocationContext.Provider value={{
      locationId,
      setLocationId: handleSetLocation,
      canSwitchLocations: user.role !== 'cashier'
    }}>
      {children}
    </LocationContext.Provider>
  )
}

// 3. Custom Hook
export function useLocation() {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}