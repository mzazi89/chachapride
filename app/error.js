'use client';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function Error({ reset }) {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="uber-card text-center py-12">
        <FaExclamationTriangle className="text-6xl text-amber-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-gray-500 mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-8 py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
