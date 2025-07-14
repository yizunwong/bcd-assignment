'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    // Simple two-state toggle: light ↔ dark
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const getIcon = () => {
    if (theme === 'dark') {
      return <Moon className="w-4 h-4" />;
    }
    return <Sun className="w-4 h-4" />;
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark mode';
      case 'dark':
        return 'Switch to light mode';
      case 'system':
        return 'Using system theme';
      default:
        return 'Toggle theme';
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0 transition-all duration-300 hover:scale-105"
      aria-label={getLabel()}
      title={getLabel()}
    >
      <div className="transition-transform duration-300 hover:rotate-12">
        {getIcon()}
      </div>
    </Button>
  );
}