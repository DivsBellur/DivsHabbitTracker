import { useState } from 'react';
import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import AchievementsPanel from './components/AchievementsPanel.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import LevelUpModal from './components/LevelUpModal.jsx';
import ToastContainer from './components/ToastContainer.jsx';
import { useGamification } from './hooks/useGamification.js';
import { currentUser } from './data/mockData.js';
import './App.css';

/**
 * Root component: owns the active-tab UI state and wires the
 * useGamification hook's data/actions into the three views (Dashboard,
 * Achievements, Leaderboard) plus the level-up modal and toast stack.
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const {
    habits,
    totalXP,
    levelInfo,
    unlockedBadgeIds,
    toasts,
    levelUpInfo,
    habitsCompletedToday,
    completeHabit,
    resetDay,
    dismissToast,
    dismissLevelUp,
  } = useGamification();

  return (
    <div className="app">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={currentUser}
        levelInfo={levelInfo}
        totalXP={totalXP}
      />

      <main className="app__main container">
        {activeTab === 'dashboard' && (
          <Dashboard
            habits={habits}
            habitsCompletedToday={habitsCompletedToday}
            onComplete={completeHabit}
            onResetDay={resetDay}
          />
        )}
        {activeTab === 'achievements' && <AchievementsPanel unlockedBadgeIds={unlockedBadgeIds} />}
        {activeTab === 'leaderboard' && <Leaderboard />}
      </main>

      <LevelUpModal levelUpInfo={levelUpInfo} onDismiss={dismissLevelUp} />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
