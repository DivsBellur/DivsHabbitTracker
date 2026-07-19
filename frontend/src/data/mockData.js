/**
 * Mock data for HabitQuest.
 *
 * The app runs entirely on the client with no backend or database (per
 * product-specification.md). All "persistence" lives in React state for the
 * current browser session — see src/hooks/useGamification.js.
 *
 * Habit/badge counts and starting values are deliberately chosen so a few
 * interactions during a demo will unlock a new badge and trigger a level-up,
 * without requiring dozens of clicks.
 */

/** The signed-in user shown in the header and highlighted on the leaderboard. */
export const currentUser = {
  id: 'u1',
  name: 'Alex Rivera',
  avatarEmoji: '🧑‍💻',
};

/**
 * Starting habit list.
 * `difficulty` drives base XP per FR-1.1 (see utils/gamification.js).
 * `currentStreak` / `longestStreak` seed the streak system (FR-3.1, FR-3.5).
 */
export const initialHabits = [
  {
    id: 'h1',
    name: 'Drink 8 glasses of water',
    category: 'Health',
    difficulty: 'easy',
    icon: '💧',
    currentStreak: 4,
    longestStreak: 12,
    completedToday: false,
  },
  {
    id: 'h2',
    name: 'Read for 20 minutes',
    category: 'Learning',
    difficulty: 'easy',
    icon: '📚',
    currentStreak: 0,
    longestStreak: 21,
    completedToday: false,
  },
  {
    id: 'h3',
    name: '30-minute workout',
    category: 'Fitness',
    difficulty: 'medium',
    icon: '🏋️',
    currentStreak: 2,
    longestStreak: 30,
    completedToday: false,
  },
  {
    id: 'h4',
    name: 'Meditate for 10 minutes',
    category: 'Mindfulness',
    difficulty: 'easy',
    icon: '🧘',
    currentStreak: 0,
    longestStreak: 15,
    completedToday: false,
  },
  {
    id: 'h5',
    name: 'No added sugar today',
    category: 'Health',
    difficulty: 'hard',
    icon: '🍬',
    currentStreak: 0,
    longestStreak: 5,
    completedToday: false,
  },
  {
    id: 'h6',
    name: 'Practice guitar',
    category: 'Creativity',
    difficulty: 'medium',
    icon: '🎸',
    currentStreak: 6,
    longestStreak: 18,
    completedToday: false,
  },
];

/** Starting lifetime stats, seeded close to a few unlock thresholds for a lively demo. */
export const initialStats = {
  totalXP: 1240,
  totalCompletions: 47,
  perfectDaysCount: 2,
  completedBeforeSixAM: false,
  completedAfterTenPM: false,
};

/**
 * Badge catalog, grouped by the categories defined in the spec (§4.2).
 * "Social" badges are intentionally omitted — social/group features are out
 * of scope for this frontend-only build.
 *
 * `criteria.type` is evaluated by evaluateBadgeUnlocks() in
 * utils/gamification.js:
 *   - streak:      longest *currently active* streak across all habits
 *   - completions:  lifetime habit completions
 *   - categories:   number of distinct categories with an active streak
 *   - perfectDay:   number of days every habit was completed
 *   - earlyBird:    a habit was completed before 6 AM local time
 *   - nightOwl:     a habit was completed at/after 10 PM local time
 */
