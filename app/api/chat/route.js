import { NextResponse } from 'next/server';

const MODEL = 'gemini-2.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export async function POST(req) {
  try {
    const { messages, context } = await req.json();
    const key = process.env.GEMINI_API_KEY;
    if (!key) return NextResponse.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 });

    // Build Gemini contents array: system context first, then chat history
    const contents = [
      { role: 'user', parts: [{ text: context }] },
      { role: 'model', parts: [{ text: "Understood — I'm Mishal's portfolio assistant. I'll answer questions about his work, skills and projects concisely." }] },
      ...messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      })),
    ];

    const res = await fetch(`${API_URL}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { maxOutputTokens: 1024, temperature: 0.7, thinkingConfig: { thinkingBudget: 0 } },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: err?.error?.message || `Gemini ${res.status}` }, { status: 502 });
    }

    const json = await res.json();
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) return NextResponse.json({ error: 'Empty response from Gemini' }, { status: 502 });

    return NextResponse.json({ reply: text });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
