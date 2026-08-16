export const metadata = {
  title: 'Privacy policy | chachapride',
  description: 'How chachapride collects, uses and protects your data',
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="uber-card">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Privacy policy</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: August 2026</p>

        <div className="space-y-6 text-gray-600 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">1. What we collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Account data:</strong> name, email, phone number, and
                password (stored only as a secure hash).
              </li>
              <li>
                <strong>Location data:</strong> your GPS position, only while you
                use the app, to set pickups, match drivers, and track trips.
              </li>
              <li>
                <strong>Trip data:</strong> pickup, destination, route, fare, and
                ride history.
              </li>
              <li>
                <strong>Payment data:</strong> card payments are processed by
                Stripe; we never store your card number.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">2. How we use it</h2>
            <p>
              To provide the service (booking, dispatch, tracking, history), to
              keep you safe (live trip monitoring, emergency support), to process
              payments, and to improve the platform. We do not sell your personal
              data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">3. Location</h2>
            <p>
              Location is only shared while a trip is active — your driver sees
              your pickup point, and you see your driver&apos;s live position
              until the trip ends. You can revoke location permission in your
              browser or device settings at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">4. Payment security</h2>
            <p>
              Payments are handled by Stripe, a PCI-DSS compliant payment
              processor. We never see or store your full card details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">5. Sharing</h2>
            <p>
              We share only what is necessary: trip details between riders and
              their matched driver, and payment data with Stripe. We may disclose
              data where required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">6. Your rights</h2>
            <p>
              You can request access to, correction of, or deletion of your data
              at any time by emailing{' '}
              <a href="mailto:chachapride@gmail.com" className="font-semibold text-black hover:underline">
                chachapride@gmail.com
              </a>
              . Deleting your account removes your personal data from our systems.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">7. Contact</h2>
            <p>
              Privacy questions: chachapride@gmail.com · Emergency:{' '}
              <a href="tel:+254741388986" className="font-semibold text-black hover:underline">
                +254 741 388 986
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
