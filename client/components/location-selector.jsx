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