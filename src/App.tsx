import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { HomeView } from './components/home/HomeView';
import { TaskView } from './components/tasks/TaskView';
import { ScheduleView } from './components/schedule/ScheduleView';
import { FinanceView } from './components/finance/FinanceView';
import { HealthView } from './components/health/HealthView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
      {activeTab === 'home' && <HomeView />}
      {activeTab === 'tasks' && <TaskView />}
      {activeTab === 'schedule' && <ScheduleView />}
      {activeTab === 'finance' && <FinanceView />}
      {activeTab === 'health' && <HealthView />}
    </main>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 mb-16 md:mb-0">
          <Header />
          <MainContent />
        </div>
        <BottomNav />
      </div>
    </AppProvider>
  );
}

export default App;
