'use client';
import { useState } from 'react';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaSpinner,
  FaCheckCircle,
} from 'react-icons/fa';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not send your message');
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Contact us</h1>
      <p className="text-gray-500 mb-8">
        We&apos;re here to help — day or night.
      </p>

      {/* Contact cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <a
          href="tel:+254741388986"
          className="uber-card p-6 hover:shadow-xl transition text-center"
        >
          <FaPhoneAlt className="text-3xl text-red-500 mx-auto mb-3" />
          <h2 className="font-bold text-gray-800">Emergency</h2>
          <p className="text-sm text-gray-500 mt-1">+254 741 388 986</p>
          <p className="text-xs text-gray-400 mt-2">24/7 rider & driver safety line</p>
        </a>

        <a
          href="mailto:chachapride@gmail.com"
          className="uber-card p-6 hover:shadow-xl transition text-center"
        >
          <FaEnvelope className="text-3xl text-blue-500 mx-auto mb-3" />
          <h2 className="font-bold text-gray-800">Email</h2>
          <p className="text-sm text-gray-500 mt-1 break-all">chachapride@gmail.com</p>
          <p className="text-xs text-gray-400 mt-2">Support, partnerships & feedback</p>
        </a>

        <div className="uber-card p-6 text-center">
          <FaMapMarkerAlt className="text-3xl text-green-500 mx-auto mb-3" />
          <h2 className="font-bold text-gray-800">Head office</h2>
          <p className="text-sm text-gray-500 mt-1">Ongata Rongai, Kajiado County</p>
          <p className="text-xs text-gray-400 mt-2">Kenya</p>
        </div>
      </div>

      {/* Message form */}
      <div className="uber-card">
        <h2 className="text-xl font-bold mb-4">Send us a message</h2>

        {sent ? (
          <div className="text-center py-8">
            <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-1">Message sent!</h3>
            <p className="text-gray-500">
              Thank you, {form.name.split(' ')[0]}. We&apos;ll get back to you at{' '}
              {form.email}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-black">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  required
                  minLength={2}
                  className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
              <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-black">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Your email"
                  required
                  className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="How can we help?"
              required
              minLength={10}
              rows={5}
              className="w-full bg-gray-100 rounded-xl p-4 outline-none text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-black resize-none"
            />

            <button
              type="submit"
              disabled={sending}
              className="uber-button flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <FaSpinner className="animate-spin" /> Sending...
                </>
              ) : (
                'Send message'
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
