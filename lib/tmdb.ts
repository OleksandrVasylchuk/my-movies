const API_KEY = process.env.TMDB_API_KEY!;
const BASE_URL = 'https://api.themoviedb.org/3';
const LANG = 'uk-UA';

async function fetchTmdb<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  const merged = { language: LANG, ...params };
  for (const [k, v] of Object.entries(merged)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${endpoint}`);
  return res.json();
}

export async function fetchTmdbPublic<T = unknown>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  return fetchTmdb<T>(endpoint, params);
}

export async function fetchTwoPages(endpoint: string, params: Record<string, string>, sitePage: number): Promise<{ items: unknown[]; totalPages: number; totalResults: number }> {
  const tmdbPage1 = (sitePage - 1) * 2 + 1;
  const tmdbPage2 = tmdbPage1 + 1;
  const [p1, p2] = await Promise.all([
    fetchTmdb<{ results: unknown[]; total_pages: number; total_results: number }>(endpoint, { ...params, page: String(tmdbPage1) }),
    fetchTmdb<{ results: unknown[]; total_pages: number; total_results: number }>(endpoint, { ...params, page: String(tmdbPage2) }).catch(() => ({ results: [], total_pages: 0, total_results: 0 })),
  ]);
  return {
    items: [...p1.results, ...p2.results],
    totalPages: Math.ceil(p1.total_pages / 2),
    totalResults: p1.total_results,
  };
}

export const getPopularMovies = () => fetchTmdb('/movie/popular');
export const getPopularSeries = () => fetchTmdb('/tv/popular');
export const getTrendingAll = () => fetchTmdb('/trending/all/week');

export const getAnime = (page = 1) =>
  fetchTmdb('/discover/tv', {
    with_genres: '16',
    with_original_language: 'ja',
    sort_by: 'popularity.desc',
    page: String(page),
  });

export const getCartoons = () =>
  fetchTmdb('/discover/movie', {
    with_genres: '16',
    sort_by: 'popularity.desc',
  });

export const getMovieById = (id: string) => fetchTmdb(`/movie/${id}`);
export const getTVById = (id: string) => fetchTmdb(`/tv/${id}`);

interface VideoResult { key: string; site: string; type: string; }
interface VideosResponse { results: VideoResult[] }

function pickTrailer(results: VideoResult[]): VideoResult | undefined {
  return (
    results.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ??
    results.find((v) => v.site === 'YouTube' && v.type === 'Teaser') ??
    results.find((v) => v.site === 'YouTube')
  );
}

export async function getMovieTrailer(id: string): Promise<string | null> {
  try {
    const [ua, en] = await Promise.all([
      fetchTmdb<VideosResponse>(`/movie/${id}/videos`, { language: 'uk-UA' }),
      fetchTmdb<VideosResponse>(`/movie/${id}/videos`, { language: 'en-US' }),
    ]);
    const trailer = pickTrailer(ua.results ?? []) ?? pickTrailer(en.results ?? []);
    return trailer?.key ?? null;
  } catch {
    return null;
  }
}

export async function getTVTrailer(id: string): Promise<string | null> {
  try {
    const [ua, en] = await Promise.all([
      fetchTmdb<VideosResponse>(`/tv/${id}/videos`, { language: 'uk-UA' }),
      fetchTmdb<VideosResponse>(`/tv/${id}/videos`, { language: 'en-US' }),
    ]);
    const trailer = pickTrailer(ua.results ?? []) ?? pickTrailer(en.results ?? []);
    return trailer?.key ?? null;
  } catch {
    return null;
  }
}

export const getMovieCast = (id: string) => fetchTmdb(`/movie/${id}/credits`);
export const getTVCast = (id: string) => fetchTmdb(`/tv/${id}/credits`);

export const getMovieReviews = (id: string) =>
  fetchTmdb(`/movie/${id}/reviews`, { language: 'en-US' });
export const getTVReviews = (id: string) =>
  fetchTmdb(`/tv/${id}/reviews`, { language: 'en-US' });

export const searchAll = (query: string) =>
  fetchTmdb('/search/multi', { query });

export const getImageUrl = (path: string | null, size = 'w500'): string =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : '';

export const getBackdropUrl = (path: string | null): string =>
  getImageUrl(path, 'original');
