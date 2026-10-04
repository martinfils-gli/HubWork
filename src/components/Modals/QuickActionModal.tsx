import React, { useState, useEffect } from 'react';
import {
  X,
  CheckSquare,
  Calendar,
  ArrowDownRight,
  ArrowUpRight,
  Utensils,
  Dumbbell,
  BookOpen,
  Heart,
  Plus
} from 'lucide-react';
import { useHubWork } from '../../context/HubWorkContext';
import { CategoryType, PriorityLevel } from '../../types/hubwork';

export const QuickActionModal: React.FC = () => {
  const {
    isQuickActionOpen,
    setIsQuickActionOpen,
    quickActionDefaultTab,
    addTask,
    addEvent,
    addTransaction,
    addMeal,
    addWorkout,
    updateJournal
  } = useHubWork();

  const [activeTab, setActiveTab] = useState<string>('task');

  // Form States
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<CategoryType>('Personal');
  const [taskPriority, setTaskPriority] = useState<PriorityLevel>('Medium');
  const [taskDueDate, setTaskDueDate] = useState('2026-09-26');

  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<CategoryType>('Work');
  const [eventDate, setEventDate] = useState('2026-09-26');
  const [eventTime, setEventTime] = useState('10:00');
  const [eventLocation, setEventLocation] = useState('');

  const [financeTitle, setFinanceTitle] = useState('');
  const [financeAmount, setFinanceAmount] = useState('');
  const [financeType, setFinanceType] = useState<'Income' | 'Expense'>('Expense');
  const [financeCategory, setFinanceCategory] = useState('Food');

  const [mealTitle, setMealTitle] = useState('');
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Lunch');
  const [mealCalories, setMealCalories] = useState('450');

  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState('30');

  const [journalText, setJournalText] = useState('');

  useEffect(() => {
    if (quickActionDefaultTab) {
      setActiveTab(quickActionDefaultTab);
    }
  }, [quickActionDefaultTab]);

  if (!isQuickActionOpen) return null;

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;
    addTask({
      title: taskTitle,
      category: taskCategory,
      priority: taskPriority,
      dueDate: taskDueDate,
      status: 'Planned'
    });
    setTaskTitle('');
    setIsQuickActionOpen(false);
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle) return;
    addEvent({
      title: eventTitle,
      category: eventCategory,
      date: eventDate,
      startTime: eventTime,
      location: eventLocation,
      isOnline: !eventLocation
    });
    setEventTitle('');
    setIsQuickActionOpen(false);
  };

  const handleFinanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!financeTitle || !financeAmount) return;
    addTransaction({
      title: financeTitle,
      amount: parseFloat(financeAmount),
      type: financeType,
      category: financeCategory,
      date: '2026-09-26'
    });
    setFinanceTitle('');
    setFinanceAmount('');
    setIsQuickActionOpen(false);
  };

  const handleMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealTitle) return;
    addMeal({
      title: mealTitle,
      type: mealType,
      calories: parseInt(mealCalories) || 350
    });
    setMealTitle('');
    setIsQuickActionOpen(false);
  };

  const handleWorkoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutTitle) return;
    addWorkout({
      title: workoutTitle,
      durationMinutes: parseInt(workoutDuration) || 30
    });
    setWorkoutTitle('');
    setIsQuickActionOpen(false);
  };

  const handleJournalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalText) return;
    updateJournal(journalText);
    setJournalText('');
    setIsQuickActionOpen(false);
  };

  const quickActionTabs = [
    { id: 'task', label: 'Add Task', icon: CheckSquare, color: 'text-sky-400' },
    { id: 'event', label: 'Add Event', icon: Calendar, color: 'text-indigo-400' },
    { id: 'expense', label: 'Add Expense', icon: ArrowDownRight, color: 'text-rose-400' },
    { id: 'income', label: 'Add Income', icon: ArrowUpRight, color: 'text-emerald-400' },
    { id: 'meal', label: 'Add Meal', icon: Utensils, color: 'text-amber-400' },
    { id: 'workout', label: 'Add Workout', icon: Dumbbell, color: 'text-purple-400' },
    { id: 'journal', label: 'Add Journal', icon: BookOpen, color: 'text-teal-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Quick Action Hub</h3>
              <p className="text-xs text-slate-400">Log entry directly into HubWork OS</p>
            </div>
          </div>
          <button
            onClick={() => setIsQuickActionOpen(false)}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Type Selector Tabs */}
        <div className="flex items-center gap-1.5 p-3 overflow-x-auto border-b border-slate-800/80 bg-slate-950/40">
          {quickActionTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'expense') setFinanceType('Expense');
                  if (tab.id === 'income') setFinanceType('Income');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-800 text-slate-100 border border-slate-700/80 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Form Content */}
        <div className="p-6 overflow-y-auto">
          {activeTab === 'task' && (
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Submit university transcript"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={taskCategory}
                    onChange={e => setTaskCategory(e.target.value as CategoryType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Personal">👤 Personal</option>
                    <option value="Education">🎓 Education</option>
                    <option value="Work">💼 Work</option>
                    <option value="Freelance">💻 Freelance</option>
                    <option value="Medical">❤️ Medical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as PriorityLevel)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={e => setTaskDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-400 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-sky-500/20"
              >
                Create Task
              </button>
            </form>
          )}

          {activeTab === 'event' && (
            <form onSubmit={handleEventSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Cardiology Consultation"
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={eventCategory}
                    onChange={e => setEventCategory(e.target.value as CategoryType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Work">💼 Work</option>
                    <option value="Education">🎓 Education</option>
                    <option value="Medical">❤️ Medical</option>
                    <option value="Personal">👤 Personal</option>
                    <option value="Spiritual">🙏 Spiritual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date & Time</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={eventDate}
                      onChange={e => setEventDate(e.target.value)}
                      className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="time"
                      value={eventTime}
                      onChange={e => setEventTime(e.target.value)}
                      className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Location (Leave blank for online)</label>
                <input
                  type="text"
                  placeholder="e.g., Central Clinic, Ave 45"
                  value={eventLocation}
                  onChange={e => setEventLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-500/20"
              >
                Schedule Event
              </button>
            </form>
          )}

          {(activeTab === 'expense' || activeTab === 'income') && (
            <form onSubmit={handleFinanceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description / Title</label>
                <input
                  type="text"
                  required
                  placeholder={financeType === 'Expense' ? 'e.g., Grocery Store' : 'e.g., Freelance Payment'}
                  value={financeTitle}
                  onChange={e => setFinanceTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={financeAmount}
                    onChange={e => setFinanceAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={financeCategory}
                    onChange={e => setFinanceCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Food">Food & Dining</option>
                    <option value="Transportation">Transportation & Fuel</option>
                    <option value="Education">Education & Fees</option>
                    <option value="Health">Health & Fitness</option>
                    <option value="Freelance">Freelance Income</option>
                    <option value="Salary">Salary</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full font-semibold py-2.5 rounded-xl text-sm transition-all shadow-lg ${
                  financeType === 'Expense'
                    ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20'
                }`}
              >
                Log {financeType}
              </button>
            </form>
          )}

          {activeTab === 'meal' && (
            <form onSubmit={handleMealSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Meal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Grilled Chicken Salad & Quinoa"
                  value={mealTitle}
                  onChange={e => setMealTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Meal Type</label>
                  <select
                    value={mealType}
                    onChange={e => setMealType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={mealCalories}
                    onChange={e => setMealCalories(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20"
              >
                Log Meal
              </button>
            </form>
          )}

          {activeTab === 'workout' && (
            <form onSubmit={handleWorkoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Workout Activity</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Evening 5K Run / Upper Body Workout"
                  value={workoutTitle}
                  onChange={e => setWorkoutTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  value={workoutDuration}
                  onChange={e => setWorkoutDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-400 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-purple-500/20"
              >
                Log Exercise Session
              </button>
            </form>
          )}

          {activeTab === 'journal' && (
            <form onSubmit={handleJournalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Daily Reflection / Gratitude Entry</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write thoughts, learnings, prayer reflections or daily milestones..."
                  value={journalText}
                  onChange={e => setJournalText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20"
              >
                Save Journal Entry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
