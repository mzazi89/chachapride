'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FaSpinner, FaCarSide, FaTimesCircle, FaCheckCircle, FaPhone } from 'react-icons/fa';
import { fmtKsh } from '../../lib/format';

const Map = dynamic(() => import('./Map'), { ssr: false });

const POLL_MS = 4000;

const STATUS_TEXT = {
  payment_pending: 'Payment required to start your ride',
  requested: 'Finding your driver...',
  accepted: 'Driver on the way to pick you up',
  en_route: 'You are on your way!',
  completed: 'Trip complete',
  cancelled: 'Ride cancelled',
};

export default function TripTracker({ rideId, onEnded }) {
  const [track, setTrack] = useState(null);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [paying, setPaying] = useState(false);

  const fetchTrack = async (silent = false) => {
    try {
      const res = await fetch(`/api/rides/${rideId}/track`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load trip');
      setTrack(data);
      if (data.status === 'completed' || data.status === 'cancelled') {
        // stop polling — terminal state
        return false;
      }
      return true;
    } catch (err) {
      if (!silent) setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    let active = true;
    let interval = null;

    const poll = async () => {
      const cont = await fetchTrack(true);
      if (active && cont) {
        interval = setTimeout(poll, POLL_MS);
      }
    };
    poll();

    return () => {
      active = false;
      if (interval) clearTimeout(interval);
    };
  }, [rideId]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await fetch(`/api/rides/${rideId}/cancel`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel');
      setTrack({ ...track, status: 'cancelled' });
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  const handlePay = async () => {
    setPaying(true);
    setError('');
    try {
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not start payment');
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setPaying(false);
    }
  };

  if (!track) {
    return (
      <div className="uber-card flex items-center justify-center gap-2 py-10 text-gray-500">
        <FaSpinner className="animate-spin" /> Loading your trip...
      </div>
    );
  }

  const isTerminal = track.status === 'completed' || track.status === 'cancelled';

  return (
    <div className="space-y-4">
      <div className="uber-card p-6">
        <div className="flex items-center gap-3 mb-4">
          {track.status === 'requested' ? (
            <FaSpinner className="animate-spin text-2xl text-violet-500" />
          ) : track.status === 'completed' ? (
            <FaCheckCircle className="text-2xl text-green-500" />
          ) : (
            <FaCarSide className="text-2xl text-green-600" />
          )}
          <div>
            <h3 className="text-xl font-bold">{STATUS_TEXT[track.status] || track.status}</h3>
            <p className="text-sm text-gray-500">
              {track.pickup} → {track.destination}
            </p>
          </div>
        </div>

        {track.etaMinutes && (track.status === 'accepted' || track.status === 'en_route') && (
          <p className="text-sm font-medium text-blue-600 mb-3">
            Driver arrives in ~{track.etaMinutes} min
          </p>
        )}

        {track.status === 'payment_pending' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-amber-800 mb-3">
              Your ride is reserved but not yet paid. Complete payment to dispatch your driver.
            </p>
            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full py-3 rounded-full text-white font-semibold transition bg-gradient-to-r from-blue-600 to-green-500 hover:brightness-110 flex items-center justify-center gap-2"
            >
              {paying ? (
                <>
                  <FaSpinner className="animate-spin" /> Opening checkout...
                </>
              ) : (
                <>{fmtKsh(track.price)}</>
              )}
            </button>
          </div>
        )}

        {track.driver && (
          <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 mb-4">
            <div className="w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-lg bg-gradient-to-br from-blue-600 to-green-500">
              {track.driver.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-bold">{track.driver.name}</p>
              <p className="text-sm text-gray-500">
                {track.driver.vehicle_model} · {track.driver.plate_number}
              </p>
              {track.driver.phone && (
                <a
                  href={`tel:${track.driver.phone}`}
                  className="inline-flex items-center gap-1.5 mt-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  <FaPhone className="text-xs" /> {track.driver.phone}
                </a>
              )}
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-gray-700">{fmtKsh(track.price)}</span>
            </div>
          </div>
        )}

        {(track.status === 'payment_pending' || track.status === 'requested') && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full py-3 rounded-full border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2"
          >
            <FaTimesCircle /> {cancelling ? 'Cancelling...' : 'Cancel ride'}
          </button>
        )}

        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
            {error}
          </p>
        )}
      </div>

      {!isTerminal && (
        <div className="uber-card p-0 overflow-hidden h-72 sm:h-96">
          <Map
            pickupCoords={track.pickupCoords}
            destinationCoords={track.destinationCoords}
            driverLocation={track.driverLocation}
            interactive={false}
          />
        </div>
      )}

      {isTerminal && (
        <div className="uber-card p-6 text-center">
          {track.status === 'completed' ? (
            <>
              <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-1">Trip complete</h3>
              <p className="text-gray-500 mb-4">
                {track.ride_type} · {fmtKsh(track.price)}
              </p>
            </>
          ) : (
            <>
              <FaTimesCircle className="text-5xl text-red-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-4">Ride cancelled</h3>
            </>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onEnded}
              className="px-6 py-3 rounded-full text-white font-semibold transition bg-gradient-to-r from-blue-600 to-green-500 hover:brightness-110"
            >
              Book another ride
            </button>
            <Link
              href="/history"
              className="px-6 py-3 rounded-full bg-gray-100 font-semibold hover:bg-gray-200 transition"
            >
              View history
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
