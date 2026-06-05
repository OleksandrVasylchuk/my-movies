function decodeToken(encoded: string): string {
  const half = Math.floor(encoded.length / 2);
  const storedH1 = encoded.slice(0, half);
  const storedH2 = encoded.slice(half);
  const b64B = storedH1.split('').reverse().join('');
  const b64A = storedH2.split('').reverse().join('');
  const A = Buffer.from(b64A, 'base64').toString('utf8');
  const B = Buffer.from(b64B, 'base64').toString('utf8');
  return A + B;
}

const RAW = process.env.KODIK_TOKEN ?? '';
const TOKEN = RAW ? decodeToken(RAW) : '';

interface KodikResult {
  link: string;
  translation: { title: string; type: string };
}

async function search(params: Record<string, string>): Promise<KodikResult[]> {
  if (!TOKEN) return [];
  const url = new URL('https://kodikapi.com/search');
  url.searchParams.set('token', TOKEN);
  url.searchParams.set('with_material_data', 'true');
  url.searchParams.set('limit', '10');
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}

function pickBest(results: KodikResult[]): string | null {
  if (!results.length) return null;
  const ua = results.find(
    (r) =>
      r.translation?.title?.toLowerCase().includes('украї') ||
      r.translation?.title?.toLowerCase().includes('ukr')
  );
  const chosen = ua ?? results[0];
  return chosen.link ? `https:${chosen.link}` : null;
}

export async function getKodikEmbed(
  imdbId?: string | null,
  title?: string
): Promise<string | null> {
  if (!TOKEN) return null;
  if (imdbId) {
    const res = await search({ imdb_id: imdbId });
    const link = pickBest(res);
    if (link) return link;
  }
  if (title) {
    const res = await search({ title });
    return pickBest(res);
  }
  return null;
}

export const hasKodik = (): boolean => !!TOKEN;
