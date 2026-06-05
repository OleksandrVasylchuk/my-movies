'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Головна' },
  { href: '/movies', label: 'Фільми' },
  { href: '/series', label: 'Серіали' },
  { href: '/anime', label: 'Аніме' },
  { href: '/cartoons', label: 'Мультфільми' },
  { href: '/search', label: '🔍' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-bg-primary/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center flex-shrink-0">
            <span className="text-xl font-black tracking-tight">
              <span className="text-white">UA</span>
              <span className="text-gold">Кіно</span>
            </span>
          </Link>

          <div className="flex items-center gap-0.5 overflow-x-auto">
            {links.map(({ href, label }) => {
              const isActive =
                href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-gold bg-gold/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
