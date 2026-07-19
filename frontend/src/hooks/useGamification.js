import { useCallback, useMemo, useReducer } from 'react';
import { initialHabits, initialStats, badgeDefinitions, STREAK_MILESTONES } from '../data/mockData.js';
import {
  calculateHabitXP,
  evaluateBadgeUnlocks,
  getLevelInfo,
  PERFECT_DAY_BONUS,
} from '../utils/gamification.js';

let toastIdCounter = 0;
/** Monotonically increasing id — good enough for a client-only toast queue. */
function nextToastId() {
  toastIdCounter += 1;
  return `toast-${toastIdCounter}`;
}

const initialState = {
  habits: initialHabits,
  totalXP: initialStats.totalXP,
  totalCompletions: initialStats.totalCompletions,
  perfectDaysCount: initialStats.perfectDaysCount,
  perfectDayAwardedToday: false,
  unlockedBadgeIds: Array.from(
    evaluateBadgeUnlocks(
      {
        longestActiveStreak: Math.max(0, ...initialHabits.map((h) => h.currentStreak)),
        totalCompletions: initialStats.totalCompletions,
        categoriesWithActiveStreak: new Set(
          initialHabits.filter((h) => h.currentStreak > 0).map((h) => h.category)
        ).size,
        perfectDaysCount: initialStats.perfectDaysCount,
        completedBeforeSixAM: initialStats.completedBeforeSixAM,
        completedAfterTenPM: initialStats.completedAfterTenPM,
      },
      badgeDefinitions
    )
  ),
  completedBeforeSixAM: initialStats.completedBeforeSixAM,
  completedAfterTenPM: initialStats.completedAfterTenPM,
  toasts: [],
  levelUpInfo: null,
};

/**
 * Handles the COMPLETE_HABIT action: awards XP, updates the streak, checks
 * for a Perfect Day bonus, re-evaluates badges, and detects a level-up — all
 * in one pass so every derived value is consistent with the same snapshot.
 */
function completeHabit(state, habitId, now) {
  const habit = state.habits.find((h) => h.id === habitId);
  if (!habit || habit.completedToday) return state; // already done today — no-op

  const newStreak = habit.currentStreak + 1;
  const xpEarned = calculateHabitXP(habit.difficulty, newStreak);

  const hour = now.getHours();
  const isEarlyBird = hour < 6;
  const isNightOwl = hour >= 22;

  const updatedHabits = state.habits.map((h) =>
    h.id === habitId
      ? {
          ...h,
          completedToday: true,
          currentStreak: newStreak,
          longestStreak: Math.max(h.longestStreak, newStreak),
        }
      : h
  );

  const allCompletedToday = updatedHabits.every((h) => h.completedToday);
  const perfectDayBonusAwarded = allCompletedToday && !state.perfectDayAwardedToday;
  const perfectDayBonus = perfectDayBonusAwarded ? PERFECT_DAY_BONUS : 0;

  const totalXP = state.totalXP + xpEarned + perfectDayBonus;
  const totalCompletions = state.totalCompletions + 1;
  const perfectDaysCount = state.perfectDaysCount + (perfectDayBonusAwarded ? 1 : 0);
  const completedBeforeSixAM = state.completedBeforeSixAM || isEarlyBird;
  const completedAfterTenPM = state.completedAfterTenPM || isNightOwl;

  const stats = {
    longestActiveStreak: Math.max(0, ...updatedHabits.map((h) => h.currentStreak)),
    totalCompletions,
    categoriesWithActiveStreak: new Set(
      updatedHabits.filter((h) => h.currentStreak > 0).map((h) => h.category)
    ).size,
    perfectDaysCount,
    completedBeforeSixAM,
    completedAfterTenPM,
  };
  const unlockedSet = evaluateBadgeUnlocks(stats, badgeDefinitions);
  const previouslyUnlocked = new Set(state.unlockedBadgeIds);
  const newlyUnlockedBadges = badgeDefinitions.filter(
    (b) => unlockedSet.has(b.id) && !previouslyUnlocked.has(b.id)
  );

  const leveledUp = getLevelInfo(totalXP).level > getLevelInfo(state.totalXP).level;

  const newToasts = [{ id: nextToastId(), tone: 'xp', message: `+${xpEarned} XP — ${habit.name}` }];
  if (perfectDayBonusAwarded) {
    newToasts.push({
      id: nextToastId(),
      tone: 'bonus',
      message: `🌟 Perfect Day! +${PERFECT_DAY_BONUS} XP bonus`,
    });
  }
  if (STREAK_MILESTONES.includes(newStreak)) {
    newToasts.push({
      id: nextToastId(),
      tone: 'streak',
      message: `🔥 ${newStreak}-day streak on "${habit.name}"!`,
    });
  }
  newlyUnlockedBadges.forEach((badge) => {
    newToasts.push({ id: nextToastId(), tone: 'badge', message: `🏅 Badge unlocked: ${badge.name}` });
  });

  return {
    ...state,
    habits: updatedHabits,
    totalXP,
    totalCompletions,
    perfectDaysCount,
    perfectDayAwardedToday: state.perfectDayAwardedToday || perfectDayBonusAwarded,
    unlockedBadgeIds: Array.from(unlockedSet),
    completedBeforeSixAM,
    completedAfterTenPM,
    toasts: [...state.toasts, ...newToasts],
    levelUpInfo: leveledUp ? { level: getLevelInfo(totalXP).level } : state.levelUpInfo,
  };
}

