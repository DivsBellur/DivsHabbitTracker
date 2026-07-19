import { badgeDefinitions } from '../data/mockData.js';
import BadgeCard from './BadgeCard.jsx';
import './AchievementsPanel.css';

const CATEGORIES = [...new Set(badgeDefinitions.map((b) => b.category))];

/**
 * Badge gallery grouped by category, with locked/unlocked states
 * (FR-2.3) and a summary count.
 *
 * @param {{ unlockedBadgeIds: Set<string> }} props
 */
export default function AchievementsPanel({ unlockedBadgeIds }) {
  const unlockedCount = badgeDefinitions.filter((b) => unlockedBadgeIds.has(b.id)).length;

  return (
    <section className="achievements" aria-labelledby="achievements-heading">
      <div className="achievements__summary card">
        <h2 id="achievements-heading">Achievements</h2>
        <p className="achievements__summary-sub">
          {unlockedCount} of {badgeDefinitions.length} badges unlocked
        </p>
      </div>

      {CATEGORIES.map((category) => (
        <div key={category} className="achievements__group">
          <h3 className="achievements__group-title">{category}</h3>
          <ul className="achievements__grid">
            {badgeDefinitions
              .filter((b) => b.category === category)
              .map((badge) => (
                <BadgeCard key={badge.id} badge={badge} unlocked={unlockedBadgeIds.has(badge.id)} />
              ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
