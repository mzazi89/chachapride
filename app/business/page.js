import Link from 'next/link';

export const metadata = {
  title: 'Business | chachapride',
  description: 'Corporate ride management for Kenyan businesses',
};

export default function BusinessPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="uber-card">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
          chachapride for Business
        </h1>
        <p className="text-gray-500 mb-8">
          Reliable rides for your team, your clients, and your operations —
          with central billing and full visibility.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 rounded-2xl p-5">
            <h2 className="font-bold text-gray-800 mb-1">🚗 Team mobility</h2>
            <p className="text-sm text-gray-600">
              On-demand rides for employees — approved drivers, live tracking,
              and a single account for your whole team.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-5">
            <h2 className="font-bold text-gray-800 mb-1">🧾 Clear billing</h2>
            <p className="text-sm text-gray-600">
              Every trip itemised by date, rider, route and fare. Easy
              reconciliation for your finance team.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-5">
            <h2 className="font-bold text-gray-800 mb-1">📊 Full oversight</h2>
            <p className="text-sm text-gray-600">
              The owner dashboard shows every ride, live trips, driver
              performance and revenue — all in real time.
            </p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Let&apos;s set up your account</h2>
          <p className="text-gray-400 text-sm mb-5">
            Tell us about your team and we&apos;ll handle the rest.
          </p>
          <a
            href="mailto:chachapride@gmail.com?subject=Business%20account"
            className="inline-block px-8 py-3 rounded-full bg-white text-gray-900 font-bold hover:bg-gray-200 transition"
          >
            Email chachapride@gmail.com
          </a>
        </div>

        <p className="mt-6 text-sm text-gray-500 text-center">
          Already a customer? Visit the{' '}
          <Link href="/help" className="font-semibold text-black hover:underline">
            help centre
          </Link>{' '}
          or{' '}
          <Link href="/contact" className="font-semibold text-black hover:underline">
            contact us
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
