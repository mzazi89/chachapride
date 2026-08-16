'use client';
import { useState } from 'react';
import RideCard from './RideCard';

const rides = [
  { 
    id: 1, 
    type: 'UberX', 
    icon: '🚗', 
    price: 8, 
    time: 2, 
    capacity: 4, 
    affordable: true,
    description: 'Affordable, everyday rides'
  },
  { 
    id: 2, 
    type: 'UberXL', 
    icon: '🚐', 
    price: 14, 
    time: 5, 
    capacity: 6, 
    affordable: false,
    description: 'Rides for groups up to 6'
  },
  { 
    id: 3, 
    type: 'Uber Comfort', 
    icon: '🛻', 
    price: 18, 
    time: 8, 
    capacity: 4, 
    affordable: false,
    description: 'Extra legroom, top-rated drivers'
  },
  { 
    id: 4, 
    type: 'Uber Green', 
    icon: '🌿', 
    price: 10, 
    time: 10, 
    capacity: 4, 
    affordable: false,
    description: 'Eco-friendly electric vehicles'
  },
];

export default function RideOptions() {
  const [selectedRide, setSelectedRide] = useState(null);

  return (
    <div className="uber-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Available rides</h3>
        <span className="text-sm text-gray-500">
          {rides.length} options
        </span>
      </div>

      <div className="space-y-3">
        {rides.map((ride) => (
          <RideCard
            key={ride.id}
            ride={ride}
            selected={selectedRide === ride.id}
            onSelect={() => setSelectedRide(ride.id)}
          />
        ))}
      </div>

      {selectedRide && (
        <button className="uber-button mt-6">
          Confirm {rides.find(r => r.id === selectedRide)?.type}
        </button>
      )}
    </div>
  );
}
