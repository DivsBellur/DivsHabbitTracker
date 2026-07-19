import './BadgeCard.css';

/**
 * Single achievement badge. Locked badges show a grayscale/silhouette icon
 * (spec §5.2), but the name and description stay visible/readable at all
 * times — including to screen readers — per the §5.3 accessibility
 * requirement that "badge descriptions [are] available as alt text".
 *
 * @param {{ badge: { name: string, description: string, tier: string, icon: string }, unlocked: boolean }} props
 */
export default function BadgeCard({ badge, unlocked }) {
  return (
    <li className={`badge-card card badge-card--${badge.tier} ${unlocked ? 'is-unlocked' : 'is-locked'}`}>
      <div className="badge-card__icon-wrap">
        <span className="badge-card__icon" aria-hidden="true">
          {badge.icon}
        </span>
        {!unlocked && (
          <span className="badge-card__lock" aria-hidden="true">
            🔒
          </span>
        )}
      </div>
      <p className={`badge-card__tier badge-card__tier--${badge.tier}`}>{badge.tier}</p>
      <h4 className="badge-card__name">{badge.name}</h4>
      <p className="badge-card__description">
        {badge.description}
        <span className="visually-hidden">{unlocked ? ' — unlocked' : ' — locked'}</span>
      </p>
    </li>
  );
}
