'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  defaultValue: string;
  action?: string;
  placeholder?: string;
}

export default function SearchForm({ defaultValue, action = '/search', placeholder = 'Пошук...' }: Props) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`${action}?query=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="flex-1 relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg pointer-events-none">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-5 py-4 bg-bg-secondary border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all text-base"
        />
      </div>
      <button
        type="submit"
        className="px-7 py-4 bg-gold text-black font-bold rounded-2xl hover:bg-gold/90 active:scale-95 transition-all"
      >
        Знайти
      </button>
    </form>
  );
}
