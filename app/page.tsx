import Image from 'next/image';
import Link from 'next/link';
import { getTrendingAll, getPopularSeries, getAnime, getCartoons, getBackdropUrl } from '@/lib/tmdb';
import MediaCard from '@/components/MediaCard';
import type { TmdbResponse, MediaItem } from '@/types';

interface SectionProps {
  title: string;
  emoji: string;
  items: MediaItem[];
  href: string;
}

function Section({ title, emoji, items, href }: SectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>{emoji}</span> {title}
        </h2>
        <Link href={href} className="text-gold text-sm hover:text-gold/80 transition-colors">
          Всі →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {items.slice(0, 12).map((item) => (
          <MediaCard key={`${item.media_type ?? 'item'}-${item.id}`} item={item} />
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [trendingData, seriesData, animeData, cartoonsData] = await Promise.all([
    getTrendingAll() as Promise<TmdbResponse<MediaItem>>,
    getPopularSeries() as Promise<TmdbResponse<MediaItem>>,
    getAnime() as Promise<TmdbResponse<MediaItem>>,
    getCartoons() as Promise<TmdbResponse<MediaItem>>,
  ]);

  const trending = trendingData.results;
  const series = seriesData.results.map((i) => ({ ...i, media_type: 'tv' as const }));
  const anime = animeData.results.map((i) => ({ ...i, media_type: 'tv' as const }));
  const cartoons = cartoonsData.results.map((i) => ({ ...i, media_type: 'movie' as const }));

  const movies = trending.filter((i) => i.media_type === 'movie');
  const featured = trending[0];
  const featuredTitle = featured ? (featured.title ?? featured.name ?? '') : '';
  const featuredBackdrop = featured?.backdrop_path;

  return (
    <>
      {featured && (
        <div className="relative w-full min-h-[85vh] overflow-hidden">
          {featuredBackdrop && (
            <Image
              src={getBackdropUrl(featuredBackdrop)}
              alt={featuredTitle}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-black/20" />

          <div className="relative z-10 flex items-center min-h-[85vh]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <p className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-4">
                ★ В тренді цього тижня
              </p>
              <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.05] mb-5 max-w-2xl">
                {featuredTitle}
              </h1>
              <p className="text-gray-300 text-base leading-relaxed mb-8 line-clamp-3 max-w-xl">
                {featured.overview}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={
                    featured.media_type === 'tv'
                      ? `/series/${featured.id}`
                      : `/movies/${featured.id}`
                  }
                  className="px-7 py-3.5 bg-gold text-black font-bold rounded-xl hover:bg-gold/90 transition-colors"
                >
                  Детальніше
                </Link>
                <Link
                  href="/search"
                  className="px-7 py-3.5 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10"
                >
                  Пошук
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pb-10">
        <Section
          title="Популярні фільми"
          emoji="🎬"
          items={movies}
          href="/movies"
        />
        <Section
          title="Популярні серіали"
          emoji="📺"
          items={series}
          href="/series"
        />
        <Section
          title="Аніме"
          emoji="⛩️"
          items={anime}
          href="/anime"
        />
        <Section
          title="Мультфільми"
          emoji="🎨"
          items={cartoons}
          href="/cartoons"
        />
      </div>
    </>
  );
}
