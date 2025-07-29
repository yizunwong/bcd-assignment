
export default function SystemAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-16 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {children}
    </div>
  );
}