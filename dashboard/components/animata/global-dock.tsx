import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import AnimatedDock from "./animated-dock";
import {
  BarChart3,
  BookOpen,
  Code,
  DollarSign,
  Download,
  FileText,
  HelpCircle,
  Home,
  Monitor,
  Plus,
  Search,
  Shield,
  Star,
  Users,
} from "lucide-react";
import React from "react";

export const dynamic = "force-dynamic";

interface DecodedToken {
  app_metadata?: {
    role?: string;
  };
  [key: string]: any;
}

type Role = "policyholder" | "admin" | "system-admin";

export default async function GlobalDock() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  let role: Role | undefined;

  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const rawRole = decoded.app_metadata?.role;
      switch (rawRole) {
        case "policyholder":
          role = "policyholder";
          break;
        case "admin":
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

  const defaultItems = [
    { title: "Home", href: "/", icon: <Home className="h-full w-full" /> },
    { title: "Solutions", href: "/solutions", icon: <Shield className="h-full w-full" /> },
    { title: "How It Works", href: "/how-it-works", icon: <BookOpen className="h-full w-full" /> },
    { title: "Benefits", href: "/benefits", icon: <Star className="h-full w-full" /> },
    { title: "Plans", href: "/plans", icon: <DollarSign className="h-full w-full" /> },
    { title: "Help", href: "/help", icon: <HelpCircle className="h-full w-full" /> },
  ];

  const roleItems: Record<Role, { title: string; href: string; icon: React.ReactNode }[]> = {
    policyholder: [
      { title: "Dashboard", href: "/policyholder", icon: <Home className="h-full w-full" /> },
      { title: "Browse", href: "/policyholder/browse", icon: <Search className="h-full w-full" /> },
      { title: "Coverage", href: "/policyholder/coverage", icon: <Shield className="h-full w-full" /> },
      { title: "Claims", href: "/policyholder/claims", icon: <FileText className="h-full w-full" /> },
    ],
    admin: [
      { title: "Dashboard", href: "/admin", icon: <BarChart3 className="h-full w-full" /> },
      { title: "Claims", href: "/admin/claims", icon: <FileText className="h-full w-full" /> },
      { title: "Policies", href: "/admin/policies", icon: <Plus className="h-full w-full" /> },
      { title: "Reports", href: "/admin/reports", icon: <Download className="h-full w-full" /> },
    ],
    "system-admin": [
      { title: "Monitoring", href: "/system-admin", icon: <Monitor className="h-full w-full" /> },
      { title: "Users", href: "/system-admin/users", icon: <Users className="h-full w-full" /> },
      { title: "Contracts", href: "/system-admin/contracts", icon: <Code className="h-full w-full" /> },
    ],
  };

  const items = role ? roleItems[role] : defaultItems;

  return (
    <AnimatedDock
      items={items}
      largeClassName="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      smallClassName="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    />
  );
}

