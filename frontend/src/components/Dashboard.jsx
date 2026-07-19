import HabitCard from './HabitCard.jsx';
import './Dashboard.css';

/**
 * Main "today" view: daily progress summary plus the habit list.
 *
 * @param {{
 *   habits: Array<object>,
 *   habitsCompletedToday: number,
 *   onComplete: (habitId: string) => void,
 *   onResetDay: () => void,
 * }} props
 */
export default function Dashboard({ habits, habitsCompletedToday, onComplete, onResetDay }) {
  const total = habits.length;
  const progressPercent = total > 0 ? (habitsCompletedToday / total) * 100 : 0;
  const isPerfectDay = total > 0 && habitsCompletedToday === total;

  return (
    <section className="dashboard" aria-labelledby="dashboard-heading">
      <div className="dashboard__summary card">
        <div className="dashboard__summary-header">
          <div>
            <h2 id="dashboard-heading">Today&rsquo;s Habits</h2>
            <p className="dashboard__summary-sub">
              {habitsCompletedToday} of {total} completed
            </p>
          </div>
          <button type="button" className="dashboard__reset tap-target" onClick={onResetDay}>
            Reset Today (Demo)
          </button>
        </div>

        <div
          className="dashboard__summary-track"
          role="progressbar"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Habits completed today"
        >
          <div className="dashboard__summary-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        {isPerfectDay && (
          <p className="dashboard__perfect-banner" role="status">
            🌟 Perfect Day! Every habit complete — bonus XP awarded.
          </p>
        )}
      </div>

      <ul className="dashboard__list">
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} onComplete={onComplete} />
        ))}
      </ul>
    </section>
  );
}
