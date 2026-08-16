'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rideId = searchParams.get('rideId');
  const sessionId = searchParams.get('session_id');
  const [state, setState] = useState('confirming'); // confirming | done | error

  useEffect(() => {
    if (!rideId || !sessionId) {
      setState('error');
      return;
    }
    fetch('/api/payments/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rideId, sessionId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Payment could not be confirmed');
        setState('done');
        setTimeout(() => router.replace('/'), 1200);
      })
      .catch((err) => {
        setState('error');
      });
  }, [rideId, sessionId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="uber-card text-center py-10">
          {state === 'confirming' && (
            <>
              <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-1">Confirming your payment...</h1>
              <p className="text-gray-500">We are dispatching your driver.</p>
            </>
          )}
          {state === 'done' && (
            <>
              <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-1">Payment successful!</h1>
              <p className="text-gray-500">Taking you to your ride...</p>
            </>
          )}
          {state === 'error' && (
            <>
              <FaTimesCircle className="text-5xl text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">We could not confirm your payment</h1>
              <p className="text-gray-500 mb-6">
                Your payment may still have succeeded — check your ride status.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition"
              >
                Back to home
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PaymentSuccess />
    </Suspense>
  );
}
