import XPBar from './XPBar.jsx';
import './Header.css';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'achievements', label: 'Achievements', icon: '🏅' },
  { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
];

/**
 * App header: brand, tab navigation, and a compact XP/level profile widget.
 *
 * @param {{
 *   activeTab: string,
 *   onTabChange: (tabId: string) => void,
 *   user: { name: string, avatarEmoji: string },
 *   levelInfo: object,
 *   totalXP: number,
 * }} props
 */
export default function Header({ activeTab, onTabChange, user, levelInfo, totalXP }) {
  return (
    <header className="app-header">
      <div className="container app-header__inner">
        <div className="app-header__brand">
          <span className="app-header__logo" aria-hidden="true">
            🎯
          </span>
          <span className="app-header__title">HabitQuest</span>
        </div>

        <nav className="app-header__nav" aria-label="Main navigation">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`app-header__tab tap-target ${activeTab === tab.id ? 'is-active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="app-header__profile">
          <XPBar levelInfo={levelInfo} compact />
          <div className="app-header__profile-text">
            <span className="app-header__profile-name">
              {user.avatarEmoji} {user.name}
            </span>
            <span className="app-header__profile-xp">{totalXP.toLocaleString()} XP</span>
          </div>
        </div>
      </div>
    </header>
  );
}
