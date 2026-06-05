'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'За популярністю' },
  { value: 'vote_average.desc', label: 'За рейтингом' },
  { value: 'first_air_date.desc', label: 'Новіші спочатку' },
  { value: 'first_air_date.asc', label: 'Старіші спочатку' },
];

const YEARS = Array.from({ length: 36 }, (_, i) => new Date().getFullYear() - i);

interface Props {
  type?: 'tv' | 'movie';
}

export default function Filters({ type = 'tv' }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const sort = params.get('sort') ?? 'popularity.desc';
  const year = params.get('year') ?? '';

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    router.push(`${pathname}?${next.toString()}`);
  };

  const sortOptions = type === 'movie'
    ? SORT_OPTIONS.map(o => ({ ...o, value: o.value.replace('first_air_date', 'release_date') }))
    : SORT_OPTIONS;

  return (
    <div className="flex flex-wrap gap-2 mt-5">
      <select
        value={sort}
        onChange={(e) => update('sort', e.target.value)}
        className="bg-bg-secondary border border-white/10 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-gold/50 cursor-pointer"
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value} className="bg-bg-primary">
            {o.label}
          </option>
        ))}
      </select>

      <select
        value={year}
        onChange={(e) => update('year', e.target.value)}
        className="bg-bg-secondary border border-white/10 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-gold/50 cursor-pointer"
      >
        <option value="" className="bg-bg-primary">Всі роки</option>
        {YEARS.map((y) => (
          <option key={y} value={String(y)} className="bg-bg-primary">{y}</option>
        ))}
      </select>

      {(sort !== 'popularity.desc' || year) && (
        <button
          onClick={() => router.push(pathname)}
          className="px-3 py-2 bg-white/5 border border-white/10 text-gray-400 hover:text-white text-sm rounded-xl transition-colors"
        >
          ✕ Скинути
        </button>
      )}
    </div>
  );
}
