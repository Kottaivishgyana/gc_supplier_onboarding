import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const SUREPASS_BASE_URL = (process.env.VITE_SUREPASS_BASE_URL || '').replace(/\/+$/, '');
  const SUREPASS_AUTH_TOKEN = process.env.VITE_SUREPASS_AUTH_TOKEN || '';

  if (!SUREPASS_BASE_URL || !SUREPASS_AUTH_TOKEN) {
    return res.status(500).json({ success: false, message: 'SurePass not configured' });
  }

  try {
    const { id_number, ifsc, ifsc_details } = req.body;

    const response = await fetch(`${SUREPASS_BASE_URL}/api/v1/bank-verification/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${SUREPASS_AUTH_TOKEN}`,
      },
      body: JSON.stringify({ id_number, ifsc, ifsc_details }),
    });

    const data = await response.json().catch(() => ({}));
    return res.status(response.status).json(data);
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to verify bank account. Please try again.' });
  }
}
