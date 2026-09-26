import React, { useState } from 'react';
import {
  CheckSquare,
  Calendar,
  Wallet,
  HeartPulse,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Droplets,
  Moon,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../lib/utils';

export const HomeView: React.FC = () => {
  const {
    setActiveTab,
    tasks,
    toggleTaskComplete,
    events,
    transactions,
    getHealthLog,
    updateHealthLog,
    searchQuery
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayHealth = getHealthLog(todayStr);

  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const { addTask } = useApp();

  // Filter tasks, events, transactions by search query if any
  const filteredTasks = tasks.filter(t =>
    !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  const todayEvents = events.filter(e => e.date === todayStr || searchQuery)
    .filter(e => !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // Financial calculations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleAddQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;
    addTask({
      title: quickTaskTitle.trim(),
      completed: false,
      priority: 'medium',
      category: 'Work',
      dueDate: todayStr,
      subtasks: [],
    });
    setQuickTaskTitle('');
  };

  const handleWaterIncrement = () => {
    updateHealthLog(todayStr, { waterGlasses: todayHealth.waterGlasses + 1 });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-tempus-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-tempus-500/10">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tempus Life Balance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Master your day across Work, Health & Wealth.
            </h2>
            <p className="text-indigo-100 text-sm leading-relaxed">
              You have <span className="font-bold underline text-white">{pendingTasks.length} pending tasks</span> and <span className="font-bold underline text-white">{todayEvents.length} events scheduled</span> today.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('tasks')}
              className="px-4 py-2.5 bg-white text-tempus-700 hover:bg-slate-100 font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center space-x-2"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Manage Tasks</span>
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-medium text-sm rounded-xl transition-all backdrop-blur-md flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>View Calendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Tasks Summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
              <CheckSquare className="w-5 h-5" />
            </span>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-medium text-slate-400 hover:text-tempus-600 dark:hover:text-tempus-400 flex items-center"
            >
              View all
            </button>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {pendingTasks.length} <span className="text-xs font-normal text-slate-500">pending</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {completedTasks.length} completed out of {filteredTasks.length} total tasks
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-500"
              style={{ width: `${filteredTasks.length ? (completedTasks.length / filteredTasks.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Schedule Summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl">
              <Calendar className="w-5 h-5" />
            </span>
            <button
              onClick={() => setActiveTab('schedule')}
              className="text-xs font-medium text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center"
            >
              View schedule
            </button>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {todayEvents.length} <span className="text-xs font-normal text-slate-500">events today</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Next: {todayEvents[0] ? `${todayEvents[0].startTime} - ${todayEvents[0].title}` : 'No remaining events'}
          </p>
        </div>

        {/* Finance Balance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Wallet className="w-5 h-5" />
            </span>
            <button
              onClick={() => setActiveTab('finance')}
              className="text-xs font-medium text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center"
            >
              Financials
            </button>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(balance)}
          </div>
          <div className="flex items-center space-x-3 text-xs mt-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {formatCurrency(totalIncome)}
            </span>
            <span className="text-rose-500 font-medium flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              {formatCurrency(totalExpense)}
            </span>
          </div>
        </div>

        {/* Health Tracker */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-xl">
              <HeartPulse className="w-5 h-5" />
            </span>
            <button
              onClick={() => setActiveTab('health')}
              className="text-xs font-medium text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center"
            >
              Health Log
            </button>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{todayHealth.steps.toLocaleString()}</span>
            <span className="text-xs font-normal text-slate-500">/ 10,000 steps</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
            <span className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-sky-500" />
              {todayHealth.waterGlasses}/8 glasses
            </span>
            <span className="flex items-center gap-1">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              {todayHealth.sleepHours} hrs sleep
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Tasks & Schedule vs Health & Finance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2 cols wide): Quick Task List & Agenda */}
        <div className="lg:col-span-2 space-y-6">

          {/* Quick Add & Today's Priority Tasks */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-tempus-600 dark:text-tempus-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Today's Focus Tasks</h3>
              </div>
              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs font-semibold text-tempus-600 dark:text-tempus-400 hover:underline"
              >
                Go to Task Manager →
              </button>
            </div>

            {/* Quick Task Input */}
            <form onSubmit={handleAddQuickTask} className="flex gap-2 mb-5">
              <input
                type="text"
                placeholder="Type a new task and press Enter..."
                value={quickTaskTitle}
                onChange={(e) => setQuickTaskTitle(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-tempus-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-tempus-600 hover:bg-tempus-700 text-white rounded-xl font-medium text-sm transition-colors flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </form>

            {/* Task Items */}
            <div className="space-y-2.5">
              {filteredTasks.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-6">No tasks found. Add your first task above!</p>
              ) : (
                filteredTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      task.completed
                        ? 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/80 opacity-70'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-tempus-300 dark:hover:border-tempus-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3 flex-1 min-w-0 pr-3">
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-tempus-600 dark:hover:text-tempus-400 transition-colors"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                      <div className="truncate">
                        <p className={`text-sm font-medium ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                        task.priority === 'urgent' ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300' :
                        task.priority === 'high' ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300' :
                        task.priority === 'medium' ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-slate-400 hidden sm:inline">
                        {task.dueTime || formatDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Today's Schedule Agenda */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Today's Timeline</h3>
              </div>
              <button
                onClick={() => setActiveTab('schedule')}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                View Full Agenda →
              </button>
            </div>

            <div className="space-y-3">
              {todayEvents.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-6">No events scheduled for today.</p>
              ) : (
                todayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                  >
                    <div
                      className="w-1.5 h-12 rounded-full shrink-0"
                      style={{ backgroundColor: evt.color || '#3b6cf2' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {evt.title}
                        </h4>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {evt.startTime} - {evt.endTime}
                        </span>
                      </div>
                      {evt.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          {evt.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Health & Finance Widgets */}
        <div className="space-y-6">

          {/* Health Daily Widgets */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <HeartPulse className="w-5 h-5 text-rose-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Health Daily Tracker</h3>
              </div>
              <button
                onClick={() => setActiveTab('health')}
                className="text-xs font-semibold text-rose-500 hover:underline"
              >
                Log Health →
              </button>
            </div>

            {/* Hydration Counter */}
            <div className="p-4 bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 rounded-xl mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-sky-500" />
                  Hydration Target (8 Glasses)
                </span>
                <span className="text-xs font-bold text-sky-700 dark:text-sky-400">
                  {todayHealth.waterGlasses} / 8
                </span>
              </div>
              <div className="flex items-center gap-1.5 my-2">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-4 flex-1 rounded-sm transition-all ${
                      idx < todayHealth.waterGlasses
                        ? 'bg-sky-500'
                        : 'bg-sky-200 dark:bg-sky-900'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleWaterIncrement}
                className="w-full mt-2 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-medium transition-colors"
              >
                + Add 1 Glass
              </button>
            </div>

            {/* Steps & Sleep Overview */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 rounded-xl">
                <div className="flex items-center space-x-1.5 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-1">
                  <span>Steps Taken</span>
                </div>
                <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {todayHealth.steps.toLocaleString()}
                </div>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">Target: 10,000</p>
              </div>

              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-xl">
                <div className="flex items-center space-x-1.5 text-indigo-700 dark:text-indigo-400 text-xs font-semibold mb-1">
                  <Moon className="w-4 h-4" />
                  <span>Night Sleep</span>
                </div>
                <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {todayHealth.sleepHours} hrs
                </div>
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5">Optimal rest</p>
              </div>
            </div>
          </div>

          {/* Recent Financial Transactions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
              </div>
              <button
                onClick={() => setActiveTab('finance')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Finance Hub →
              </button>
            </div>

            <div className="space-y-3">
              {transactions.slice(0, 4).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      tx.type === 'income'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                    }`}>
                      {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {tx.description}
                      </h5>
                      <span className="text-[11px] text-slate-400">{tx.category}</span>
                    </div>
                  </div>

                  <span className={`text-sm font-bold ${
                    tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
