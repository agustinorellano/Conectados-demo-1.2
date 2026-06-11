import { useMemo, useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import SplashScreen from './components/splash/SplashScreen';
import AuthScreen from './components/auth/AuthScreen';
import OnboardingScreen from './components/onboarding/OnboardingScreen';
import DashboardView from './components/dashboard/DashboardView';
import SwipeBoard from './components/matchmaking/SwipeBoard';
import ProfileView from './components/profile/ProfileView';
import ChatView from './components/chat/ChatView';
import WorkplaceView from './components/workplace/WorkplaceView';

import RecommendationsView from './components/recommendations/RecommendationsView';
import ActionsView from './components/actions/ActionsView';
import AssistantView from './components/assistant/AssistantView';
import ManualView from './components/manual/ManualView';
import {
  actionItems,
  chatPreviews,
  currentCompany,
  recommendationColumns,
  recommendedCompanies
} from './data/mockCompanies';

function App() {
  const [stage, setStage] = useState('splash');
  const [activeView, setActiveView] = useState('alliances');
  const [matches, setMatches] = useState([]);

  const handleCreateMatch = (company) => {
    setMatches((current) =>
      current.some((item) => item.id === company.id) ? current : [company, ...current]
    );
  };

  const view = useMemo(() => {
    switch (activeView) {
      case 'profile':
        return <ProfileView company={currentCompany} />;
      case 'chats':
        return <ChatView chatPreviews={chatPreviews} matches={matches} />;
      case 'assistant':
        return <AssistantView />;
      case 'dashboard':
        return <DashboardView company={currentCompany} />;
      case 'workplace':
        return <WorkplaceView />;
      case 'recommendations':
        return <RecommendationsView columns={recommendationColumns} />;
      case 'actions':
        return <ActionsView actionItems={actionItems} />;
      case 'manual':
        return <ManualView />;
      case 'alliances':
      default:
        return (
          <SwipeBoard
            companies={recommendedCompanies}
            matches={matches}
            onMatch={handleCreateMatch}
            onNavigateToChats={() => setActiveView('chats')}
          />
        );
    }
  }, [activeView, matches]);

  if (stage === 'splash') {
    return <SplashScreen onComplete={() => setStage('auth')} />;
  }

  if (stage === 'auth') {
    return <AuthScreen onContinue={() => setStage('onboarding')} />;
  }

  if (stage === 'onboarding') {
    return <OnboardingScreen onFinish={() => setStage('app')} />;
  }

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="main-shell">
        <header className="topbar glass-card">
          <div>
            <p className="eyebrow">Alliance Operating System</p>
            <h1>Conectados</h1>
          </div>
          <div className="topbar-status">
            <div className="pulse-dot" />
            <span>Pipeline activo</span>
          </div>
        </header>
        <section className="content-shell">{view}</section>
      </main>
    </div>
  );
}

export default App;