import { NextResponse } from 'next/server';
import crypto from 'crypto';

function sign(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', process.env.ADMIN_SECRET).update(data).digest('hex');
  return `${data}.${sig}`;
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const validEmail = process.env.ADMIN_EMAIL;
    const validPassword = process.env.ADMIN_PASSWORD;
    const secret = process.env.ADMIN_SECRET;

    if (!validEmail || !validPassword || !secret) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const h = (s) => crypto.createHash('sha256').update(s).digest();
    const emailMatch = crypto.timingSafeEqual(h(email || ''), h(validEmail));
    const passMatch  = crypto.timingSafeEqual(h(password || ''), h(validPassword));

    if (!emailMatch || !passMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = sign({ email, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
    const res = NextResponse.json({ ok: true });
    res.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
