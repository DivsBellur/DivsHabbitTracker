import { useState } from 'react';
import { leaderboardData, currentUser } from '../data/mockData.js';
import './Leaderboard.css';

const RANK_MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

/**
 * Leaderboard with a Weekly / All-Time toggle (FR-5.1–FR-5.4). Runs
 * entirely on the static mock dataset in data/mockData.js, independent of
 * the live dashboard state, per the "leaderboard using mock data"
 * requirement.
 */
export default function Leaderboard() {
  const [period, setPeriod] = useState('weekly');
  const rows = [...leaderboardData[period]].sort((a, b) => b.xp - a.xp);

  return (
    <section className="leaderboard" aria-labelledby="leaderboard-heading">
      <div className="leaderboard__header card">
        <h2 id="leaderboard-heading">Leaderboard</h2>
        <div className="leaderboard__toggle" role="tablist" aria-label="Leaderboard period">
          <button
            type="button"
            role="tab"
            aria-selected={period === 'weekly'}
            className={`leaderboard__toggle-btn tap-target ${period === 'weekly' ? 'is-active' : ''}`}
            onClick={() => setPeriod('weekly')}
          >
            This Week
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={period === 'allTime'}
            className={`leaderboard__toggle-btn tap-target ${period === 'allTime' ? 'is-active' : ''}`}
            onClick={() => setPeriod('allTime')}
          >
            All Time
          </button>
        </div>
      </div>

      <ol className="leaderboard__list">
        {rows.map((entry, index) => {
          const rank = index + 1;
          const isYou = entry.id === currentUser.id;
          const rowLabel = `Rank ${rank}: ${entry.name}${isYou ? ' (you)' : ''}, level ${entry.level}, ${entry.xp} XP`;

          return (
            <li key={entry.id} className={`leaderboard__row card ${isYou ? 'is-you' : ''}`} aria-label={rowLabel}>
              <span className="leaderboard__rank" aria-hidden="true">
                {RANK_MEDAL[rank] ?? `#${rank}`}
              </span>
              <span className="leaderboard__avatar" aria-hidden="true">
                {entry.avatarEmoji}
              </span>
              <span className="leaderboard__name" aria-hidden="true">
                {entry.name}
                {isYou && <span className="leaderboard__you-tag">You</span>}
              </span>
              <span className="leaderboard__level" aria-hidden="true">
                Lv {entry.level}
              </span>
              <span className="leaderboard__xp" aria-hidden="true">
                {entry.xp.toLocaleString()} XP
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
