import { NextRequest } from 'next/server';

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json();

  const apiUrl = process.env.CERT_API_URL;
  if (!apiUrl) {
    return new Response('Missing CERT_API_URL', { status: 500 });
  }

  const res = await fetch(`${apiUrl}/bulk-download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const blob = await res.blob();

  return new Response(blob, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') ?? 'application/zip',
    },
  });
}
