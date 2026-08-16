'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa';
import RideCard from './RideCard';
import { useRide } from '../context/RideContext';

export default function RideOptions() {
  const {
    pickup,
    destination,
    pickupCoords,
    destinationCoords,
    selectedRide,
    setSelectedRide,
  } = useRide();

  const [rideTypes, setRideTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [confirmedRide, setConfirmedRide] = useState(null);
  const [confirmError, setConfirmError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (pickupCoords) {
      params.set('fromLat', pickupCoords.lat);
      params.set('fromLng', pickupCoords.lng);
    }
    if (destinationCoords) {
      params.set('toLat', destinationCoords.lat);
      params.set('toLng', destinationCoords.lng);
    }

    fetch(`/api/rides?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load ride options');
        const data = await res.json();
        if (!cancelled) {
          setRideTypes(data.rideTypes);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [pickupCoords, destinationCoords]);

  const handleConfirm = async () => {
    setConfirming(true);
    setConfirmError('');
    try {
      const res = await fetch('/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup,
          destination,
          pickupLat: pickupCoords?.lat ?? null,
          pickupLng: pickupCoords?.lng ?? null,
          destinationLat: destinationCoords?.lat ?? null,
          destinationLng: destinationCoords?.lng ?? null,
          rideType: selectedRide,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to confirm ride');
      setConfirmedRide(data.ride);
    } catch (err) {
      setConfirmError(err.message);
    } finally {
      setConfirming(false);
    }
  };

  if (confirmedRide) {
    return (
      <div className="uber-card">
        <div className="text-center py-6">
          <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-1">Ride confirmed!</h3>
          <p className="text-gray-500 mb-4">
            {confirmedRide.ride_type} · ${Number(confirmedRide.price).toFixed(2)}
          </p>
          <p className="text-sm text-gray-400 mb-6">
            {confirmedRide.pickup} → {confirmedRide.destination}
          </p>
          <Link
            href="/history"
            className="inline-block px-6 py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition"
          >
            View my rides
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="uber-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Available rides</h3>
        {!loading && (
          <span className="text-sm text-gray-500">{rideTypes.length} options</span>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8 text-gray-500">
          <FaSpinner className="animate-spin mr-2" />
          Loading real-time prices...
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-3">
          {rideTypes.map((ride) => (
            <RideCard
              key={ride.id}
              ride={{
                ...ride,
                time: Math.max(1, Math.round((ride.price / 4) * 10) / 10),
              }}
              selected={selectedRide === ride.id}
              onSelect={() => setSelectedRide(ride.id)}
            />
          ))}
        </div>
      )}

      {confirmError && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {confirmError}
        </div>
      )}

      {selectedRide && !loading && !error && (
        <button
          onClick={handleConfirm}
          disabled={confirming}
          className="uber-button mt-6 flex items-center justify-center gap-2"
        >
          {confirming ? (
            <>
              <FaSpinner className="animate-spin" />
              Confirming...
            </>
          ) : (
            `Confirm ${rideTypes.find((r) => r.id === selectedRide)?.type}`
          )}
        </button>
      )}
    </div>
  );
}
