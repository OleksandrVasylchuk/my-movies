import Image from 'next/image';
import { getMovieCast, getImageUrl } from '@/lib/tmdb';
import type { CastMember } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CastPage({ params }: Props) {
  const { id } = await params;
  const data = (await getMovieCast(id)) as { cast: CastMember[] };
  const cast = data.cast.slice(0, 24);

  if (cast.length === 0) {
    return (
      <p className="text-gray-500 text-center py-12">
        Інформація про акторів відсутня.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-5">
      {cast.map((person) => (
        <div key={person.id} className="group">
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-bg-secondary ring-1 ring-white/5 transition-all duration-300 group-hover:ring-gold/30">
            {person.profile_path ? (
              <Image
                src={getImageUrl(person.profile_path, 'w185')}
                alt={person.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 33vw, 20vw"
              />
            ) : (
              <div className="w-full h-full bg-bg-tertiary flex items-center justify-center">
                <span className="text-3xl opacity-20">👤</span>
              </div>
            )}
          </div>
          <p className="text-white text-xs font-semibold mt-2 leading-tight">{person.name}</p>
          <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{person.character}</p>
        </div>
      ))}
    </div>
  );
}
