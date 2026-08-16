'use client';
import { createContext, useContext, useState } from 'react';

const RideContext = createContext();

export function RideProvider({ children }) {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedRide, setSelectedRide] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);

  const value = {
    pickup,
    setPickup,
    destination,
    setDestination,
    selectedRide,
    setSelectedRide,
    rideHistory,
    setRideHistory,
    // Helper function
    clearLocations: () => {
      setPickup('');
      setDestination('');
    }
  };

  return (
    <RideContext.Provider value={value}>
      {children}
    </RideContext.Provider>
  );
}

export function useRide() {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
}
