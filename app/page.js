'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Header from './components/Header';
import RideOptions from './components/RideOptions';
import LocationInput from './components/LocationInput';
import RequestButton from './components/RequestButton';
import { useRide } from './context/RideContext';
import { useAuth } from './context/AuthContext';
import { geocode } from '../lib/geocode';

const Map = dynamic(() => import('./components/Map'), { ssr: false });

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    pickup,
    destination,
    pickupCoords,
    destinationCoords,
    setPickup,
    setDestination,
  } = useRide();
  const [showRides, setShowRides] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [requestError, setRequestError] = useState('');

  const handleRequestRide = async () => {
    setRequestError('');
    if (!pickup || !destination) {
      setRequestError('Please enter both pickup and destination');
      return;
    }
    if (!user) {
      router.push('/login');
      return;
    }

    setRequesting(true);
    try {
      let fromCoords = pickupCoords;
      let toCoords = destinationCoords;

      if (!fromCoords) {
        const results = await geocode(pickup);
        if (results.length === 0) throw new Error(`Could not find "${pickup}"`);
        fromCoords = { lat: results[0].lat, lng: results[0].lng };
        setPickup(results[0].label, fromCoords);
      }
      if (!toCoords) {
        const results = await geocode(destination);
        if (results.length === 0) throw new Error(`Could not find "${destination}"`);
        toCoords = { lat: results[0].lat, lng: results[0].lng };
        setDestination(results[0].label, toCoords);
      }

      setShowRides(true);
    } catch (err) {
      setRequestError(err.message);
    } finally {
      setRequesting(false);
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

              {requestError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  {requestError}
                </div>
              )}

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

                <RequestButton onClick={handleRequestRide} isLoading={requesting} />
                {!authLoading && !user && (
                  <p className="text-center text-xs text-gray-400">
                    You&apos;ll need to log in to request a ride
                  </p>
                )}
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
          <div className="order-first lg:order-none">
            <div className="uber-card p-0 overflow-hidden h-72 sm:h-96 lg:h-[600px]">
              <Map />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
