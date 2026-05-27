import { useState, useEffect } from 'react';

export type AgeGroup = 'teen' | 'young' | 'adult' | 'senior' | null;

const KEY = 'bld_age_group';

export function useAgeGroup() {
  const [ageGroup, setAgeGroupState] = useState<AgeGroup>(() => {
    return (localStorage.getItem(KEY) as AgeGroup) ?? null;
  });

  const setAgeGroup = (g: AgeGroup) => {
    setAgeGroupState(g);
    if (g) localStorage.setItem(KEY, g);
    else localStorage.removeItem(KEY);
  };

  return { ageGroup, setAgeGroup };
}

export const AGE_GROUPS: { id: AgeGroup; label: string; emoji: string; range: string }[] = [
  { id: 'teen', label: 'Ado', emoji: '⚡', range: '13–17 ans' },
  { id: 'young', label: 'Jeune adulte', emoji: '🔥', range: '18–29 ans' },
  { id: 'adult', label: 'Adulte', emoji: '◈', range: '30–49 ans' },
  { id: 'senior', label: 'Senior', emoji: '🌿', range: '50+ ans' },
];

export const AGE_DURATION_FACTOR: Record<NonNullable<AgeGroup>, number> = {
  teen: 0.6,
  young: 1.0,
  adult: 1.0,
  senior: 1.3,
};

export function adjustDuration(minutes: number, ag: AgeGroup): number {
  if (!ag) return minutes;
  return Math.round(minutes * AGE_DURATION_FACTOR[ag]);
}
