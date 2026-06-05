'use client';

import { useState } from 'react';

interface Props {
  embedUrl?: string | null;
  youtubeKey?: string | null;
  title: string;
}

export default function VideoPlayer({ embedUrl, youtubeKey, title }: Props) {
  const [watching, setWatching] = useState(false);

  const src = watching && embedUrl
    ? embedUrl
    : youtubeKey
    ? `https://www.youtube.com/embed/${youtubeKey}?autoplay=0&rel=0&modestbranding=1`
    : null;

  return (
    <div className="w-full max-w-4xl">
      {src ? (
        <>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black ring-1 ring-white/10 shadow-2xl mb-3">
            <iframe
              src={src}
              title={watching ? title : `${title} — трейлер`}
              allowFullScreen
              allow="autoplay; fullscreen; encrypted-media"
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
            />
          </div>

          <div className="flex items-center gap-2">
            {embedUrl && !watching && (
              <button
                onClick={() => setWatching(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gold text-black font-bold rounded-xl hover:bg-gold/90 active:scale-95 transition-all text-sm"
              >
                ▶ Дивитись повністю
              </button>
            )}
            {watching && (
              <button
                onClick={() => setWatching(false)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all text-sm border border-white/10"
              >
                ← Трейлер
              </button>
            )}
            {!watching && youtubeKey && (
              <span className="text-gray-500 text-xs">
                {watching ? '' : 'Трейлер'}
              </span>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-500 text-sm w-fit">
          🔒 Відео незабаром
        </div>
      )}
    </div>
  );
}
