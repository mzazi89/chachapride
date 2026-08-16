import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="uber-card text-center py-12">
        <FaMapMarkerAlt className="text-6xl text-gray-300 mx-auto mb-4" />
        <h1 className="text-6xl font-black text-gray-200 mb-2">404</h1>
        <h2 className="text-2xl font-bold mb-2">Page not found</h2>
        <p className="text-gray-500 mb-6">
          This route doesn&apos;t exist — let&apos;s get you back on the road.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
