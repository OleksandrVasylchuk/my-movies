import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'КіноХаб — Фільми та серіали',
    template: '%s | КіноХаб',
  },
  description: 'Знайди свій наступний улюблений фільм. Тренди, пошук, акторський склад і рецензії.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={inter.variable}>
      <body className="bg-bg-primary text-white antialiased min-h-screen font-sans">
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
