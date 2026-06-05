import { searchAll } from '@/lib/tmdb';
import SearchForm from '@/components/SearchForm';
import MediaCard from '@/components/MediaCard';
import type { TmdbResponse, MediaItem } from '@/types';

interface Props {
  searchParams: Promise<{ query?: string }>;
}

export const metadata = { title: 'Пошук' };

export default async function SearchPage({ searchParams }: Props) {
  const { query } = await searchParams;
  const trimmed = query?.trim() ?? '';

  let items: MediaItem[] = [];
  if (trimmed) {
    const data = (await searchAll(trimmed)) as TmdbResponse<MediaItem>;
    items = data.results.filter((i) => (i.media_type === 'movie' || i.media_type === 'tv') && i.poster_path);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">Пошук</h1>
      <SearchForm defaultValue={trimmed} action="/search" placeholder="Фільм, серіал, аніме..." />

      {trimmed && (
        <div className="mt-10">
          {items.length > 0 ? (
            <>
              <p className="text-gray-400 text-sm mb-6">
                Знайдено <span className="text-white font-semibold">{items.length}</span> результатів для «{trimmed}»
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {items.map((item) => (
                  <MediaCard key={`${item.media_type}-${item.id}`} item={item} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-gray-200 text-xl font-semibold">Нічого не знайдено</p>
              <p className="text-gray-500 text-sm mt-2">Спробуй інший запит</p>
            </div>
          )}
        </div>
      )}

      {!trimmed && (
        <div className="text-center py-24">
          <p className="text-6xl mb-5">🍿</p>
          <p className="text-gray-200 text-2xl font-bold">Знайди що подивитись</p>
          <p className="text-gray-500 text-sm mt-3">Фільми, серіали, аніме, мультфільми</p>
        </div>
      )}
    </div>
  );
}
