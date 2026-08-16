'use client';
import { useState } from 'react';
import Header from './components/Header';
import Map from './components/Map';
import RideOptions from './components/RideOptions';
import LocationInput from './components/LocationInput';
import RequestButton from './components/RequestButton';
import { useRide } from './context/RideContext';

export default function Home() {
  const { pickup, destination, setPickup, setDestination } = useRide();
  const [showRides, setShowRides] = useState(false);

  const handleRequestRide = () => {
    if (pickup && destination) {
      setShowRides(true);
    } else {
      alert('Please enter both pickup and destination');
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Booking Form */}
          <div className="space-y-6">
            <div className="uber-card animate-slide-up">
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
                Go anywhere
              </h1>
              <p className="text-gray-500 mb-6">
                Get affordable rides at your fingertips
              </p>

              <div className="space-y-4">
                <LocationInput
                  type="pickup"
                  value={pickup}
                  onChange={setPickup}
                  placeholder="Enter pickup location"
                />
                
                <LocationInput
                  type="destination"
                  value={destination}
                  onChange={setDestination}
                  placeholder="Enter destination"
                />

                <RequestButton onClick={handleRequestRide} />
              </div>
            </div>

            {/* Ride Options - Show after request */}
            {showRides && (
              <div className="animate-slide-up">
                <RideOptions />
              </div>
            )}
          </div>

          {/* Right Column - Map */}
          <div className="hidden lg:block">
            <div className="uber-card p-0 overflow-hidden h-[600px]">
              <Map />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
