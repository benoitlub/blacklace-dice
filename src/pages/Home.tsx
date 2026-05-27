import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { RollingDice } from '@/components/RollingDice';
import { CyclopsEye, CyclopsModeBadge, CyclopsWatermark, DionysusEye, FeuchHexIcon, BeletteEyeIcon, ActionTargetIcon, SocialWaveIcon } from '@/components/CyclopsEye';
import { InfoModal } from '@/components/InfoModal';
import { useStats, useDailyLimit } from '@/hooks/use-stats';
import { useLanguage } from '@/hooks/use-language';
import { useAgeGroup, AGE_GROUPS, adjustDuration, type AgeGroup } from '@/hooks/use-age';
import type { EvalScore } from '@/hooks/use-stats';
import { categories, Category } from '@/lib/categories';
import { CHARACTERS, PSYCHO_PROFILES, PsychoProfile, generatePalette } from '@/lib/characters';
import { playRollSound, playRevealSound, playSuccessSound } from '@/lib/sound';
import { Play, Pause, X, CheckCircle2, Dice6, ChevronRight, ChevronDown, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getUI, getAtmosphericPhrases, getCategoryText, getComboText,
  getCharacterText, getProfileText, LANGS,
  SPIRIT_PHRASES, SPIRIT_AMBIENT, SPIRIT_DONE, SPIRIT_SKIP,
  ENGAGE_PRESETS, ENGAGE_OUTCOMES, ENGAGE_TWISTS, ENGAGE_UI, ENGAGE_MESSAGES,
  MOOD_STATES, MOOD_UI, PAYWALL_UI, HISTORY_UI, QCM_UI,
  type Lang, type EngageModifier,
} from '@/lib/i18n';

// ── Types ─────────────────────────────────────────────────────────────────────

type GameMode = 'actions' | 'personnages' | 'profil' | 'engagement';
type ViewState =
  | 'onboard' | 'mode-select' | 'qcm' | 'modes'
  | 'home' | 'mood-check' | 'rolling' | 'result' | 'double-rolling' | 'combo-result' | 'timer'
  | 'char-home' | 'char-rolling' | 'char-palette' | 'char-timer'
  | 'profil-home' | 'profil-rolling' | 'profil-result' | 'profil-timer'
  | 'engage-home' | 'engage-rolling' | 'engage-result'
  | 'tension' | 'eval' | 'success' | 'paywall' | 'history';

interface TimerMeta { emoji: string; title: string; color: string; missionDetail?: string; example?: string; }

// Strip explicit duration mentions from a mission text — the on-screen timer
// already shows it, so repeating it inside the description is noise (and wrong
// when the duration was rolled by the dice).
function stripTime(s?: string): string {
  if (!s) return '';
  return s
    // Compound: "pendant 5 minutes", "for 25 min", "durante 10 minutos", "during 5 mn"
    .replace(/\b(?:pendant|durant|for|durante|during)\s+(?:au\s+moins\s+|at\s+least\s+|al\s+menos\s+)?\d+\s*(?:minutes?|mins?|mn|minutos?)\b\.?/gi, '')
    // "Travaille 25 min", "Marche 15 minutes", "Continue 20 minutes"
    .replace(/\b\d+\s*(?:minutes?|mins?|mn|minutos?)\s+de\s+/gi, '')
    // Standalone "20 minutes" / "5 min" / "25 mn" / "10 minutos"
    .replace(/\b\d+\s*(?:minutes?|mins?|mn|minutos?)\b\.?/gi, '')
    // dangling French/Spanish prepositions left over: "pendant ", "durant ", "durante "
    .replace(/\b(?:pendant|durant|durante|during|for)\s+(?=[.,;!?]|$)/gi, '')
    // collapse whitespace before punctuation
    .replace(/\s+([.,;!?])/g, '$1')
    // remove "  " and double dots/commas
    .replace(/\s{2,}/g, ' ')
    .replace(/\.{2,}/g, '.')
    .replace(/,\s*,/g, ',')
    // strip orphaned punctuation at the start
    .replace(/^[\s.,;:]+/, '')
    .trim();
}
type PaletteItem = { character: typeof CHARACTERS[0]; minutes: number };

// ── Helpers ───────────────────────────────────────────────────────────────────

const pageVariants = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -16, scale: 0.97, transition: { duration: 0.25, ease: 'easeIn' } },
};

