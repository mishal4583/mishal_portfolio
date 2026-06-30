import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const DATA_PATH = path.join(process.cwd(), 'data', 'portfolio.json');

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('portfolio_data')
      .select('data')
      .eq('id', 1)
      .single();

    if (!error && data && data.data && Object.keys(data.data).length > 0) {
      return NextResponse.json(data.data);
    }
  } catch {}

  // Fallback to bundled JSON (first load before any admin save)
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return NextResponse.json(JSON.parse(raw));
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { error } = await supabase
      .from('portfolio_data')
      .upsert({ id: 1, data: body, updated_at: new Date().toISOString() });

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
