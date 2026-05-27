import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';
const KEY = 'bld_theme';

function readTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return (localStorage.getItem(KEY) as Theme) || 'dark';
}

function applyTheme(t: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(t);
  root.style.colorScheme = t;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readTheme);

  useEffect(() => { applyTheme(theme); }, [theme]);

  const setTheme = (t: Theme) => {
    localStorage.setItem(KEY, t);
    setThemeState(t);
  };
  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  return { theme, setTheme, toggle };
}
