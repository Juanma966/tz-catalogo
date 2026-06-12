import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { PWARegister } from '@/components/PWARegister';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'TZ Catalogos',
  description: 'Crea y comparte catálogos de precios en PDF',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TZ Catalogos',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#2563EB" />
        <link rel="apple-touch-icon" href="/icon-512.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <PWARegister />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
