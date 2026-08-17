'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSpinner,
  FaSave,
  FaCar,
  FaDollarSign,
  FaSignOutAlt,
  FaHistory,
} from 'react-icons/fa';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { fmtKsh } from '../../lib/format';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, refresh, logout } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rides, setRides] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    setName(user.name || '');
    setPhone(user.phone || '');
    fetch('/api/rides')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setRides(data?.rides || []))
      .catch(() => setRides([]));
  }, [loading, user, router]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save changes');
      await refresh();
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const totalSpent = (rides || []).reduce(
    (sum, r) => sum + (r.status === 'completed' ? Number(r.price) : 0),
    0
  );

  if (loading || rides === null) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-16 flex items-center justify-center text-gray-500">
          <FaSpinner className="animate-spin mr-2" /> Loading...
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold mb-6">My profile</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="uber-card p-5 flex items-center gap-3">
            <FaCar className="text-2xl text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Rides</p>
              <p className="text-2xl font-extrabold">{rides.length}</p>
            </div>
          </div>
          <div className="uber-card p-5 flex items-center gap-3">
            <FaDollarSign className="text-2xl text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Total spent</p>
              <p className="text-2xl font-extrabold">{fmtKsh(totalSpent)}</p>
            </div>
          </div>
          <div className="uber-card p-5 flex items-center gap-3">
            <FaUser className="text-2xl text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Member since</p>
              <p className="text-sm font-bold text-gray-700 mt-1">
                {new Date(user.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="uber-card">
          <h2 className="text-xl font-bold mb-4">Account details</h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}
          {saved && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
              Saved successfully.
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500">
              <FaUser className="text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
                minLength={2}
                className="bg-transparent w-full outline-none text-gray-700"
              />
            </div>

            <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-4">
              <FaEnvelope className="text-gray-400" />
              <input
                type="email"
                value={user.email}
                disabled
                className="bg-transparent w-full outline-none text-gray-400"
              />
            </div>

            <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500">
              <FaPhone className="text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number (optional)"
                className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="uber-button flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save changes
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
            <Link
              href="/history"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-gray-100 font-semibold hover:bg-gray-200 transition"
            >
              <FaHistory /> View ride history
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full border-2 border-red-100 text-red-600 font-semibold hover:bg-red-50 transition"
            >
              <FaSignOutAlt /> Log out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
