import StreakFlame from './StreakFlame.jsx';
import { calculateHabitXP } from '../utils/gamification.js';
import './HabitCard.css';

const DIFFICULTY_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

/**
 * A single trackable habit: name, category/difficulty tags, streak, and a
 * complete button that previews the XP it will award (FR-1.1/FR-1.2).
 *
 * @param {{
 *   habit: { id: string, name: string, category: string, difficulty: string, icon: string, currentStreak: number, longestStreak: number, completedToday: boolean },
 *   onComplete: (habitId: string) => void,
 * }} props
 */
export default function HabitCard({ habit, onComplete }) {
  const previewXP = calculateHabitXP(habit.difficulty, habit.currentStreak + 1);

  return (
    <li className={`habit-card card ${habit.completedToday ? 'habit-card--done' : ''}`}>
      <div className="habit-card__icon" aria-hidden="true">
        {habit.icon}
      </div>

      <div className="habit-card__body">
        <h3 className="habit-card__name">{habit.name}</h3>
        <div className="habit-card__tags">
          <span className="habit-card__tag">{habit.category}</span>
          <span className={`habit-card__tag habit-card__tag--${habit.difficulty}`}>
            {DIFFICULTY_LABEL[habit.difficulty] ?? habit.difficulty}
          </span>
        </div>
        <div className="habit-card__meta">
          <StreakFlame streakDays={habit.currentStreak} />
          <span className="habit-card__longest">Best: {habit.longestStreak}d</span>
        </div>
      </div>

      <button
        type="button"
        className={`habit-card__complete tap-target ${habit.completedToday ? 'is-done' : ''}`}
        onClick={() => onComplete(habit.id)}
        disabled={habit.completedToday}
        aria-pressed={habit.completedToday}
      >
        {habit.completedToday ? (
          <>
            <span aria-hidden="true">✓</span> Done
          </>
        ) : (
          <>Complete · +{previewXP} XP</>
        )}
      </button>
    </li>
  );
}
