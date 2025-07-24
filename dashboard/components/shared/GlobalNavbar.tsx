'use client';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

export default function GlobalNavbar() {
  const pathname = usePathname();

  let role: 'policyholder' | 'admin' | 'system-admin' | undefined;
  if (pathname.startsWith('/policyholder')) {
    role = 'policyholder';
  } else if (pathname.startsWith('/admin')) {
    role = 'admin';
  } else if (pathname.startsWith('/system-admin')) {
    role = 'system-admin';
  }

  return <Navbar role={role} />;
}
