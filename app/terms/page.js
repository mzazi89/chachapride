export const metadata = {
  title: 'Terms of service | chachapride',
  description: 'The terms that govern your use of chachapride',
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="uber-card">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Terms of service</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: August 2026</p>

        <div className="space-y-6 text-gray-600 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">1. The service</h2>
            <p>
              chachapride is a ride-hailing platform connecting riders with
              vetted drivers in Kenya. We provide the technology; drivers
              provide transportation services as independent providers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">2. Accounts</h2>
            <p>
              You must provide accurate information when creating an account and
              keep your login credentials secure. You are responsible for all
              activity under your account. Rider accounts are for individuals;
              driver accounts require our approval before driving.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">3. Booking and payment</h2>
            <p>
              Fares are quoted before booking and are based on the selected ride
              type and distance. Payment is collected securely by card through
              Stripe before a driver is dispatched. A ride may be cancelled free
              of charge until a driver is assigned; once a driver is on the way,
              cancellations are at the driver&apos;s discretion.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">4. Driver conduct</h2>
            <p>
              Drivers must hold a valid licence, maintain their vehicle, and
              behave professionally at all times. Drivers found to be unsafe,
              dishonest, or abusive may have their access revoked permanently.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">5. Safety</h2>
            <p>
              While we take safety seriously, rides involve risk. Drivers must
              obey traffic laws, and riders should wear seatbelts and behave
              responsibly. In an emergency, call our 24/7 line at{' '}
              <a href="tel:+254741388986" className="font-semibold text-black hover:underline">
                +254 741 388 986
              </a>{' '}
              or local emergency services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">6. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, chachapride is not liable
              for indirect or consequential damages arising from use of the
              service. Nothing in these terms limits liability that cannot be
              limited by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">7. Changes</h2>
            <p>
              We may update these terms from time to time. Continued use of the
              service after changes take effect constitutes acceptance of the
              updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">8. Contact</h2>
            <p>
              Questions about these terms? Email{' '}
              <a href="mailto:chachapride@gmail.com" className="font-semibold text-black hover:underline">
                chachapride@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
