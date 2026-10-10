import React, { useMemo } from 'react';
import {
  Plus,
  CheckSquare,
  Calendar,
  Wallet,
  Heart,
  Clock,
  ChevronRight,
  MapPin,
  Navigation,
  AlertCircle,
  Download,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useHubWork } from '../../context/HubWorkContext';

export const HomeView: React.FC = () => {
  const {
    userProfile,
    tasks,
    events,
    totalBalance,
    monthlyExpenses,
    bills,
    sleep,
    hydration,
    dailyPlan,
    smartAlerts,
    taskCompletionPercent,
    healthScore,
    scheduleConflictsCount,
    openQuickActionWithTab,
    toggleTaskComplete,
    togglePlanBlockComplete,
    addWaterGlass,
    autoResolveScheduleConflicts,
    exportDailyReport,
    setActiveTab
  } = useHubWork();

  // Memoize derived calculations to prevent redundant array allocations and filtering operations on re-renders
  const dueTodayTasks = useMemo(() => tasks.filter(t => t.dueDate === '2026-09-26'), [tasks]);
  const nextEvent = useMemo(() => events.find(e => e.date === '2026-09-26') || events[0], [events]);
  const upcomingBills = useMemo(() => bills.filter(b => !b.isPaid), [bills]);

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto pb-24">
      {/* 1. TODAY & DAY PROGRESS HERO CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-sky-950 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold uppercase tracking-wider">
                Command Center
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Day Progress: {userProfile.dayProgressPercent}%
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight">
              Today's Operating Plan
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Synchronized view connecting tasks, events, financial metrics, and health routines into one execution timeline.
            </p>
          </div>

          {/* Quick Actions & Report Download */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={exportDailyReport}
              className="flex items-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm"
              title="Download text summary of today's plan"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>
            <button
              onClick={() => openQuickActionWithTab('task')}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-700/80 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-sky-400" />
              <span>+ Task</span>
            </button>
            <button
              onClick={() => openQuickActionWithTab('event')}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-700/80 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>+ Event</span>
            </button>
            <button
              onClick={() => openQuickActionWithTab('expense')}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-700/80 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Expense</span>
            </button>
          </div>
        </div>

        {/* Day Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>Morning (06:00)</span>
            <span>Current: {userProfile.currentTime}</span>
            <span>Evening (22:00)</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-500 shadow-lg shadow-sky-500/50"
              style={{ width: `${userProfile.dayProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. SCHEDULE CONFLICT AUTO-RESOLVE BANNER */}
      {scheduleConflictsCount > 0 && (
        <div className="bg-rose-950/40 border border-rose-800/60 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Schedule Overlap Detected in Daily Plan</h3>
              <p className="text-xs text-slate-400">Two events are overlapping at 09:15 AM. Auto-resolve to shift one block to open slot.</p>
            </div>
          </div>

          <button
            onClick={autoResolveScheduleConflicts}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-500/20 transition-all self-start sm:self-auto"
          >
            Auto-Resolve Conflict
          </button>
        </div>
      )}

      {/* 3. OPERATIONAL OVERVIEWS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TASK OVERVIEW CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-200 text-base">Task Overview</h3>
              </div>
              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {dueTodayTasks.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No tasks due today.</p>
              ) : (
                dueTodayTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs transition-all hover:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.status === 'Completed'}
                        onChange={() => toggleTaskComplete(task.id)}
                        className="w-4 h-4 rounded border-slate-700 text-sky-500 focus:ring-0 bg-slate-900 cursor-pointer"
                      />
                      <div>
                        <p className={`font-semibold ${task.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task.title}
                        </p>
                        <span className="text-[10px] text-slate-400">{task.category} • Due {task.dueDate}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      task.priority === 'Critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Completion Status</span>
            <span className="font-bold text-sky-400">{taskCompletionPercent}% done</span>
          </div>
        </div>

        {/* EVENT & PUNCTUALITY OVERVIEW CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-200 text-base">Next Event & Route</h3>
              </div>
              <button
                onClick={() => setActiveTab('events')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>Calendar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {nextEvent ? (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {nextEvent.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{nextEvent.startTime} - {nextEvent.endTime}</span>
                </div>

                <h4 className="font-bold text-slate-100 text-sm">{nextEvent.title}</h4>

                {nextEvent.location ? (
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{nextEvent.location}</span>
                    </div>

                    {nextEvent.recommendedLeaveTime && (
                      <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-800/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Navigation className="w-3.5 h-3.5 text-sky-400" />
                          <span className="text-indigo-200 font-medium text-[11px]">Leave by {nextEvent.recommendedLeaveTime} ({nextEvent.selectedTransportMode || 'Driving'})</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {nextEvent.arrivalStatus}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Online Event • Meeting link attached</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No upcoming events scheduled.</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Punctuality Engine</span>
            <span className="text-emerald-400 font-bold">Active Sync</span>
          </div>
        </div>

        {/* FINANCE & HEALTH SNAPSHOT CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-200 text-base">Finance Snapshot</h3>
              </div>
              <button
                onClick={() => setActiveTab('finance')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
              >
                <span>Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Cash</span>
                <p className="text-base font-extrabold text-slate-100 mt-0.5">${totalBalance.toLocaleString()}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Monthly Spend</span>
                <p className="text-base font-extrabold text-rose-400 mt-0.5">${monthlyExpenses.toLocaleString()}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span className="font-bold text-slate-200 text-xs">Health Score</span>
                </div>
                <span className="text-xs font-extrabold text-sky-400">{healthScore} / 100</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Hydration</span>
                  <button onClick={addWaterGlass} className="font-bold text-sky-400 hover:text-sky-300">
                    💧 {hydration.consumedLiters}L / {hydration.targetLiters}L
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Sleep</span>
                  <span className="font-bold text-indigo-400">{sleep.durationHours}h {sleep.durationMinutes}m</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Upcoming Payments</span>
            <span className="font-bold text-amber-400">{upcomingBills.length} Due</span>
          </div>
        </div>
      </div>

      {/* 4. DAILY OPERATIONAL PLAN TIMELINE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-400" />
              <span>Full Daily Operational Schedule</span>
            </h3>
            <p className="text-xs text-slate-400">Automated block plan integrating tasks, events, nutrition, exercise, and prayers.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              Saturday Schedule
            </span>
          </div>
        </div>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {dailyPlan.map((block) => (
            <div key={block.id} className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/60 border hover:border-slate-700 transition-all ${
              block.hasConflict ? 'border-rose-500/60 bg-rose-950/20' : 'border-slate-800/80'
            }`}>
              <div className={`absolute -left-[23px] top-5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                block.hasConflict ? 'bg-rose-500' : block.completed ? 'bg-emerald-500' : 'bg-sky-500'
              }`} />

              <div className="flex items-start sm:items-center gap-3">
                <input
                  type="checkbox"
                  checked={block.completed}
                  onChange={() => togglePlanBlockComplete(block.id)}
                  className="w-4 h-4 rounded border-slate-700 text-sky-500 focus:ring-0 bg-slate-900 mt-1 sm:mt-0 cursor-pointer"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sky-400">{block.timeSlot}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      block.period === 'Morning' ? 'bg-amber-500/10 text-amber-400' :
                      block.period === 'Work' ? 'bg-sky-500/10 text-sky-400' :
                      block.period === 'Meals' ? 'bg-emerald-500/10 text-emerald-400' :
                      block.period === 'Prayer' ? 'bg-indigo-500/10 text-indigo-400' :
                      'bg-purple-500/10 text-purple-400'
                    }`}>
                      {block.period}
                    </span>
                    {block.hasConflict && (
                      <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-extrabold text-[9px] uppercase">
                        Conflict
                      </span>
                    )}
                  </div>
                  <h4 className={`text-sm font-semibold mt-1 ${block.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {block.title}
                  </h4>
                  {block.subtitle && <p className="text-[11px] text-slate-400">{block.subtitle}</p>}
                </div>
              </div>

              <span className={`self-start sm:self-center px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase ${
                block.type === 'Task' ? 'bg-sky-500/20 text-sky-400' :
                block.type === 'Event' ? 'bg-indigo-500/20 text-indigo-400' :
                block.type === 'Meal' ? 'bg-amber-500/20 text-amber-400' :
                block.type === 'Prayer' ? 'bg-teal-500/20 text-teal-400' :
                'bg-slate-800 text-slate-300'
              }`}>
                {block.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
