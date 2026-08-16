'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { FaSpinner, FaCar, FaHistory } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const RIDE_ICONS = { uberx: '🚗', uberxl: '🚐', comfort: '🛻', green: '🌿' };

export default function HistoryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [rides, setRides] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    fetch('/api/rides')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load rides');
        const data = await res.json();
        setRides(data.rides);
      })
      .catch((err) => setError(err.message));
  }, [authLoading, user, router]);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <FaHistory className="text-2xl text-gray-500" />
          <h1 className="text-3xl font-extrabold">My rides</h1>
        </div>

        {authLoading || rides === null ? (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <FaSpinner className="animate-spin mr-2" />
            Loading...
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        ) : rides.length === 0 ? (
          <div className="uber-card text-center py-12">
            <FaCar className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No rides yet. Book your first ride!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <div key={ride.id} className="uber-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{RIDE_ICONS[ride.ride_type] || '🚗'}</span>
                    <div>
                      <p className="font-bold text-lg">{ride.ride_type}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(ride.created_at).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${Number(ride.price).toFixed(2)}</p>
                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full capitalize">
                      {ride.status}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 space-y-1">
                  <p>📍 {ride.pickup}</p>
                  <p>🏁 {ride.destination}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
