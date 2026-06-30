import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'portfolio.json');

export async function GET() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: 'Could not read portfolio data' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    fs.writeFileSync(DATA_PATH, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
