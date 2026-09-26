import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Wallet,
  HeartPulse,
  Clock,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, tasks, resetToDefaultData } = useApp();

  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }>; count?: number }[] = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, count: tasks.filter(t => !t.completed).length },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'health', label: 'Health', icon: HeartPulse },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 min-h-screen p-4 justify-between transition-colors">
      <div>
        {/* Brand Header */}
        <div className="flex items-center space-x-3 px-3 py-4 mb-6">
          <div className="p-2.5 bg-tempus-600 rounded-2xl text-white shadow-lg shadow-tempus-500/20 flex items-center justify-center">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-sans flex items-center gap-1.5">
              Tempus
              <span className="text-xs px-2 py-0.5 rounded-full bg-tempus-100 dark:bg-tempus-950 text-tempus-600 dark:text-tempus-400 font-medium">
                v1.0
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">All-In-One Life Manager</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-tempus-600 text-white shadow-md shadow-tempus-600/20 translate-x-1'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-tempus-100 dark:bg-tempus-950 text-tempus-600 dark:text-tempus-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Quick Actions */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <div className="p-3 bg-gradient-to-br from-tempus-50 to-indigo-50 dark:from-slate-900 dark:to-tempus-950/40 rounded-xl border border-tempus-100 dark:border-tempus-900/50">
          <div className="flex items-center space-x-2 text-tempus-700 dark:text-tempus-300 font-semibold text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily Pro Tip</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Organize tasks by priority & keep track of water intake for optimal focus!
          </p>
        </div>

        <button
          onClick={resetToDefaultData}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          title="Reset back to default sample data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>
    </aside>
  );
};
