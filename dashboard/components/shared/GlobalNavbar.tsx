import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { Navbar } from './Navbar';

export const dynamic = 'force-dynamic';

interface DecodedToken {
  app_metadata?: {
    role?: string;
  };
  [key: string]: any;
}

type Role = 'policyholder' | 'admin' | 'system-admin';

export default function GlobalNavbar() {
  const cookieStore = cookies();
  const token = cookieStore.get('access_token')?.value;

  let role: Role | undefined;

  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const rawRole = decoded.app_metadata?.role;
      switch (rawRole) {
        case 'policyholder':
          role = 'policyholder';
          break;
        case 'admin':
        case 'insurance_admin':
          role = 'admin';
          break;
        case 'system_admin':
          role = 'system-admin';
          break;
        default:
          role = undefined;
      }
    } catch (err) {
      console.error('Failed to decode token', err);
    }
  }

  return <Navbar role={role} />;
}
