'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function PaymentCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rideId = searchParams.get('rideId');
  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const [state, setState] = useState('verifying'); // verifying | done | error

  useEffect(() => {
    if (!rideId || !reference) {
      setState('error');
      return;
    }
    fetch('/api/payments/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rideId, reference }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Payment could not be verified');
        setState('done');
        setTimeout(() => router.replace('/'), 1200);
      })
      .catch(() => {
        setState('error');
      });
  }, [rideId, reference, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="uber-card text-center py-10">
          {state === 'verifying' && (
            <>
              <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-1">Verifying your payment...</h1>
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
              <h1 className="text-2xl font-bold mb-2">We could not verify your payment</h1>
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

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PaymentCallback />
    </Suspense>
  );
}
