'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  movieId: string;
  basePath?: string;
}

const tabs = [
  { label: 'Актори', key: 'cast' },
  { label: 'Рецензії', key: 'reviews' },
];

export default function MovieTabs({ movieId, basePath = '/movies' }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex gap-1">
      {tabs.map((tab) => {
        const href = `${basePath}/${movieId}/${tab.key}`;
        const isActive = pathname.endsWith(`/${tab.key}`);
        return (
          <Link
            key={tab.key}
            href={href}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              isActive
                ? 'bg-gold text-black font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
