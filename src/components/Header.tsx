import React, { useEffect, useRef, useState } from 'react';
import { DiceIcon } from './DiceIcon';
import { Home, Info, Globe, Sparkles, Sun, Moon } from 'lucide-react';
import { LANGS, type Lang } from '@/lib/i18n';
import { useTheme } from '@/hooks/use-theme';

interface HeaderProps {
  onHome?: () => void;
  onInfo?: () => void;
  onSecretTap?: (taps: number) => void;
  onSecretLongPress?: () => void;
  onLogoTextClick?: () => void;
  onRandom?: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  iconStatus?: 'normal' | 'premium' | 'test';
}

export function Header({ onHome, onInfo, onSecretTap, onSecretLongPress, onLogoTextClick, onRandom, lang, setLang, iconStatus = 'normal' }: HeaderProps) {
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFired = useRef(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    if (!langOpen) return;
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    const t = setTimeout(() => document.addEventListener('mousedown', onClick), 0);
    const auto = setTimeout(() => setLangOpen(false), 4500);
    return () => { clearTimeout(t); clearTimeout(auto); document.removeEventListener('mousedown', onClick); };
  }, [langOpen]);

  function handleIconTap() {
    if (longPressFired.current) { longPressFired.current = false; return; }
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    // Wait a bit after every tap; only fire once the user stops tapping.
    // 5–9 taps => premium toggle (unlock). 10+ taps => normal mode (downgrade).
    tapTimer.current = setTimeout(() => {
      const n = tapCount.current;
      tapCount.current = 0;
      if (n >= 5) onSecretTap?.(n);
    }, 700);
  }

  function startLongPress() {
    longPressFired.current = false;
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => {
      longPressFired.current = true;
      tapCount.current = 0;
      if (tapTimer.current) clearTimeout(tapTimer.current);
      onSecretLongPress?.();
    }, 1500);
  }
  function cancelLongPress() {
    if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
  }

  const currentLang = LANGS.find(l => l.code === lang);

  const iconBtn = "flex items-center justify-center w-9 h-9 rounded-xl border border-foreground/10 dark:border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-foreground/5 transition-all duration-200 active:scale-90";

  return (
    <header className="w-full py-4 flex items-center justify-between gap-2">
      {/* Left cluster */}
      <div className="flex items-center gap-2">
        {onHome && (
          <button onClick={onHome} aria-label="Accueil" className={iconBtn}>
            <Home className="w-4 h-4" />
          </button>
        )}
        {onRandom && (
          <button onClick={onRandom} aria-label="Mission aléatoire" className={iconBtn}
            style={{ borderColor: 'rgba(249,115,22,0.35)', color: '#f97316' }}>
            <Sparkles className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Center logo */}
      <div className="flex items-center gap-2 select-none">
        <button onClick={handleIconTap}
          onPointerDown={startLongPress}
          onPointerUp={cancelLongPress}
          onPointerLeave={cancelLongPress}
          onPointerCancel={cancelLongPress}
          aria-label="Blacklace"
          style={{ WebkitTapHighlightColor: 'transparent', background: 'none', border: 'none', padding: 0, cursor: 'default', touchAction: 'manipulation' }}
          className="active:scale-90 transition-transform duration-100">
          <DiceIcon status={iconStatus} />
        </button>
        <button onClick={onLogoTextClick} aria-label="Intro Blacklace"
          style={{ WebkitTapHighlightColor: 'transparent', background: 'none', border: 'none', padding: 0 }}
          className="active:scale-95 transition-transform duration-100">
          <h1 className="text-sm font-display font-bold tracking-[0.2em] uppercase text-foreground/80 hover:text-foreground transition-colors duration-200">
            Blacklace
          </h1>
        </button>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-2">
        <button onClick={toggle} aria-label="Changer le thème" className={iconBtn}>
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div ref={langRef} className="relative">
          <button onClick={() => setLangOpen(o => !o)} aria-label="Langue"
            className={iconBtn + " gap-1 w-auto px-2.5"}>
            <span className="text-base leading-none">{currentLang?.flag}</span>
            <Globe className="w-3 h-3 opacity-60" />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-11 z-40 rounded-xl p-1.5 flex flex-col gap-1 min-w-[110px]"
              style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', boxShadow: '0 8px 24px rgba(0,0,0,0.35)' }}>
              {LANGS.map(l => (
                <button key={l.code}
                  onClick={() => { setLang(l.code); setLangOpen(false); }}
                  className={"flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all " +
                    (lang === l.code ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground")}>
                  <span>{l.flag}</span><span>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {onInfo && (
          <button onClick={onInfo} aria-label="À propos" className={iconBtn}>
            <Info className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
