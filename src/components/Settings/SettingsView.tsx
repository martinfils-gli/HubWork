import React from 'react';
import { Settings, User, Bell, Shield, Palette } from 'lucide-react';
import { useHubWork } from '../../context/HubWorkContext';

export const SettingsView: React.FC = () => {
  const { userProfile } = useHubWork();

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto pb-24">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-400" />
          <h1 className="text-2xl font-bold text-slate-100">HubWork System Settings</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Configure profile, notifications, privacy rules, and visual preferences.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-lg">
            {userProfile.name[0]}
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">{userProfile.name}</h3>
            <p className="text-xs text-slate-400">{userProfile.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
