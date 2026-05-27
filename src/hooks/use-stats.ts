import { useState, useEffect } from "react";
import { differenceInDays, startOfDay, parseISO } from "date-fns";

export type EvalScore = 3 | 2 | 1 | 0;

export interface EvalEntry {
  date: string;
  mode: string;
  score: EvalScore;
}

export interface SessionEntry {
  id: string;
  date: string;
  mode: string;
  moodId: string | null;
  score: EvalScore | null;
}

interface UserStats {
  completed: number;
  streak: number;
  lastDate: string | null;
  evaluations: EvalEntry[];
  sessions: SessionEntry[];
}

function loadEvaluations(): EvalEntry[] {
  try { return JSON.parse(localStorage.getItem("bld_evaluations") || "[]"); }
  catch { return []; }
}

function saveEvaluations(evals: EvalEntry[]) {
  localStorage.setItem("bld_evaluations", JSON.stringify(evals.slice(-100)));
}

function loadSessions(): SessionEntry[] {
  try { return JSON.parse(localStorage.getItem("bld_sessions") || "[]"); }
  catch { return []; }
}

function saveSessions(sessions: SessionEntry[]) {
  localStorage.setItem("bld_sessions", JSON.stringify(sessions.slice(-200)));
}

export function useStats() {
  const [stats, setStats] = useState<UserStats>({
    completed: 0, streak: 0, lastDate: null, evaluations: [], sessions: [],
  });

  useEffect(() => {
    const completed = parseInt(localStorage.getItem("bld_completed") || "0", 10);
    const streak = parseInt(localStorage.getItem("bld_streak") || "0", 10);
    const lastDate = localStorage.getItem("bld_last_date");
    const evaluations = loadEvaluations();
    const sessions = loadSessions();

    let currentStreak = streak;
    if (lastDate) {
      const today = startOfDay(new Date());
      const last = startOfDay(parseISO(lastDate));
      const diff = differenceInDays(today, last);
      if (diff > 1) {
        currentStreak = 0;
        localStorage.setItem("bld_streak", "0");
      }
    }
    setStats({ completed, streak: currentStreak, lastDate, evaluations, sessions });
  }, []);

  const recordCompletion = () => {
    const todayStr = new Date().toISOString();
    const todayStart = startOfDay(new Date());
    setStats((prev) => {
      let newStreak = prev.streak;
      if (prev.lastDate) {
        const lastStart = startOfDay(parseISO(prev.lastDate));
        const diff = differenceInDays(todayStart, lastStart);
        if (diff === 1) newStreak += 1;
        else if (diff > 1) newStreak = 1;
      } else {
        newStreak = 1;
      }
      const newCompleted = prev.completed + 1;
      localStorage.setItem("bld_completed", newCompleted.toString());
      localStorage.setItem("bld_streak", newStreak.toString());
      localStorage.setItem("bld_last_date", todayStr);
      return { ...prev, completed: newCompleted, streak: newStreak, lastDate: todayStr };
    });
  };

  const recordEvaluation = (mode: string, score: EvalScore) => {
    const entry: EvalEntry = { date: new Date().toISOString(), mode, score };
    setStats((prev) => {
      const updated = [...prev.evaluations, entry];
      saveEvaluations(updated);
      return { ...prev, evaluations: updated };
    });
  };

  const recordSession = (mode: string, moodId: string | null, score: EvalScore | null) => {
    const entry: SessionEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mode, moodId, score,
    };
    setStats((prev) => {
      const updated = [...prev.sessions, entry];
      saveSessions(updated);
      return { ...prev, sessions: updated };
    });
  };

  const clearSessions = () => {
    localStorage.removeItem("bld_sessions");
    setStats((prev) => ({ ...prev, sessions: [] }));
  };

  const averageScore = (n = 10): number | null => {
    const recent = stats.evaluations.slice(-n);
    if (!recent.length) return null;
    return recent.reduce((a, e) => a + e.score, 0) / recent.length;
  };

  return { stats, recordCompletion, recordEvaluation, recordSession, clearSessions, averageScore };
}

// ── Daily limit ───────────────────────────────────────────────────────────────

const DAILY_LIMIT = 4;
const DAILY_KEY = "bld_daily";
const PREMIUM_KEY = "bld_premium";
const TEST_KEY = "bld_test_mode";

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function loadDaily(): { count: number; date: string } {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) return { count: 0, date: getTodayStr() };
    const data = JSON.parse(raw);
    if (data.date !== getTodayStr()) return { count: 0, date: getTodayStr() };
    return data;
  } catch {
    return { count: 0, date: getTodayStr() };
  }
}

function loadPremium(): boolean {
  try { return localStorage.getItem(PREMIUM_KEY) === 'true'; } catch { return false; }
}

function loadTestMode(): boolean {
  try { return localStorage.getItem(TEST_KEY) === 'true'; } catch { return false; }
}

export function useDailyLimit() {
  const [daily, setDaily] = useState(loadDaily);
  const [isPremium, setIsPremium] = useState(loadPremium);
  const [isTestMode, setIsTestMode] = useState(loadTestMode);

  const consumePlay = (): boolean => {
    if (isPremium || isTestMode) return true;
    const d = loadDaily();
    if (d.count >= DAILY_LIMIT) return false;
    const next = { count: d.count + 1, date: getTodayStr() };
    localStorage.setItem(DAILY_KEY, JSON.stringify(next));
    setDaily(next);
    return true;
  };

  const unlockPremium = () => {
    try { localStorage.setItem(PREMIUM_KEY, 'true'); } catch {}
    setIsPremium(true);
  };

  const lockPremium = () => {
    try {
      localStorage.removeItem(PREMIUM_KEY);
      localStorage.removeItem('bld_subscription_id');
    } catch {}
    setIsPremium(false);
  };

  const resetDaily = () => {
    const next = { count: 0, date: getTodayStr() };
    try { localStorage.setItem(DAILY_KEY, JSON.stringify(next)); } catch {}
    setDaily(next);
  };

  const toggleTestMode = (): boolean => {
    const next = !isTestMode;
    try {
      if (next) localStorage.setItem(TEST_KEY, 'true');
      else localStorage.removeItem(TEST_KEY);
    } catch {}
    setIsTestMode(next);
    return next;
  };

  // Always read fresh from localStorage so external changes are reflected
  const freshDaily = loadDaily();
  const canPlay = isPremium || isTestMode || freshDaily.count < DAILY_LIMIT;
  const playsLeft = (isPremium || isTestMode) ? 999 : Math.max(0, DAILY_LIMIT - freshDaily.count);
  const dailyCount = freshDaily.count;

  return { canPlay, playsLeft, dailyCount, consumePlay, isPremium, isTestMode, toggleTestMode, unlockPremium, lockPremium, resetDaily };
}
