const POLLINATIONS_URL = 'https://text.pollinations.ai/openai/chat/completions';
const MODEL = 'gemini-fast';

export async function aiMovieSummary(title: string, plot: string): Promise<string> {
  const res = await fetch(POLLINATIONS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content:
            "Ти професійний кінокритик. Пиши українською мовою. Зроби яскраве інтригуюче резюме фільму у 2-3 реченнях. Жодних SPOILER'ів — лише налаштування і конфлікт. Стиль розмовний, без води.",
        },
        {
          role: 'user',
          content: `Назва фільму: "${title}"\n\nОригінальний overview англійською:\n${plot}\n\nНапиши яскраве українське AI-резюме.`,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!res.ok) throw new Error(`Pollinations HTTP ${res.status}`);
  const data = await res.json();
  return (data?.choices?.[0]?.message?.content ?? '').trim();
}
