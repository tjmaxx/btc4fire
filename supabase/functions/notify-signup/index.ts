// Triggered by Supabase Database Webhook on profiles INSERT.
// Sends an email notification to the site owner via Resend (free tier).
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const NOTIFY_EMAIL   = 'jevehome@gmail.com';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let payload: { record?: Record<string, string> };
  try {
    payload = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const record   = payload?.record ?? {};
  const username = record.username   ?? 'Unknown';
  const userId   = record.id         ?? 'Unknown';
  const ts       = record.created_at
    ? new Date(record.created_at).toUTCString()
    : new Date().toUTCString();

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'BTC4Fire <onboarding@resend.dev>',
      to:   [NOTIFY_EMAIL],
      subject: `New BTC4Fire signup — ${username}`,
      html: `
        <h2 style="color:#f97316;">New user registered on btc4fire.com</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Username</td><td><strong>${username}</strong></td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">User ID</td><td>${userId}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Registered</td><td>${ts}</td></tr>
        </table>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('Resend error:', body);
    return new Response(`Email failed: ${body}`, { status: 500 });
  }

  return new Response('OK', { status: 200 });
});
