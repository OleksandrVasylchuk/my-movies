// Pollinations.ai integration — AI-powered movie features
//
// Безкоштовний LLM API від Pollinations. Не потребує API key для базових моделей.
// Документація: https://pollinations.ai/
//
// Використовуємо у двох місцях:
//   • aiMovieSummary() — генерує українське AI-резюме фільму на основі його overview
//   • aiRecommend() — пропонує 5 схожих фільмів за списком улюблених

const POLLINATIONS_URL = "https://text.pollinations.ai/openai/chat/completions";
const MODEL = "gemini-fast"; // Gemini 2.5 Flash Lite, найшвидший і дешевший

/**
 * AI-резюме фільму українською мовою. На вхід дається назва і overview англійською —
 * на виході 2-3 речення яскравого опису для українського глядача.
 *
 * @param {string} title  — назва фільму
 * @param {string} plot   — overview англійською
 * @returns {Promise<string>} 2-3 речення українською
 */
export async function aiMovieSummary(title, plot) {
  const response = await fetch(POLLINATIONS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "Ти професійний кінокритик. Пиши українською мовою. Зроби яскраве інтригуюче резюме фільму у 2-3 реченнях. Жодних SPOILER'ів — лише налаштування і конфлікт. Стиль розмовний, без води.",
        },
        {
          role: "user",
          content: `Назва фільму: "${title}"\n\nОригінальний overview англійською:\n${plot}\n\nНапиши яскраве українське AI-резюме.`,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Pollinations HTTP ${response.status}`);
  }
  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content || "";
  return text.trim();
}

/**
 * AI-рекомендації схожих фільмів. На вхід — список улюблених, на виході JSON
 * з 5 пропозиціями (назва + чому варто подивитись).
 *
 * @param {string[]} favoriteTitles — назви улюблених фільмів
 * @returns {Promise<Array<{title: string, why: string}>>}
 */
export async function aiRecommend(favoriteTitles) {
  const response = await fetch(POLLINATIONS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            'Ти радник фільмів. Українською мовою. Поверни JSON формату {"recommendations":[{"title":"...","why":"..."}]} — рівно 5 пропозицій, кожна з причиною (1 речення) чому подивитись.',
        },
        {
          role: "user",
          content: `Я люблю ці фільми: ${favoriteTitles.join(", ")}. Порадь 5 схожих.`,
        },
      ],
      temperature: 0.8,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error(`Pollinations HTTP ${response.status}`);
  }
  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content || "{}";
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
  } catch {
    return [];
  }
}
