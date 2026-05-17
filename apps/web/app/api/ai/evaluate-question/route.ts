import { NextResponse } from 'next/server';

const SYSTEM_INSTRUCTIONS = `You are an expert on hiring bias and inclusive interview design.

Given a list of interview questions, evaluate EACH question for hiring bias and return a JSON object:
{ "findings": [ { ... }, { ... } ] }

There must be exactly one entry in "findings" per input question, in the same order as the input.

Each finding object has:
- severity: one of "high", "medium", "low", "none"
- issues: short labels for each bias pattern detected (e.g., "Gendered language", "Age bias", "Leading question"). Empty array if severity is "none".
- explanations: 1-2 short sentences (each its own array element) explaining WHY the question is biased and the impact on candidates. Empty array if severity is "none".
- suggestions: exactly 3 full alternative rewordings of the question that preserve the original intent but remove the bias. Each suggestion must be a complete, ready-to-use interview question. Empty array if severity is "none".

Severity guide:
- "high": touches a legally protected class (national origin, religion, marital/family status, disability, pregnancy, age proxies like "young" or "digital native")
- "medium": gendered language, exclusionary jargon ("rockstar"/"ninja"/"10x"), leading questions, aggressive framing, year-count proxies
- "low": minor wording issues (binary pronoun assumptions, vague "culture fit")
- "none": clean, unbiased, job-relevant question

Be concise. Do not add commentary. Output only the JSON object.`;

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['high', 'medium', 'low', 'none'] },
          issues: { type: 'array', items: { type: 'string' } },
          explanations: { type: 'array', items: { type: 'string' } },
          suggestions: { type: 'array', items: { type: 'string' } },
        },
        required: ['severity', 'issues', 'explanations', 'suggestions'],
      },
    },
  },
  required: ['findings'],
};

export async function POST(req: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not set in apps/web/.env.local. Add it and restart the dev server.' },
      { status: 500 },
    );
  }

  let body: { question?: unknown; questions?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  let questions: string[] = [];
  if (Array.isArray(body.questions)) {
    questions = body.questions.filter((q): q is string => typeof q === 'string' && q.trim().length > 0).map((q) => q.trim());
  } else if (typeof body.question === 'string' && body.question.trim()) {
    questions = [body.question.trim()];
  }

  if (questions.length === 0) {
    return NextResponse.json({ error: 'Field "questions" (string[]) or "question" (string) is required.' }, { status: 400 });
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  const numbered = questions.map((q, i) => `${i + 1}. ${q}`).join('\n');

  const payload = {
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTIONS }] },
    contents: [
      { role: 'user', parts: [{ text: `Evaluate these ${questions.length} interview question(s):\n\n${numbered}\n\nReturn one finding per question, in order.` }] },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.4,
    },
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Gemini API error (${res.status}): ${text.slice(0, 500)}` },
        { status: 502 },
      );
    }

    const data = await res.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return NextResponse.json({ error: 'Empty response from Gemini.', raw: data }, { status: 502 });
    }

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: 'Gemini returned non-JSON content.', raw: text }, { status: 502 });
    }

    const rawFindings: any[] = Array.isArray(parsed?.findings) ? parsed.findings : [];
    const findings = questions.map((_, i) => {
      const f = rawFindings[i] ?? {};
      const severity = ['high', 'medium', 'low', 'none'].includes(f?.severity) ? f.severity : 'none';
      return {
        severity,
        issues: Array.isArray(f?.issues) ? f.issues.map(String) : [],
        explanations: Array.isArray(f?.explanations) ? f.explanations.map(String) : [],
        suggestions: Array.isArray(f?.suggestions) ? f.suggestions.slice(0, 3).map(String) : [],
      };
    });

    return NextResponse.json({ findings });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unknown server error' }, { status: 500 });
  }
}
