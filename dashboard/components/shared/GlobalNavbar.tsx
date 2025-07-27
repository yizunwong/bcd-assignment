"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

type Role = "policyholder" | "admin" | "system-admin";

export default function GlobalNavbar() {
  const pathname = usePathname();

  let role: Role | undefined;

  if (pathname.startsWith("/policyholder")) {
    role = "policyholder";
  } else if (pathname.startsWith("/admin")) {
    role = "admin";
  } else if (pathname.startsWith("/system-admin")) {
    role = "system-admin";
  }

  return <Navbar role={role} />;
}
