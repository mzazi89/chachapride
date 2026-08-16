import Link from 'next/link';

export const metadata = {
  title: 'Help & FAQ | chachapride',
  description: 'Answers to common questions about booking, paying, and riding',
};

const FAQS = [
  {
    q: 'How do I book a ride?',
    a: 'Enter your pickup and destination, choose a ride type, pay securely with your card, and the nearest available driver is matched to you automatically. You can follow your driver live on the map.',
  },
  {
    q: 'How is the fare calculated?',
    a: 'Fares are a base amount plus a per-kilometre rate for your ride type, calculated from the actual distance of your trip. The price is shown before you book and does not change.',
  },
  {
    q: 'Can I cancel a ride?',
    a: 'Yes — you can cancel any time before a driver is assigned at no charge. Once your driver is on the way, cancellations are at the driver\'s discretion.',
  },
  {
    q: 'How do I pay?',
    a: 'Pay by card through Stripe — we never see or store your card number. No cash needed.',
  },
  {
    q: 'Where is my driver?',
    a: 'Once matched, your trip screen shows your driver\'s live position and estimated arrival time. Make sure location is enabled so your pickup is set accurately.',
  },
  {
    q: 'How do I become a driver?',
    a: 'Great question! See our Drive with us page — sign up with your vehicle details and our team approves your account before you can accept rides.',
  },
  {
    q: 'Something went wrong with my trip.',
    a: 'Email us at chachapride@gmail.com with the trip details and we\'ll sort it out. For emergencies, call +254 741 388 986 immediately.',
  },
];

export default function HelpPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="uber-card">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Help & FAQ</h1>
        <p className="text-gray-500 mb-8">
          Quick answers. Need more?{' '}
          <Link href="/contact" className="font-semibold text-black hover:underline">
            Contact us
          </Link>
          .
        </p>

        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <details
              key={i}
              className="group border border-gray-100 rounded-2xl p-4 open:bg-gray-50 transition"
            >
              <summary className="cursor-pointer font-semibold text-gray-800 flex items-center justify-between list-none">
                {f.q}
                <span className="text-gray-400 group-open:rotate-45 transition-transform text-lg">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-8 bg-gray-50 rounded-2xl p-5 text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p>
            <span className="font-bold text-gray-800">Emergency?</span> Call our
            24/7 safety line.
          </p>
          <a
            href="tel:+254741388986"
            className="px-5 py-2.5 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition text-center"
          >
            +254 741 388 986
          </a>
        </div>
      </div>
    </main>
  );
}
