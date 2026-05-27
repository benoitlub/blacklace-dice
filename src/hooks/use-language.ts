import { useState, useEffect } from 'react';
import type { Lang } from '@/lib/i18n';

const STORAGE_KEY = 'bld_lang';

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    return stored ?? 'fr';
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  return { lang, setLang };
}
