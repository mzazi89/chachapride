// Paystack API helper (server-side). Paystack amounts are in the currency's
// smallest unit (e.g. kobo/cents), so prices are multiplied by 100.
export function getPaystackKey() {
  return process.env.PAYSTACK_SECRET_KEY || null;
}

export function getPaystackCurrency() {
  return process.env.PAYSTACK_CURRENCY || 'KES';
}

export async function paystackRequest(path, options = {}) {
  const key = getPaystackKey();
  if (!key) return { status: false, error: 'PAYSTACK_NOT_CONFIGURED' };

  const res = await fetch(`https://api.paystack.co${path}`, {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  return res.json();
}
