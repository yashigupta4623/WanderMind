import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/providers/ThemeProvider';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5">
        <Sun className="absolute inset-0 w-5 h-5 transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute inset-0 w-5 h-5 transition-all duration-300 -rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
      </div>
    </Button>
  );
};

export default ThemeToggle;