import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'portfolio.json');

function sb() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
  );
}

function verifySession(token) {
  try {
    const [data, sig] = token.split('.');
    const expected = crypto.createHmac('sha256', process.env.ADMIN_SECRET).update(data).digest('hex');
    if (sig.length !== expected.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))) return null;
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch { return null; }
}

export async function GET() {
  try {
    const { data, error } = await sb()
      .from('portfolio_data')
      .select('data')
      .eq('id', 1)
      .single();

    if (!error && data?.data && Object.keys(data.data).length > 0) {
      return NextResponse.json(data.data);
    }
  } catch (e) {
    console.error('Supabase GET failed, falling back to JSON:', e);
  }

  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(raw));
  } catch (e) {
    console.error('JSON fallback failed:', e);
    return NextResponse.json({ error: 'Data temporarily unavailable' }, { status: 503 });
  }
}

export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (!token || !verifySession(token)) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return NextResponse.json({ ok: false, error: 'Supabase env vars missing' }, { status: 500 });
    }

    const { error } = await sb()
      .from('portfolio_data')
      .upsert({ id: 1, data: body, updated_at: new Date().toISOString() });

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
