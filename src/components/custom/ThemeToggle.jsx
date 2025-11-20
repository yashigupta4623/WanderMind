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
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full p-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5">
        <Sun className="absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute inset-0 w-5 h-5 text-blue-400 transition-all duration-300 -rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
      </div>
    </Button>
  );
};

export default ThemeToggle;