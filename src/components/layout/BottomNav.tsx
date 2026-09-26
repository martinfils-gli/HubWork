import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Wallet,
  HeartPulse
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, tasks } = useApp();

  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }>; count?: number }[] = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, count: tasks.filter(t => !t.completed).length },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'health', label: 'Health', icon: HeartPulse },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-2">
      <nav className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-tempus-600 dark:text-tempus-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-tempus-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
