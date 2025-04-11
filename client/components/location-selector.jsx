// components/LocationSelector.js
'use client'

import {useLocation} from '@/providers/'


export default function LocationSelector({ locations }) {
  const { locationId, setLocationId, canSwitchLocations } = useLocation()

  if (!canSwitchLocations) {
    return (
      <div className="current-location">
        Current Location: {locations.find(l => l.id === locationId)?.name}
      </div>
    )
  }

  return (
    <select
      value={locationId || ''}
      onChange={(e) => setLocationId(e.target.value)}
      className="location-select"
    >
      {locations.map(location => (
        <option key={location.id} value={location.id}>
          {location.name}
        </option>
      ))}
    </select>
  )
}


/*
"use client";

import { useLocation } from "@/providers/location-provider";

export default function LocationSwitcher() {
  const { locationId, setLocationId, canSwitchLocations } = useLocation();

  return (
    <div>
      <h2>Current Location: {locationId}</h2>
      {canSwitchLocations && (
        <button onClick={() => setLocationId("new_location_id")}>
          Switch Location
        </button>
      )}
    </div>
  );
}

*/