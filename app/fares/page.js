'use client';
import { useEffect, useState } from 'react';
import { FaSpinner, FaShieldAlt } from 'react-icons/fa';
import { fmtKsh } from '../../lib/format';

const SAMPLE_DISTANCES = ['2 km', '3 km', '5 km', '10 km'];

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
        Transparent boda-boda pricing in Kenyan Shillings — the price you see
        before you book is the price you pay.
      </p>

      <div className="uber-card p-6 mb-6 text-sm text-gray-600">
        <p className="font-semibold text-gray-800 mb-2">How fares work</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Minimum trip: <strong>KSh 50</strong> (up to 2 km)</li>
          <li>3 km trip: <strong>KSh 70</strong></li>
          <li>Beyond 3 km: <strong>KSh 30 per km</strong> (Electric Bike: KSh 25 per km)</li>
          <li>
            <strong>Night fare ×2</strong> between 10:30 PM and 4:30 AM
          </li>
        </ul>
      </div>

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
                  1 rider · helmet included
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SAMPLE_DISTANCES.map((d) => (
                  <div
                    key={d}
                    className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100"
                  >
                    <p className="text-xs text-gray-500">{d}</p>
                    <p className="text-lg font-extrabold text-gray-800 mt-1">
                      {fmtKsh(rt.sampleFares[d])}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="uber-card p-6 text-sm text-gray-600">
            <p className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
              <FaShieldAlt className="text-green-500" /> Good to know
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Final fare is calculated from the real distance of your trip.</li>
              <li>Pay online with Paystack (card or mobile money) or pay the rider in cash.</li>
              <li>Night fare ×2 applies automatically between 10:30 PM and 4:30 AM.</li>
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
