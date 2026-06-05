import { Suspense } from 'react';
import { fetchTmdbPublic, fetchTwoPages } from '@/lib/tmdb';
import SearchForm from '@/components/SearchForm';
import MediaCard from '@/components/MediaCard';
import Filters from '@/components/Filters';
import type { TmdbResponse, MediaItem } from '@/types';

interface Props {
  searchParams: Promise<{ query?: string; page?: string; sort?: string; year?: string }>;
}

export const metadata = { title: 'Аніме' };

export default async function AnimePage({ searchParams }: Props) {
  const { query, page, sort, year } = await searchParams;
  const trimmed = query?.trim() ?? '';
  const currentPage = Math.max(1, Number(page ?? 1));
  const sortBy = sort ?? 'popularity.desc';

  let items: MediaItem[] = [];
  let totalPages = 1;
  let totalResults = 0;

  if (trimmed) {
    const data = (await fetchTmdbPublic('/search/tv', {
      query: trimmed,
      page: String(currentPage),
    })) as TmdbResponse<MediaItem>;
    items = data.results
      .filter((i) => i.poster_path)
      .map((i) => ({ ...i, media_type: 'tv' as const }));
    totalPages = data.total_pages;
    totalResults = data.total_results;
  } else {
    const params: Record<string, string> = {
      with_genres: '16',
      with_original_language: 'ja',
      sort_by: sortBy,
      'vote_count.gte': sortBy.includes('vote_average') ? '100' : '0',
    };
    if (year) {
      params['first_air_date.gte'] = `${year}-01-01`;
      params['first_air_date.lte'] = `${year}-12-31`;
    }
    const data = await fetchTwoPages('/discover/tv', params, currentPage);
    items = (data.items as MediaItem[])
      .filter((i) => i.poster_path)
      .map((i) => ({ ...i, media_type: 'tv' as const }));
    totalPages = data.totalPages;
    totalResults = data.totalResults;
  }

  const buildUrl = (p: number) => {
    const params = new URLSearchParams();
    if (trimmed) params.set('query', trimmed);
    if (sort) params.set('sort', sort);
    if (year) params.set('year', year);
    params.set('page', String(p));
    return `/anime?${params.toString()}`;
  };

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-white mb-6">⛩️ Аніме</h1>

      <SearchForm defaultValue={trimmed} action="/anime" placeholder="Назва аніме..." />

      {!trimmed && (
        <Suspense>
          <Filters type="tv" />
        </Suspense>
      )}

      <div className="flex items-center justify-between mt-6 mb-4">
        <p className="text-gray-500 text-sm">
          {totalResults > 0 && (
            <>Знайдено <span className="text-white font-medium">{totalResults.toLocaleString()}</span> тайтлів</>
          )}
        </p>
        {totalPages > 1 && (
          <p className="text-gray-500 text-sm">
            Стор. {currentPage} / {totalPages}
          </p>
        )}
      </div>

      {items.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {items.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
              {currentPage > 1 && (
                <a href={buildUrl(currentPage - 1)}
                  className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all text-sm border border-white/10">
                  ←
                </a>
              )}
              {pageNumbers.map((p, i) =>
                p === '...' ? (
                  <span key={`dots-${i}`} className="px-2 text-gray-600 text-sm">…</span>
                ) : (
                  <a key={p} href={buildUrl(Number(p))}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      Number(p) === currentPage
                        ? 'bg-gold text-black font-bold'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                    }`}>
                    {p}
                  </a>
                )
              )}
              {currentPage < totalPages && (
                <a href={buildUrl(currentPage + 1)}
                  className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all text-sm border border-white/10">
                  →
                </a>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">⛩️</p>
          <p className="text-gray-200 text-xl font-semibold">Нічого не знайдено</p>
        </div>
      )}
    </div>
  );
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '...')[] = [];
  pages.push(1);
  if (current > 3) pages.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}
