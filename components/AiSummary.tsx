'use client';

import { useState } from 'react';
import { aiMovieSummary } from '@/lib/pollinations';

interface Props {
  title: string;
  overview: string;
}

export default function AiSummary({ title, overview }: Props) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const text = await aiMovieSummary(title, overview);
      setSummary(text);
    } catch {
      setError('Не вдалося згенерувати. Спробуй ще раз.');
    } finally {
      setLoading(false);
    }
  };

  if (summary) {
    return (
      <div className="mt-1 p-4 bg-gold/5 border border-gold/20 rounded-xl max-w-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gold text-xs font-semibold uppercase tracking-wide">✨ AI-резюме</span>
          <button
            onClick={() => setSummary('')}
            className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
          >
            сховати
          </button>
        </div>
        <p className="text-gray-200 text-sm leading-relaxed">{summary}</p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={generate}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded-xl text-gold text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="inline-block w-3.5 h-3.5 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
            Генерую...
          </>
        ) : (
          <>✨ AI-резюме українською</>
        )}
      </button>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}
