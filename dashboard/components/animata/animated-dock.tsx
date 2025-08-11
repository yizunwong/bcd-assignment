'use client';

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { Menu, X } from "lucide-react";

interface AnimatedDockProps {
  items: { title: string; icon: React.ReactNode; href: string }[];
  largeClassName?: string;
  smallClassName?: string;
}

export default function AnimatedDock({ items, largeClassName, smallClassName }: AnimatedDockProps) {
  return (
    <>
      <LargeDock items={items} className={largeClassName} />
      <SmallDock items={items} className={smallClassName} />
    </>
  );
}

const LargeDock = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  const mouseXPosition = useMotionValue(Infinity);
  return (
    <motion.nav
      onMouseMove={(e) => mouseXPosition.set(e.pageX)}
      onMouseLeave={() => mouseXPosition.set(Infinity)}
      className={cn(
        "glass-card mx-auto hidden h-16 items-end gap-4 rounded-2xl px-4 pb-3 md:flex",
        className,
      )}
    >
      {items.map((item) => (
        <DockIcon mouseX={mouseXPosition} key={item.title} {...item} />
      ))}
    </motion.nav>
  );
};

function DockIcon({
  mouseX,
  title,
  icon,
  href,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const distanceFromMouse = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distanceFromMouse, [-150, 0, 150], [40, 80, 40]);
  const heightTransform = useTransform(distanceFromMouse, [-150, 0, 150], [40, 80, 40]);
  const iconWidthTransform = useTransform(distanceFromMouse, [-150, 0, 150], [20, 40, 20]);
  const iconHeightTransform = useTransform(distanceFromMouse, [-150, 0, 150], [20, 40, 20]);

  const width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  const height = useSpring(heightTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  const iconWidth = useSpring(iconWidthTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  const iconHeight = useSpring(iconHeightTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-white/20 text-slate-800 shadow-lg backdrop-blur-md dark:bg-slate-800/40 dark:text-slate-200"
      >
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit -translate-x-1/2 whitespace-pre rounded-md border border-white/20 bg-white/80 px-2 py-0.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: iconWidth, height: iconHeight }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </Link>
  );
}

const SmallDock = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10, transition: { delay: index * 0.05 } }}
                transition={{ delay: (items.length - 1 - index) * 0.05 }}
              >
                <Link
                  href={item.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-slate-800 shadow-md backdrop-blur-md dark:bg-slate-800/40 dark:text-slate-200"
                >
                  <div className="h-4 w-4">{item.icon}</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-slate-800 shadow-md backdrop-blur-md dark:bg-slate-800/40 dark:text-slate-200"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </nav>
  );
};

