"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setCurrentLocation } from "@/actions/NextServerActions";
import { toast } from "@/hooks/use-toast";
import { getSession } from "next-auth/react";
import { useLocationStore } from "@/providers/location-store-provider";

const LocationSwitcher = ({ locations }) => {
  const optimizedLocations = [
    { id: "kamekanpoon", name: "Switch Locations" },
    ...locations,
  ];

  const selectedLocation = useLocationStore((state) => state.selectedLocation);
  const setSelectedLocation = useLocationStore(
    (state) => state.setSelectedLocation
  );
  const [loading, setLoading] = useState(false);

  const handleChange = async (newLocation) => {
    setLoading(true);
    if (newLocation !== selectedLocation) {
      setSelectedLocation(newLocation);
    } // ✅ Update Zustand state immediately

    const res = await setCurrentLocation(newLocation);

    if (res.success) {
      toast({
        title: "Location Successfully Changed",
        description: "You have successfully switched to a different location",
      });
    } else {
      toast({
        title: "Failed to Switch Location",
        description: "Please try again.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <Select onValueChange={handleChange} value={selectedLocation}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a location" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Available Locations</SelectLabel>
          {optimizedLocations.map((loc, index) => (
            <SelectItem key={index} value={loc.id}>
              {loc.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default LocationSwitcher;
