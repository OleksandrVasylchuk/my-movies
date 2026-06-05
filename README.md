# UAКіно

Стрімінг-сайт з фільмами, серіалами, аніме та мультфільмами.

## Стек

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS**
- **TMDB API** — метадані, постери, рейтинги
- **Kodik API** — відеоплеєр (фільми, серіали, аніме)
- **Pollinations.ai** — AI-резюме українською

## Запуск локально

```bash
npm install
npm run dev
```

Відкрий [http://localhost:3000](http://localhost:3000)

## Змінні середовища

Створи `.env.local`:

```
TMDB_API_KEY=     # отримай на themoviedb.org/settings/api
KODIK_TOKEN=      # отримай написавши @kodik_biz в Telegram
```

## Деплой на Vercel

1. Запушити на GitHub
2. Імпортувати на [vercel.com](https://vercel.com)
3. Додати змінні середовища:
   - `TMDB_API_KEY`
   - `KODIK_TOKEN`

## Як працює відеоплеєр

Без `KODIK_TOKEN` — кнопка "Відео незабаром"  
З `KODIK_TOKEN` — кнопка "▶ Дивитись" → плеєр з відео

Kodik шукає відео по IMDB ID (фільми) або назві (серіали/аніме).  
Автоматично підбирає українську озвучку якщо є.
