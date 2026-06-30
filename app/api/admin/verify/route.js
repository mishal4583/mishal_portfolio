import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';

function verify(token) {
  try {
    const [data, sig] = token.split('.');
    const expected = crypto.createHmac('sha256', process.env.ADMIN_SECRET).update(data).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))) return null;
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return NextResponse.json({ ok: false }, { status: 401 });
  const payload = verify(token);
  if (!payload) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, email: payload.email });
}