function vibrate(p: number | number[]) {
  if (typeof window !== 'undefined' && navigator?.vibrate) navigator.vibrate(p);
}
function pickRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function pickTwo(arr: Category[]): [Category, Category] {
  const a = pickRandom(arr);
  return [a, pickRandom(arr.filter(c => c.id !== a.id))];
}
function fmt(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Home() {
  const { lang, setLang } = useLanguage();
  const ui = useMemo(() => getUI(lang), [lang]);

  const [view, setView] = useState<ViewState>('mode-select');
  const [mode, setMode] = useState<GameMode>('actions');
  const [manualPickOpen, setManualPickOpen] = useState(false);
  const [frictionOpen, setFrictionOpen] = useState(false);
  const [cancelToast, setCancelToast] = useState(false);
  const [tension, setTension] = useState<{ mission: string; emoji: string; color: string; start: () => void } | null>(null);
  useEffect(() => { if (view !== 'mode-select') { setManualPickOpen(false); setFrictionOpen(false); } if (view !== 'tension') setTension(null); }, [view]);
  const [phrase, setPhrase] = useState(() => pickRandom(getAtmosphericPhrases('fr')));

  // Actions mode state
  const [category, setCategory] = useState<Category | null>(null);
  const [comboCategories, setComboCategories] = useState<[Category, Category] | null>(null);
  const [selectedExample, setSelectedExample] = useState<number | null>(null);
  const [isPickingExample, setIsPickingExample] = useState(false);
  const DURATION_OPTIONS = [5, 10, 15, 20, 30, 45];
  const [rolledDuration, setRolledDuration] = useState<number | null>(null);
  const [isPickingDuration, setIsPickingDuration] = useState(false);

  // Personnages mode state
  const [palette, setPalette] = useState<PaletteItem[]>([]);
  const [paletteIdx, setPaletteIdx] = useState(0);
  const paletteRef = useRef<PaletteItem[]>([]);
  const paletteIdxRef = useRef(0);

  // Profil mode state
  const [currentProfile, setCurrentProfile] = useState<PsychoProfile | null>(null);
  const [profilDuration, setProfilDuration] = useState<number | null>(null);
  const [isPickingProfilDuration, setIsPickingProfilDuration] = useState(false);
  const PROFIL_DURATION_OPTIONS = [15, 30, 45, 60, 90];

  // Shared timer — timestamp-based so it keeps counting in background tabs
  // and survives page reload / app close (state is mirrored to localStorage).
  const [timerMeta, setTimerMeta] = useState<TimerMeta | null>(null);
  const [timeLeft, setTimeLeft] = useState(30 * 60);   // seconds, derived
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const endsAtRef = useRef<number | null>(null);       // epoch ms when running
  const remainingMsRef = useRef<number>(0);            // ms left when paused
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimerEndRef = useRef<() => void>(() => {});
  const restoredRef = useRef(false);                   // prevents persist before restore

  // Timer control helpers — keep refs and state in sync.
  const startTimerSeconds = useCallback((seconds: number) => {
    const ms = Math.max(0, Math.round(seconds * 1000));
    endsAtRef.current = Date.now() + ms;
    remainingMsRef.current = 0;
    setTimeLeft(Math.ceil(ms / 1000));
    setIsTimerRunning(true);
  }, []);
  const pauseTimer = useCallback(() => {
    if (endsAtRef.current != null) {
      const left = Math.max(0, endsAtRef.current - Date.now());
      remainingMsRef.current = left;
      endsAtRef.current = null;
      setTimeLeft(Math.ceil(left / 1000));
    }
    setIsTimerRunning(false);
  }, []);
  const resumeTimer = useCallback(() => {
    const ms = remainingMsRef.current > 0 ? remainingMsRef.current : timeLeft * 1000;
    endsAtRef.current = Date.now() + ms;
    remainingMsRef.current = 0;
    setIsTimerRunning(true);
  }, [timeLeft]);
  const togglePause = useCallback(() => {
    if (isTimerRunning) pauseTimer(); else resumeTimer();
  }, [isTimerRunning, pauseTimer, resumeTimer]);
  const stopTimer = useCallback(() => {
    endsAtRef.current = null;
    remainingMsRef.current = 0;
    setIsTimerRunning(false);
  }, []);

  const { stats, recordCompletion, recordEvaluation, recordSession, clearSessions } = useStats();
  const { canPlay, playsLeft, consumePlay, isPremium, isTestMode, toggleTestMode, unlockPremium, lockPremium, resetDaily } = useDailyLimit();
  const [devToast, setDevToast] = useState('');
  const { ageGroup, setAgeGroup } = useAgeGroup();
  const [ageModalOpen, setAgeModalOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [onboardStep, setOnboardStep] = useState(0);
  const [diceFlash, setDiceFlash] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallError, setPaywallError] = useState('');
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [introOverlayOpen, setIntroOverlayOpen] = useState(false);
  const [introOverlayStep, setIntroOverlayStep] = useState(0);

  // Auto-open intro overlay on first visit
  useEffect(() => {
    if (!localStorage.getItem('bld_onboarded')) {
      setIntroOverlayStep(0);
      setIntroOverlayOpen(true);
    }
  }, []);

  const closeIntroOverlay = () => {
    localStorage.setItem('bld_onboarded', '1');
    setIntroOverlayOpen(false);
    if (!localStorage.getItem('bld_age_group')) setAgeModalOpen(true);
  };

  // Spirit system
  const [spiritPhrase, setSpiritPhrase] = useState<string>('');
  const [completionMsg, setCompletionMsg] = useState<string>('');

  // Mood check
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [pendingDoubleRoll, setPendingDoubleRoll] = useState(false);

  // QCM state (answers stored as option indices, not display strings)
  const [qcmStep, setQcmStep] = useState<0 | 1 | 2>(0);
  const [qcmAnswers, setQcmAnswers] = useState<{ q1: number | null; q2: number | null; q3: number | null }>({ q1: null, q2: null, q3: null });
  const [inferredModeName, setInferredModeName] = useState<string>('');

  // Engagement mode state
  const [engageMission, setEngageMission] = useState('');
  const [engageCustom, setEngageCustom] = useState('');
  const [engageOutcomeIdx, setEngageOutcomeIdx] = useState<number>(3);
  const [engageTwist, setEngageTwist] = useState('');
  const [engageCharacter, setEngageCharacter] = useState<typeof CHARACTERS[0] | null>(null);
  const [engageDuration, setEngageDuration] = useState<number | null>(null);
  const [isPickingEngageDuration, setIsPickingEngageDuration] = useState(false);

  // Keep refs in sync
  useEffect(() => { paletteRef.current = palette; }, [palette]);
  useEffect(() => { paletteIdxRef.current = paletteIdx; }, [paletteIdx]);

  // Update the timer-end callback whenever relevant state changes
  useEffect(() => {
    onTimerEndRef.current = () => {
      if (view === 'char-timer') {
        const idx = paletteIdxRef.current;
        const pal = paletteRef.current;
        if (idx < pal.length - 1) {
          const next = idx + 1;
          setPaletteIdx(next);
          paletteIdxRef.current = next;
          startTimerSeconds(pal[next].minutes * 60);
          vibrate([40, 20, 40]);
          playRevealSound();
        } else {
          finishSession();
        }
      } else {
        finishSession();
      }
    };
  }, [view]);

  // ── Timer tick (timestamp-based, survives background tabs) ────────────────
  useEffect(() => {
    const tick = () => {
      const endsAt = endsAtRef.current;
      if (endsAt == null) return;
      const leftMs = endsAt - Date.now();
      if (leftMs <= 0) {
        endsAtRef.current = null;
        remainingMsRef.current = 0;
        setTimeLeft(0);
        setIsTimerRunning(false);
        onTimerEndRef.current();
      } else {
        setTimeLeft(Math.ceil(leftMs / 1000));
      }
    };
    if (isTimerRunning) {
      tick();                                      // immediate sync
      timerRef.current = setInterval(tick, 500);
      const onVis = () => { if (!document.hidden) tick(); };
      document.addEventListener('visibilitychange', onVis);
      window.addEventListener('focus', tick);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        document.removeEventListener('visibilitychange', onVis);
        window.removeEventListener('focus', tick);
      };
    }
    if (timerRef.current) clearInterval(timerRef.current);
    return undefined;
  }, [isTimerRunning]);

  // ── Persist active timer to localStorage ──────────────────────────────────
  // Saves the minimum needed to resume the same view + timer after reload/close.
  useEffect(() => {
    if (!restoredRef.current) return;            // skip until first restore pass
    try {
      if (timerMeta && (isTimerRunning || remainingMsRef.current > 0)) {
        localStorage.setItem('bld_timer_state', JSON.stringify({
          v: 1,
          view, mode,
          timerMeta,
          palette, paletteIdx,
          endsAt: isTimerRunning ? endsAtRef.current : null,
          remainingMs: !isTimerRunning ? remainingMsRef.current : 0,
          isRunning: isTimerRunning,
          savedAt: Date.now(),
        }));
      } else {
        localStorage.removeItem('bld_timer_state');
      }
    } catch { /* quota / disabled */ }
  }, [view, mode, timerMeta, palette, paletteIdx, isTimerRunning, timeLeft]);

  // ── Restore timer on mount ────────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem('bld_timer_state');
      if (raw) {
        const s = JSON.parse(raw) as {
          v: number; view: ViewState; mode: GameMode;
          timerMeta: TimerMeta | null;
          palette: PaletteItem[]; paletteIdx: number;
          endsAt: number | null; remainingMs: number; isRunning: boolean;
        };
        if (s.v === 1 && s.timerMeta) {
          setMode(s.mode);
          setTimerMeta(s.timerMeta);
          if (s.palette?.length) { setPalette(s.palette); setPaletteIdx(s.paletteIdx ?? 0); }
          if (s.isRunning && s.endsAt) {
            const leftMs = s.endsAt - Date.now();
            if (leftMs > 0) {
              endsAtRef.current = s.endsAt;
              remainingMsRef.current = 0;
              setTimeLeft(Math.ceil(leftMs / 1000));
              setView(s.view);
              setIsTimerRunning(true);
            } else {
              // Time elapsed while away — drop straight into eval
              endsAtRef.current = null;
              remainingMsRef.current = 0;
              setTimeLeft(0);
              setView('eval');
            }
          } else if (s.remainingMs > 0) {
            endsAtRef.current = null;
            remainingMsRef.current = s.remainingMs;
            setTimeLeft(Math.ceil(s.remainingMs / 1000));
            setView(s.view);
            setIsTimerRunning(false);
          }
        }
      }
    } catch { /* corrupted */ }
    restoredRef.current = true;
  }, []);

  // Refresh phrase on home — 1-in-4 chance of ambient spirit phrase
  useEffect(() => {
    if (view === 'home') {
      const useAmbient = Math.random() < 0.25;
      setPhrase(useAmbient ? pickRandom(SPIRIT_AMBIENT[lang]) : pickRandom(getAtmosphericPhrases(lang)));
    }
  }, [view, lang]);

  // ── PayPal return URL detection ─────────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const subscriptionId = params.get('subscription_id');
    if (!subscriptionId) return;

    // Clean URL immediately
    window.history.replaceState({}, '', window.location.pathname);

    // Verify subscription with backend
    fetch(`/api/paypal/subscription/${subscriptionId}`)
      .then((r) => r.json())
      .then((data: { active: boolean }) => {
        if (data.active) {
          unlockPremium();
          localStorage.setItem('bld_subscription_id', subscriptionId);
        }
      })
      .catch(() => {
        // Silent fallback — subscription id stored for manual check
        localStorage.setItem('bld_subscription_id', subscriptionId);
      });
  }, []);

  // ── PayPal SDK button ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!paywallOpen) return;

    const PAYPAL_CLIENT_ID = 'AaYUcuWqDgncfwHyKeQyA87BBGp_He4XztArXToFpanLAaGYOvhPedVIyWyrRq37AfamC54z2RwfT_EC';
    const PLAN_ID = 'P-5Y48399227183293NNHN4KEA';
    const SCRIPT_ID = 'paypal-sdk-script';

    type PayPalActions = {
      subscription: { create: (opts: { plan_id: string }) => Promise<string> };
    };
    type PayPalData = { subscriptionID: string };

    const renderButton = () => {
      const container = paypalContainerRef.current;
      const w = window as unknown as { paypal?: { Buttons: (o: unknown) => { render: (s: string) => void } } };
      if (!container || !w.paypal) return;
      container.innerHTML = '';
      const pp = w.paypal;
      pp.Buttons({
        style: { shape: 'pill', color: 'gold', layout: 'vertical', label: 'subscribe' },
        createSubscription: (_data: unknown, actions: PayPalActions) =>
          actions.subscription.create({ plan_id: PLAN_ID }),
        onApprove: (data: PayPalData) => {
          unlockPremium();
          localStorage.setItem('bld_subscription_id', data.subscriptionID);
          fetch(`/api/paypal/subscription/${data.subscriptionID}`).catch(() => {});
          setPaywallOpen(false);
          setPaywallError('');
        },
        onError: () => {
          setPaywallError('Erreur lors du paiement. Réessaie.');
        },
      }).render('#paypal-button-container');
    };

    if (document.getElementById(SCRIPT_ID)) {
      renderButton();
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    script.setAttribute('data-sdk-integration-source', 'button-factory');
    script.onload = renderButton;
    document.body.appendChild(script);
  }, [paywallOpen]);

  // ── Session finish → eval screen ───────────────────────────────────────────
  const finishSession = useCallback(() => {
    stopTimer();
    setTimerMeta(null);
    try { localStorage.removeItem('bld_timer_state'); } catch { /* noop */ }
    vibrate([50, 30, 50]);
    setView('eval');
  }, [stopTimer]);

  const handleEval = (score: EvalScore) => {
    recordCompletion();
    recordEvaluation(mode, score);
    recordSession(mode, selectedMood, score);
    setCompletionMsg(pickRandom(SPIRIT_DONE[lang]));
    vibrate([80, 40, 80, 40, 120]);
    playSuccessSound();
    setView('success');
  };

  // ── Navigation ──────────────────────────────────────────────────────────────
  const goModeSelect = () => {
    pauseTimer();
    setInferredModeName('');
    setView('mode-select');
  };

  const goTo = (fn: () => void, delay = 660) => {
    setDiceFlash(true);
    setTimeout(() => { setDiceFlash(false); fn(); }, delay);
  };

  const launchRandom = () => {
    if (!canPlay) { setPaywallOpen(true); return; }
    const modes: GameMode[] = ['actions', 'personnages', 'profil', 'engagement'];
    const m = modes[Math.floor(Math.random() * 4)];
    goTo(() => selectMode(m));
  };

  const launchQcm = () => {
    if (!canPlay) { setPaywallOpen(true); return; }
    setQcmStep(0);
    setQcmAnswers({ q1: null, q2: null, q3: null });
    setInferredModeName('');
    vibrate([20]);
    setView('qcm');
  };

  const selectMode = (m: GameMode) => {
    setMode(m);
    setInferredModeName('');
    vibrate([20]);
    if (m === 'actions') setView('home');
    else if (m === 'personnages') setView('char-home');
    else if (m === 'profil') setView('profil-home');
    else { setEngageMission(''); setEngageCustom(''); setView('engage-home'); }
  };

  // ── Actions mode handlers ───────────────────────────────────────────────────
  const handleRoll = () => {
    if (!canPlay) { setPaywallOpen(true); return; }
    consumePlay();
    setSelectedExample(null); setRolledDuration(null);
    setSelectedMood(null); setPendingDoubleRoll(false);
    setView('mood-check');
  };

  const handleDoubleRoll = () => {
    if (!canPlay) { setPaywallOpen(true); return; }
    consumePlay();
    setSelectedExample(null); setRolledDuration(null);
    setSelectedMood(null); setPendingDoubleRoll(true);
    setView('mood-check');
  };

  const handleRollAfterMood = () => {
    if (pendingDoubleRoll) {
      vibrate([30, 20, 30, 20, 30]); playRollSound();
      setView('double-rolling');
      setTimeout(() => {
        const [c1, c2] = pickTwo(categories);
        setComboCategories([c1, c2]);
        setSpiritPhrase(pickRandom(SPIRIT_PHRASES[lang]));
        vibrate([40, 20, 80]); playRevealSound(); setView('combo-result');
      }, 1200);
    } else {
      vibrate([30, 20, 30]); playRollSound();
      setView('rolling');
      setTimeout(() => {
        setCategory(pickRandom(categories));
        setSpiritPhrase(pickRandom(SPIRIT_PHRASES[lang]));
        vibrate([60]); playRevealSound(); setView('result');
      }, 1050);
    }
  };

  // ── QCM → mode inference ────────────────────────────────────────────────────

  // q2 index → game mode
  const inferMode = (intention: number | null, direction: number | null, context: number | null): GameMode => {
    // Q1 intention → base mode
    const BASE: GameMode[] = ['actions', 'personnages', 'profil', 'engagement'];
    let m: GameMode = BASE[intention ?? 0] ?? 'actions';
    // Q2 direction: 1=transform → shift to next mode in cycle
    if (direction === 1) {
      const idx = BASE.indexOf(m);
      m = BASE[(idx + 1) % 4];
    }
    // Q3 context overrides
    if (context === 0 && m === 'engagement') m = 'profil';   // seul → pas de social
    if (context === 1 && m === 'profil') m = 'actions';       // dehors → action
    if (context === 2 && m === 'actions') m = 'engagement';   // avec qqun + action → social
    if (context === 3 && m === 'engagement') m = 'profil';    // public → discret
    return m;
  };

  const MODE_LABELS: Record<Lang, Record<GameMode, string>> = {
    fr: { actions: 'Focus — Mission concrète', personnages: 'Flow — Expression & jeu', profil: 'Reset — Archétype du jour', engagement: 'Social — Décision déléguée' },
    en: { actions: 'Focus — Concrete mission', personnages: 'Flow — Expression & play', profil: 'Reset — Archetype of the day', engagement: 'Social — Delegated decision' },
    es: { actions: 'Focus — Misión concreta', personnages: 'Flow — Expresión & juego', profil: 'Reset — Arquetipo del día', engagement: 'Social — Decisión delegada' },
  };

  // intention index → mood id
  const Q1_TO_MOOD: Record<number, string> = {
    0: 'motivated', 1: 'charged', 2: 'tired', 3: 'scattered',
  };

  const handleQcmRoll = () => {
    if (!canPlay) { setPaywallOpen(true); return; }
    consumePlay();
    const m = inferMode(qcmAnswers.q1, qcmAnswers.q2, qcmAnswers.q3);
    setMode(m);
    setInferredModeName(MODE_LABELS[lang][m]);
    setSelectedMood(qcmAnswers.q1 !== null ? (Q1_TO_MOOD[qcmAnswers.q1] ?? null) : null);
    setSpiritPhrase('');
    if (m === 'actions') {
      setSelectedExample(null); setRolledDuration(null);
      vibrate([30, 20, 30]); playRollSound(); setView('rolling');
      setTimeout(() => {
        setCategory(pickRandom(categories));
        setSpiritPhrase(pickRandom(SPIRIT_PHRASES[lang]));
        vibrate([60]); playRevealSound(); setView('result');
      }, 1050);
    } else if (m === 'personnages') {
      vibrate([30, 20, 30]); playRollSound(); setView('char-rolling');
      setTimeout(() => {
        const pal = generatePalette(4);
        setPalette(pal); paletteRef.current = pal;
        setPaletteIdx(0); paletteIdxRef.current = 0;
        vibrate([60]); playRevealSound(); setView('char-palette');
      }, 1050);
    } else if (m === 'profil') {
      setProfilDuration(null);
      vibrate([30, 20, 30]); playRollSound(); setView('profil-rolling');
      setTimeout(() => {
        setCurrentProfile(pickRandom(PSYCHO_PROFILES));
        setSpiritPhrase(pickRandom(SPIRIT_PHRASES[lang]));
        vibrate([60]); playRevealSound(); setView('profil-result');
      }, 1050);
    } else {
      // engagement: pick a random preset as the default mission
      const preset = pickRandom(ENGAGE_PRESETS[lang]);
      setEngageMission(preset); setEngageCustom(''); setEngageDuration(null);
      vibrate([30, 20, 30]); playRollSound(); setView('engage-rolling');
      setTimeout(() => {
        const idx = Math.floor(Math.random() * 6);
        setEngageOutcomeIdx(idx);
        const modifier = ENGAGE_OUTCOMES[lang][idx].modifier;
        if (modifier === 'twist') setEngageTwist(pickRandom(ENGAGE_TWISTS[lang]));
        if (modifier === 'character') setEngageCharacter(pickRandom(CHARACTERS));
        vibrate([40, 20, 80]); playRevealSound(); setView('engage-result');
      }, 1200);
    }
  };

  // ── Actions example / duration handlers ────────────────────────────────────
  const handlePickExample = (exampleCount: number) => {
    if (isPickingExample) return;
    setIsPickingExample(true); setSelectedExample(null);
    vibrate([20, 15, 20]); playRollSound();
    setTimeout(() => {
      setSelectedExample(Math.floor(Math.random() * exampleCount));
      setIsPickingExample(false); vibrate([40]); playRevealSound();
    }, 700);
  };

  const handlePickDuration = () => {
    if (isPickingDuration) return;
    setIsPickingDuration(true); setRolledDuration(null);
    vibrate([20, 15, 20]); playRollSound();
    setTimeout(() => {
      setRolledDuration(DURATION_OPTIONS[Math.floor(Math.random() * DURATION_OPTIONS.length)]);
      setIsPickingDuration(false); vibrate([40]); playRevealSound();
    }, 700);
  };

  const startActionTimer = (meta: TimerMeta) => {
    const baseMins = rolledDuration ?? 30;
    const adjustedMins = adjustDuration(baseMins, ageGroup);
    const catText = category ? getCategoryText(category.id, lang) : null;
    const example = (catText && selectedExample !== null) ? catText.examples[selectedExample] : undefined;
    const missionLine = stripTime(example || catText?.mission || meta.title);
    setTension({
      mission: missionLine, emoji: meta.emoji, color: meta.color,
      start: () => {
        setTimerMeta({ ...meta, missionDetail: catText?.mission, example });
        startTimerSeconds(adjustedMins * 60);
        setView('timer');
      },
    });
    setView('tension');
  };

  // ── Personnages mode handlers ───────────────────────────────────────────────
  const handleGeneratePalette = () => {
    if (!canPlay) { setPaywallOpen(true); return; }
    consumePlay();
    setSelectedMood(null);
    vibrate([30, 20, 30]); playRollSound();
    setView('char-rolling');
    setTimeout(() => {
      const pal = generatePalette(4);
      setPalette(pal); paletteRef.current = pal;
      setPaletteIdx(0); paletteIdxRef.current = 0;
      vibrate([60]); playRevealSound(); setView('char-palette');
    }, 1050);
  };

  const handleRegeneratePalette = () => {
    vibrate([20, 15, 20]); playRollSound();
    setTimeout(() => {
      const pal = generatePalette(4);
      setPalette(pal); paletteRef.current = pal;
      setPaletteIdx(0); paletteIdxRef.current = 0;
      vibrate([40]); playRevealSound();
    }, 600);
  };

  const startPaletteTimer = () => {
    if (!palette.length) return;
    const first = palette[0];
    const charText = getCharacterText(first.character.id, lang);
    setTension({
      mission: charText.name, emoji: first.character.emoji, color: first.character.color,
      start: () => {
        setPaletteIdx(0); paletteIdxRef.current = 0;
        setTimerMeta({ emoji: first.character.emoji, title: charText.name, color: first.character.color });
        startTimerSeconds(first.minutes * 60);
        setView('char-timer');
      },
    });
    setView('tension');
  };

  const skipToNextCharacter = () => {
    const idx = paletteIdxRef.current;
    const pal = paletteRef.current;
    if (idx < pal.length - 1) {
      const next = idx + 1;
      setPaletteIdx(next); paletteIdxRef.current = next;
      const nextChar = pal[next].character;
      setTimerMeta({ emoji: nextChar.emoji, title: getCharacterText(nextChar.id, lang).name, color: nextChar.color });
      startTimerSeconds(pal[next].minutes * 60);
      vibrate([30, 15, 30]); playRevealSound();
    } else {
      finishSession();
    }
  };

  // ── Profil mode handlers ────────────────────────────────────────────────────
  const handleRollProfile = () => {
    if (!canPlay) { setPaywallOpen(true); return; }
    consumePlay();
    setSelectedMood(null);
    setProfilDuration(null);
    vibrate([30, 20, 30]); playRollSound();
    setView('profil-rolling');
    setTimeout(() => {
      setCurrentProfile(pickRandom(PSYCHO_PROFILES));
      setSpiritPhrase(pickRandom(SPIRIT_PHRASES[lang]));
      vibrate([60]); playRevealSound(); setView('profil-result');
    }, 1050);
  };

  const handlePickProfilDuration = () => {
    if (isPickingProfilDuration) return;
    setIsPickingProfilDuration(true); setProfilDuration(null);
    vibrate([20, 15, 20]); playRollSound();
    setTimeout(() => {
      setProfilDuration(PROFIL_DURATION_OPTIONS[Math.floor(Math.random() * PROFIL_DURATION_OPTIONS.length)]);
      setIsPickingProfilDuration(false); vibrate([40]); playRevealSound();
    }, 700);
  };

  const startProfilTimer = () => {
    if (!currentProfile) return;
    const pText = getProfileText(currentProfile.id, lang);
    const baseMins = profilDuration ?? 30;
    const adjustedMins = adjustDuration(baseMins, ageGroup);
    setTension({
      mission: pText.name, emoji: currentProfile.emoji, color: currentProfile.color,
      start: () => {
        setTimerMeta({ emoji: currentProfile.emoji, title: pText.name, color: currentProfile.color, missionDetail: pText.essence });
        startTimerSeconds(adjustedMins * 60);
        setView('profil-timer');
      },
    });
    setView('tension');
  };

  // ── Engagement mode handlers ────────────────────────────────────────────────
  const handleEngageRoll = () => {
    const mission = engageCustom.trim() || engageMission;
    if (!mission) return;
    if (!canPlay) { setPaywallOpen(true); return; }
    consumePlay();
    setSelectedMood(null);
    setEngageDuration(null);
    vibrate([30, 20, 30]); playRollSound();
    setView('engage-rolling');
    setTimeout(() => {
      const idx = Math.floor(Math.random() * 6);
      setEngageOutcomeIdx(idx);
      const modifier = ENGAGE_OUTCOMES[lang][idx].modifier;
      if (modifier === 'twist') setEngageTwist(pickRandom(ENGAGE_TWISTS[lang]));
      if (modifier === 'character') setEngageCharacter(pickRandom(CHARACTERS));
      vibrate([40, 20, 80]); playRevealSound(); setView('engage-result');
    }, 1200);
  };

  const handlePickEngageDuration = (options: number[]) => {
    if (isPickingEngageDuration) return;
    setIsPickingEngageDuration(true); setEngageDuration(null);
    vibrate([20, 15, 20]); playRollSound();
    setTimeout(() => {
      setEngageDuration(options[Math.floor(Math.random() * options.length)]);
      setIsPickingEngageDuration(false); vibrate([40]); playRevealSound();
    }, 700);
  };

  const startEngageTimer = (options: number[]) => {
    const mission = engageCustom.trim() || engageMission;
    const baseMins = engageDuration ?? options[Math.floor(options.length / 2)];
    const adjustedMins = adjustDuration(baseMins, ageGroup);
    setTension({
      mission: stripTime(mission), emoji: '◆', color: '#a855f7',
      start: () => {
        setTimerMeta({ emoji: '◆', title: mission, color: '#a855f7', missionDetail: mission });
        startTimerSeconds(adjustedMins * 60);
        setView('timer');
      },
    });
    setView('tension');
  };

  // ── Shared ──────────────────────────────────────────────────────────────────
  const cancelTimer = () => {
    stopTimer();
    setTimerMeta(null);
    try { localStorage.removeItem('bld_timer_state'); } catch { /* noop */ }
    setCancelToast(true);
    setTimeout(() => setCancelToast(false), 2200);
    setView('mode-select');
  };

  const showHomeBtn = view !== 'mode-select';

  // ── Sub-components ─────────────────────────────────────────────────────────

  const DurationPicker = ({ meta, color, options = DURATION_OPTIONS, value, picking, onPick, onStart }:
    { meta: TimerMeta; color: string; options?: number[]; value: number | null; picking: boolean; onPick: () => void; onStart: () => void }) => (
    <div className="space-y-3 pt-1">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center justify-center py-3 rounded-2xl border transition-all duration-300"
          style={{ borderColor: value ? `${color}40` : 'rgba(255,255,255,0.08)', background: value ? `${color}10` : 'transparent' }}>
          <AnimatePresence mode="wait">
            {picking ? (
              <motion.span key="pick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-sm text-muted-foreground italic">{ui.pickingDot}</motion.span>
            ) : value ? (
              <motion.span key={value} initial={{ opacity: 0, scale: 0.6, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="font-display font-bold text-2xl tabular-nums"
                style={{ color, textShadow: `0 0 16px ${color}60` }}>
                {value}<span className="text-sm font-semibold ml-1 opacity-70">{ui.durationUnit}</span>
              </motion.span>
            ) : (
              <motion.span key="def" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-sm text-muted-foreground">
                <span className="font-display font-bold text-foreground/80">{options[Math.floor(options.length / 2)]}</span>
                <span className="ml-1 opacity-60">{ui.durationUnit}</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <button onClick={onPick} disabled={picking}
          className={cn("flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-2xl border transition-all duration-200 active:scale-95",
            picking ? "opacity-60 cursor-not-allowed border-foreground/8" : "border-foreground/10 hover:border-foreground/25 hover:bg-foreground/5")}
          style={value && !picking ? { borderColor: `${color}40`, background: `${color}08` } : {}}>
          <motion.span animate={picking ? { rotate: 360 } : { rotate: 0 }}
            transition={picking ? { duration: 0.4, repeat: Infinity, ease: 'linear' } : {}} style={{ display: 'inline-flex' }}>
            <Dice6 className="w-5 h-5" style={{ color: value && !picking ? color : undefined }} />
          </motion.span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{ui.durationLabel}</span>
        </button>
      </div>
      <button onClick={onStart}
        className="w-full py-4 rounded-2xl font-display font-bold text-base tracking-wide text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: `linear-gradient(135deg, ${color}dd, ${color})`, boxShadow: `0 0 24px -4px ${color}80` }}>
        <AnimatePresence mode="wait">
          <motion.span key={value ?? 'def'} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.2 }} className="block">
            {ui.startBtn(value ?? options[Math.floor(options.length / 2)])}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(hsl(var(--foreground) / 0.07) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
      }} />
      {/* Cyclops watermark — fixed behind everything */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          style={{ filter: 'blur(0.5px)' }}>
          <CyclopsWatermark size={340} />
        </motion.div>
      </div>

      {/* Purple + orange aurora glow on home */}
      {view === 'mode-select' && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.24, 0.15] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full"
            style={{ background: 'radial-gradient(circle, #a855f7 0%, #7c3aed80 40%, transparent 75%)' }}
          />
          <motion.div
            animate={{ scale: [1, 1.14, 1], opacity: [0.10, 0.20, 0.10] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[280px] h-[280px] rounded-full"
            style={{ background: 'radial-gradient(circle, #f97316 0%, #ea580c55 40%, transparent 75%)' }}
          />
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.16, 0.08] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full"
            style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
          />
        </div>
      )}

      {/* ── Dev toast ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {devToast && (
          <motion.div key="dev-toast" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.25 }}
            className="fixed top-4 left-1/2 z-[100] -translate-x-1/2 px-5 py-2.5 rounded-2xl text-sm font-semibold"
            style={{ background: 'rgba(168,85,247,0.9)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 20px rgba(168,85,247,0.5)' }}>
            {devToast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col min-h-[100dvh] px-5 pb-10 pt-2">

        <Header
          onHome={showHomeBtn ? goModeSelect : undefined}
          onInfo={() => setInfoOpen(true)}
          onRandom={view === 'mode-select' ? launchQcm : undefined}
          lang={lang}
          setLang={setLang}
          onLogoTextClick={() => { setIntroOverlayStep(0); setIntroOverlayOpen(true); }}
          iconStatus={isTestMode ? 'test' : (isPremium ? 'premium' : 'normal')}
          onSecretTap={(taps) => {
            if (taps >= 10) {
              lockPremium();
              resetDaily();
              setDevToast('🔒 Mode normal — abonnement désactivé');
            } else {
              unlockPremium();
              resetDaily();
              setDevToast(isPremium ? '🔓 Limite réinitialisée' : '🔓 Premium activé + compteur reset');
            }
            setTimeout(() => setDevToast(''), 3000);
          }}
          onSecretLongPress={() => {
            const next = toggleTestMode();
            resetDaily();
            setDevToast(next ? '🧪 Mode test activé — illimité' : '🧪 Mode test désactivé');
            setTimeout(() => setDevToast(''), 3000);
          }}
        />

        <main className="flex-1 flex flex-col justify-center items-center">
          <AnimatePresence mode="wait">

            {/* ══ ONBOARD / PRELOAD ════════════════════════════════════════════ */}
            {view === 'onboard' && (() => {
              const qcmUI = QCM_UI[lang];
              const steps = qcmUI.onboardSteps;
              const step = steps[onboardStep];
              const isLast = onboardStep === steps.length - 1;
              const ONBOARD_ICONS: Record<string, React.ReactNode> = {
                '⬡': <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(249,115,22,0.1)', border: '1.5px solid rgba(249,115,22,0.35)', boxShadow: '0 0 24px rgba(249,115,22,0.35)' }}><FeuchHexIcon size={58} color="#f97316" /></div>,
                '◈': <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)', border: '1.5px solid rgba(59,130,246,0.35)', boxShadow: '0 0 24px rgba(59,130,246,0.35)' }}><BeletteEyeIcon size={58} color="#3b82f6" /></div>,
                '🔒': <CyclopsEye size={52} color="#6366f1" glow pulse />,
                '⚡': <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)', border: '1.5px solid rgba(245,158,11,0.35)', boxShadow: '0 0 24px rgba(245,158,11,0.35)' }}><ActionTargetIcon size={58} color="#f59e0b" /></div>,
              };
              const finishOnboard = () => {
                localStorage.setItem('bld_onboarded', '1');
                setView('mode-select');
                if (!localStorage.getItem('bld_age_group')) setAgeModalOpen(true);
              };
              return (
                <motion.div key="onboard" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                  className="w-full flex flex-col items-center justify-center min-h-[70vh] gap-8 px-2">

                  {/* Step card */}
                  <AnimatePresence mode="wait">
                    {(() => {
                      const isWarning = onboardStep === steps.length - 1;
                      return (
                        <motion.div key={onboardStep}
                          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                          transition={{ duration: 0.28, ease: 'easeInOut' }}
                          className="w-full rounded-3xl p-8 space-y-5 text-center"
                          style={isWarning
                            ? { background: 'linear-gradient(160deg, #1a1200 0%, #1f1500 100%)', border: '1px solid rgba(245,158,11,0.35)', boxShadow: '0 0 60px -15px rgba(245,158,11,0.3)' }
                            : { background: 'linear-gradient(160deg, #0f0f1a 0%, #1a1033 100%)', border: '1px solid rgba(168,85,247,0.2)', boxShadow: '0 0 60px -15px rgba(168,85,247,0.35)' }}>
                          <motion.div className="flex justify-center"
                            animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                            {ONBOARD_ICONS[step.icon] ?? <span className="text-5xl">{step.icon}</span>}
                          </motion.div>
                          <h2 className="text-2xl font-display font-bold leading-tight"
                            style={isWarning
                              ? { background: 'linear-gradient(135deg, #fff 55%, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                              : { background: 'linear-gradient(135deg, #fff 55%, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {step.title}
                          </h2>
                          <p
                            className={`text-sm leading-relaxed max-w-xs mx-auto ${isWarning ? '' : 'text-muted-foreground/75'}`}
                            style={{ color: isWarning ? 'rgba(245,158,11,0.7)' : undefined }}>
                            {step.body}
                          </p>
                          {isWarning && (
                            <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'rgba(245,158,11,0.4)' }}>
                              PayPal · 2,90€ / mois · sans engagement
                            </p>
                          )}
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>

                  {/* Dots indicator */}
                  <div className="flex items-center gap-2">
                    {steps.map((_, i) => (
                      <motion.div key={i}
                        animate={{ width: i === onboardStep ? 24 : 8, opacity: i === onboardStep ? 1 : 0.3 }}
                        transition={{ duration: 0.25 }}
                        className="h-1.5 rounded-full bg-primary" />
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="w-full space-y-3">
                    <motion.button
                      onClick={() => isLast ? finishOnboard() : setOnboardStep(s => s + 1)}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-5 rounded-3xl font-display font-bold text-xl tracking-wider text-white transition-all duration-200"
                      style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', boxShadow: '0 0 40px -8px rgba(168,85,247,0.6)' }}>
                      {isLast ? qcmUI.onboardStart : qcmUI.onboardNext}
                    </motion.button>
                    {!isLast && (
                      <button onClick={finishOnboard}
                        className="w-full text-xs text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors">
                        {qcmUI.ageModalSkip}
                      </button>
                    )}
                  </div>

                </motion.div>
              );
            })()}

            {/* ══ HOME (landing) ═══════════════════════════════════════════════ */}
            {view === 'mode-select' && (() => {
              const qcmUI = QCM_UI[lang];
              const MODE_ICONS = [ActionTargetIcon, FeuchHexIcon, BeletteEyeIcon, SocialWaveIcon];
              const modeColors = ['#a855f7', '#f97316', '#3b82f6', '#ec4899'];
              const gameModes: GameMode[] = ['actions', 'personnages', 'profil', 'engagement'];
              return (
                <motion.div key="mode-select" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                  className="w-full flex flex-col items-center gap-5">

                  {/* ── Active mission banner (top, unmissable) ──────────────── */}
                  {timerMeta && timeLeft > 0 && (
                    <motion.button
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setView('timer')}
                      className="w-full text-left rounded-3xl p-3.5 flex items-center gap-3 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${timerMeta.color}28 0%, ${timerMeta.color}10 100%)`,
                        border: `2px solid ${timerMeta.color}80`,
                        boxShadow: `0 0 36px -6px ${timerMeta.color}b0, inset 0 0 20px ${timerMeta.color}10`,
                      }}>
                      <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-y-0 w-1/3 pointer-events-none"
                        style={{ background: `linear-gradient(90deg, transparent, ${timerMeta.color}25, transparent)` }} />
                      <div className="relative shrink-0">
                        <motion.div
                          animate={isTimerRunning ? { scale: [1, 1.25, 1], opacity: [0.45, 0.85, 0.45] } : { opacity: 0.5 }}
                          transition={{ duration: 1.4, repeat: Infinity }}
                          className="absolute inset-0 rounded-2xl"
                          style={{ background: timerMeta.color, filter: 'blur(10px)' }} />
                        <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                          style={{ background: `${timerMeta.color}35`, border: `1px solid ${timerMeta.color}90` }}>
                          {timerMeta.emoji}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 relative">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[9px] uppercase tracking-[0.22em] font-bold" style={{ color: timerMeta.color }}>
                            {isTimerRunning
                              ? (lang === 'fr' ? '● mission en cours' : lang === 'es' ? '● misión en curso' : '● mission running')
                              : (lang === 'fr' ? '⏸ en pause' : lang === 'es' ? '⏸ en pausa' : '⏸ paused')}
                          </span>
                        </div>
                        <p className="font-display font-bold text-sm text-foreground leading-tight truncate">
                          {timerMeta.missionDetail || timerMeta.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {qcmUI.resumeMission} · <span className="font-bold tabular-nums" style={{ color: timerMeta.color }}>{fmt(timeLeft)}</span>
                        </p>
                      </div>
                      <ChevronDown className="w-5 h-5 -rotate-90 shrink-0 relative" style={{ color: timerMeta.color }} />
                    </motion.button>
                  )}

                  {/* Hero */}
                  <div className="text-center space-y-2 pt-2 flex flex-col items-center">
                    <motion.h1
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.02, type: 'spring', bounce: 0.35 }}
                      className="text-[2rem] font-display font-bold leading-tight tracking-tight"
                      style={{ background: 'linear-gradient(135deg, hsl(var(--foreground)) 60%, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {qcmUI.heroTitle.split('\n').map((line, i) => <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>)}
                    </motion.h1>
                    <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.18, type: 'spring', bounce: 0.45 }}>
                      <CyclopsEye size={44} color="#f97316" glow pulse chaos />
                    </motion.div>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
                      className="text-sm text-muted-foreground leading-relaxed">
                      {qcmUI.heroSubtitle}
                    </motion.p>
                  </div>

                  {/* Primary CTA — single huge "Décide pour moi" button */}
                  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.32, type: 'spring', bounce: 0.35 }}
                    className="w-full space-y-3 pt-1">
                    <motion.button
                      onClick={launchRandom}
                      whileTap={{ scale: 0.96 }}
                      className="w-full relative overflow-hidden rounded-3xl py-7 px-6 font-display font-bold text-2xl tracking-wider text-white"
                      style={{
                        background: 'linear-gradient(135deg, #a855f7, #7c3aed 55%, #ec4899)',
                        boxShadow: '0 0 60px -10px rgba(168,85,247,0.85), 0 0 100px -30px rgba(236,72,153,0.5)',
                      }}>
                      <motion.span
                        animate={{ x: ['-120%', '220%'] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-y-0 w-1/3 pointer-events-none"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }} />
                      <span className="relative">{qcmUI.decideForMe}</span>
                    </motion.button>
                    <p className="text-[11px] text-foreground/55 text-center leading-snug px-4">
                      {qcmUI.decideForMeSub}
                    </p>
                  </motion.div>

                  {/* Mode cards — always visible underneath the main CTA */}
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.45 }}
                    className="w-full">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60 text-center font-bold mb-3">
                      {qcmUI.chooseMode}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {qcmUI.modes.map((m, idx) => {
                        const color = modeColors[idx];
                        const gm = gameModes[idx];
                        const Icon = MODE_ICONS[idx];
                        const fromLeft = idx % 2 === 0;
                        return (
                          <motion.button key={idx}
                            initial={{ opacity: 0, x: fromLeft ? -40 : 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.28 + Math.floor(idx / 2) * 0.08, type: 'spring', bounce: 0.3 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => selectMode(gm)}
                            className="relative rounded-2xl p-4 flex flex-col items-center text-center gap-2.5 overflow-hidden active:opacity-90 transition-all"
                            style={{
                              background: `linear-gradient(160deg, ${color}18, ${color}08)`,
                              border: `1px solid ${color}40`,
                              boxShadow: `0 0 24px -10px ${color}80`,
                              minHeight: 168,
                            }}>
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                              style={{ background: `${color}20`, border: `1px solid ${color}45` }}>
                              <Icon size={36} color={color} />
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center gap-1 overflow-hidden w-full">
                              {/* Horizontal text slide-in (marquee-style) */}
                              <motion.p
                                initial={{ x: fromLeft ? -50 : 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.42 + idx * 0.06, duration: 0.45, ease: [0.2, 0.8, 0.4, 1] }}
                                className="glitch font-display font-bold text-sm tracking-wide"
                                data-text={m.label}
                                style={{ color }}>
                                {m.label}
                              </motion.p>
                              <motion.span
                                initial={{ x: fromLeft ? -30 : 30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 + idx * 0.06, duration: 0.4 }}
                                className="text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider"
                                style={{ background: `${color}25`, color }}>
                                {m.emotionalTag}
                              </motion.span>
                              <motion.p
                                initial={{ x: fromLeft ? -20 : 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 0.85 }}
                                transition={{ delay: 0.58 + idx * 0.06, duration: 0.45 }}
                                className="text-[10px] text-foreground/60 leading-snug line-clamp-2 px-1">
                                {m.sub}
                              </motion.p>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Stats mini */}
                  {stats.completed > 0 && (
                    <div className="flex items-center gap-6 text-center">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{ui.statSessions}</p>
                        <p className="font-display font-bold text-lg mt-0.5">{stats.completed}</p>
                      </div>
                      <div className="w-px h-8 bg-foreground/15" />
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{ui.statStreak}</p>
                        <p className="font-display font-bold text-lg mt-0.5 text-primary">{stats.streak}<span className="text-xs text-muted-foreground ml-0.5">{ui.statStreakUnit}</span></p>
                      </div>
                      {stats.sessions.length > 0 && (
                        <>
                          <div className="w-px h-8 bg-foreground/15" />
                          <button onClick={() => setView('history')} className="text-center">
                            <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{qcmUI.historyLabel}</p>
                            <p className="font-display font-bold text-lg mt-0.5 text-foreground/70">◈</p>
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Age picker — improved contrast */}
                  <button onClick={() => setAgeModalOpen(true)}
                    className="text-[11px] text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-foreground/10 hover:border-foreground/25">
                    <span className="text-sm">{AGE_GROUPS.find(g => g.id === ageGroup)?.emoji ?? '◇'}</span>
                    <span className="font-bold">{ageGroup ? QCM_UI[lang].ageGroups[AGE_GROUPS.findIndex(g => g.id === ageGroup)]?.label : qcmUI.agePlaceholder}</span>
                  </button>

                </motion.div>
              );
            })()}

            {/* ══ QCM ══════════════════════════════════════════════════════════ */}
            {view === 'qcm' && (() => {
              const qcmUI = QCM_UI[lang];
              const INTENT_COLORS = ['#a855f7', '#f97316', '#3b82f6', '#ec4899'];

              const pickAnswer = (key: 'q1' | 'q2' | 'q3', idx: number) => {
                const next = { ...qcmAnswers, [key]: idx };
                setQcmAnswers(next);
                if (qcmStep < 2) {
                  setTimeout(() => setQcmStep((s) => Math.min(s + 1, 2) as 0 | 1 | 2), 280);
                }
              };

              return (
                <motion.div key="qcm-shell" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                  className="w-full flex flex-col gap-6">

                  {/* Progress journey */}
                  {(() => {
                    const STEP_ICONS = ['🎲', '🧭', '📍'];
                    const STEP_LABELS = ['Envie', 'Direction', 'Contexte'];
                    const answerEmoji = [
                      qcmAnswers.q1 !== null ? qcmUI.qcmIntention.opts[qcmAnswers.q1]?.emoji : null,
                      qcmAnswers.q2 !== null ? qcmUI.qcmDirection.opts[qcmAnswers.q2]?.emoji : null,
                      qcmAnswers.q3 !== null ? qcmUI.qcmContext.opts[qcmAnswers.q3]?.emoji : null,
                    ];
                    return (
                      <div className="flex items-center px-2">
                        {[0, 1, 2].map((i) => {
                          const done = i < qcmStep;
                          const active = i === qcmStep;
                          return (
                            <React.Fragment key={i}>
                              <div className="flex flex-col items-center gap-1.5">
                                <motion.div
                                  animate={{
                                    background: done ? 'rgba(168,85,247,0.85)' : active ? 'rgba(168,85,247,0.18)' : 'rgba(255,255,255,0.04)',
                                    borderColor: done ? '#c084fc' : active ? '#a855f7' : 'rgba(255,255,255,0.1)',
                                    boxShadow: active ? '0 0 18px -2px rgba(168,85,247,0.75)' : 'none',
                                    scale: active ? 1.12 : 1,
                                  }}
                                  transition={{ duration: 0.3, type: 'spring', bounce: 0.3 }}
                                  className="w-11 h-11 rounded-full border-2 flex items-center justify-center text-lg relative">
                                  {done && answerEmoji[i]
                                    ? <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>{answerEmoji[i]}</motion.span>
                                    : <span style={{ opacity: active ? 1 : 0.4 }}>{STEP_ICONS[i]}</span>
                                  }
                                  {active && (
                                    <motion.div className="absolute inset-0 rounded-full border-2 border-purple-400"
                                      animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }} />
                                  )}
                                </motion.div>
                                <p className="text-[9px] uppercase tracking-widest font-bold"
                                  style={{ color: done || active ? 'rgba(168,85,247,0.9)' : 'rgba(255,255,255,0.2)' }}>
                                  {STEP_LABELS[i]}
                                </p>
                              </div>
                              {i < 2 && (
                                <div className="flex-1 mx-1.5 h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                                  <motion.div className="h-full rounded-full"
                                    animate={{ width: i < qcmStep ? '100%' : '0%', background: '#a855f7' }}
                                    transition={{ duration: 0.4, ease: 'easeInOut' }} />
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    );
                  })()}

                  <AnimatePresence mode="wait">
                    {/* ── Step 0 — Intention (2×2 big cards) ─────────────────── */}
                    {qcmStep === 0 && (
                      <motion.div key="step-0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}
                        className="flex flex-col gap-5">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 font-bold">1 / 3</p>
                          <h2 className="text-xl font-display font-bold leading-snug">{qcmUI.qcmIntention.q}</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {qcmUI.qcmIntention.opts.map((opt, idx) => {
                            const color = INTENT_COLORS[idx];
                            const selected = qcmAnswers.q1 === idx;
                            return (
                              <motion.button key={idx} onClick={() => pickAnswer('q1', idx)}
                                whileTap={{ scale: 0.95 }}
                                className="flex flex-col items-center justify-center gap-2 py-6 px-3 rounded-2xl text-center transition-all duration-150"
                                style={selected
                                  ? { background: `${color}25`, border: `2px solid ${color}`, boxShadow: `0 0 24px -6px ${color}70` }
                                  : { background: `${color}0a`, border: `1.5px solid ${color}20` }}>
                                <span className="text-3xl">{opt.emoji}</span>
                                <p className="font-display font-bold text-sm" style={{ color }}>{opt.label}</p>
                                <p className="text-[10px] text-muted-foreground/55 leading-tight">{opt.sub}</p>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* ── Step 1 — Direction (binary) ─────────────────────────── */}
                    {qcmStep === 1 && (
                      <motion.div key="step-1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}
                        className="flex flex-col gap-5">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 font-bold">2 / 3</p>
                          <h2 className="text-xl font-display font-bold leading-snug">{qcmUI.qcmDirection.q}</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {qcmUI.qcmDirection.opts.map((opt, idx) => {
                            const selected = qcmAnswers.q2 === idx;
                            const colors = ['#a855f7', '#f59e0b'];
                            const c = colors[idx];
                            return (
                              <motion.button key={idx} onClick={() => pickAnswer('q2', idx)}
                                whileTap={{ scale: 0.95 }}
                                className="flex flex-col items-center gap-3 py-8 px-4 rounded-2xl text-center transition-all duration-150"
                                style={selected
                                  ? { background: `${c}20`, border: `2px solid ${c}`, boxShadow: `0 0 24px -6px ${c}60` }
                                  : { background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.1)' }}>
                                <span className="text-4xl font-bold" style={{ color: selected ? c : 'rgba(255,255,255,0.5)' }}>
                                  {opt.emoji}
                                </span>
                                <div>
                                  <p className="font-display font-bold text-sm" style={{ color: selected ? c : 'inherit' }}>{opt.label}</p>
                                  <p className="text-[10px] text-muted-foreground/50 mt-0.5 leading-tight">{opt.sub}</p>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* ── Step 2 — Context (2×2 location grid) ───────────────── */}
                    {qcmStep === 2 && (
                      <motion.div key="step-2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}
                        className="flex flex-col gap-5">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 font-bold">3 / 3</p>
                          <h2 className="text-xl font-display font-bold leading-snug">{qcmUI.qcmContext.q}</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {qcmUI.qcmContext.opts.map((opt, idx) => {
                            const selected = qcmAnswers.q3 === idx;
                            return (
                              <motion.button key={idx} onClick={() => pickAnswer('q3', idx)}
                                whileTap={{ scale: 0.95 }}
                                className="flex flex-col items-center gap-2.5 py-5 px-3 rounded-2xl text-center transition-all duration-150"
                                style={selected
                                  ? { background: 'rgba(168,85,247,0.2)', border: '2px solid #a855f7', boxShadow: '0 0 20px -6px rgba(168,85,247,0.5)' }
                                  : { background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.1)' }}>
                                <span className="text-2xl">{opt.emoji}</span>
                                <p className="font-semibold text-xs leading-tight">{opt.label}</p>
                              </motion.button>
                            );
                          })}
                        </div>
                        {/* CTA appears after context is chosen */}
                        {qcmAnswers.q3 !== null && (
                          <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            onClick={handleQcmRoll} whileTap={{ scale: 0.97 }}
                            className="w-full py-5 rounded-3xl font-display font-bold text-lg tracking-wider text-white transition-all duration-200 mt-1"
                            style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', boxShadow: '0 0 30px -6px rgba(168,85,247,0.7)' }}>
                            {qcmUI.findBtn}
                          </motion.button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Back link */}
                  {qcmStep > 0 && (
                    <button onClick={() => setQcmStep((s) => Math.max(0, s - 1) as 0 | 1 | 2)}
                      className="text-xs text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors text-center">
                      ← retour
                    </button>
                  )}
                </motion.div>
              );
            })()}

            {/* ══ MODES (manual selection) ═════════════════════════════════════ */}
            {view === 'modes' && (
              <motion.div key="modes" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                className="w-full space-y-4">
                <div className="text-center space-y-1 pb-1">
                  <h2 className="text-xl font-display font-bold text-foreground">Choisir un mode</h2>
                  <p className="text-xs text-muted-foreground/60 italic">Sélection manuelle</p>
                </div>
                {(() => {
                  const eUI = ENGAGE_UI[lang];
                  const modeCardLabels = UI[lang].modes ?? [
                    { label: 'ACTION', sub: 'Mission concrète' },
                    { label: 'FEUCH', sub: 'Chaos maîtrisé' },
                    { label: 'BELETTE', sub: 'Archétype du jour' },
                    { label: 'SOCIAL', sub: 'Décision déléguée' },
                  ];
                  const cards = [
                    { m: 'actions' as GameMode, emoji: '🎯', title: modeCardLabels[0]?.label ?? 'ACTION', subtitle: modeCardLabels[0]?.sub ?? 'Mission concrète', color: '#a855f7' },
                    { m: 'personnages' as GameMode, emoji: '🤪', title: modeCardLabels[1]?.label ?? 'FEUCH', subtitle: modeCardLabels[1]?.sub ?? 'Chaos maîtrisé', color: '#f97316' },
                    { m: 'profil' as GameMode, emoji: '🧿', title: modeCardLabels[2]?.label ?? 'BELETTE', subtitle: modeCardLabels[2]?.sub ?? 'Archétype du jour', color: '#3b82f6' },
                    { m: 'engagement' as GameMode, emoji: '📡', title: modeCardLabels[3]?.label ?? 'SOCIAL', subtitle: modeCardLabels[3]?.sub ?? 'Décision déléguée', color: '#ec4899' },
                  ];
                  return cards.map(({ m, emoji, title, subtitle, color }) => (
                    <motion.button key={m} onClick={() => selectMode(m)}
                      whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}
                      className="w-full text-left rounded-2xl overflow-hidden transition-all duration-200"
                      style={{ background: `${color}0a`, border: `1px solid ${color}25` }}>
                      <div className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>{emoji}</div>
                        <div className="flex-1">
                          <p className="font-display font-bold text-base text-foreground">{title}</p>
                          <p className="text-xs text-muted-foreground/70">{subtitle}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                      </div>
                    </motion.button>
                  ));
                })()}
              </motion.div>
            )}

            {/* ══ ACTIONS: HOME ════════════════════════════════════════════════ */}
            {view === 'home' && (
              <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                className="w-full flex flex-col items-center text-center gap-8">
                <div className="space-y-1">
                  <h2 className="text-[2.4rem] font-display font-bold leading-tight tracking-tight text-glow">{ui.modeActions}</h2>
                  <p className="text-sm text-muted-foreground italic">{ui.actionsTagline}</p>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-primary/40 to-accent/30 blur-3xl opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                  <button onClick={handleRoll}
                    className={cn("relative h-52 w-52 rounded-full flex flex-col items-center justify-center gap-3 bg-card border border-foreground/10",
                      "shadow-[0_0_40px_-10px_hsl(var(--primary)/0.5),0_0_20px_-5px_hsl(var(--accent)/0.3)]",
                      "transition-all duration-300 active:scale-95 hover:scale-[1.03] hover:border-primary/40")}
                    aria-label={ui.rollBtn}>
                    <div className="css-die css-die--lg" aria-hidden="true">
                      {Array.from({ length: 6 }).map((_, i) => <div key={i} className="css-die-dot" />)}
                    </div>
                    <span className="font-display font-bold text-xl tracking-widest uppercase text-foreground/90">{ui.rollBtn}</span>
                  </button>
                </div>
                <button onClick={handleDoubleRoll}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-foreground/10 text-muted-foreground hover:border-foreground/20 hover:text-foreground hover:bg-foreground/5 transition-all duration-200 active:scale-95">
                  <span className="text-base">🎲🎲</span>
                  <div className="text-left">
                    <p className="text-sm font-display font-semibold text-foreground/80 leading-tight">{ui.doubleRollBtn}</p>
                    <p className="text-[10px] text-muted-foreground/70 leading-tight">{ui.doubleRollSub}</p>
                  </div>
                </button>
                <p className="text-sm text-muted-foreground/70 italic max-w-[230px]">{phrase}</p>
                {playsLeft > 0 && playsLeft <= 3 && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="text-[10px] tracking-widest uppercase text-muted-foreground/35">
                    {PAYWALL_UI[lang].playsLeftLabel(playsLeft)}
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* ══ ROLLING (single) ═════════════════════════════════════════════ */}
            {view === 'rolling' && (
              <motion.div key="rolling" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                className="w-full flex flex-col items-center justify-center gap-10">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-semibold">{ui.rollingSingle}</p>
                <motion.div animate={{ rotate: [0, -8, 8, -5, 5, 0], scale: [1, 1.05, 0.97, 1.03, 1] }}
                  transition={{ duration: 0.9, ease: 'easeInOut' }}>
                  <RollingDice color="hsl(var(--primary))" />
                </motion.div>
              </motion.div>
            )}

            {/* ══ RESULT (single) ══════════════════════════════════════════════ */}
            {view === 'result' && category && (() => {
              const catText = getCategoryText(category.id, lang);
              return (
                <motion.div key="result" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full space-y-3">
                  {inferredModeName && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
                      style={{ background: '#a855f710', border: '1px solid #a855f725' }}>
                      <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground/50">{QCM_UI[lang].modeSelected}</span>
                      <span className="text-xs font-bold text-primary/80">{inferredModeName}</span>
                    </motion.div>
                  )}
                  <div className="rounded-3xl overflow-hidden"
                    style={{ border: `1px solid ${category.color}25`, background: `radial-gradient(ellipse at top, ${category.color}12 0%, transparent 60%), hsl(var(--card))`, boxShadow: `0 0 60px -15px ${category.color}40, 0 20px 40px -20px rgba(0,0,0,0.5)` }}>
                    <div className="w-full h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${category.color}, transparent)` }} />
                    <div className="p-7 space-y-7">
                      <div className="text-center space-y-3">
                        <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', bounce: 0.5, delay: 0.05 }} className="text-6xl">{category.emoji}</motion.div>
                        <h2 className="text-4xl font-display font-bold tracking-tight"
                          style={{ color: category.color, textShadow: `0 0 30px ${category.color}50` }}>{catText.title}</h2>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: `${category.color}cc` }}>{catText.feeling}</p>
                        <p className="text-base text-foreground/75 italic leading-relaxed pt-1">"{stripTime(catText.mission)}"</p>
                        {spiritPhrase && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                            className="text-[11px] text-foreground/25 tracking-widest uppercase mt-1">
                            {spiritPhrase}
                          </motion.p>
                        )}
                      </div>
                      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${category.color}30, transparent)` }} />
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold">{ui.examplesLabel}</p>
                          <button onClick={() => handlePickExample(catText.examples.length)} disabled={isPickingExample}
                            className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all duration-200",
                              isPickingExample ? "opacity-60 cursor-not-allowed border-foreground/10 text-muted-foreground" : "border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/25 active:scale-95")}
                            style={selectedExample !== null && !isPickingExample ? { borderColor: `${category.color}50`, color: category.color } : {}}>
                            <motion.span animate={isPickingExample ? { rotate: 360 } : { rotate: 0 }}
                              transition={isPickingExample ? { duration: 0.5, repeat: Infinity, ease: 'linear' } : {}} style={{ display: 'inline-flex' }}>
                              <Dice6 className="w-3 h-3" />
                            </motion.span>
                            {isPickingExample ? ui.pickingMsg : selectedExample !== null ? ui.rePickExampleBtn : ui.pickExampleBtn}
                          </button>
                        </div>
                        <ul className="space-y-2">
                          {catText.examples.map((ex, i) => {
                            const isChosen = selectedExample === i;
                            const isDimmed = selectedExample !== null && !isChosen;
                            return (
                              <motion.li key={i} initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: isDimmed ? 0.3 : 1, x: 0, scale: isChosen ? 1.02 : 1 }}
                                transition={{ delay: isChosen ? 0 : 0.1 + i * 0.07, duration: 0.3 }}
                                className={cn("flex items-start gap-3 text-sm leading-relaxed rounded-xl px-3 py-2.5 transition-colors duration-300", isChosen ? "" : "text-foreground/70")}
                                style={isChosen ? { border: `1px solid ${category.color}35`, background: `${category.color}0d` } : { border: '1px solid transparent' }}>
                                <span className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300"
                                  style={{ backgroundColor: isChosen ? category.color : `${category.color}60`, boxShadow: isChosen ? `0 0 10px ${category.color}` : 'none', transform: isChosen ? 'scale(1.4)' : 'scale(1)' }} />
                                <span className={isChosen ? 'text-foreground font-medium' : ''}>{stripTime(ex)}</span>
                                {isChosen && (
                                  <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                                    className="ml-auto shrink-0 text-xs font-bold uppercase tracking-wider" style={{ color: category.color }}>{ui.missionTag}</motion.span>
                                )}
                              </motion.li>
                            );
                          })}
                        </ul>
                      </div>
                      <DurationPicker
                        meta={{ emoji: category.emoji, title: catText.title, color: category.color }}
                        color={category.color} value={rolledDuration} picking={isPickingDuration}
                        onPick={handlePickDuration}
                        onStart={() => startActionTimer({ emoji: category.emoji, title: catText.title, color: category.color })}
                      />
                      <button onClick={handleRoll}
                        className="w-full py-3.5 rounded-2xl font-display font-semibold text-sm text-muted-foreground border border-foreground/8 hover:border-foreground/15 hover:text-foreground hover:bg-foreground/5 transition-all duration-200">
                        {ui.rerollBtn}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {/* ══ DOUBLE ROLLING ═══════════════════════════════════════════════ */}
            {view === 'double-rolling' && (
              <motion.div key="double-rolling" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                className="w-full flex flex-col items-center justify-center gap-10">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-semibold">{ui.rollingDouble}</p>
                <div className="flex items-center gap-6">
                  <motion.div animate={{ rotate: [0, -10, 8, -5, 3, 0], scale: [1, 1.08, 0.95, 1.04, 1] }}
                    transition={{ duration: 1.0, ease: 'easeInOut' }}>
                    <RollingDice color="hsl(var(--primary))" />
                  </motion.div>
                  <span className="text-2xl font-bold text-muted-foreground/30">×</span>
                  <motion.div animate={{ rotate: [0, 10, -8, 5, -3, 0], scale: [1, 0.95, 1.08, 0.97, 1] }}
                    transition={{ duration: 1.0, ease: 'easeInOut', delay: 0.1 }}>
                    <RollingDice color="hsl(var(--accent))" />
                  </motion.div>
                </div>
                <p className="text-xs text-muted-foreground/50 tracking-widest uppercase">{ui.rollingDoubleHint}</p>
              </motion.div>
            )}

            {/* ══ COMBO RESULT ══════════════════════════════════════════════════ */}
            {view === 'combo-result' && comboCategories && (() => {
              const [c1, c2] = comboCategories;
              const c1Text = getCategoryText(c1.id, lang);
              const c2Text = getCategoryText(c2.id, lang);
              const comboText = getComboText(c1.id, c2.id, lang);
              return (
                <motion.div key="combo-result" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full">
                  <div className="rounded-3xl overflow-hidden"
                    style={{ border: `1px solid ${c1.color}25`, background: `radial-gradient(ellipse at top left, ${c1.color}10 0%, transparent 50%), radial-gradient(ellipse at bottom right, ${c2.color}10 0%, transparent 50%), hsl(var(--card))`, boxShadow: `0 0 60px -15px ${c1.color}30` }}>
                    <div className="w-full h-[3px] flex">
                      <div className="flex-1" style={{ background: c1.color }} />
                      <div className="flex-1" style={{ background: c2.color }} />
                    </div>
                    <div className="p-7 space-y-6">
                      <div className="flex items-center justify-center gap-4">
                        {[{ c: c1, ct: c1Text }, { c: c2, ct: c2Text }].map(({ c, ct }, ci) => (
                          <React.Fragment key={c.id}>
                            {ci === 1 && <span className="text-xl font-bold text-muted-foreground/30">✕</span>}
                            <motion.div initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: 'spring', bounce: 0.5, delay: 0.05 + ci * 0.05 }}
                              className="flex flex-col items-center gap-1">
                              <span className="text-4xl">{c.emoji}</span>
                              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: c.color }}>{ct.title}</span>
                            </motion.div>
                          </React.Fragment>
                        ))}
                      </div>
                      {comboText ? (
                        <>
                          <div className="text-center space-y-2">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-2xl">{comboText.emoji}</span>
                              <h2 className="text-2xl font-display font-bold">{comboText.label}</h2>
                            </div>
                            <p className="text-base text-foreground/80 italic">"{stripTime(comboText.mission)}"</p>
                            {spiritPhrase && (
                              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                                className="text-[11px] text-foreground/25 tracking-widest uppercase">
                                {spiritPhrase}
                              </motion.p>
                            )}
                          </div>
                          <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${c1.color}40, ${c2.color}40)` }} />
                          <div className="rounded-2xl px-4 py-4 space-y-2"
                            style={{ background: `${c1.color}08`, border: `1px solid ${c1.color}20` }}>
                            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold">{ui.comboDetailLabel}</p>
                            <p className="text-sm text-foreground/85 leading-relaxed">{comboText.detail}</p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <p className="text-base text-foreground/75 italic">"{stripTime(c1Text.mission + ' ' + c2Text.mission)}"</p>
                        </div>
                      )}
                      <DurationPicker
                        meta={{ emoji: comboText?.emoji ?? c1.emoji, title: comboText?.label ?? `${c1Text.title} × ${c2Text.title}`, color: c1.color }}
                        color={c1.color} value={rolledDuration} picking={isPickingDuration}
                        onPick={handlePickDuration}
                        onStart={() => startActionTimer({ emoji: comboText?.emoji ?? c1.emoji, title: comboText?.label ?? `${c1Text.title} × ${c2Text.title}`, color: c1.color })}
                      />
                      <button onClick={handleDoubleRoll}
                        className="w-full py-3.5 rounded-2xl font-display font-semibold text-sm text-muted-foreground border border-foreground/8 hover:border-foreground/15 hover:text-foreground hover:bg-foreground/5 transition-all duration-200">
                        {ui.newComboBtn}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {/* ══ ACTIONS TIMER ════════════════════════════════════════════════ */}
            {view === 'timer' && timerMeta && (
              <motion.div key="timer" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                className="w-full flex flex-col items-center justify-center gap-5">
                {/* Tiny mode chip */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ background: `${timerMeta.color}15`, border: `1px solid ${timerMeta.color}40` }}>
                  <span className="text-base leading-none">{timerMeta.emoji}</span>
                  <span className="text-[10px] uppercase tracking-[0.25em] font-bold" style={{ color: timerMeta.color }}>{timerMeta.title}</span>
                </div>

                {/* MISSION — primary focus, large & central */}
                {(timerMeta.missionDetail || timerMeta.example) && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="w-full rounded-3xl px-6 py-6 space-y-4"
                    style={{
                      background: `linear-gradient(160deg, ${timerMeta.color}22 0%, ${timerMeta.color}0a 100%)`,
                      border: `2px solid ${timerMeta.color}70`,
                      boxShadow: `0 0 40px -6px ${timerMeta.color}80, inset 0 0 24px ${timerMeta.color}10`
                    }}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: timerMeta.color }}>
                        {QCM_UI[lang].modeSelected ?? 'Mission'}
                      </span>
                      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${timerMeta.color}50, transparent)` }} />
                    </div>
                    {timerMeta.missionDetail && (
                      <p className="text-xl font-display font-bold text-foreground italic leading-snug">
                        "{stripTime(timerMeta.missionDetail)}"
                      </p>
                    )}
                    {timerMeta.example && (
                      <div className="flex items-start gap-2 pt-1 border-t" style={{ borderColor: `${timerMeta.color}25` }}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ backgroundColor: timerMeta.color }} />
                        <p className="text-sm text-foreground/85 leading-relaxed pt-1">{stripTime(timerMeta.example)}</p>
                      </div>
                    )}
                    {ageGroup && (
                      <div className="flex items-center gap-1.5 pt-2 border-t" style={{ borderColor: `${timerMeta.color}25` }}>
                        <span className="text-[10px] text-muted-foreground">{QCM_UI[lang].adaptedFor}</span>
                        <span className="text-[10px] font-bold" style={{ color: timerMeta.color }}>
                          {AGE_GROUPS.find(g => g.id === ageGroup)?.label}
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* PRIMARY validation button — HUGE, halo, unmissable */}
                <motion.button
                  onClick={finishSession}
                  initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.18, type: 'spring', bounce: 0.4 }}
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  className="w-full relative py-7 rounded-[2rem] font-display font-bold text-2xl tracking-wider text-white flex items-center justify-center gap-3"
                  style={{
                    background: `linear-gradient(135deg, ${timerMeta.color}, ${timerMeta.color}d0)`,
                    boxShadow: `0 0 48px -4px ${timerMeta.color}, 0 8px 24px -8px ${timerMeta.color}80`,
                  }}>
                  <motion.div
                    aria-hidden
                    animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -inset-1 rounded-[2rem] -z-10"
                    style={{ background: timerMeta.color, filter: 'blur(20px)', opacity: 0.45 }} />
                  <CheckCircle2 className="w-7 h-7" />
                  <span>{ui.doneBtn}</span>
                </motion.button>

                {/* Discreet timer + secondary controls */}
                <div className="flex flex-col items-center gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={isTimerRunning ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.4 }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: timerMeta.color }} />
                    <span className="font-mono text-base tabular-nums text-muted-foreground/70">{fmt(timeLeft)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={togglePause}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-card border border-foreground/10 hover:bg-foreground/5 transition-colors">
                      {isTimerRunning
                        ? <><Pause className="w-3.5 h-3.5 text-foreground/70" /><span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{ui.pauseBtn}</span></>
                        : <><Play className="w-3.5 h-3.5 text-foreground/70" /><span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{ui.resumeBtn}</span></>}
                    </button>
                    <button onClick={cancelTimer}
                      className="flex items-center gap-1 px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 hover:text-destructive border border-foreground/10 hover:border-destructive/40 transition-colors">
                      <X className="w-3 h-3" />{ui.cancelMission}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ PERSONNAGES: HOME ════════════════════════════════════════════ */}
            {view === 'char-home' && (
              <motion.div key="char-home" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                className="w-full flex flex-col items-center text-center gap-8">
                <div className="space-y-2">
                  <div className="text-5xl">🤪</div>
                  <h2 className="text-[2rem] font-display font-bold leading-tight tracking-tight"
                    style={{ color: '#f97316', textShadow: '0 0 30px #f9731650' }}>{ui.charHomeTitle}</h2>
                  <p className="text-sm text-muted-foreground italic max-w-[260px] mx-auto leading-relaxed">
                    {ui.charHomeDesc}
                  </p>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-6 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                    style={{ background: 'radial-gradient(#f9731640, transparent)' }} />
                  <button onClick={handleGeneratePalette}
                    className="relative h-52 w-52 rounded-full flex flex-col items-center justify-center gap-3 bg-card border border-foreground/10 transition-all duration-300 active:scale-95 hover:scale-[1.03]"
                    style={{ borderColor: '#f9731630', boxShadow: '0 0 40px -10px #f9731640' }}>
                    <span className="text-5xl">🤪</span>
                    <span className="font-display font-bold text-lg tracking-widest uppercase" style={{ color: '#f97316' }}>
                      {ui.charGenerateBtn}
                    </span>
                    <span className="text-xs text-muted-foreground">{ui.charGenerateSub}</span>
                  </button>
                </div>
                <div className="rounded-2xl px-5 py-4 border border-foreground/6 bg-card/60 text-left max-w-[280px] space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{ui.charHowTitle}</p>
                  {ui.charHowSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                      <span className="w-1 h-1 rounded-full bg-amber-400/60 mt-1.5 shrink-0" />
                      {step}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══ PERSONNAGES: ROLLING ═════════════════════════════════════════ */}
            {view === 'char-rolling' && (
              <motion.div key="char-rolling" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                className="w-full flex flex-col items-center justify-center gap-10">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-semibold">{ui.rollingChar}</p>
                <div className="flex items-end gap-3">
                  {[0, 1, 2, 3].map(i => (
                    <motion.div key={i}
                      animate={{ y: [0, -12, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.6, delay: i * 0.12, repeat: Infinity, ease: 'easeInOut' }}>
                      <RollingDice color="#f97316" size="sm" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══ PERSONNAGES: PALETTE ══════════════════════════════════════════ */}
            {view === 'char-palette' && palette.length > 0 && (
              <motion.div key="char-palette" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full">
                <div className="rounded-3xl overflow-hidden"
                  style={{ background: 'radial-gradient(ellipse at top, #f9731612 0%, transparent 60%), hsl(var(--card))', border: '1px solid #f9731625', boxShadow: '0 0 60px -15px #f9731630' }}>
                  <div className="w-full h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, #f97316, transparent)' }} />
                  <div className="p-6 space-y-5">
                    <div className="text-center space-y-1">
                      <h2 className="text-2xl font-display font-bold" style={{ color: '#f97316' }}>{ui.charPaletteTitle}</h2>
                      <p className="text-xs text-muted-foreground">
                        {ui.charPaletteTotal(palette.reduce((a, p) => a + p.minutes, 0), palette.length)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {palette.map((item, i) => {
                        const charText = getCharacterText(item.character.id, lang);
                        return (
                          <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.35 }}
                            className="flex items-center gap-3 rounded-2xl px-4 py-3"
                            style={{ background: `${item.character.color}10`, border: `1px solid ${item.character.color}25` }}>
                            <span className="text-2xl">{item.character.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-display font-bold text-sm" style={{ color: item.character.color }}>{charText.name}</p>
                              <p className="text-xs text-muted-foreground/70 truncate">{charText.hint}</p>
                            </div>
                            <span className="text-xs font-bold tabular-nums shrink-0"
                              style={{ color: item.character.color }}>{item.minutes} {ui.durationUnit}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                    <div className="space-y-2.5">
                      <button onClick={startPaletteTimer}
                        className="w-full py-4 rounded-2xl font-display font-bold text-base tracking-wide text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 0 24px -4px #f9731680' }}>
                        {ui.charStartBtn}
                      </button>
                      <button onClick={handleRegeneratePalette}
                        className="w-full py-3.5 rounded-2xl font-display font-semibold text-sm text-muted-foreground border border-foreground/8 hover:border-foreground/15 hover:text-foreground hover:bg-foreground/5 transition-all duration-200">
                        {ui.charRegenBtn}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ PERSONNAGES: TIMER ═══════════════════════════════════════════ */}
            {view === 'char-timer' && palette.length > 0 && (() => {
              const current = palette[paletteIdx];
              const next = palette[paletteIdx + 1];
              const c = current.character;
              const charText = getCharacterText(c.id, lang);
              const nextText = next ? getCharacterText(next.character.id, lang) : null;
              const isLast = paletteIdx >= palette.length - 1;
              return (
                <motion.div key="char-timer" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                  className="w-full flex flex-col items-center gap-5">
                  {/* Progress bar */}
                  <div className="w-full flex items-center gap-2">
                    {palette.map((_, i) => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all duration-500"
                        style={{ background: i < paletteIdx ? '#ffffff30' : i === paletteIdx ? c.color : '#ffffff10', boxShadow: i === paletteIdx ? `0 0 8px ${c.color}` : 'none' }} />
                    ))}
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {ui.charProgress(paletteIdx + 1, palette.length)}
                  </p>

                  {/* MISSION card — primary focus */}
                  <motion.div key={`card-${paletteIdx}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="w-full rounded-3xl px-6 py-5 space-y-3 text-center"
                    style={{
                      background: `linear-gradient(160deg, ${c.color}22 0%, ${c.color}0a 100%)`,
                      border: `2px solid ${c.color}70`,
                      boxShadow: `0 0 40px -6px ${c.color}80, inset 0 0 24px ${c.color}10`
                    }}>
                    <div className="text-5xl">{c.emoji}</div>
                    <h2 className="text-2xl font-display font-bold leading-tight" style={{ color: c.color, textShadow: `0 0 24px ${c.color}55` }}>
                      {charText.name}
                    </h2>
                    <p className="text-sm text-foreground/80 italic leading-snug">{stripTime(charText.description)}</p>
                    <div className="rounded-xl px-3 py-2 text-xs text-foreground/75 italic leading-relaxed"
                      style={{ background: `${c.color}12`, border: `1px solid ${c.color}25` }}>
                      {stripTime(charText.hint)}
                    </div>
                  </motion.div>

                  {/* PRIMARY validation/next button — HUGE, halo */}
                  <motion.button onClick={skipToNextCharacter}
                    initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.18, type: 'spring', bounce: 0.4 }}
                    whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }}
                    className="w-full relative py-7 rounded-[2rem] font-display font-bold text-2xl tracking-wider text-white flex items-center justify-center gap-3"
                    style={{
                      background: `linear-gradient(135deg, ${c.color}, ${c.color}d0)`,
                      boxShadow: `0 0 48px -4px ${c.color}, 0 8px 24px -8px ${c.color}80`,
                    }}>
                    <motion.div aria-hidden
                      animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -inset-1 rounded-[2rem] -z-10"
                      style={{ background: c.color, filter: 'blur(20px)', opacity: 0.45 }} />
                    {isLast ? <CheckCircle2 className="w-7 h-7" /> : <SkipForward className="w-7 h-7" />}
                    <span>{isLast ? ui.doneBtn : ui.charSkipBtn}</span>
                  </motion.button>

                  {/* Discreet timer + secondary controls */}
                  <div className="flex flex-col items-center gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      <motion.div animate={isTimerRunning ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.4 }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
                      <span className="font-mono text-base tabular-nums text-muted-foreground/70">{fmt(timeLeft)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={togglePause}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-card border border-foreground/10 hover:bg-foreground/5 transition-colors">
                        {isTimerRunning
                          ? <><Pause className="w-3.5 h-3.5 text-foreground/70" /><span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{ui.pauseBtn}</span></>
                          : <><Play className="w-3.5 h-3.5 text-foreground/70" /><span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{ui.resumeBtn}</span></>}
                      </button>
                      <button onClick={cancelTimer}
                        className="flex items-center gap-1 px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 hover:text-destructive border border-foreground/10 hover:border-destructive/40 transition-colors">
                        <X className="w-3 h-3" />{ui.cancelMission}
                      </button>
                    </div>
                  </div>

                  {next && nextText && (
                    <div className="text-center space-y-1 opacity-50 pt-1">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{ui.charNextLabel}</p>
                      <p className="text-sm font-display font-bold" style={{ color: next.character.color }}>{next.character.emoji} {nextText.name}</p>
                    </div>
                  )}
                </motion.div>
              );
            })()}

            {/* ══ PROFIL: HOME ═════════════════════════════════════════════════ */}
            {view === 'profil-home' && (
              <motion.div key="profil-home" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                className="w-full flex flex-col items-center text-center gap-8">
                <div className="space-y-2">
                  <div className="text-5xl">🧠</div>
                  <h2 className="text-[2rem] font-display font-bold leading-tight tracking-tight"
                    style={{ color: '#6366f1', textShadow: '0 0 30px #6366f150' }}>{ui.profilHomeTitle}</h2>
                  <p className="text-sm text-muted-foreground italic max-w-[260px] mx-auto leading-relaxed">
                    {ui.profilHomeDesc}
                  </p>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-6 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                    style={{ background: 'radial-gradient(#6366f140, transparent)' }} />
                  <button onClick={handleRollProfile}
                    className="relative h-52 w-52 rounded-full flex flex-col items-center justify-center gap-3 bg-card border border-foreground/10 transition-all duration-300 active:scale-95 hover:scale-[1.03]"
                    style={{ borderColor: '#6366f130', boxShadow: '0 0 40px -10px #6366f140' }}>
                    <span className="text-5xl">🎲</span>
                    <span className="font-display font-bold text-lg tracking-widest uppercase" style={{ color: '#6366f1' }}>{ui.profilRollBtn}</span>
                  </button>
                </div>
                <div className="rounded-2xl px-5 py-4 border border-foreground/6 bg-card/60 text-left max-w-[280px] space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{ui.profilExamplesLabel}</p>
                  {ui.profilExamples.map((ex, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                      <span className="w-1 h-1 rounded-full bg-indigo-400/60 mt-1.5 shrink-0" />
                      {stripTime(ex)}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══ PROFIL: ROLLING ══════════════════════════════════════════════ */}
            {view === 'profil-rolling' && (
              <motion.div key="profil-rolling" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                className="w-full flex flex-col items-center justify-center gap-10">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-semibold">{ui.rollingProfil}</p>
                <motion.div animate={{ rotate: [0, -8, 8, -5, 5, 0], scale: [1, 1.05, 0.97, 1.03, 1] }}
                  transition={{ duration: 0.9, ease: 'easeInOut' }}>
                  <RollingDice color="#6366f1" />
                </motion.div>
              </motion.div>
            )}

            {/* ══ PROFIL: RESULT ═══════════════════════════════════════════════ */}
            {view === 'profil-result' && currentProfile && (() => {
              const pText = getProfileText(currentProfile.id, lang);
              return (
                <motion.div key="profil-result" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full space-y-3">
                  {inferredModeName && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
                      style={{ background: '#6366f110', border: '1px solid #6366f125' }}>
                      <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground/50">{QCM_UI[lang].modeSelected}</span>
                      <span className="text-xs font-bold" style={{ color: '#818cf8' }}>{inferredModeName}</span>
                    </motion.div>
                  )}
                  <div className="rounded-3xl overflow-hidden"
                    style={{ border: `1px solid ${currentProfile.color}25`, background: `radial-gradient(ellipse at top, ${currentProfile.color}12 0%, transparent 60%), hsl(var(--card))`, boxShadow: `0 0 60px -15px ${currentProfile.color}40` }}>
                    <div className="w-full h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${currentProfile.color}, transparent)` }} />
                    <div className="p-7 space-y-7">
                      <div className="text-center space-y-3">
                        <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', bounce: 0.5, delay: 0.05 }} className="text-6xl">{currentProfile.emoji}</motion.div>
                        <div>
                          <h2 className="text-3xl font-display font-bold tracking-tight"
                            style={{ color: currentProfile.color, textShadow: `0 0 30px ${currentProfile.color}50` }}>{pText.name}</h2>
                          <p className="text-sm font-semibold uppercase tracking-[0.2em] mt-1" style={{ color: `${currentProfile.color}cc` }}>{pText.archetype}</p>
                        </div>
                        <p className="text-sm text-foreground/70 italic leading-relaxed">{pText.essence}</p>
                        {spiritPhrase && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                            className="text-[11px] text-foreground/25 tracking-widest uppercase mt-1">
                            {spiritPhrase}
                          </motion.p>
                        )}
                      </div>
                      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${currentProfile.color}30, transparent)` }} />
                      <div className="space-y-3">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold">{ui.profilTraitsLabel}</p>
                        <ul className="space-y-2">
                          {pText.traits.map((trait, i) => (
                            <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.15 + i * 0.07 }}
                              className="flex items-start gap-3 text-sm text-foreground/75 leading-relaxed rounded-xl px-3 py-2"
                              style={{ border: `1px solid ${currentProfile.color}15`, background: `${currentProfile.color}06` }}>
                              <span className="w-1.5 h-1.5 rounded-full mt-[6px] shrink-0" style={{ backgroundColor: `${currentProfile.color}90` }} />
                              {trait}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      <DurationPicker
                        meta={{ emoji: currentProfile.emoji, title: pText.name, color: currentProfile.color }}
                        color={currentProfile.color} value={profilDuration} picking={isPickingProfilDuration}
                        options={PROFIL_DURATION_OPTIONS}
                        onPick={handlePickProfilDuration}
                        onStart={startProfilTimer}
                      />
                      <button onClick={handleRollProfile}
                        className="w-full py-3.5 rounded-2xl font-display font-semibold text-sm text-muted-foreground border border-foreground/8 hover:border-foreground/15 hover:text-foreground hover:bg-foreground/5 transition-all duration-200">
                        {ui.profilRerollBtn}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {/* ══ PROFIL: TIMER ════════════════════════════════════════════════ */}
            {view === 'profil-timer' && timerMeta && currentProfile && (() => {
              const pText = getProfileText(currentProfile.id, lang);
              return (
                <motion.div key="profil-timer" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                  className="w-full flex flex-col items-center justify-center gap-5">
                  {/* Tiny mode chip */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                    style={{ background: `${timerMeta.color}15`, border: `1px solid ${timerMeta.color}40` }}>
                    <span className="text-base leading-none">{timerMeta.emoji}</span>
                    <span className="text-[10px] uppercase tracking-[0.25em] font-bold" style={{ color: timerMeta.color }}>{timerMeta.title}</span>
                  </div>

                  {/* MISSION card — primary focus */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="w-full rounded-3xl px-6 py-6 space-y-4"
                    style={{
                      background: `linear-gradient(160deg, ${timerMeta.color}22 0%, ${timerMeta.color}0a 100%)`,
                      border: `2px solid ${timerMeta.color}70`,
                      boxShadow: `0 0 40px -6px ${timerMeta.color}80, inset 0 0 24px ${timerMeta.color}10`
                    }}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: timerMeta.color }}>
                        {ui.profilReminderLabel}
                      </span>
                      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${timerMeta.color}50, transparent)` }} />
                    </div>
                    <p className="text-xl font-display font-bold text-foreground italic leading-snug">
                      "{stripTime(pText.essence)}"
                    </p>
                  </motion.div>

                  {/* PRIMARY validation button — HUGE, halo */}
                  <motion.button onClick={finishSession}
                    initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.18, type: 'spring', bounce: 0.4 }}
                    whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }}
                    className="w-full relative py-7 rounded-[2rem] font-display font-bold text-2xl tracking-wider text-white flex items-center justify-center gap-3"
                    style={{
                      background: `linear-gradient(135deg, ${timerMeta.color}, ${timerMeta.color}d0)`,
                      boxShadow: `0 0 48px -4px ${timerMeta.color}, 0 8px 24px -8px ${timerMeta.color}80`,
                    }}>
                    <motion.div aria-hidden
                      animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -inset-1 rounded-[2rem] -z-10"
                      style={{ background: timerMeta.color, filter: 'blur(20px)', opacity: 0.45 }} />
                    <CheckCircle2 className="w-7 h-7" />
                    <span>{ui.doneBtn}</span>
                  </motion.button>

                  {/* Discreet timer + secondary controls */}
                  <div className="flex flex-col items-center gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      <motion.div animate={isTimerRunning ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.4 }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full" style={{ background: timerMeta.color }} />
                      <span className="font-mono text-base tabular-nums text-muted-foreground/70">{fmt(timeLeft)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={togglePause}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-card border border-foreground/10 hover:bg-foreground/5 transition-colors">
                        {isTimerRunning
                          ? <><Pause className="w-3.5 h-3.5 text-foreground/70" /><span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{ui.pauseBtn}</span></>
                          : <><Play className="w-3.5 h-3.5 text-foreground/70" /><span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{ui.resumeBtn}</span></>}
                      </button>
                      <button onClick={cancelTimer}
                        className="flex items-center gap-1 px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 hover:text-destructive border border-foreground/10 hover:border-destructive/40 transition-colors">
                        <X className="w-3 h-3" />{ui.cancelMission}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {/* ══ ENGAGE-HOME ══════════════════════════════════════════════════ */}
            {view === 'engage-home' && (() => {
              const eUI = ENGAGE_UI[lang];
              const presets = ENGAGE_PRESETS[lang];
              const missionReady = !!(engageCustom.trim() || engageMission);
              return (
                <motion.div key="engage-home" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                  className="w-full flex flex-col gap-6">
                  <div className="text-center space-y-1">
                    <div className="text-5xl mb-3">◆</div>
                    <h2 className="text-3xl font-display font-bold" style={{ color: '#14b8a6', textShadow: '0 0 30px #14b8a650' }}>{eUI.homeTitle}</h2>
                    <p className="text-sm text-muted-foreground italic">{eUI.homeSubtitle}</p>
                  </div>
                  {/* Preset chips */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {presets.map((p) => (
                      <button key={p} onClick={() => { setEngageMission(p); setEngageCustom(''); }}
                        className="px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-150"
                        style={engageMission === p && !engageCustom
                          ? { background: '#14b8a6', color: '#000', border: '1px solid #14b8a6' }
                          : { background: '#14b8a615', color: '#14b8a6', border: '1px solid #14b8a630' }}>
                        {p}
                      </button>
                    ))}
                  </div>
                  {/* Custom input */}
                  <div className="relative">
                    <input type="text" value={engageCustom}
                      onChange={e => { setEngageCustom(e.target.value); if (e.target.value) setEngageMission(''); }}
                      placeholder={eUI.homeCustomPlaceholder}
                      className="w-full bg-card border border-border rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-teal-500/60 transition-colors" />
                    {engageCustom && (
                      <button onClick={() => setEngageCustom('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground/70 text-lg">×</button>
                    )}
                  </div>
                  {/* Roll button */}
                  <motion.button onClick={handleEngageRoll} disabled={!missionReady}
                    whileHover={missionReady ? { scale: 1.02 } : {}} whileTap={missionReady ? { scale: 0.97 } : {}}
                    className="w-full py-5 rounded-3xl font-display font-bold text-lg tracking-wider transition-all duration-200"
                    style={missionReady
                      ? { background: 'linear-gradient(135deg, #14b8a6, #0d9488)', color: '#000', boxShadow: '0 0 30px #14b8a630' }
                      : { background: '#14b8a610', color: '#14b8a640', border: '1px solid #14b8a620' }}>
                    {eUI.rollBtn}
                  </motion.button>
                </motion.div>
              );
            })()}

            {/* ══ ENGAGE-ROLLING ════════════════════════════════════════════════ */}
            {view === 'engage-rolling' && (() => {
              const eUI = ENGAGE_UI[lang];
              return (
                <motion.div key="engage-rolling" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                  className="w-full flex flex-col items-center gap-8 py-8">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/60">{eUI.rollSuspense}</p>
                  <motion.div animate={{ rotate: [0, 30, -20, 40, -30, 10, -5, 0], scale: [1, 1.1, 0.95, 1.15, 0.9, 1.05, 1] }}
                    transition={{ duration: 1.1, ease: "easeOut" }} className="text-8xl" style={{ filter: 'drop-shadow(0 0 20px #14b8a680)' }}>
                    ◆
                  </motion.div>
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.6, repeat: Infinity }}
                    className="text-2xl font-display font-bold tracking-wider" style={{ color: '#14b8a6' }}>
                    {[1, 2, 3, 4, 5, 6][Math.floor(Math.random() * 6)]}
                  </motion.div>
                </motion.div>
              );
            })()}

            {/* ══ ENGAGE-RESULT ═════════════════════════════════════════════════ */}
            {view === 'engage-result' && (() => {
              const eUI = ENGAGE_UI[lang];
              const outcome = ENGAGE_OUTCOMES[lang][engageOutcomeIdx];
              const modifier = outcome.modifier;
              const COLOR_MAP: Record<string, string> = {
                refus: '#ef4444', light: '#3b82f6', character: '#f59e0b', standard: '#14b8a6', intense: '#a855f7', twist: '#ec4899',
              };
              const color = COLOR_MAP[modifier] ?? '#14b8a6';
              const mission = engageCustom.trim() || engageMission;
              const durationOptions: Record<string, number[]> = {
                light: [5, 10], standard: [15, 20, 25], intense: [30, 45, 60], twist: [15, 25], character: [10, 20],
              };
              const opts = durationOptions[modifier] ?? [];
              return (
                <motion.div key="engage-result" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                  className="w-full flex flex-col items-center gap-5">
                  {inferredModeName && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl"
                      style={{ background: '#14b8a610', border: '1px solid #14b8a625' }}>
                      <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground/50">{QCM_UI[lang].modeSelected}</span>
                      <span className="text-xs font-bold" style={{ color: '#2dd4bf' }}>{inferredModeName}</span>
                    </motion.div>
                  )}
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', bounce: 0.5, delay: 0.05 }}
                      className="text-6xl" style={{ filter: `drop-shadow(0 0 20px ${color}70)` }}>
                      {outcome.icon}
                    </motion.div>
                    <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/50">{`Face ${outcome.face}`}</div>
                    <h2 className="text-3xl font-display font-bold" style={{ color, textShadow: `0 0 30px ${color}50` }}>{outcome.label}</h2>
                    <p className="text-sm text-foreground/70 italic">{outcome.desc}</p>
                  </div>
                  {/* Engage message */}
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="w-full rounded-2xl px-4 py-4"
                    style={{ background: `${color}0d`, border: `1px solid ${color}20` }}>
                    <p className="text-sm text-foreground/80 leading-relaxed">{ENGAGE_MESSAGES[lang][modifier]}</p>
                  </motion.div>
                  <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
                  {/* Mission display */}
                  {modifier !== 'refus' && (
                    <div className="w-full rounded-2xl p-4 space-y-1"
                      style={{ background: `${color}0d`, border: `1px solid ${color}25` }}>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 font-bold">{eUI.resultMission}</p>
                      <p className="text-base font-semibold text-foreground">{mission}</p>
                    </div>
                  )}
                  {/* Character overlay */}
                  {modifier === 'character' && engageCharacter && (() => {
                    const cText = getCharacterText(engageCharacter.id, lang);
                    return (
                      <div className="w-full rounded-2xl p-4 space-y-1"
                        style={{ background: '#f973160d', border: '1px solid #f9731625' }}>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 font-bold">{eUI.resultCharLabel}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{engageCharacter.emoji}</span>
                          <span className="font-display font-bold text-lg" style={{ color: '#f97316' }}>{cText.name}</span>
                        </div>
                        <p className="text-xs text-foreground/60 italic">{cText.vibe}</p>
                      </div>
                    );
                  })()}
                  {/* Twist overlay */}
                  {modifier === 'twist' && engageTwist && (
                    <div className="w-full rounded-2xl p-4 space-y-1"
                      style={{ background: '#ec489910', border: '1px solid #ec489930' }}>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 font-bold">Blacklace Twist</p>
                      <p className="text-base font-bold" style={{ color: '#ec4899' }}>{engageTwist}</p>
                    </div>
                  )}
                  {/* Refus action */}
                  {modifier === 'refus' && (
                    <div className="w-full text-center space-y-4">
                      <p className="text-lg font-display font-bold text-muted-foreground">{eUI.resultRest}</p>
                      <button onClick={() => setView('engage-home')}
                        className="text-sm text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors underline underline-offset-4">
                        {eUI.resultOtherMission}
                      </button>
                    </div>
                  )}
                  {/* Duration picker for timed outcomes */}
                  {opts.length > 0 && (
                    <div className="w-full">
                      <DurationPicker
                        meta={{ emoji: outcome.icon, title: mission, color }}
                        color={color} options={opts}
                        value={engageDuration} picking={isPickingEngageDuration}
                        onPick={() => handlePickEngageDuration(opts)}
                        onStart={() => startEngageTimer(opts)}
                      />
                    </div>
                  )}
                  {/* Back link */}
                  <button onClick={() => setView('engage-home')}
                    className="text-xs text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors mt-1">
                    ← {eUI.resultOtherMission}
                  </button>
                </motion.div>
              );
            })()}

            {/* ══ MOOD CHECK ════════════════════════════════════════════════════ */}
            {view === 'mood-check' && (() => {
              const moods = MOOD_STATES[lang];
              const moodUI = MOOD_UI[lang];
              return (
                <motion.div key="mood-check" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                  className="w-full flex flex-col items-center gap-6">
                  <div className="text-center space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 font-bold">
                      {pendingDoubleRoll ? ui.doubleRollBtn : ui.rollBtn}
                    </p>
                    <h2 className="text-2xl font-display font-bold text-foreground">{moodUI.title}</h2>
                    <p className="text-sm text-muted-foreground/70 italic">{moodUI.subtitle}</p>
                  </div>
                  <div className="w-full grid grid-cols-1 gap-2.5">
                    {moods.map((mood) => (
                      <motion.button key={mood.id}
                        onClick={() => { setSelectedMood(mood.id); setTimeout(handleRollAfterMood, 180); }}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-150"
                        style={selectedMood === mood.id
                          ? { background: mood.color, color: '#000', boxShadow: `0 0 20px ${mood.color}50` }
                          : { background: `${mood.color}12`, border: `1px solid ${mood.color}30` }}>
                        <span className="text-2xl">{mood.emoji}</span>
                        <div className="flex-1">
                          <p className="font-display font-bold text-sm"
                            style={selectedMood === mood.id ? { color: '#000' } : { color: mood.color }}>{mood.label}</p>
                          <p className="text-xs opacity-70">{mood.sublabel}</p>
                        </div>
                        {selectedMood === mood.id && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xl">✓</motion.span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                  <button onClick={() => { setSelectedMood(null); handleRollAfterMood(); }}
                    className="text-xs text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors">
                    {moodUI.skipBtn} →
                  </button>
                </motion.div>
              );
            })()}

            {/* ══ PAYWALL ═══════════════════════════════════════════════════════ */}
            {/* paywall is now handled as a modal overlay — no full-page view */}

            {/* ══ HISTORY ═══════════════════════════════════════════════════════ */}
            {view === 'history' && (() => {
              const hUI = HISTORY_UI[lang];
              const moods = MOOD_STATES[lang];
              const sessions = [...stats.sessions].reverse().slice(0, 30);
              const moodById = Object.fromEntries(moods.map(m => [m.id, m]));
              return (
                <motion.div key="history" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                  className="w-full flex flex-col gap-5">
                  <div className="text-center space-y-1">
                    <h2 className="text-2xl font-display font-bold text-foreground">{hUI.title}</h2>
                    <p className="text-xs text-muted-foreground/60 italic">{hUI.subtitle}</p>
                  </div>
                  {sessions.length === 0 ? (
                    <div className="text-center py-12 space-y-2">
                      <p className="text-3xl">◈</p>
                      {hUI.empty.split('\n').map((line, i) => (
                        <p key={i} className="text-sm text-muted-foreground italic">{line}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {/* ── Dashboard analytics block ─────────────────────────────── */}
                      {(() => {
                        const all = stats.sessions;
                        const totalMissions = all.length;
                        const evaluated = all.filter(s => s.score !== null);
                        const avgScore = evaluated.length > 0
                          ? evaluated.reduce((a, s) => a + (s.score ?? 0), 0) / evaluated.length
                          : null;
                        const successCount = evaluated.filter(s => (s.score ?? 0) >= 2).length;
                        const successRate = evaluated.length > 0 ? Math.round((successCount / evaluated.length) * 100) : null;
                        const modeCounts: Record<string, number> = { actions: 0, personnages: 0, profil: 0, engagement: 0 };
                        all.forEach(s => { if (modeCounts[s.mode] !== undefined) modeCounts[s.mode]++; });
                        const modeColor: Record<string, string> = {
                          actions: '#a855f7', personnages: '#f97316', profil: '#3b82f6', engagement: '#ec4899',
                        };
                        const modeLabelMap: Record<string, string> = hUI.modeLabels as Record<string, string>;
                        const maxMode = Math.max(1, ...Object.values(modeCounts));

                        // Daily counts for last 14 days
                        const today = new Date(); today.setHours(0, 0, 0, 0);
                        const dayMs = 86400000;
                        const days: { date: Date; total: number; success: number }[] = [];
                        for (let i = 13; i >= 0; i--) {
                          const d = new Date(today.getTime() - i * dayMs);
                          days.push({ date: d, total: 0, success: 0 });
                        }
                        all.forEach(s => {
                          const sd = new Date(s.date); sd.setHours(0, 0, 0, 0);
                          const idx = Math.floor((today.getTime() - sd.getTime()) / dayMs);
                          if (idx >= 0 && idx < 14) {
                            const slot = days[13 - idx];
                            slot.total += 1;
                            if (s.score !== null && s.score >= 2) slot.success += 1;
                          }
                        });
                        const maxDaily = Math.max(1, ...days.map(d => d.total));

                        // Score evolution (last 20)
                        const ordered = [...all].slice(-20);
                        const W = 300, H = 70, P = 6;
                        const lineXs = ordered.map((_, i) => P + (i * (W - 2 * P)) / Math.max(1, ordered.length - 1));
                        const lineYs = ordered.map(s => {
                          const v = s.score === null ? 1.5 : s.score;
                          return H - P - (v / 3) * (H - 2 * P);
                        });
                        const path = lineXs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${lineYs[i].toFixed(1)}`).join(' ');
                        const area = ordered.length > 1 ? `${path} L${lineXs[lineXs.length - 1].toFixed(1)},${H - P} L${lineXs[0].toFixed(1)},${H - P} Z` : '';

                        const t = {
                          total: lang === 'fr' ? 'Total' : lang === 'es' ? 'Total' : 'Total',
                          success: lang === 'fr' ? 'Réussite' : lang === 'es' ? 'Éxito' : 'Success',
                          avg: lang === 'fr' ? 'Score moy.' : lang === 'es' ? 'Pts. medio' : 'Avg score',
                          progress: lang === 'fr' ? 'Évolution du score' : lang === 'es' ? 'Evolución de puntos' : 'Score evolution',
                          activity: lang === 'fr' ? 'Activité (14 j)' : lang === 'es' ? 'Actividad (14 d)' : 'Activity (14d)',
                          byMode: lang === 'fr' ? 'Par mode' : lang === 'es' ? 'Por modo' : 'By mode',
                          missions: lang === 'fr' ? 'missions' : lang === 'es' ? 'misiones' : 'missions',
                          completed: lang === 'fr' ? 'validées' : lang === 'es' ? 'validadas' : 'completed',
                        };

                        return (
                          <div className="space-y-3 mb-1">
                            {/* Stat cards */}
                            <div className="grid grid-cols-3 gap-2">
                              <div className="rounded-2xl p-3 text-center"
                                style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
                                <p className="text-[9px] uppercase tracking-[0.18em] font-bold text-muted-foreground">{t.total}</p>
                                <p className="font-display font-bold text-2xl mt-1 text-foreground">{totalMissions}</p>
                                <p className="text-[9px] text-muted-foreground mt-0.5">{t.missions}</p>
                              </div>
                              <div className="rounded-2xl p-3 text-center"
                                style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
                                <p className="text-[9px] uppercase tracking-[0.18em] font-bold text-muted-foreground">{t.success}</p>
                                <p className="font-display font-bold text-2xl mt-1" style={{ color: successRate !== null && successRate >= 60 ? '#22c55e' : successRate !== null && successRate >= 40 ? '#eab308' : '#f97316' }}>
                                  {successRate !== null ? `${successRate}%` : '—'}
                                </p>
                                <p className="text-[9px] text-muted-foreground mt-0.5">{successCount}/{evaluated.length}</p>
                              </div>
                              <div className="rounded-2xl p-3 text-center"
                                style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
                                <p className="text-[9px] uppercase tracking-[0.18em] font-bold text-muted-foreground">{t.avg}</p>
                                <p className="font-display font-bold text-2xl mt-1 text-primary">
                                  {avgScore !== null ? avgScore.toFixed(1) : '—'}<span className="text-xs text-muted-foreground">/3</span>
                                </p>
                                <p className="text-[9px] text-muted-foreground mt-0.5">{stats.streak}🔥</p>
                              </div>
                            </div>

                            {/* Daily activity bar chart */}
                            <div className="rounded-2xl p-4"
                              style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
                              <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">{t.activity}</p>
                                <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
                                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: '#22c55e' }} />{t.completed}</span>
                                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: 'hsl(var(--muted-foreground) / 0.5)' }} />{t.total}</span>
                                </div>
                              </div>
                              <div className="flex items-end gap-1 h-[80px]">
                                {days.map((d, i) => {
                                  const totalH = (d.total / maxDaily) * 70;
                                  const successH = (d.success / maxDaily) * 70;
                                  const isToday = i === 13;
                                  return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                      <div className="relative flex-1 w-full flex items-end justify-center">
                                        <div className="w-full rounded-t-sm relative overflow-hidden"
                                          style={{
                                            height: Math.max(2, totalH),
                                            background: 'hsl(var(--muted-foreground) / 0.25)',
                                            minHeight: d.total > 0 ? 4 : 2,
                                          }}>
                                          {d.success > 0 && (
                                            <div className="absolute bottom-0 left-0 right-0 rounded-t-sm"
                                              style={{
                                                height: (successH / Math.max(1, totalH)) * 100 + '%',
                                                background: 'linear-gradient(180deg, #22c55e, #16a34a)',
                                                boxShadow: '0 0 6px rgba(34,197,94,0.5)',
                                              }} />
                                          )}
                                        </div>
                                      </div>
                                      <span className="text-[8px] font-bold" style={{ color: isToday ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.6)' }}>
                                        {d.date.getDate()}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Score evolution line */}
                            {ordered.length >= 2 && (
                              <div className="rounded-2xl p-4"
                                style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">{t.progress}</p>
                                  <p className="text-[10px] text-muted-foreground">{ordered.length} {t.missions}</p>
                                </div>
                                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[70px]" preserveAspectRatio="none">
                                  <defs>
                                    <linearGradient id="hgrad" x1="0" x2="0" y1="0" y2="1">
                                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
                                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                                    </linearGradient>
                                  </defs>
                                  {[0, 1, 2, 3].map(g => {
                                    const y = H - P - (g / 3) * (H - 2 * P);
                                    return <line key={g} x1={P} x2={W - P} y1={y} y2={y} stroke="hsl(var(--foreground))" strokeOpacity="0.08" strokeDasharray="2 3" />;
                                  })}
                                  <path d={area} fill="url(#hgrad)" />
                                  <path d={path} fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    style={{ filter: 'drop-shadow(0 0 6px rgba(168,85,247,0.6))' }} />
                                  {lineXs.map((x, i) => {
                                    const c = ordered[i].score === 3 ? '#22c55e' : ordered[i].score === 2 ? '#eab308' : ordered[i].score === 1 ? '#f97316' : ordered[i].score === 0 ? '#ef4444' : 'hsl(var(--muted-foreground))';
                                    return <circle key={i} cx={x} cy={lineYs[i]} r="2.5" fill={c} stroke="hsl(var(--background))" strokeWidth="1.2" />;
                                  })}
                                </svg>
                                <div className="flex items-center justify-between mt-1.5 text-[8px] text-muted-foreground/70">
                                  <span>0/3</span><span>1</span><span>2</span><span>3</span>
                                </div>
                              </div>
                            )}

                            {/* Mode distribution bars */}
                            <div className="rounded-2xl p-4"
                              style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
                              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-3">{t.byMode}</p>
                              <div className="space-y-2">
                                {(['actions', 'personnages', 'profil', 'engagement'] as const).map(m => {
                                  const c = modeColor[m];
                                  const count = modeCounts[m];
                                  const pct = (count / maxMode) * 100;
                                  return (
                                    <div key={m} className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold uppercase tracking-wider w-20 shrink-0" style={{ color: c }}>
                                        {modeLabelMap[m] ?? m}
                                      </span>
                                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted-foreground) / 0.15)' }}>
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${pct}%` }}
                                          transition={{ duration: 0.6, ease: 'easeOut' }}
                                          className="h-full rounded-full"
                                          style={{
                                            background: `linear-gradient(90deg, ${c}, ${c}dd)`,
                                            boxShadow: `0 0 6px ${c}80`,
                                          }} />
                                      </div>
                                      <span className="text-[11px] font-bold tabular-nums w-6 text-right" style={{ color: c }}>{count}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                      {sessions.map((s) => {
                        const dateObj = new Date(s.date);
                        const dateStr = dateObj.toLocaleDateString(lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short' });
                        const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const modeLabel = hUI.modeLabels[s.mode] ?? s.mode;
                        const mood = s.moodId ? moodById[s.moodId] : null;
                        const evalLabel = s.score !== null ? hUI.evalLabels[3 - s.score] : hUI.noEval;
                        const evalColor = s.score !== null ? hUI.evalColors[3 - s.score] : '#6b7280';
                        const modeColor: Record<string, string> = {
                          actions: '#a855f7', personnages: '#f97316', profil: '#3b82f6', engagement: '#ec4899',
                        };
                        const c = modeColor[s.mode] ?? '#a855f7';
                        return (
                          <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            className="w-full rounded-2xl px-4 py-3 flex items-center gap-3"
                            style={{ background: `${c}08`, border: `1px solid ${c}20` }}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm"
                              style={{ background: `${c}18`, border: `1px solid ${c}25` }}>
                              {s.mode === 'actions' ? '⚡' : s.mode === 'personnages' ? '🎭' : s.mode === 'profil' ? '🧠' : '◆'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: c }}>{modeLabel}</span>
                                {mood && (
                                  <span className="text-[11px] text-muted-foreground/60">{mood.emoji} {mood.label}</span>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground/50">{dateStr} · {timeStr}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[10px] font-semibold" style={{ color: evalColor }}>{evalLabel}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                  {sessions.length > 0 && (
                    <button onClick={() => { clearSessions(); }}
                      className="text-xs text-muted-foreground/30 hover:text-red-400/60 transition-colors text-center mt-2">
                      {hUI.clearBtn}
                    </button>
                  )}
                </motion.div>
              );
            })()}

            {/* ══ TENSION (Tu le fais ?) ════════════════════════════════════════ */}
            {view === 'tension' && tension && (
              <motion.div key="tension" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                className="w-full flex flex-col items-center gap-6 pt-4">
                {/* Pulsing emoji halo */}
                <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
                  <motion.div
                    animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0.6, 0.35] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full"
                    style={{ background: tension.color, filter: 'blur(28px)' }} />
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative w-28 h-28 rounded-3xl flex items-center justify-center text-5xl"
                    style={{
                      background: `linear-gradient(160deg, ${tension.color}30, ${tension.color}10)`,
                      border: `2px solid ${tension.color}90`,
                      boxShadow: `0 0 40px -8px ${tension.color}`,
                    }}>
                    {tension.emoji}
                  </motion.div>
                </div>

                {/* Mission text */}
                <div className="text-center space-y-3 px-2 max-w-[320px]">
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: `${tension.color}cc` }}>
                    {pickRandom(SPIRIT_PHRASES[lang])}
                  </p>
                  <p className="font-display font-bold text-xl text-foreground leading-snug">
                    "{tension.mission}"
                  </p>
                </div>

                {/* Tension question */}
                <motion.h2
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="font-display font-bold text-3xl tracking-tight text-foreground pt-1">
                  {QCM_UI[lang].tensionTitle}
                </motion.h2>

                {/* Two big buttons */}
                <div className="w-full space-y-3 pt-1">
                  <motion.button
                    onClick={() => { vibrate([40, 20, 60]); const fn = tension.start; setTension(null); fn(); }}
                    whileTap={{ scale: 0.96 }}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="w-full relative overflow-hidden rounded-3xl py-6 px-6 font-display font-bold text-2xl tracking-wider text-white"
                    style={{
                      background: `linear-gradient(135deg, ${tension.color}, ${tension.color}aa)`,
                      boxShadow: `0 0 50px -10px ${tension.color}, 0 0 100px -30px ${tension.color}80`,
                    }}>
                    <motion.span
                      animate={{ x: ['-120%', '220%'] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-y-0 w-1/3 pointer-events-none"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }} />
                    <span className="relative">{QCM_UI[lang].tensionAccept}</span>
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      vibrate([15]);
                      setTension(null);
                      setCancelToast(true);
                      setTimeout(() => setCancelToast(false), 2200);
                      setView('mode-select');
                    }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
                    className="w-full py-3.5 rounded-2xl text-sm text-foreground/55 underline underline-offset-4 decoration-foreground/25">
                    {QCM_UI[lang].tensionDecline}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ══ EVAL ═════════════════════════════════════════════════════════ */}
            {view === 'eval' && (
              <motion.div key="eval" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                className="w-full space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-display font-bold text-glow">{ui.evalTitle}</h2>
                  <p className="text-sm text-muted-foreground">{ui.evalSubtitle}</p>
                </div>
                <div className="space-y-3">
                  {([
                    { score: 3 as EvalScore, color: '#22c55e' },
                    { score: 2 as EvalScore, color: '#eab308' },
                    { score: 1 as EvalScore, color: '#f97316' },
                    { score: 0 as EvalScore, color: '#ef4444' },
                  ] as const).map(({ score, color }, i) => {
                    const opt = ui.evalOptions[i];
                    return (
                      <motion.button key={score} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        onClick={() => handleEval(score)}
                        whileTap={{ scale: 0.98 }}
                        className="w-full text-left rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.01]"
                        style={{ background: `${color}08`, border: `1px solid ${color}25` }}>
                        <div className="p-4 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: `${color}18`, border: `1px solid ${color}35` }}>
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
                          </div>
                          <div>
                            <p className="font-display font-bold text-sm text-foreground">{opt.label}</p>
                            <p className="text-xs text-muted-foreground/70 leading-relaxed">{opt.desc}</p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
                <button onClick={() => { recordCompletion(); recordSession(mode, selectedMood, null); setCompletionMsg(pickRandom(SPIRIT_SKIP[lang])); setView('success'); }}
                  className="w-full text-center text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors py-2">
                  {ui.evalSkip}
                </button>
              </motion.div>
            )}

            {/* ══ SUCCESS ══════════════════════════════════════════════════════ */}
            {view === 'success' && (() => {
              const isFeuch = mode === 'personnages';
              const modeColor = isFeuch ? '#f97316' : mode === 'profil' ? '#3b82f6' : mode === 'engagement' ? '#ec4899' : '#a855f7';
              const modeGradient = isFeuch
                ? 'linear-gradient(135deg, #ea580c, #f97316)'
                : mode === 'profil' ? 'linear-gradient(135deg, #1d4ed8, #3b82f6)'
                : mode === 'engagement' ? 'linear-gradient(135deg, #be185d, #ec4899)'
                : 'linear-gradient(135deg, #7c3aed, #a855f7)';
              const titleText = isFeuch ? ui.successTitleFeuch : ui.successTitle;
              const msgText = completionMsg || (
                isFeuch ? ui.successMsgFeuch
                : mode === 'profil' ? ui.successMsgProfil
                : mode === 'engagement' ? ui.successMsgActions
                : ui.successMsgActions
              );
              const FEUCH_CHAOS_EMOJIS = ['🤪','🌀','😈','💀','🔮','🍷','📡','👽','🤫','🤖','🍼','😤'];

              return (
                <motion.div key="success" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                  className="w-full flex flex-col items-center text-center gap-7 relative">

                  {/* ── Victory flash */}
                  <motion.div className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{ zIndex: 10, background: `radial-gradient(ellipse at 50% 35%, ${modeColor}55 0%, transparent 70%)` }}
                    initial={{ opacity: 0.85 }} animate={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }} />

                  {/* ── Burst particles */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }} aria-hidden>
                    {Array.from({ length: 28 }, (_, i) => {
                      const angle = (i / 28) * Math.PI * 2;
                      const dist = 80 + (i * 41 % 90);
                      const x = Math.cos(angle) * dist;
                      const y = Math.sin(angle) * dist - 30;
                      const delay = (i * 19 % 120) / 1000;
                      const STD = ['✨','⭐','💫','🌟','◆','★','●','✦'];
                      const FEUCH_B = ['🤪','🌀','💀','🔮','⚡','🎭','🍷','📡'];
                      return (
                        <motion.span key={i}
                          className="absolute text-base select-none"
                          style={{ left: '50%', top: '28%' }}
                          initial={{ x: 0, y: 0, opacity: 1, scale: 1.4 }}
                          animate={{ x, y, opacity: 0, scale: 0.1 }}
                          transition={{ duration: 0.8 + (i % 5) * 0.07, delay, ease: [0.2, 0.8, 0.4, 1] }}>
                          {isFeuch ? FEUCH_B[i % 8] : STD[i % 8]}
                        </motion.span>
                      );
                    })}
                  </div>

                  {/* ── FEUCH ambient chaos */}
                  {isFeuch && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
                      {FEUCH_CHAOS_EMOJIS.map((em, i) => (
                        <motion.span key={i}
                          className="absolute text-xl select-none"
                          style={{ left: `${(i * 79 + 11) % 90}%`, top: `${(i * 53 + 7) % 85}%`, opacity: 0 }}
                          animate={{ y: [0, -18, 0], opacity: [0, 0.22, 0], rotate: [-8, 8, -8] }}
                          transition={{ duration: 3 + i * 0.4, delay: 0.9 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}>
                          {em}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* ── Icon */}
                  <div className="relative" style={{ zIndex: 6 }}>
                    <motion.div className="absolute -inset-8 rounded-full"
                      initial={{ opacity: 0.9, scale: 0.5 }} animate={{ opacity: 0, scale: 2.4 }}
                      transition={{ duration: 0.65, ease: 'easeOut' }}
                      style={{ background: `radial-gradient(${modeColor}45, transparent)` }} />
                    <div className="absolute -inset-5 rounded-full blur-2xl opacity-50"
                      style={{ background: `radial-gradient(${modeColor}40, transparent)` }} />
                    <motion.div
                      initial={{ scale: 0, rotate: -20, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 13, delay: 0.04 }}
                      className="relative">
                      <motion.div className={isFeuch ? 'text-8xl' : 'text-7xl'}
                        animate={isFeuch
                          ? { rotate: [-4, 4, -4], scale: [1, 1.1, 1] }
                          : { scale: [1, 1.04, 1] }}
                        transition={{ duration: isFeuch ? 1.8 : 3, repeat: Infinity, ease: 'easeInOut' }}>
                        {isFeuch ? '🤪' : mode === 'profil' ? '🧿' : mode === 'engagement' ? '📡' : '🎯'}
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Title + message */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.22 }}
                    className="space-y-2" style={{ zIndex: 6, position: 'relative' }}>
                    <h2 className={cn("font-display font-bold leading-tight", isFeuch ? "text-3xl glitch" : "text-4xl")}
                      data-text={titleText}
                      style={isFeuch
                        ? { color: modeColor, textShadow: `0 0 40px ${modeColor}80, 0 0 12px ${modeColor}50` }
                        : { background: `linear-gradient(135deg, #fff 45%, ${modeColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {titleText}
                    </h2>
                    <motion.p
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }}
                      className="text-sm leading-relaxed max-w-[260px] mx-auto"
                      style={{ color: isFeuch ? `${modeColor}cc` : 'rgba(255,255,255,0.55)', fontStyle: isFeuch ? 'normal' : 'italic' }}>
                      {msgText}
                    </motion.p>
                  </motion.div>

                  {/* Streak badge */}
                  {stats.streak > 0 && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                      className="rounded-2xl px-6 py-3"
                      style={{ border: `1px solid ${modeColor}40`, background: `${modeColor}12` }}>
                      <p className="font-display font-bold text-sm" style={{ color: modeColor }}>{ui.successStreak(stats.streak)}</p>
                    </motion.div>
                  )}

                  {/* Buttons */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.38 }}
                    className="w-full space-y-2.5" style={{ zIndex: 6, position: 'relative' }}>

                    {/* Primary — mode-specific re-roll / chaos */}
                    <button
                      onClick={mode === 'actions' ? handleRoll : mode === 'personnages' ? handleGeneratePalette : mode === 'engagement' ? () => setView('engage-home') : handleRollProfile}
                      className="w-full py-4 rounded-2xl font-display font-bold text-base tracking-wide text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      style={{ background: modeGradient, boxShadow: `0 0 24px -4px ${modeColor}80` }}>
                      {isFeuch ? ui.successNewPaletteBtn
                        : mode === 'actions' ? ui.successRerollBtn
                        : mode === 'engagement' ? ENGAGE_UI[lang].rollBtn
                        : ui.successNewProfilBtn}
                    </button>

                    {/* Choose mode */}
                    <button onClick={goModeSelect}
                      className="w-full py-3.5 rounded-2xl font-display font-semibold text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.98]"
                      style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${modeColor}30`, color: `${modeColor}cc` }}>
                      {ui.successChooseModeBtn}
                    </button>

                    {/* Back to home */}
                    <button onClick={() => { setView('mode-select'); }}
                      className="w-full py-3 rounded-2xl font-display font-semibold text-sm text-muted-foreground/50 border border-foreground/6 hover:border-foreground/12 hover:text-muted-foreground/80 transition-all duration-200">
                      {ui.successHomeBtn}
                    </button>

                    {/* History */}
                    <button onClick={() => setView('history')}
                      className="w-full py-2 rounded-xl text-xs text-muted-foreground/30 hover:text-muted-foreground/55 transition-colors flex items-center justify-center gap-1.5">
                      <span>◈</span> {HISTORY_UI[lang].title}
                    </button>
                  </motion.div>

                </motion.div>
              );
            })()}

          </AnimatePresence>
        </main>
      </div>

      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} lang={lang} />

      {/* ── Intro Overlay (logo tap) ─────────────────────────────────────── */}
      <AnimatePresence>
        {introOverlayOpen && (() => {
          const qcmUI = QCM_UI[lang];
          const steps = qcmUI.onboardSteps;
          const step = steps[introOverlayStep];
          const isLast = introOverlayStep === steps.length - 1;
          const isWarning = introOverlayStep === steps.length - 1;
          const INTRO_ICONS: Record<string, React.ReactNode> = {
            '⬡': <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(249,115,22,0.1)', border: '1.5px solid rgba(249,115,22,0.35)', boxShadow: '0 0 24px rgba(249,115,22,0.35)' }}><FeuchHexIcon size={58} color="#f97316" /></div>,
            '◈': <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)', border: '1.5px solid rgba(59,130,246,0.35)', boxShadow: '0 0 24px rgba(59,130,246,0.35)' }}><BeletteEyeIcon size={58} color="#3b82f6" /></div>,
            '🔒': <CyclopsEye size={52} color="#6366f1" glow pulse />,
            '⚡': <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)', border: '1.5px solid rgba(245,158,11,0.35)', boxShadow: '0 0 24px rgba(245,158,11,0.35)' }}><ActionTargetIcon size={58} color="#f59e0b" /></div>,
          };
          return (
            <>
              <motion.div
                key="intro-backdrop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeIntroOverlay}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                key="intro-panel"
                initial={{ opacity: 0, scale: 0.92, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 40 }}
                transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                className="fixed inset-x-5 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto"
              >
                <div className="relative rounded-3xl p-8 space-y-5 text-center"
                  style={isWarning
                    ? { background: 'linear-gradient(160deg, #1a1200 0%, #1f1500 100%)', border: '1px solid rgba(245,158,11,0.35)', boxShadow: '0 0 60px -15px rgba(245,158,11,0.3)' }
                    : { background: 'linear-gradient(160deg, #0f0f1a 0%, #1a1033 100%)', border: '1px solid rgba(168,85,247,0.25)', boxShadow: '0 0 60px -15px rgba(168,85,247,0.4)' }}>

                  <button onClick={closeIntroOverlay}
                    className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-foreground/50 hover:text-white hover:bg-foreground/10 transition-all"
                    style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Language picker — top-left of intro overlay */}
                  <div className="absolute top-3 left-3 flex gap-1">
                    {LANGS.map(l => (
                      <button key={l.code}
                        onClick={(e) => { e.stopPropagation(); setLang(l.code); }}
                        className="text-base leading-none px-1.5 py-1 rounded-md transition-all"
                        style={{
                          opacity: lang === l.code ? 1 : 0.4,
                          background: lang === l.code ? 'rgba(168,85,247,0.18)' : 'transparent',
                          border: lang === l.code ? '1px solid rgba(168,85,247,0.45)' : '1px solid transparent',
                        }}>
                        {l.flag}
                      </button>
                    ))}
                  </div>

                  <motion.div className="flex justify-center"
                    key={introOverlayStep}
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}>
                    {INTRO_ICONS[step.icon] ?? <span className="text-5xl">{step.icon}</span>}
                  </motion.div>

                  <motion.div key={`text-${introOverlayStep}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                    <h2 className="text-xl font-display font-bold leading-tight mb-2"
                      style={isWarning
                        ? { background: 'linear-gradient(135deg, #fff 55%, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                        : { background: 'linear-gradient(135deg, #fff 55%, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {step.title}
                    </h2>
                    <p className="text-sm text-foreground/65 leading-relaxed">{step.body}</p>
                  </motion.div>

                  {/* Dots */}
                  <div className="flex justify-center gap-1.5 pt-1">
                    {steps.map((_, i) => (
                      <button key={i} onClick={() => setIntroOverlayStep(i)}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: i === introOverlayStep ? 20 : 6, height: 6,
                          background: i === introOverlayStep
                            ? (isWarning ? '#f59e0b' : '#a855f7')
                            : 'rgba(255,255,255,0.2)'
                        }} />
                    ))}
                  </div>

                  {/* Nav buttons */}
                  <div className="flex gap-3 pt-1">
                    {introOverlayStep > 0 && (
                      <button onClick={() => setIntroOverlayStep(s => s - 1)}
                        className="flex-1 py-3 rounded-2xl text-sm font-display font-bold text-foreground/60 hover:text-foreground transition-colors"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                        ←
                      </button>
                    )}
                    <button
                      onClick={() => isLast ? closeIntroOverlay() : setIntroOverlayStep(s => s + 1)}
                      className="flex-1 py-3 rounded-2xl text-sm font-display font-bold text-white transition-all active:scale-95"
                      style={isWarning
                        ? { background: 'linear-gradient(135deg, #d97706, #f59e0b)', boxShadow: '0 0 16px -4px rgba(245,158,11,0.6)' }
                        : { background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 0 16px -4px rgba(168,85,247,0.5)' }}>
                      {isLast ? (lang === 'en' ? 'Close' : lang === 'es' ? 'Cerrar' : 'Fermer') : (qcmUI.onboardNext)}
                    </button>
                  </div>

                </div>
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>

      {/* ── Friction Modal (when user tries to manually pick a mode) ──────── */}
      <AnimatePresence>
        {frictionOpen && (
          <>
            <motion.div
              key="friction-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setFrictionOpen(false)}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)' }} />
            <motion.div
              key="friction-card"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', bounce: 0.35 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
              <div className="pointer-events-auto w-full max-w-sm rounded-3xl p-6 space-y-5 text-center"
                style={{
                  background: 'linear-gradient(160deg, rgba(20,20,28,0.98), rgba(12,12,18,0.98))',
                  border: '1px solid rgba(168,85,247,0.35)',
                  boxShadow: '0 0 50px -10px rgba(168,85,247,0.55)',
                }}>
                <h3 className="font-display font-bold text-xl text-foreground leading-snug">
                  {QCM_UI[lang].frictionTitle}
                </h3>
                <p className="text-sm text-foreground/65 leading-relaxed">
                  {QCM_UI[lang].frictionBody}
                </p>
                <div className="space-y-2.5 pt-1">
                  <button
                    onClick={() => { setFrictionOpen(false); launchRandom(); }}
                    className="w-full py-3.5 rounded-2xl font-display font-bold text-base text-white"
                    style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', boxShadow: '0 0 30px -8px rgba(168,85,247,0.7)' }}>
                    {QCM_UI[lang].frictionCancel}
                  </button>
                  <button
                    onClick={() => { setFrictionOpen(false); setManualPickOpen(true); }}
                    className="w-full py-3 rounded-2xl text-sm text-foreground/55 underline underline-offset-4 decoration-foreground/25">
                    {QCM_UI[lang].frictionConfirm}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Cancel Toast (when user abandons a mission) ────────────────────── */}
      <AnimatePresence>
        {cancelToast && (
          <motion.div
            key="cancel-toast"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 pointer-events-none">
            <div className="rounded-2xl px-5 py-3.5 text-center min-w-[240px]"
              style={{
                background: 'linear-gradient(135deg, rgba(239,68,68,0.18), rgba(20,20,28,0.95))',
                border: '1px solid rgba(239,68,68,0.4)',
                boxShadow: '0 0 30px -8px rgba(239,68,68,0.5)',
                backdropFilter: 'blur(8px)',
              }}>
              <p className="font-display font-bold text-base text-foreground">{QCM_UI[lang].cancelToastTitle}</p>
              <p className="text-xs text-foreground/55 mt-0.5">{QCM_UI[lang].cancelToastSub}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Paywall Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {paywallOpen && (
          <>
            <motion.div
              key="paywall-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
              onClick={() => setPaywallOpen(false)}
            />
            <motion.div
              key="paywall-modal"
              initial={{ opacity: 0, y: 32, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', bounce: 0.28, duration: 0.45 }}
              className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-8"
              style={{ pointerEvents: 'none' }}>
              <div className="w-full max-w-sm rounded-3xl p-7 flex flex-col gap-6"
                style={{
                  background: 'linear-gradient(160deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)',
                  border: '1px solid rgba(168,85,247,0.18)',
                  boxShadow: '0 -4px 80px -8px rgba(168,85,247,0.2), 0 24px 60px rgba(0,0,0,0.6)',
                  pointerEvents: 'auto',
                }}>

                {/* Icon + copy */}
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-2xl"
                    style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                    ◆
                  </div>
                  <h2 className="text-xl font-display font-bold text-foreground">Tu veux continuer ?</h2>
                  <p className="text-sm text-muted-foreground/70 leading-relaxed">
                    Blacklace t'a lancé.<br />Continue le mouvement.
                  </p>
                </div>

                {/* Session dots */}
                <div className="flex items-center justify-center gap-2">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full"
                      style={{ background: '#a855f7' }} />
                  ))}
                  <span className="text-[10px] text-muted-foreground/40 ml-2 uppercase tracking-widest">4 missions</span>
                </div>

                {/* Buttons */}
                <div className="space-y-2.5">
                  {paywallError && (
                    <p className="text-xs text-red-400/70 text-center">{paywallError}</p>
                  )}
                  <div ref={paypalContainerRef} id="paypal-button-container" className="min-h-[48px] w-full" />
                  <button
                    onClick={() => { setPaywallOpen(false); setPaywallError(''); }}
                    className="w-full py-3.5 rounded-2xl text-sm text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors">
                    Plus tard
                  </button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Dice transition flash overlay ───────────────────────────────────── */}
      <AnimatePresence>
        {diceFlash && (
          <motion.div key="dice-flash"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 backdrop-blur-sm pointer-events-none">
            <motion.div
              initial={{ scale: 0.4, rotateY: -90 }} animate={{ scale: 1, rotateY: 0 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.4 }}
              style={{ perspective: 500 }}>
              <RollingDice color="#f97316" />
            </motion.div>
            <motion.div className="absolute inset-0"
              animate={{ background: ['radial-gradient(circle at 50% 50%, rgba(249,115,22,0.06), transparent 70%)', 'radial-gradient(circle at 50% 50%, rgba(249,115,22,0.16), transparent 70%)', 'radial-gradient(circle at 50% 50%, rgba(249,115,22,0.06), transparent 70%)'] }}
              transition={{ duration: 0.6, repeat: Infinity }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Age group modal (first launch) ─────────────────────────────────── */}
      <AnimatePresence>
        {ageModalOpen && (() => {
          const qcmUI = QCM_UI[lang];
          return (
            <>
              <motion.div key="age-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
                <motion.div key="age-modal" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }} transition={{ type: 'spring', bounce: 0.3 }}
                  className="w-full max-w-sm rounded-3xl p-6 space-y-5"
                  style={{ background: 'linear-gradient(160deg, #0f0f1a 0%, #1a1033 100%)', border: '1px solid rgba(168,85,247,0.25)', boxShadow: '0 0 60px -10px rgba(168,85,247,0.4)' }}>
                  <div className="text-center space-y-2">
                    <div className="text-4xl mb-2">⬡</div>
                    <h2 className="text-xl font-display font-bold">{qcmUI.ageModalTitle}</h2>
                    <p className="text-sm text-muted-foreground/70 leading-relaxed">{qcmUI.ageModalSubtitle}</p>
                  </div>
                  <div className="space-y-2.5">
                    {AGE_GROUPS.map((g, gIdx) => {
                      const tg = qcmUI.ageGroups[gIdx];
                      const isSelected = ageGroup === g.id;
                      return (
                        <motion.button key={g.id} whileTap={{ scale: 0.97 }}
                          onClick={() => { setAgeGroup(g.id); setAgeModalOpen(false); }}
                          className="w-full py-3.5 px-4 rounded-2xl flex items-center gap-3 transition-all duration-150"
                          style={isSelected
                            ? { background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.4)' }
                            : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <span className="text-xl">{g.emoji}</span>
                          <div className="flex-1 text-left">
                            <p className="font-semibold text-sm">{tg?.label ?? g.label}</p>
                            <p className="text-xs text-muted-foreground/50">{tg?.range ?? g.range}</p>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                            style={{ background: 'rgba(168,85,247,0.12)', color: 'rgba(168,85,247,0.7)' }}>
                            {tg?.hint}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                  <button onClick={() => setAgeModalOpen(false)}
                    className="w-full text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors pt-1">
                    {qcmUI.ageModalSkip}
                  </button>
                </motion.div>
              </div>
            </>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
