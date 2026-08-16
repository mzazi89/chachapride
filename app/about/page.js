import Link from 'next/link';

export const metadata = {
  title: 'About us | chachapride',
  description: 'Who we are — safe, affordable ride-hailing across Kenya',
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="uber-card">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">About chachapride</h1>
        <p className="text-gray-500 mb-8">
          Safe, affordable rides for Kenya — from Ongata Rongai to everywhere.
        </p>

        <div className="prose-sm space-y-5 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Our story</h2>
            <p>
              chachapride started with a simple frustration: getting a safe,
              fairly-priced ride should not be a gamble. We built a platform
              where riders see the fare before they book, pay securely by card,
              and track their driver in real time — while drivers earn
              transparently, matched automatically to the nearest request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-2">How it works</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Enter your pickup and destination — the fare is quoted instantly.</li>
              <li>Pay securely with your card (powered by Stripe).</li>
              <li>The nearest available driver is matched to you automatically.</li>
              <li>Follow your driver live on the map until you arrive.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Safety first</h2>
            <p>
              Every trip is tracked live. Every driver is vetted and approved by
              our team before they can accept rides, and our 24/7 emergency line
              is one tap away on every screen:{' '}
              <a href="tel:+254741388986" className="font-semibold text-black hover:underline">
                +254 741 388 986
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Questions?</h2>
            <p>
              Reach us at{' '}
              <a href="mailto:chachapride@gmail.com" className="font-semibold text-black hover:underline">
                chachapride@gmail.com
              </a>{' '}
              or visit our{' '}
              <Link href="/contact" className="font-semibold text-black hover:underline">
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
