import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'portfolio.json');

export async function GET() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: 'Failed to read portfolio data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save portfolio data' }, { status: 500 });
  }
}
