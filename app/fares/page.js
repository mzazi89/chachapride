'use client';
import { useEffect, useState } from 'react';
import { FaSpinner, FaDollarSign } from 'react-icons/fa';

const SAMPLE_DISTANCES = ['5 km', '10 km', '20 km'];

export default function FaresPage() {
  const [rideTypes, setRideTypes] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/ride-types')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load fares');
        const data = await res.json();
        setRideTypes(data.rideTypes);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Fares</h1>
      <p className="text-gray-500 mb-8">
        Transparent pricing — what you see before you book is what you pay.
        Fares are base + per-kilometre, quoted for the exact trip distance.
      </p>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm mb-6">
          {error}
        </div>
      )}

      {!rideTypes ? (
        <div className="flex items-center justify-center py-16 text-gray-500">
          <FaSpinner className="animate-spin mr-2" /> Loading fares...
        </div>
      ) : (
        <div className="space-y-4">
          {rideTypes.map((rt) => (
            <div key={rt.id} className="uber-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{rt.icon}</span>
                  <div>
                    <h2 className="text-lg font-bold">{rt.type}</h2>
                    <p className="text-sm text-gray-500">{rt.description}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-400">
                  up to {rt.capacity} seats
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {SAMPLE_DISTANCES.map((d) => (
                  <div
                    key={d}
                    className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100"
                  >
                    <p className="text-xs text-gray-500">{d}</p>
                    <p className="text-lg font-extrabold text-gray-800 mt-1">
                      ${rt.sampleFares[d].toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="uber-card p-6 text-sm text-gray-600">
            <p className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
              <FaDollarSign className="text-green-500" /> Good to know
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Final fare is calculated from the real distance of your trip.</li>
              <li>No cash needed — pay securely by card (Stripe).</li>
              <li>Prices may vary slightly with traffic and route.</li>
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