export const badgeDefinitions = [
  // Streak badges
  {
    id: 'b1',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak on any habit.',
    category: 'Streak',
    tier: 'bronze',
    icon: '🔥',
    criteria: { type: 'streak', days: 7 },
  },
  {
    id: 'b2',
    name: 'Month Master',
    description: 'Maintain a 30-day streak on any habit.',
    category: 'Streak',
    tier: 'silver',
    icon: '🔥',
    criteria: { type: 'streak', days: 30 },
  },
  {
    id: 'b3',
    name: 'Century Club',
    description: 'Maintain a 100-day streak on any habit.',
    category: 'Streak',
    tier: 'legendary',
    icon: '🔥',
    criteria: { type: 'streak', days: 100 },
  },
  // Completion badges
  {
    id: 'b4',
    name: 'First Step',
    description: 'Complete your first habit.',
    category: 'Completion',
    tier: 'bronze',
    icon: '✅',
    criteria: { type: 'completions', count: 1 },
  },
  {
    id: 'b5',
    name: 'Halfway There',
    description: 'Complete 50 habits in total.',
    category: 'Completion',
    tier: 'silver',
    icon: '✅',
    criteria: { type: 'completions', count: 50 },
  },
  {
    id: 'b6',
    name: 'Habit Hero',
    description: 'Complete 100 habits in total.',
    category: 'Completion',
    tier: 'gold',
    icon: '🏆',
    criteria: { type: 'completions', count: 100 },
  },
  // Variety badges
  {
    id: 'b7',
    name: 'Renaissance Person',
    description: 'Keep active streaks across 3 different habit categories.',
    category: 'Variety',
    tier: 'silver',
    icon: '🎨',
    criteria: { type: 'categories', count: 3 },
  },
  {
    id: 'b8',
    name: 'Well-Rounded',
    description: 'Keep active streaks across 5 different habit categories.',
    category: 'Variety',
    tier: 'gold',
    icon: '🌈',
    criteria: { type: 'categories', count: 5 },
  },
  // Special badges
  {
    id: 'b9',
    name: 'Early Bird',
    description: 'Complete a habit before 6 AM.',
    category: 'Special',
    tier: 'bronze',
    icon: '🌅',
    criteria: { type: 'earlyBird' },
  },
  {
    id: 'b10',
    name: 'Night Owl',
    description: 'Complete a habit at or after 10 PM.',
    category: 'Special',
    tier: 'bronze',
    icon: '🌙',
    criteria: { type: 'nightOwl' },
  },
  {
    id: 'b11',
    name: 'Perfect Day',
    description: 'Complete every habit on your list in a single day.',
    category: 'Special',
    tier: 'gold',
    icon: '🌟',
    criteria: { type: 'perfectDay', count: 1 },
  },
];

/**
 * Mock leaderboard rows. `id: currentUser.id` marks the row that should be
 * highlighted as "you" in the UI. Two boards (weekly / all-time) give the
 * period toggle something real to switch between.
 */
export const leaderboardData = {
  weekly: [
    { id: 'u4', name: 'Priya Nandakumar', avatarEmoji: '🧗', xp: 2140, level: 6 },
    { id: 'u2', name: 'Jordan Lee', avatarEmoji: '🏃', xp: 1980, level: 6 },
    { id: 'u1', name: 'Alex Rivera', avatarEmoji: '🧑‍💻', xp: 1240, level: 4 },
    { id: 'u7', name: 'Sam Okafor', avatarEmoji: '🎨', xp: 1190, level: 4 },
    { id: 'u3', name: 'Maria Gonzalez', avatarEmoji: '🧘', xp: 1050, level: 3 },
    { id: 'u6', name: 'Chen Wei', avatarEmoji: '📖', xp: 940, level: 3 },
    { id: 'u5', name: 'Taylor Brooks', avatarEmoji: '🎸', xp: 820, level: 3 },
    { id: 'u8', name: 'Nina Petrov', avatarEmoji: '🏋️', xp: 610, level: 2 },
  ],
  allTime: [
    { id: 'u2', name: 'Jordan Lee', avatarEmoji: '🏃', xp: 18420, level: 15 },
    { id: 'u4', name: 'Priya Nandakumar', avatarEmoji: '🧗', xp: 16770, level: 14 },
    { id: 'u6', name: 'Chen Wei', avatarEmoji: '📖', xp: 12930, level: 12 },
    { id: 'u3', name: 'Maria Gonzalez', avatarEmoji: '🧘', xp: 11080, level: 11 },
    { id: 'u1', name: 'Alex Rivera', avatarEmoji: '🧑‍💻', xp: 9640, level: 10 },
    { id: 'u5', name: 'Taylor Brooks', avatarEmoji: '🎸', xp: 8710, level: 9 },
    { id: 'u7', name: 'Sam Okafor', avatarEmoji: '🎨', xp: 6320, level: 8 },
    { id: 'u8', name: 'Nina Petrov', avatarEmoji: '🏋️', xp: 4150, level: 6 },
  ],
};

/** Streak-length milestones celebrated per FR-3.4. */
export const STREAK_MILESTONES = [7, 14, 30, 60, 90, 180, 365];
