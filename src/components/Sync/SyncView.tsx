import React from 'react';
import { RefreshCw, CheckCircle2, ShieldCheck, Database, Calendar } from 'lucide-react';

export const SyncView: React.FC = () => {
  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto pb-24">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 text-indigo-400" />
          <h1 className="text-2xl font-bold text-slate-100">Synchronization Architecture</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Unified relational model binding tasks, events, financial entries, health records, and external calendar feeds.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="font-bold text-slate-200 text-sm">Active Calendar Providers</h3>
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-sky-400" />
              <div>
                <p className="font-semibold text-slate-200">Google Calendar Sync</p>
                <span className="text-[10px] text-slate-500">2-Way Sync Active</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Connected</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="font-semibold text-slate-200">Apple Calendar (iCal)</p>
                <span className="text-[10px] text-slate-500">2-Way Sync Active</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
