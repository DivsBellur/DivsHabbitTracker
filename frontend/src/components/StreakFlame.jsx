import './StreakFlame.css';

/**
 * Flame icon whose visual "intensity" scales with streak length, plus the
 * numeric streak count (spec §5.2: "Flame icon with intensity scaling").
 *
 * @param {{ streakDays: number }} props
 */
export default function StreakFlame({ streakDays }) {
  const intensity = streakDays >= 30 ? 'blazing' : streakDays >= 7 ? 'strong' : streakDays > 0 ? 'small' : 'none';

  const label =
    streakDays > 0 ? `${streakDays} day${streakDays === 1 ? '' : 's'} streak` : 'No active streak';

  return (
    <span className={`streak-flame streak-flame--${intensity}`} role="img" aria-label={label} title={label}>
      <span className="streak-flame__icon" aria-hidden="true">
        🔥
      </span>
      <span className="streak-flame__count">{streakDays}</span>
    </span>
  );
}
