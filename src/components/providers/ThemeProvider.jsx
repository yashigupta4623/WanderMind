import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => null,
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children, defaultTheme = 'light', storageKey = 'wandermind-theme' }) => {
  // Initialize theme synchronously from storage or system to avoid flashes
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return stored;
    } catch {}
    if (defaultTheme === 'system') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return defaultTheme || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  // Apply theme by toggling only the 'dark' class on html (Tailwind expects this)
  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.toggle('dark', isDark);
    // Set color-scheme so native UI (forms, scrollbars) match
    root.style.colorScheme = isDark ? 'dark' : 'light';
  }, [theme]);

  // Persist theme and respond to system changes when theme === 'system'
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, theme);
    } catch {}

    if (!window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (theme === 'system') {
        const isDark = media.matches;
        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
      }
    };
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme: (next) => {
      try {
        localStorage.setItem(storageKey, next);
      } catch {}
      setTheme(next);
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};