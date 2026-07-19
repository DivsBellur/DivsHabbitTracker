/**
 * Pure gamification calculation functions.
 *
 * Every formula here is traceable to a functional requirement in
 * product-specification.md §4 (Feature Requirements). Keeping this module
 * side-effect free (no state, no DOM) makes the rules independently testable
 * and reusable from src/hooks/useGamification.js.
 */

/** Base XP by habit difficulty (FR-1.1: 10–50 points based on difficulty). */
export const DIFFICULTY_XP = {
  easy: 10,
  medium: 25,
  hard: 50,
};

/** Flat bonus for completing every habit in a day (FR-1.3). */
export const PERFECT_DAY_BONUS = 100;

/** Streak multiplier cap (FR-1.2). */
export const STREAK_MULTIPLIER_CAP = 2.0;

/**
 * Streak multiplier applied to base XP.
 * FR-1.2 specifies "1.1x per consecutive day, capped at 2.0x" — implemented
 * here as a compounding 1.1^streakDays, clamped to the cap. A 1-day streak
 * is a 1.1x bonus; the cap is reached at an 8-day streak (1.1^8 ≈ 2.14).
 *
 * @param {number} streakDays - the habit's current streak *after* today's completion
 * @returns {number} multiplier in the range [1, STREAK_MULTIPLIER_CAP]
 */
export function getStreakMultiplier(streakDays) {
  if (streakDays <= 0) return 1;
  return Math.min(Math.pow(1.1, streakDays), STREAK_MULTIPLIER_CAP);
}

/**
 * XP awarded for completing a single habit.
 *
 * @param {'easy'|'medium'|'hard'} difficulty
 * @param {number} streakDaysAfterCompletion - streak length including today
 * @returns {number} whole-number XP amount
 */
export function calculateHabitXP(difficulty, streakDaysAfterCompletion) {
  const base = DIFFICULTY_XP[difficulty] ?? DIFFICULTY_XP.easy;
  const multiplier = getStreakMultiplier(streakDaysAfterCompletion);
  return Math.round(base * multiplier);
}

/**
 * Cumulative XP required to REACH a given level (FR-1.4).
 * Spec formula: XP_needed = 100 * level^1.5. Level 1 is the starting level
 * and requires 0 XP; the formula is applied to the *previous* level to get
 * the threshold for the next one, e.g. threshold(2) = 100 * 1^1.5 = 100.
 *
 * @param {number} level
 * @returns {number} total XP required to be at `level`
 */
export function xpRequiredForLevel(level) {
  if (level <= 1) return 0;
  return Math.round(100 * Math.pow(level - 1, 1.5));
}

/**
 * Derives level + progress-bar data from a total XP amount.
 *
 * @param {number} totalXP
 * @returns {{
 *   level: number,
 *   xpIntoLevel: number,
 *   xpForThisLevel: number,
 *   nextLevelXP: number,
 *   progressPercent: number,
 * }}
 */
export function getLevelInfo(totalXP) {
  let level = 1;
  // Small, bounded loop — XP thresholds grow superlinearly, so this
  // terminates quickly even for very high totals.
  while (totalXP >= xpRequiredForLevel(level + 1)) {
    level += 1;
  }

  const currentLevelBaseXP = xpRequiredForLevel(level);
  const nextLevelXP = xpRequiredForLevel(level + 1);
  const xpIntoLevel = totalXP - currentLevelBaseXP;
  const xpForThisLevel = nextLevelXP - currentLevelBaseXP;
  const progressPercent =
    xpForThisLevel > 0 ? Math.min(100, (xpIntoLevel / xpForThisLevel) * 100) : 100;

  return { level, xpIntoLevel, xpForThisLevel, nextLevelXP, progressPercent };
}

/**
 * Evaluates every badge definition against the user's current stats and
 * returns the set of badge ids that should be unlocked.
 *
 * @param {{
 *   longestActiveStreak: number,
 *   totalCompletions: number,
 *   categoriesWithActiveStreak: number,
 *   perfectDaysCount: number,
 *   completedBeforeSixAM: boolean,
 *   completedAfterTenPM: boolean,
 * }} stats
 * @param {Array<{id: string, criteria: object}>} definitions
 * @returns {Set<string>} badge ids that meet their unlock criteria
 */
export function evaluateBadgeUnlocks(stats, definitions) {
  const unlocked = new Set();

  definitions.forEach((badge) => {
    const c = badge.criteria;
    let isUnlocked = false;

    switch (c.type) {
      case 'streak':
        isUnlocked = stats.longestActiveStreak >= c.days;
        break;
      case 'completions':
        isUnlocked = stats.totalCompletions >= c.count;
        break;
      case 'categories':
        isUnlocked = stats.categoriesWithActiveStreak >= c.count;
        break;
      case 'perfectDay':
        isUnlocked = stats.perfectDaysCount >= c.count;
        break;
      case 'earlyBird':
        isUnlocked = stats.completedBeforeSixAM;
        break;
      case 'nightOwl':
        isUnlocked = stats.completedAfterTenPM;
        break;
      default:
        isUnlocked = false;
    }

    if (isUnlocked) unlocked.add(badge.id);
  });

  return unlocked;
}
