import './XPBar.css';

/**
 * Level badge (progress ring around the level number, per spec §5.2:
 * "progress ring around avatar") plus a linear XP-to-next-level bar.
 *
 * @param {{
 *   levelInfo: { level: number, xpIntoLevel: number, xpForThisLevel: number, progressPercent: number },
 *   compact?: boolean,
 * }} props
 */
export default function XPBar({ levelInfo, compact = false }) {
  const { level, xpIntoLevel, xpForThisLevel, progressPercent } = levelInfo;

  return (
    <div className={`xp-bar ${compact ? 'xp-bar--compact' : ''}`}>
      <div className="xp-ring" style={{ '--progress': progressPercent }}>
        <span className="xp-ring__inner">
          <span className="xp-ring__level-number">{level}</span>
          {!compact && <span className="xp-ring__level-label">LVL</span>}
        </span>
      </div>

      {!compact && (
        <div className="xp-bar__details">
          <div
            className="xp-bar__track"
            role="progressbar"
            aria-valuenow={Math.round(progressPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progress toward level ${level + 1}`}
          >
            <div className="xp-bar__fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="xp-bar__caption">
            {xpIntoLevel} / {xpForThisLevel} XP to level {level + 1}
          </p>
        </div>
      )}
    </div>
  );
}
