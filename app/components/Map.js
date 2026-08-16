'use client';
import { useEffect, useRef, useState } from 'react';
import { FaSearch, FaCrosshairs } from 'react-icons/fa';

export default function Map() {
  const mapContainer = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-full w-full">
      {isLoading ? (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading map...</p>
          </div>
        </div>
      ) : (
        <div className="h-full w-full bg-gray-200 relative">
          {/* Map placeholder with styling */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-gray-600 font-medium">Map View</p>
              <p className="text-sm text-gray-400">Connected to mapping service</p>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <button className="bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition">
              <FaCrosshairs className="text-gray-700" />
            </button>
            <button className="bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition">
              <FaSearch className="text-gray-700" />
            </button>
          </div>

          {/* Location indicator */}
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Your location is set</span>
              <span className="text-gray-400 text-xs ml-auto">Updated just now</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
