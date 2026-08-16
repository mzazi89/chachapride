export const metadata = {
  title: 'Drive with us | chachapride',
  description: 'Earn on your own schedule as a chachapride driver in Kenya',
};

export default function DriveWithUsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="uber-card">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
          Drive with chachapride
        </h1>
        <p className="text-gray-500 mb-8">
          Be your own boss. Earn on your schedule with a fair, transparent
          platform.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 rounded-2xl p-5 text-center">
            <p className="text-3xl mb-2">💸</p>
            <h2 className="font-bold text-gray-800">Earn what you drive</h2>
            <p className="text-sm text-gray-600 mt-1">
              Transparent fares — you see the trip before you take it.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-5 text-center">
            <p className="text-3xl mb-2">🕐</p>
            <h2 className="font-bold text-gray-800">Your schedule</h2>
            <p className="text-sm text-gray-600 mt-1">
              Go online whenever you want. No shifts, no quotas.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-5 text-center">
            <p className="text-3xl mb-2">🛡️</p>
            <h2 className="font-bold text-gray-800">Matched, not hunted</h2>
            <p className="text-sm text-gray-600 mt-1">
              The nearest ride finds you — no racing to hotspots.
            </p>
          </div>
        </div>

        <div className="space-y-5 text-sm text-gray-600 leading-relaxed mb-8">
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">What you need</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>A valid driving licence and a roadworthy vehicle</li>
              <li>A smartphone with GPS and mobile data</li>
              <li>Phone number for riders to reach you</li>
              <li>Our team will review and approve your profile</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">How to start</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Sign up on the driver portal with your vehicle details</li>
              <li>We approve your profile (usually within a day)</li>
              <li>Go online — ride requests find you automatically</li>
            </ol>
          </section>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Ready to drive?</h2>
          <p className="text-gray-400 text-sm mb-5">
            Questions first? We&apos;d love to hear from you.
          </p>
          <a
            href="mailto:chachapride@gmail.com?subject=I%20want%20to%20drive"
            className="inline-block px-8 py-3 rounded-full bg-white text-gray-900 font-bold hover:bg-gray-200 transition"
          >
            Email chachapride@gmail.com
          </a>
        </div>
      </div>
    </main>
  );
}
