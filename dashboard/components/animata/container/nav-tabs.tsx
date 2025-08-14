"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface NavTab {
  href: string;
  label: string;
  icon?: LucideIcon;
}

interface TabProps {
  tab: NavTab;
  selected: boolean;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

export default function NavTabs({ tabs, className }: { tabs: NavTab[]; className?: string }) {
  const pathname = usePathname();
  const [selected, setSelected] = useState<string>(pathname);

  useEffect(() => {
    setSelected(pathname);
  }, [pathname]);

  return (
    <div
      className={cn(
        "w-full flex flex-wrap items-center justify-center gap-4 rounded-md bg-slate-100 dark:bg-slate-900 p-6",
        className,
      )}
    >
      {tabs.map((tab) => (
        <Tab tab={tab} selected={selected === tab.href} setSelected={setSelected} key={tab.href} />
      ))}
    </div>
  );
}

const Tab = ({ tab, selected, setSelected }: TabProps) => {
  const Icon = tab.icon;
  return (
    <Link
      href={tab.href}
      onClick={() => setSelected(tab.href)}
      className={cn(
        "relative flex items-center justify-center gap-1 rounded-md p-2 text-sm transition-all min-w-20",
        selected
          ? "text-slate-900 dark:text-white"
          : "text-slate-600 dark:text-slate-300 hover:font-black",
      )}
    >
      {Icon && <Icon className="relative z-50 h-4 w-4" />}
      <p className="relative z-50 text-center">{tab.label}</p>
      {selected && (
        <motion.span
          layoutId="tabs"
          transition={{ type: "spring", duration: 0.5 }}
          className="absolute inset-0 rounded-sm bg-slate-300 dark:bg-slate-700"
        />
      )}
    </Link>
  );
};

