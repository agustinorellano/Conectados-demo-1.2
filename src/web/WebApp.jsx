import { useMemo, useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';
import WebSidebar from './WebSidebar';
import DashboardView from '../components/dashboard/DashboardView';
import SwipeBoard from '../components/matchmaking/SwipeBoard';
import ProfileView from '../components/profile/ProfileView';
import ChatView from '../components/chat/ChatView';
import WorkplaceView from '../components/workplace/WorkplaceView';
import AssistantView from '../components/assistant/AssistantView';
import PricingView from '../components/pricing/PricingView';
import SettingsView from '../components/settings/SettingsView';
import AllianceRoomView from '../components/alliance-room/AllianceRoomView';
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
} from '../data/mockCompanies';
import {
  buildCompanyFromProfile,
  createInitialProfile,
  personalizeRecommendedCompanies
} from '../utils/companyProfile';

function WebApp() {
  const { t } = useTheme();

  useEffect(() => {
    document.body.classList.add('app-view');
    return () => document.body.classList.remove('app-view');
  }, []);

  const [activeView, setActiveView] = useState('dashboard');
  const [showAllianceRoom, setShowAllianceRoom] = useState(false);
  const [matches, setMatches] = useState([demoInitialMatch]);
  const [userPlan, setUserPlan] = useState('starter');
  const [dailyMatchCount, setDailyMatchCount] = useState(0);
  const [workplaceArea, setWorkplaceArea] = useState('general');
  const [companyProfile, setCompanyProfile] = useState(() => createInitialProfile(currentCompany));
  const [meetings, setMeetings] = useState(demoMeetings);
  const [pendingAiOpportunity, setPendingAiOpportunity] = useState(null);
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

  const handleToggleMeeting = (id) =>
    setMeetings((prev) => prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m)));

  const handleScheduleMeeting = (meeting) =>
    setMeetings((prev) => [...prev, { ...meeting, id: `meet-${Date.now()}`, done: false }]);

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

  const navigate = (view) => setActiveView(view);

  const view = useMemo(() => {
    switch (activeView) {
      case 'settings':
        return (
          <SettingsView
            currentPlan={userPlan}
            onCheckoutSuccess={(plan) => setUserPlan(plan)}
            onNavigateToChat={() => navigate('assistant')}
          />
        );
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
            onAreaSelect={(area) => { setWorkplaceArea(area); navigate('workplace'); }}
            onOpenSettings={() => navigate('settings')}
            onSave={setCompanyProfile}
          />
        );
      case 'chats':
        return (
          <ChatView
            chatConversations={chatConversations}
            matches={matches}
            onScheduleMeeting={handleScheduleMeeting}
            onOpenAllianceRoom={() => setShowAllianceRoom(true)}
            onOpenAssistant={() => navigate('assistant')}
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
            opportunities={taskState}
            onCreateOpportunity={(opp) => {
              setPendingAiOpportunity(opp);
              window.setTimeout(() => navigate('workplace'), 1200);
            }}
            onNavigateToWorkplace={() => navigate('workplace')}
          />
        );
      case 'pricing':
        return (
          <PricingView currentPlan={userPlan} onCheckoutSuccess={(plan) => setUserPlan(plan)} horizontal />
        );
      case 'workplace':
        return (
          <WorkplaceView
            currentArea={workplaceArea}
            onTaskMove={handleTaskMove}
            tasks={taskState}
            pendingOpportunity={pendingAiOpportunity}
            onOpportunityAdded={() => setPendingAiOpportunity(null)}
          />
        );
      case 'alliances':
        return (
          <SwipeBoard
            companies={personalizedCompanies}
            dailyMatchCount={dailyMatchCount}
            matches={matches}
            myCompany={companyView}
            onMatch={handleCreateMatch}
            onNavigateToChats={() => navigate('chats')}
            onOpenPricing={() => navigate('pricing')}
            userPlan={userPlan}
          />
        );
      case 'dashboard':
      default:
        return (
          <DashboardView
            dashboardData={personalizedDashboardData}
            meetings={meetings}
            onAreaSelect={(area) => { setWorkplaceArea(area); navigate('workplace'); }}
            onNavigateToChats={() => navigate('chats')}
            onOpenAlliances={() => navigate('alliances')}
            onOpenAllianceRoom={() => setShowAllianceRoom(true)}
            onOpenAssistant={() => navigate('assistant')}
            onToggleMeeting={handleToggleMeeting}
            userPlan={userPlan}
          />
        );
    }
  }, [
    activeView, companyProfile, companyView, dailyMatchCount,
    matches, pendingAiOpportunity, personalizedCompanies,
    personalizedDashboardData, taskState, userPlan, workplaceArea
  ]);

  const fullBleed = ['alliances', 'profile', 'chats', 'workplace'].includes(activeView);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: t.bg, transition: 'background 0.3s ease' }}>
      {showAllianceRoom && (
        <AllianceRoomView onExit={() => setShowAllianceRoom(false)} />
      )}

      <WebSidebar
        activeView={activeView}
        onNavigate={navigate}
        userPlan={userPlan}
        companyName={companyView.name}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <AnimatePresence mode="wait">
          {fullBleed ? (
            <motion.div
              key={activeView}
              className="flex-1 min-h-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="h-full overflow-hidden">{view}</div>
            </motion.div>
          ) : (
            <motion.main
              key={activeView}
              className="flex-1 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="mx-auto max-w-6xl px-6 py-6">{view}</div>
            </motion.main>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default WebApp;
