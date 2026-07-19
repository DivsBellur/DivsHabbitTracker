import { useEffect, useRef } from 'react';
import './LevelUpModal.css';

const CONFETTI_PIECES = Array.from({ length: 24 }, (_, i) => i);

/**
 * Level-up celebration overlay (spec §5.2: "Confetti burst + glow effect;
 * 2-3 seconds; auto-dismiss" — here it's user-dismissed via button, click
 * outside, or Escape, which is friendlier for keyboard/screen-reader users
 * than a timed auto-dismiss).
 *
 * @param {{ levelUpInfo: { level: number } | null, onDismiss: () => void }} props
 */
export default function LevelUpModal({ levelUpInfo, onDismiss }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!levelUpInfo) return undefined;

    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') onDismiss();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [levelUpInfo, onDismiss]);

  if (!levelUpInfo) return null;

  return (
    <div className="level-up-overlay" onClick={onDismiss}>
      <div
        className="level-up-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="level-up-heading"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="level-up-modal__confetti" aria-hidden="true">
          {CONFETTI_PIECES.map((i) => (
            <span key={i} className="level-up-modal__confetti-piece" style={{ '--i': i }} />
          ))}
        </div>

        <p className="level-up-modal__eyebrow">Level Up!</p>
        <h2 id="level-up-heading" className="level-up-modal__level">
          Level {levelUpInfo.level}
        </h2>
        <p className="level-up-modal__body">You&rsquo;ve grown stronger. Keep the streak alive!</p>

        <button
          type="button"
          ref={closeButtonRef}
          className="level-up-modal__close tap-target"
          onClick={onDismiss}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