function gamificationReducer(state, action) {
  switch (action.type) {
    case 'COMPLETE_HABIT':
      return completeHabit(state, action.habitId, action.now ?? new Date());
    case 'RESET_DAY':
      // Demo-only affordance: real day rollover would happen server-side at
      // the user's local midnight. This lets you replay the interaction
      // without reloading the page. Lifetime stats/badges are untouched.
      return {
        ...state,
        habits: state.habits.map((h) => ({ ...h, completedToday: false })),
        perfectDayAwardedToday: false,
      };
    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case 'DISMISS_LEVEL_UP':
      return { ...state, levelUpInfo: null };
    default:
      return state;
  }
}

/**
 * Central state + actions for the gamification system (XP, levels, streaks,
 * badges, Perfect Day bonus). Everything lives in memory for the browser
 * session — there is no backend, so a page reload resets progress back to
 * the seeded mock data.
 */
export function useGamification() {
  const [state, dispatch] = useReducer(gamificationReducer, initialState);

  const completeHabitAction = useCallback((habitId) => {
    dispatch({ type: 'COMPLETE_HABIT', habitId, now: new Date() });
  }, []);

  const resetDay = useCallback(() => dispatch({ type: 'RESET_DAY' }), []);
  const dismissToast = useCallback((id) => dispatch({ type: 'DISMISS_TOAST', id }), []);
  const dismissLevelUp = useCallback(() => dispatch({ type: 'DISMISS_LEVEL_UP' }), []);

  const levelInfo = useMemo(() => getLevelInfo(state.totalXP), [state.totalXP]);
  const unlockedBadgeIds = useMemo(() => new Set(state.unlockedBadgeIds), [state.unlockedBadgeIds]);
  const habitsCompletedToday = useMemo(
    () => state.habits.filter((h) => h.completedToday).length,
    [state.habits]
  );

  return {
    habits: state.habits,
    totalXP: state.totalXP,
    totalCompletions: state.totalCompletions,
    perfectDaysCount: state.perfectDaysCount,
    levelInfo,
    unlockedBadgeIds,
    toasts: state.toasts,
    levelUpInfo: state.levelUpInfo,
    habitsCompletedToday,
    completeHabit: completeHabitAction,
    resetDay,
    dismissToast,
    dismissLevelUp,
  };
}
