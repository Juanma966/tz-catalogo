'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/productos', label: 'Productos', icon: Package },
  { href: '/catalogos', label: 'Catálogos', icon: BookOpen },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="px-6 py-5 border-b border-slate-800">
        <h1 className="text-lg font-bold text-white tracking-tight">
          CatálogoPDF
        </h1>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            )}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
