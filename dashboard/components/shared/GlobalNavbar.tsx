'use client';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Navbar } from './Navbar';

interface DecodedToken {
  app_metadata?: {
    role?: string;
  };
  [key: string]: any;
}

type Role = 'policyholder' | 'admin' | 'system-admin';

export default function GlobalNavbar() {
  const [role, setRole] = useState<Role | undefined>();

  useEffect(() => {
    const cookieString = document.cookie;
    const match = cookieString.match(/(?:^|; )access_token=([^;]+)/);
    if (!match) {
      setRole(undefined);
      return;
    }

    try {
      const token = decodeURIComponent(match[1]);
      const decoded = jwtDecode<DecodedToken>(token);
      const rawRole = decoded.app_metadata?.role;
      switch (rawRole) {
        case 'policyholder':
          setRole('policyholder');
          break;
        case 'admin':
        case 'insurance_admin':
          setRole('admin');
          break;
        case 'system_admin':
          setRole('system-admin');
          break;
        default:
          setRole(undefined);
      }
    } catch (err) {
      console.error('Failed to decode token', err);
      setRole(undefined);
    }
  }, []);

  return <Navbar role={role} />;
}
