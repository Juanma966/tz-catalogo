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

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex w-full lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors',
            pathname === href
              ? 'text-blue-600'
              : 'text-gray-400 hover:text-gray-700'
          )}
        >
          <Icon size={20} strokeWidth={pathname === href ? 2.5 : 1.8} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
};
