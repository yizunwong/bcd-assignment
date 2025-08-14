"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface FluidTab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface FluidTabsProps {
  tabs: FluidTab[];
  defaultTab?: string;
  value?: string;
  onValueChange?: (tabId: string) => void;
  renderContent?: boolean;
}

export default function FluidTabs({
  tabs,
  defaultTab,
  value,
  onValueChange,
  renderContent = true,
}: FluidTabsProps) {
  const initialTab = defaultTab ?? tabs[0]?.id;
  const [internalActiveTab, setInternalActiveTab] = useState(initialTab);
  const activeTab = value ?? internalActiveTab;
  const [touchedTab, setTouchedTab] = useState<string | null>(null);
  const [prevActiveTab, setPrevActiveTab] = useState(initialTab);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (value !== undefined && value !== activeTab) {
      setPrevActiveTab(activeTab);
    }
  }, [value]);

  const handleTabClick = (tabId: string) => {
    setPrevActiveTab(activeTab);
    if (onValueChange) {
      onValueChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
    setTouchedTab(tabId);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setTouchedTab(null);
    }, 300);
  };

  const getTabIndex = (tabId: string) => tabs.findIndex((tab) => tab.id === tabId);

  return (
    <div className="space-y-6">
      <div className="relative flex w-full space-x-2 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 shadow-lg">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeTab}
            className="absolute inset-y-0 my-1 rounded-2xl bg-white dark:bg-slate-700"
            initial={{ x: `${getTabIndex(prevActiveTab) * 100}%` }}
            animate={{ x: `${getTabIndex(activeTab) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width: `${100 / tabs.length}%` }}
          />
        </AnimatePresence>
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`relative z-10 flex w-full items-center justify-center gap-1.5 px-5 py-3 text-sm font-bold transition-colors duration-300 ${
              activeTab === tab.id
                ? "text-slate-900 dark:text-slate-100"
                : "text-slate-500"
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>
      {renderContent && (
        <div>
          {tabs.map((tab) => (
            <div key={tab.id} hidden={tab.id !== activeTab}>
              {tab.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

