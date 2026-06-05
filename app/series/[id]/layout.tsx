import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTVById, getTVTrailer, getImageUrl, getBackdropUrl } from '@/lib/tmdb';
import { getKodikEmbed, hasKodik } from '@/lib/kodik';
import AiSummary from '@/components/AiSummary';
import MovieTabs from '@/components/MovieTabs';
import VideoPlayer from '@/components/VideoPlayer';
import type { TVShow, Genre } from '@/types';

interface Props {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const show = (await getTVById(id)) as TVShow;
    return { title: show.name, description: show.overview?.slice(0, 160) };
  } catch {
    return { title: 'Серіал' };
  }
}

export default async function SeriesLayout({ children, params }: Props) {
  const { id } = await params;

  let show: TVShow;
  try {
    show = (await getTVById(id)) as TVShow;
  } catch {
    notFound();
  }

  const year = show.first_air_date?.split('-')[0];

  const [embedUrl, trailerKey] = await Promise.all([
    hasKodik() ? getKodikEmbed(null, show.name) : Promise.resolve(null),
    getTVTrailer(id),
  ]);

  return (
    <>
      {/* Backdrop */}
      {show.backdrop_path && (
        <div className="relative w-full h-[45vh] overflow-hidden">
          <Image
            src={getBackdropUrl(show.backdrop_path)}
            alt={show.name}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/60 to-transparent" />
        </div>
      )}

      {/* Info card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-10">
        <div className="flex gap-6 sm:gap-8 items-start">

          {/* Постер */}
          <div className="w-36 sm:w-48 flex-shrink-0">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden ring-2 ring-white/10 shadow-2xl">
              {show.poster_path ? (
                <Image
                  src={getImageUrl(show.poster_path)}
                  alt={show.name}
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              ) : (
                <div className="w-full h-full bg-bg-secondary flex items-center justify-center">
                  <span className="text-5xl opacity-20">📺</span>
                </div>
              )}
            </div>
          </div>

          {/* Інформація */}
          <div className="flex-1 min-w-0 pt-4 sm:pt-8">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-2">
              <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-md font-semibold uppercase tracking-wide">Серіал</span>
              {year && <span className="bg-white/10 px-2 py-0.5 rounded-md">{year}</span>}
              {show.number_of_seasons && (
                <span className="bg-white/10 px-2 py-0.5 rounded-md">{show.number_of_seasons} сез.</span>
              )}
              {show.number_of_episodes && (
                <span className="bg-white/10 px-2 py-0.5 rounded-md">{show.number_of_episodes} еп.</span>
              )}
              <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-md font-semibold">
                ★ {show.vote_average.toFixed(1)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-2 leading-tight">
              {show.name}
            </h1>

            {show.tagline && (
              <p className="text-gold/70 text-sm italic mb-3">{show.tagline}</p>
            )}

            {show.genres && show.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {show.genres.map((g: Genre) => (
                  <span key={g.id} className="px-2.5 py-1 bg-white/8 border border-white/10 rounded-full text-xs text-gray-300">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 max-w-2xl mb-5">
              {show.overview || 'Опис недоступний.'}
            </p>

            <AiSummary title={show.name} overview={show.overview ?? ''} />
          </div>
        </div>

        {/* Плеєр */}
        <div className="mt-6">
          <VideoPlayer embedUrl={embedUrl} youtubeKey={trailerKey} title={show.name} />
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <Link href="/series" className="text-sm text-gray-500 hover:text-white flex items-center gap-1.5 transition-colors group">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Назад
          </Link>
          <MovieTabs movieId={id} basePath="/series" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </>
  );
}
