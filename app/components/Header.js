'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUser, FaBars, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import InstallBanner from './InstallBanner';
import InstallAppButton from './InstallAppButton';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight gradient-text">
              chachapride
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-gray-600 transition">
              Ride
            </Link>
            <Link href="/history" className="text-sm font-medium hover:text-gray-600 transition">
              History
            </Link>
            <Link href="/business" className="text-sm font-medium hover:text-gray-600 transition">
              Business
            </Link>
            <Link href="/install" className="text-sm font-medium hover:text-gray-600 transition">
              Install
            </Link>

            {loading ? (
              <FaSpinner className="animate-spin text-gray-400" />
            ) : user ? (
              <>
                <Link
                  href="/profile"
                  className="text-sm font-semibold text-gray-800 hover:text-gray-600 transition"
                >
                  Hi, {user.name.split(' ')[0]}
                </Link>
                <InstallAppButton />
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-sm font-medium"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-white transition bg-gradient-to-r from-blue-600 to-green-500 hover:brightness-110"
                >
                  <FaUser className="text-sm" />
                  <span className="text-sm font-medium">Sign up</span>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <FaBars className="text-xl" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-sm font-medium hover:text-gray-600">Ride</Link>
              <Link href="/history" className="text-sm font-medium hover:text-gray-600">History</Link>
              <Link href="/business" className="text-sm font-medium hover:text-gray-600">Business</Link>
              <Link href="/install" className="text-sm font-medium hover:text-gray-600">Install</Link>

              {loading ? (
                <FaSpinner className="animate-spin text-gray-400" />
              ) : user ? (
                <>
                  <span className="text-sm font-semibold text-gray-800">
                    Hi, {user.name.split(' ')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center px-4 py-2 rounded-full bg-gray-100 text-sm font-medium"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium hover:text-gray-600"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-white bg-gradient-to-r from-blue-600 to-green-500"
                  >
                    <FaUser className="text-sm" />
                    <span className="text-sm font-medium">Sign up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <InstallBanner />
    </header>
  );
}
