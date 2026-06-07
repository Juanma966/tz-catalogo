import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
//import { AuthProvider } from '@/features/auth/hooks/useAuth';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Generador de Catálogos PDF',
  description: 'Crea y comparte catálogos de precios en PDF',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        {children}
      </body>
    </html>
  );
}
