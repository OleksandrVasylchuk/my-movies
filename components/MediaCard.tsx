import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/tmdb';
import type { MediaItem } from '@/types';

interface Props {
  item: MediaItem;
}

export default function MediaCard({ item }: Props) {
  const isTV = item.media_type === 'tv' || ('name' in item && !('title' in item));
  const title = item.title ?? item.name ?? '';
  const date = item.release_date ?? item.first_air_date;
  const year = date?.split('-')[0];
  const href = isTV ? `/series/${item.id}` : `/movies/${item.id}`;
  const rating = (Math.round(item.vote_average * 10) / 10).toFixed(1);

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-bg-secondary ring-1 ring-white/5 transition-all duration-300 group-hover:ring-gold/40 group-hover:shadow-2xl group-hover:shadow-black/60">
        {item.poster_path ? (
          <Image
            src={getImageUrl(item.poster_path)}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-bg-tertiary">
            <span className="text-5xl opacity-30">🎬</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="text-[9px] font-bold uppercase tracking-wide bg-gold/90 text-black px-1.5 py-0.5 rounded-md">
            {isTV ? 'Серіал' : 'Фільм'}
          </span>
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
          <span className="text-gold text-[10px]">★</span>
          <span className="text-white text-[10px] font-semibold">{rating}</span>
        </div>
      </div>
      <div className="mt-2 px-0.5">
        <p className="text-white text-sm font-medium leading-tight line-clamp-2 group-hover:text-gold transition-colors duration-200">
          {title}
        </p>
        {year && <p className="text-gray-500 text-xs mt-0.5">{year}</p>}
      </div>
    </Link>
  );
}
