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
  LogIn,
  LogOut,
  Monitor,
  Plus,
  Search,
  Shield,
  Star,
  User,
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

interface DockItem {
  title: string;
  href?: string;
  icon: React.ReactNode;
  action?: "logout";
}

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

  const defaultItems: DockItem[] = [
    { title: "Home", href: "/", icon: <Home className="h-full w-full" /> },
    { title: "Solutions", href: "/solutions", icon: <Shield className="h-full w-full" /> },
    { title: "How It Works", href: "/how-it-works", icon: <BookOpen className="h-full w-full" /> },
    { title: "Benefits", href: "/benefits", icon: <Star className="h-full w-full" /> },
    { title: "Plans", href: "/plans", icon: <DollarSign className="h-full w-full" /> },
    { title: "Help", href: "/help", icon: <HelpCircle className="h-full w-full" /> },
    { title: "Login", href: "/auth/login", icon: <LogIn className="h-full w-full" /> },
  ];

  const roleItems: Record<Role, DockItem[]> = {
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

  const getProfileLink = (r: Role) => {
    switch (r) {
      case "policyholder":
        return "/policyholder/profile";
      case "admin":
        return "/admin/profile";
      case "system-admin":
        return "/system-admin/profile";
      default:
        return "/profile";
    }
  };

  const items: DockItem[] = role
    ? [
        ...roleItems[role],
        { title: "Profile", href: getProfileLink(role), icon: <User className="h-full w-full" /> },
        { title: "Logout", icon: <LogOut className="h-full w-full" />, action: "logout" },
      ]
    : defaultItems;

  return (
    <AnimatedDock
      items={items}
      largeClassName="fixed top-6 left-1/2 -translate-x-1/2 z-50"
      smallClassName="fixed top-6 left-1/2 -translate-x-1/2 z-50"
    />
  );
}

