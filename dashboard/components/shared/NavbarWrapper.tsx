'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

export type Role = 'policyholder' | 'admin' | 'system-admin' | undefined;

interface NavbarWrapperProps {
  role?: Role;
}

export default function NavbarWrapper({ role }: NavbarWrapperProps) {
  const pathname = usePathname();

  if (pathname.startsWith('/auth')) {
    return null;
  }

  return <Navbar role={role} />;
}
