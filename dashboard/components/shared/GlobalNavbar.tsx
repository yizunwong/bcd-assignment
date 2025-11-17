import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { Navbar } from "./Navbar";

export const dynamic = "force-dynamic";

interface DecodedToken {
  app_metadata?: {
    role?: string;
  };
  sub?: string;
  [key: string]: any;
}

type Role = "policyholder" | "admin" | "system-admin";

export default async function GlobalNavbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  let role: Role | undefined;
  let userId: string | undefined;

  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const rawRole =
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
      userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      switch (rawRole) {
        case "policyholder":
          role = "policyholder";
          break;
        case "insurance_admin":
          role = "admin";
          break;
        case "system_admin":
          role = "system-admin";
          break;
        default:
          role = undefined;
      }
    } catch (err) {
      console.error("Failed to decode token", err);
    }
  }

  return <Navbar initialRole={role} initialUserId={userId} />;
}
