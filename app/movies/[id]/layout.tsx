import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMovieById, getMovieTrailer, getImageUrl, getBackdropUrl } from '@/lib/tmdb';
import { getKodikEmbed, hasKodik } from '@/lib/kodik';
import AiSummary from '@/components/AiSummary';
import MovieTabs from '@/components/MovieTabs';
import VideoPlayer from '@/components/VideoPlayer';
import type { Movie, Genre } from '@/types';

interface Props {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = (await getMovieById(id)) as Movie;
    return { title: movie.title, description: movie.overview?.slice(0, 160) };
  } catch {
    return { title: 'Фільм' };
  }
}

export default async function MovieLayout({ children, params }: Props) {
  const { id } = await params;

  let movie: Movie;
  try {
    movie = (await getMovieById(id)) as Movie;
  } catch {
    notFound();
  }

  const year = movie.release_date?.split('-')[0];
  const hours = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
  const mins = movie.runtime ? movie.runtime % 60 : 0;

  const [embedUrl, trailerKey] = await Promise.all([
    hasKodik() ? getKodikEmbed(movie.imdb_id, movie.title) : Promise.resolve(null),
    getMovieTrailer(id),
  ]);

  return (
    <>
      {/* Backdrop */}
      {movie.backdrop_path && (
        <div className="relative w-full h-[45vh] overflow-hidden">
          <Image
            src={getBackdropUrl(movie.backdrop_path)}
            alt={movie.title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/60 to-transparent" />
        </div>
      )}

      {/* Info card — витягується вгору поверх backdrop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-10">
        <div className="flex gap-6 sm:gap-8 items-start">

          {/* Постер */}
          <div className="w-36 sm:w-48 flex-shrink-0">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden ring-2 ring-white/10 shadow-2xl">
              {movie.poster_path ? (
                <Image
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              ) : (
                <div className="w-full h-full bg-bg-secondary flex items-center justify-center">
                  <span className="text-5xl opacity-20">🎬</span>
                </div>
              )}
            </div>
          </div>

          {/* Інформація */}
          <div className="flex-1 min-w-0 pt-4 sm:pt-8">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-2">
              {year && <span className="bg-white/10 px-2 py-0.5 rounded-md">{year}</span>}
              {movie.runtime && movie.runtime > 0 && (
                <span className="bg-white/10 px-2 py-0.5 rounded-md">{hours}г {mins}хв</span>
              )}
              <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-md font-semibold">
                ★ {movie.vote_average.toFixed(1)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-2 leading-tight">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-gold/70 text-sm italic mb-3">{movie.tagline}</p>
            )}

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {movie.genres.map((g: Genre) => (
                  <span key={g.id} className="px-2.5 py-1 bg-white/8 border border-white/10 rounded-full text-xs text-gray-300">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 max-w-2xl mb-5">
              {movie.overview || 'Опис недоступний.'}
            </p>

            <AiSummary title={movie.title} overview={movie.overview ?? ''} />
          </div>
        </div>

        {/* Плеєр — повна ширина */}
        <div className="mt-6">
          <VideoPlayer embedUrl={embedUrl} youtubeKey={trailerKey} title={movie.title} />
        </div>

        {/* Навігація та вкладки */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <Link href="/movies" className="text-sm text-gray-500 hover:text-white flex items-center gap-1.5 transition-colors group">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Назад
          </Link>
          <MovieTabs movieId={id} basePath="/movies" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </>
  );
}
