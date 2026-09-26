import React from 'react';
import { Search, Sun, Moon, Bell, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { activeTab, darkMode, setDarkMode, searchQuery, setSearchQuery } = useApp();

  const getTitle = () => {
    switch (activeTab) {
      case 'home':
        return { title: 'Dashboard Overview', sub: 'Welcome back! Here is your life balance summary.' };
      case 'tasks':
        return { title: 'Task Manager', sub: 'Stay organized, prioritize, and get work done.' };
      case 'schedule':
        return { title: 'Calendar & Schedule', sub: 'Manage events, meetings, and daily time blocks.' };
      case 'finance':
        return { title: 'Financial Tracker', sub: 'Monitor budget goals, income, and daily expenses.' };
      case 'health':
        return { title: 'Health & Wellness', sub: 'Track water, sleep, exercise, and daily mood.' };
      default:
        return { title: 'Tempus', sub: 'Personal Productivity Hub' };
    }
  };

  const headerInfo = getTitle();
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Title & Subtitle */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 md:hidden mb-1">
            <div className="p-1.5 bg-tempus-600 rounded-lg text-white">
              <Clock className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">Tempus</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {headerInfo.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {headerInfo.sub}
          </p>
        </div>
      </div>

      {/* Right Controls: Search, Date, Notifications, Dark Mode */}
      <div className="flex items-center flex-wrap sm:flex-nowrap gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks, events, expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm rounded-xl border border-transparent focus:border-tempus-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all"
          />
        </div>

        {/* Date Display */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300">
          <CalendarIcon className="w-4 h-4 text-tempus-600 dark:text-tempus-400" />
          <span>{todayFormatted}</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(prev => !prev)}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications badge */}
        <button
          className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-tempus-500 animate-ping" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-tempus-500" />
        </button>
      </div>
    </header>
  );
};
