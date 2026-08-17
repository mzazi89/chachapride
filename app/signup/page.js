'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });
      let data = {};
      try {
        data = await res.json();
      } catch {
        // non-JSON response (e.g. proxy error page)
      }
      if (!res.ok) {
        setError(data.error || `Request failed (HTTP ${res.status})`);
        return;
      }
      await refresh();
      router.push('/');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block w-1/2 relative">
        <img
          src="/images/hero-rider.png"
          alt="Boda boda ride"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/80 via-blue-900/40 to-emerald-900/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <h2 className="text-4xl font-black gradient-text mb-2">chachapride</h2>
          <p className="text-white/85 max-w-sm">
            Join thousands riding safely across Kenya.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6 text-center">
            <h2 className="text-3xl font-black gradient-text">chachapride</h2>
          </div>
          <div className="uber-card">
          <h1 className="text-3xl font-extrabold mb-1">Create your account</h1>
          <p className="text-gray-500 mb-6">Sign up to start riding with chachapride</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500">
              <FaUser className="text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
                minLength={2}
                className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
              />
            </div>

            <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500">
              <FaEnvelope className="text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
              />
            </div>

            <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500">
              <FaLock className="text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 8 characters)"
                required
                minLength={8}
                className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
              />
            </div>

            <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500">
              <FaPhone className="text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number (drivers call this)"
                required
                pattern="[0-9+()\-\s]{7,}"
                title="Enter a valid phone number"
                className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="uber-button flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                'Sign up'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-black hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
