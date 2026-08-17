'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Header from './components/Header';
import RideOptions from './components/RideOptions';
import LocationInput from './components/LocationInput';
import RequestButton from './components/RequestButton';
import LocationBanner from './components/LocationBanner';
import TripTracker from './components/TripTracker';
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
    clearLocations,
  } = useRide();
  const [showRides, setShowRides] = useState(false);
  const [activeRideId, setActiveRideId] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const [requestError, setRequestError] = useState('');

  // Resume an in-progress trip on reload
  useEffect(() => {
    if (!user) return;
    fetch('/api/rides/active')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.ride) setActiveRideId(data.ride.id);
      })
      .catch(() => {});
  }, [user]);

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

  const handleRideEnded = () => {
    setActiveRideId(null);
    setShowRides(false);
    clearLocations();
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero with background photo */}
      <section className="relative">
        <img
          src="/images/hero-rider.png"
          alt="Boda boda rider at dusk"
          className="h-[340px] sm:h-[420px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/50 to-emerald-900/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-6xl font-black gradient-text max-w-2xl leading-tight">
            Go anywhere in Kenya
          </h1>
          <p className="mt-3 text-white/85 text-base sm:text-lg max-w-md font-medium">
            Boda boda rides with fair KSh fares, live tracking, and a 24/7
            emergency line.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user && !activeRideId && <LocationBanner />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 -mt-24 relative z-10">
          {/* Left Column - Booking Form or Trip Tracker */}
          <div className="space-y-6">
            {activeRideId ? (
              <TripTracker rideId={activeRideId} onEnded={handleRideEnded} />
            ) : (
              <div className="uber-card animate-slide-up !p-6 sm:!p-8">
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
            )}

            {/* Ride Options - Show after request */}
            {showRides && !activeRideId && (
              <div className="animate-slide-up">
                <RideOptions onConfirmed={setActiveRideId} />
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
