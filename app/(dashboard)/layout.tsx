import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/features/common/components/Sidebar';
import { Header } from '@/features/common/components/Header';
import { BottomNav } from '@/features/common/components/BottomNav';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 lg:p-6 overflow-auto pb-20 lg:pb-6">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
