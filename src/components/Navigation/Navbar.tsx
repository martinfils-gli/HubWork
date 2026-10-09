import React from 'react';
import {
  Home,
  CheckSquare,
  Calendar,
  Wallet,
  Heart,
  BarChart3,
  RefreshCw,
  Settings,
  Plus,
  Search,
  Bell
} from 'lucide-react';
import { useHubWork } from '../../context/HubWorkContext';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, openQuickActionWithTab, setIsSearchOpen, smartAlerts } = useHubWork();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'health', label: 'Health', icon: Heart },
  ];

  const secondaryNavItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'sync', label: 'Sync Engine', icon: RefreshCw },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shrink-0 select-none">
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/20">
              H
            </div>
            <div>
              <h1 className="font-bold text-slate-100 tracking-tight text-lg leading-tight">HubWork</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Personal OS</p>
            </div>
          </div>

          <button
            onClick={() => setIsSearchOpen(true)}
            title="Global Search (Ctrl+K)"
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-4">
          <button
            onClick={() => openQuickActionWithTab()}
            className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-sky-500/25 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Quick Entry</span>
          </button>
        </div>

        {/* Primary Operational Modules */}
        <div className="px-3 py-2 space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Core Modules</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto px-3 py-4 border-t border-slate-800/80 space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">System</p>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Mobile Navigation Header & Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                isActive ? 'text-sky-400 font-semibold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
