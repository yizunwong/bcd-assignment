import { Navbar } from '@/src/components/shared/Navbar';
import { Footer } from 'react-day-picker';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar role="admin" />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}