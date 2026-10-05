import React from 'react';
import { HubWorkProvider, useHubWork } from './context/HubWorkContext';
import { Navbar } from './components/Navigation/Navbar';
import { Header } from './components/Navigation/Header';
import { HomeView } from './components/Home/HomeView';
import { TasksView } from './components/Tasks/TasksView';
import { EventsView } from './components/Events/EventsView';
import { FinanceView } from './components/Finance/FinanceView';
import { HealthView } from './components/Health/HealthView';
import { AnalyticsView } from './components/Analytics/AnalyticsView';
import { SyncView } from './components/Sync/SyncView';
import { SettingsView } from './components/Settings/SettingsView';
import { QuickActionModal } from './components/Modals/QuickActionModal';
import { GlobalSearchModal } from './components/Modals/GlobalSearchModal';

const MainContent: React.FC = () => {
  const { activeTab } = useHubWork();

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden bg-slate-950">
      <Header />
      <main className="flex-1">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'tasks' && <TasksView />}
        {activeTab === 'events' && <EventsView />}
        {activeTab === 'finance' && <FinanceView />}
        {activeTab === 'health' && <HealthView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'sync' && <SyncView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
      <QuickActionModal />
      <GlobalSearchModal />
    </div>
  );
};

export function App() {
  return (
    <HubWorkProvider>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
        <Navbar />
        <MainContent />
      </div>
    </HubWorkProvider>
  );
}

export default App;
