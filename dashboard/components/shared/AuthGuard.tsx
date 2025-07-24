'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/app/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  role?: 'policyholder' | 'admin' | 'system-admin';
}

export default function AuthGuard({ children, role }: AuthGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoadingUser } = useAuth();

  useEffect(() => {
    if (!isLoadingUser) {
      if (!isAuthenticated) {
        router.replace('/auth/login');
      } else if (role && user?.role !== role) {
        router.replace('/');
      }
    }
  }, [isAuthenticated, isLoadingUser, role, router, user]);

  if (!isAuthenticated || isLoadingUser || (role && user?.role !== role)) {
    return null;
  }

  return <>{children}</>;
}
