export const metadata = {
  title: 'Safety | chachapride',
  description: 'How chachapride keeps riders and drivers safe on every trip',
};

export default function SafetyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="uber-card">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Safety</h1>
        <p className="text-gray-500 mb-8">
          Your safety drives everything we build.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <h2 className="font-bold text-red-700 mb-1">🚨 Emergency</h2>
            <p className="text-sm text-red-600">
              Call our 24/7 safety line any time:
              <br />
              <a href="tel:+254741388986" className="font-extrabold text-lg hover:underline">
                +254 741 388 986
              </a>
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <h2 className="font-bold text-blue-700 mb-1">📍 Live tracking</h2>
            <p className="text-sm text-blue-600">
              Every trip is tracked in real time. Your driver&apos;s location is
              visible to you — and to our team — for the whole journey.
            </p>
          </div>
        </div>

        <div className="space-y-5 text-gray-600 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Vetted drivers</h2>
            <p>
              Every driver is individually reviewed and approved by our team —
              licence, vehicle, and identity checks — before they can accept a
              single ride. We track vehicle details and plates on every trip.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Safe payment</h2>
            <p>
              Fares are paid securely by card through Stripe before you ride.
              No cash, no haggling — the price you see is the price you pay.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Rider tips</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Confirm the plate number matches your app before getting in.</li>
              <li>Share your trip with someone you trust.</li>
              <li>Wear your seatbelt and keep your phone charged.</li>
              <li>If anything feels wrong, call our emergency line immediately.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Report a problem</h2>
            <p>
              Issues or feedback? Email{' '}
              <a href="mailto:chachapride@gmail.com" className="font-semibold text-black hover:underline">
                chachapride@gmail.com
              </a>{' '}
              — we respond to every report.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
