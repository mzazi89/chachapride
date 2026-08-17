'use client';
import { useEffect, useState } from 'react';
import { FaSpinner, FaCreditCard, FaTimesCircle, FaMoneyBillWave } from 'react-icons/fa';
import RideCard from './RideCard';
import { useRide } from '../context/RideContext';
import { fmtKsh } from '../../lib/format';

export default function RideOptions({ onConfirmed }) {
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
  const [pendingRide, setPendingRide] = useState(null);
  const [payMethod, setPayMethod] = useState('online');
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');
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
          paymentMethod: payMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to confirm ride');
      if (data.ride.payment_method === 'cash') {
        // Cash ride is live immediately — go straight to the trip tracker
        onConfirmed(data.ride.id);
      } else {
        setPendingRide(data.ride);
      }
    } catch (err) {
      setConfirmError(err.message);
    } finally {
      setConfirming(false);
    }
  };

  const handlePay = async () => {
    setPaying(true);
    setPayError('');
    try {
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideId: pendingRide.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not start payment');
      window.location.href = data.url;
    } catch (err) {
      setPayError(err.message);
      setPaying(false);
    }
  };

  const handleCancel = async () => {
    setConfirming(true);
    try {
      await fetch(`/api/rides/${pendingRide.id}/cancel`, { method: 'POST' });
      setPendingRide(null);
      setSelectedRide(null);
    } catch {
      // ignore — refresh clears it
    } finally {
      setConfirming(false);
    }
  };

  // Payment step — shown after confirming the ride type
  if (pendingRide) {
    const ride = rideTypes.find((r) => r.id === selectedRide);
    return (
      <div className="uber-card">
        <div className="flex items-center gap-3 mb-4">
          <FaCreditCard className="text-2xl text-gray-700" />
          <div>
            <h3 className="text-xl font-bold">Confirm payment</h3>
            <p className="text-sm text-gray-500">
              {ride?.type || pendingRide.ride_type} · {pendingRide.pickup} → {pendingRide.destination}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4 flex items-center justify-between">
          <span className="text-gray-600 font-medium">Fare</span>
          <span className="text-2xl font-extrabold">{fmtKsh(pendingRide.price)}</span>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          You will be redirected to a secure Paystack checkout (card or mobile
          money). Your ride is dispatched the moment payment succeeds.
        </p>

        {payError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {payError}
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={paying}
          className="uber-button flex items-center justify-center gap-2"
        >
          {paying ? (
            <>
              <FaSpinner className="animate-spin" /> Opening Paystack...
            </>
          ) : (
            <>
              <FaCreditCard /> Pay {fmtKsh(pendingRide.price)}
            </>
          )}
        </button>

        <button
          onClick={handleCancel}
          disabled={paying}
          className="mt-3 w-full py-3 rounded-full border-2 border-gray-200 text-gray-500 font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <FaTimesCircle /> Cancel ride
        </button>
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
        <>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => setPayMethod('online')}
              className={`py-3 rounded-2xl border-2 text-sm font-semibold flex items-center justify-center gap-2 transition ${
                payMethod === 'online'
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <FaCreditCard /> Pay online
            </button>
            <button
              onClick={() => setPayMethod('cash')}
              className={`py-3 rounded-2xl border-2 text-sm font-semibold flex items-center justify-center gap-2 transition ${
                payMethod === 'cash'
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <FaMoneyBillWave /> Pay cash
            </button>
          </div>
          {payMethod === 'cash' && (
            <p className="mt-2 text-xs text-gray-400 text-center">
              Pay the rider in cash. A commission deposit will be tracked on
              the rider&apos;s account.
            </p>
          )}
          <p className="mt-2 text-xs text-amber-600 text-center">
            Fares ×2 between 10:30 PM and 4:30 AM
          </p>

          <button
            onClick={handleConfirm}
            disabled={confirming}
            className="uber-button mt-4 flex items-center justify-center gap-2"
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
        </>
      )}
    </div>
  );
}
