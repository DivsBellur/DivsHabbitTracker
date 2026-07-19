# HabitQuest — Gamified Habit Tracker (Frontend)

A React frontend for a habit-tracking app with gamification: XP, levels,
streaks, achievement badges, and a leaderboard. Built against
[`product-specification.md`](../product-specification.md).

**Runs entirely on mock data — no backend, no database.** All state (habit
completions, XP, streaks, unlocked badges) lives in memory for the browser
session via React state, and resets to the seeded mock data on page reload.
The `backend/` folder at the repo root is an unused placeholder — this
frontend does not call it.

## Features

| Area | What's implemented |
|---|---|
| **Dashboard** | Today's habit list, per-habit streaks, daily completion progress, Perfect Day banner |
| **XP & Levels** | Base XP by difficulty, streak multiplier, Perfect Day bonus, level-up celebration (spec §4.1) |
| **Achievements** | 11 badges across Streak / Completion / Variety / Special categories, locked/unlocked gallery (spec §4.2) |
| **Streaks** | Per-habit current & longest streak, flame icon that scales with streak length, milestone toasts (spec §4.3) |
| **Leaderboard** | Weekly / All-Time toggle over mock ranked users, current user highlighted (spec §4.5) |
| **Responsive design** | Mobile-first layout, breakpoints at 640px/560px/480px, 44×44px minimum touch targets |
| **Accessibility** | `prefers-reduced-motion` respected globally, `aria-live` toasts, screen-reader labels on badges/leaderboard rows |

Out of scope for this build (not requested): backend/database, daily
challenges, social/group features, virtual currency & rewards store, avatar
customization. These are documented in the spec but weren't part of the
requested feature set.

## Tech stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) (JavaScript, no TypeScript)
- Plain CSS (custom properties for theming) — no CSS framework or component library
- No routing library — the three views are tabs managed by local component state
- Zero backend dependencies

## Project structure

```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── src/
│   ├── main.jsx                 # React entry point
│   ├── App.jsx                  # Root component, tab routing
│   ├── App.css
│   ├── data/
│   │   └── mockData.js          # Habits, badges, leaderboard, user profile
│   ├── utils/
│   │   └── gamification.js      # Pure XP/level/streak/badge formulas
│   ├── hooks/
│   │   └── useGamification.js   # Central state + actions (useReducer)
│   ├── components/
│   │   ├── Header.jsx / .css
│   │   ├── XPBar.jsx / .css
│   │   ├── Dashboard.jsx / .css
│   │   ├── HabitCard.jsx / .css
│   │   ├── StreakFlame.jsx / .css
│   │   ├── AchievementsPanel.jsx / .css
│   │   ├── BadgeCard.jsx / .css
│   │   ├── Leaderboard.jsx / .css
│   │   ├── LevelUpModal.jsx / .css
│   │   └── ToastContainer.jsx / .css
│   └── styles/
│       └── global.css           # Design tokens, reset, responsive/a11y base
```

## Setup (local development)

Requires [Node.js](https://nodejs.org/) 18 or later.

```bash
cd frontend
npm install
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`) — open it in
your browser. The dev server hot-reloads on file changes.

### Try it out

1. Go to **Dashboard** and click **Complete** on a habit to earn XP.
2. Complete every habit to trigger the **Perfect Day** bonus.
3. Watch the header's level ring — crossing a level threshold opens the
   level-up modal.
4. Check **Achievements** to see badges unlock live as you hit their
   criteria (a few are seeded close to unlocking).
5. Use **Reset Today (Demo)** on the dashboard to clear today's checkmarks
   without losing XP/streaks/badges, so you can replay the flow. (This
   button exists only because there's no backend to roll the day over at
   midnight — see the comment in `useGamification.js`.)

### Other scripts

```bash
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

## Deployment (Vercel)

This app is a static Vite build — Vercel needs no server runtime.
`vercel.json` in this folder configures the build.

### Option A — Vercel CLI

```bash
cd frontend
npm install -g vercel   # if you don't already have it
vercel                  # first run: link/create the project, deploy a preview
vercel --prod            # deploy to production
```

### Option B — Vercel dashboard (Git-connected)

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In the [Vercel dashboard](https://vercel.com/new), import the repo.
3. **Important:** since this app lives in a `frontend/` subfolder (the repo
   also has a sibling `backend/` folder), set the project's **Root
   Directory** to `frontend` in the Vercel project settings.
4. Framework preset should auto-detect as **Vite**; build command
   `npm run build`, output directory `dist` (already set in `vercel.json`).
5. Deploy. Every push to the connected branch redeploys automatically.

No environment variables are required — there's no backend or API key to
configure.

## Notes on the gamification formulas

Implemented in `src/utils/gamification.js`, each traced to a requirement in
`product-specification.md` §4.1–4.3:

- **Base XP** by difficulty: easy 10 / medium 25 / hard 50 (FR-1.1).
- **Streak multiplier**: `1.1 ^ streakDays`, capped at `2.0×` (FR-1.2).
- **Perfect Day bonus**: flat `+100 XP`, once per day (FR-1.3).
- **Level thresholds**: cumulative XP to reach level *N* is
  `100 * (N-1)^1.5`, per the spec's `XP_needed = 100 * level^1.5` formula
  (FR-1.4).
- **Streak milestones** celebrated at 7/14/30/60/90/180/365 days (FR-3.4).

These are documented with JSDoc comments in the source in case the exact
interpretation (e.g. compounding vs. linear streak multiplier) needs
adjusting for your actual game-balance targets.
