import { useEffect, useMemo, useState } from 'react';
import AppHeader from './components/layout/AppHeader';
import BottomNav from './components/layout/BottomNav';
import SplashScreen from './components/splash/SplashScreen';
import AuthScreen from './components/auth/AuthScreen';
import OnboardingScreen from './components/onboarding/OnboardingScreen';
import ActivationScreen from './components/activation/ActivationScreen';
import DashboardView from './components/dashboard/DashboardView';
import SwipeBoard from './components/matchmaking/SwipeBoard';
import ProfileView from './components/profile/ProfileView';
import ChatView from './components/chat/ChatView';
import WorkplaceView from './components/workplace/WorkplaceView';
import AssistantView from './components/assistant/AssistantView';
import HelpCenterView from './components/manual/HelpCenterView';
import PricingView from './components/pricing/PricingView';
import {
  actionItems,
  chatConversations,
  currentCompany,
  dashboardData,
  demoInitialMatch,
  demoMeetings,
  recommendationColumns,
  recommendedCompanies,
  tasks
} from './data/mockCompanies';
import {
  buildCompanyFromProfile,
  createInitialProfile,
  personalizeRecommendedCompanies
} from './utils/companyProfile';

function App() {
  const [stage, setStage] = useState('splash');
  const [activeView, setActiveView] = useState('dashboard');
  const [matches, setMatches] = useState([demoInitialMatch]);
  const [userPlan, setUserPlan] = useState('starter');
  const [dailyMatchCount, setDailyMatchCount] = useState(0);
  const [workplaceArea, setWorkplaceArea] = useState('general');
  const [companyProfile, setCompanyProfile] = useState(() => createInitialProfile(currentCompany));
  const [meetings, setMeetings] = useState(demoMeetings);

  const handleToggleMeeting = (id) =>
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m))
    );

  const handleScheduleMeeting = (meeting) =>
    setMeetings((prev) => [...prev, { ...meeting, id: `meet-${Date.now()}`, done: false }]);
  const [taskState, setTaskState] = useState(
    tasks.map((task, index) => ({
      ...task,
      id: `${task.area}-${index + 1}`,
      companyName: currentCompany.name
    }))
  );

  const companyView = useMemo(
    () => buildCompanyFromProfile(currentCompany, companyProfile),
    [companyProfile]
  );
  const personalizedCompanies = useMemo(
    () => personalizeRecommendedCompanies(recommendedCompanies, companyProfile),
    [companyProfile]
  );
  const personalizedDashboardData = useMemo(
    () => ({
      ...dashboardData,
      commerce: {
        ...dashboardData.commerce,
        name: companyView.name,
        category: companyProfile.industries.join(' • '),
        location: `${companyProfile.location.city}, ${companyProfile.location.country}`
      }
    }),
    [companyProfile, companyView.name]
  );

  useEffect(() => {
    setTaskState((current) =>
      current.map((task) => ({
        ...task,
        companyName: companyView.name
      }))
    );
  }, [companyView.name]);

  const handleCreateMatch = (company) => {
    setMatches((current) =>
      current.some((item) => item.id === company.id) ? current : [company, ...current]
    );
    setDailyMatchCount((current) => current + 1);
  };

  const handleTaskMove = (taskId, nextStatus) => {
    setTaskState((current) =>
      current.map((task) => (task.id === taskId ? { ...task, status: nextStatus } : task))
    );
  };

  const view = useMemo(() => {
    switch (activeView) {
      case 'profile':
        return (
          <ProfileView
            company={{
              ...companyView,
              allianceProfile: companyProfile.allianceProfile,
              branches: companyProfile.branches,
              description: companyProfile.description,
              industries: companyProfile.industries,
              location: companyProfile.location
            }}
            onAreaSelect={(area) => {
              setWorkplaceArea(area);
              setActiveView('workplace');
            }}
            onSave={setCompanyProfile}
          />
        );
      case 'chats':
        return (
          <ChatView
            chatConversations={chatConversations}
            matches={matches}
            onScheduleMeeting={handleScheduleMeeting}
            recommendedCompanies={personalizedCompanies}
            userPlan={userPlan}
          />
        );
      case 'assistant':
        return (
          <AssistantView
            actionItems={actionItems}
            aiEnabled={userPlan === 'scale'}
            company={companyView}
            matches={matches}
            recommendedCompanies={personalizedCompanies}
            recommendations={recommendationColumns}
          />
        );
      case 'help':
        return <HelpCenterView onNavigateToChat={() => setActiveView('chats')} />;
      case 'pricing':
        return (
          <PricingView currentPlan={userPlan} onCheckoutSuccess={(plan) => setUserPlan(plan)} />
        );
      case 'workplace':
        return (
          <WorkplaceView
            currentArea={workplaceArea}
            onTaskMove={handleTaskMove}
            tasks={taskState}
          />
        );
      case 'alliances':
        return (
          <SwipeBoard
            companies={personalizedCompanies}
            dailyMatchCount={dailyMatchCount}
            matches={matches}
            onMatch={handleCreateMatch}
            onNavigateToChats={() => setActiveView('chats')}
            onOpenPricing={() => setActiveView('pricing')}
            userPlan={userPlan}
          />
        );
      case 'dashboard':
      default:
        return (
          <DashboardView
            dashboardData={personalizedDashboardData}
            meetings={meetings}
            onAreaSelect={(area) => {
              setWorkplaceArea(area);
              setActiveView('workplace');
            }}
            onNavigateToChats={() => setActiveView('chats')}
            onOpenAlliances={() => setActiveView('alliances')}
            onOpenAssistant={() => setActiveView('assistant')}
            onToggleMeeting={handleToggleMeeting}
            userPlan={userPlan}
          />
        );
    }
  }, [
    activeView,
    companyProfile,
    companyView,
    dailyMatchCount,
    matches,
    personalizedCompanies,
    personalizedDashboardData,
    taskState,
    userPlan,
    workplaceArea
  ]);

  if (stage === 'splash') {
    return <SplashScreen onComplete={() => setStage('auth')} />;
  }

  if (stage === 'auth') {
    return (
      <AuthScreen
        onContinue={(isNewUser) => setStage(isNewUser ? 'onboarding' : 'activation')}
      />
    );
  }

  if (stage === 'activation') {
    return (
      <ActivationScreen
        onFinish={() => {
          setActiveView('alliances');
          setStage('app');
        }}
        onProfileChange={setCompanyProfile}
        profile={companyProfile}
      />
    );
  }

  if (stage === 'onboarding') {
    return (
      <OnboardingScreen
        onFinish={() => setStage('app')}
        profile={companyProfile}
        onProfileChange={setCompanyProfile}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen pb-24">
        <AppHeader activeView={activeView} onNavigate={setActiveView} userPlan={userPlan} />
        <main className="mx-auto min-w-0 max-w-6xl px-4 py-5 sm:px-6 sm:py-7">
          {view}
        </main>
        <BottomNav activeView={activeView} onNavigate={setActiveView} />
      </div>
    </div>
  );
}

export default App;
