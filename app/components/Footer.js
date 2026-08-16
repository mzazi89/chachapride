import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-black text-white mb-2">chachapride</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Safe, affordable ride-hailing across Kenya — book, pay, and track
              your driver in real time.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:+254741388986" className="hover:text-white transition">
                  🚨 Emergency: +254 741 388 986
                </a>
              </li>
              <li>
                <a
                  href="mailto:chachapride@gmail.com"
                  className="hover:text-white transition"
                >
                  chachapride@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} chachapride. All rights reserved.</p>
          <p>
            Ride safely · Ongata Rongai, Kenya
          </p>
        </div>
      </div>
    </footer>
  );
}
