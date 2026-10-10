import React, { useState } from 'react';
import {
  Bell,
  Search,
  MapPin,
  CloudSun,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';
import { useHubWork } from '../../context/HubWorkContext';

/**
 * NotificationsPopover
 * Dedicated notification menu sub-component wrapped in React.memo.
 * Isolating showNotificationMenu state prevents toggling the notification dropdown
 * from re-rendering the outer Header component shell and static layout elements.
 */
interface NotificationsPopoverProps {
  smartAlerts: Array<{
    id: string;
    module: string;
    title: string;
    description: string;
    severity: string;
    createdAt: string;
  }>;
}

const NotificationsPopover: React.FC<NotificationsPopoverProps> = React.memo(({ smartAlerts }) => {
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotificationMenu(!showNotificationMenu)}
        className="p-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 relative border border-slate-700/50 transition-colors"
        title="Notifications & Smart Alerts"
      >
        <Bell className="w-4 h-4" />
        {smartAlerts.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {smartAlerts.length}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Popover */}
      {showNotificationMenu && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-400" />
              <h3 className="font-semibold text-sm text-slate-200">Smart HubWork Alerts</h3>
            </div>
            <button
              onClick={() => setShowNotificationMenu(false)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {smartAlerts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No active alerts. All systems operational.</p>
            ) : (
              smartAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      alert.severity === 'critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      alert.severity === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    }`}>
                      {alert.module}
                    </span>
                    <span className="text-[10px] text-slate-400">{alert.createdAt}</span>
                  </div>
                  <h4 className="font-semibold text-slate-200">{alert.title}</h4>
                  <p className="text-slate-400 leading-relaxed">{alert.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export const Header: React.FC = () => {
  const { userProfile, smartAlerts, setIsSearchOpen } = useHubWork();

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Left: User Profile & Current Date */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 p-0.5 shadow-md">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-sky-400">
              {userProfile.name[0]}
            </div>
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>Good morning, {userProfile.name}</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            {userProfile.currentDate}
          </p>
        </div>
      </div>

      {/* Middle: Weather & Location Info */}
      <div className="hidden md:flex items-center gap-6 bg-slate-950/60 border border-slate-800/80 px-4 py-1.5 rounded-full text-xs">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-semibold text-slate-200">{userProfile.currentTime}</span>
        </div>

        <div className="h-3 w-px bg-slate-800" />

        <div className="flex items-center gap-1.5 text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-rose-400" />
          <span>{userProfile.location}</span>
        </div>

        <div className="h-3 w-px bg-slate-800" />

        <div className="flex items-center gap-1.5 text-slate-300">
          <CloudSun className="w-3.5 h-3.5 text-amber-400" />
          <span>{userProfile.weatherTempC}°C, {userProfile.weatherCondition}</span>
        </div>
      </div>

      {/* Right: Search & Notifications */}
      <div className="flex items-center gap-2 relative">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 bg-slate-800/70 hover:bg-slate-800 text-slate-400 px-3 py-1.5 rounded-xl text-xs border border-slate-700/50 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search (Ctrl+K)</span>
        </button>

        <NotificationsPopover smartAlerts={smartAlerts} />
      </div>
    </header>
  );
};
