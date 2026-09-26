import React, { useState } from 'react';
import {
  HeartPulse,
  Droplets,
  Footprints,
  Moon,
  Smile,
  Plus,
  Dumbbell,
  Flame,
  Trash2,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HealthLog } from '../../types';
import { formatDate } from '../../lib/utils';

export const HealthView: React.FC = () => {
  const { getHealthLog, updateHealthLog, addWorkout, deleteWorkout } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const currentLog = getHealthLog(selectedDate);

  // Modal State for adding Workout
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [workoutType, setWorkoutType] = useState('Running');
  const [workoutDuration, setWorkoutDuration] = useState('30');
  const [workoutCalories, setWorkoutCalories] = useState('250');

  // Step counter inline editor
  const [isEditingSteps, setIsEditingSteps] = useState(false);
  const [stepInput, setStepInput] = useState(currentLog.steps.toString());

  const moods: { id: HealthLog['mood']; label: string; emoji: string; color: string }[] = [
    { id: 'great', label: 'Great', emoji: '🤩', color: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 border-emerald-300' },
    { id: 'good', label: 'Good', emoji: '😊', color: 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 border-blue-300' },
    { id: 'okay', label: 'Okay', emoji: '😐', color: 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300 border-amber-300' },
    { id: 'tired', label: 'Tired', emoji: '😴', color: 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 border-purple-300' },
    { id: 'stressed', label: 'Stressed', emoji: '🤯', color: 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 border-rose-300' },
  ];

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleWaterChange = (delta: number) => {
    const newWater = Math.max(0, currentLog.waterGlasses + delta);
    updateHealthLog(selectedDate, { waterGlasses: newWater });
  };

  const handleSaveSteps = () => {
    const val = parseInt(stepInput, 10);
    if (!isNaN(val) && val >= 0) {
      updateHealthLog(selectedDate, { steps: val });
    }
    setIsEditingSteps(false);
  };

  const handleSleepChange = (delta: number) => {
    const newSleep = Math.max(0, Math.min(24, Math.round((currentLog.sleepHours + delta) * 10) / 10));
    updateHealthLog(selectedDate, { sleepHours: newSleep });
  };

  const handleMoodSelect = (moodId: HealthLog['mood']) => {
    updateHealthLog(selectedDate, { mood: moodId });
  };

  const handleAddWorkoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const durationNum = parseInt(workoutDuration, 10);
    const caloriesNum = parseInt(workoutCalories, 10);

    if (!workoutType.trim() || isNaN(durationNum) || isNaN(caloriesNum)) return;

    addWorkout(selectedDate, {
      type: workoutType.trim(),
      durationMinutes: durationNum,
      caloriesBurned: caloriesNum,
    });

    setIsWorkoutModalOpen(false);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateHealthLog(selectedDate, { notes: e.target.value });
  };

  const totalCaloriesBurned = currentLog.workouts.reduce((acc, w) => acc + w.caloriesBurned, 0);
  const totalWorkoutMinutes = currentLog.workouts.reduce((acc, w) => acc + w.durationMinutes, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Date Navigation & Summary Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-xl">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Health Log: {formatDate(selectedDate)}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track hydration, activity, sleep hygiene, and daily mood.
            </p>
          </div>
        </div>

        {/* Date Selector Navigation */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={handlePrevDay}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 rounded-lg transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900 rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={handleNextDay}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 rounded-lg transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Hydration, Steps, Sleep & Mood */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Hydration Tracker */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-sky-50 dark:bg-sky-950 text-sky-500 rounded-xl">
                <Droplets className="w-5 h-5" />
              </span>
              <span className="font-bold text-sm text-slate-900 dark:text-white">Water Intake</span>
            </div>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
              {currentLog.waterGlasses} / 8 Glasses
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 py-1">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className={`h-6 rounded-lg transition-all flex items-center justify-center text-[10px] font-bold ${
                  idx < currentLog.waterGlasses
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {idx + 1}
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleWaterChange(-1)}
              className="flex-1 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors"
            >
              - 1 Glass
            </button>
            <button
              onClick={() => handleWaterChange(1)}
              className="flex-1 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
            >
              + 1 Glass
            </button>
          </div>
        </div>

        {/* Step Counter Tracker */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-amber-50 dark:bg-amber-950 text-amber-500 rounded-xl">
                <Footprints className="w-5 h-5" />
              </span>
              <span className="font-bold text-sm text-slate-900 dark:text-white">Step Goal</span>
            </div>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Target: 10,000</span>
          </div>

          {isEditingSteps ? (
            <div className="flex items-center space-x-2 my-2">
              <input
                type="number"
                value={stepInput}
                onChange={(e) => setStepInput(e.target.value)}
                className="w-full px-3 py-1 bg-slate-50 dark:bg-slate-800 border rounded-lg text-sm"
              />
              <button
                onClick={handleSaveSteps}
                className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg"
              >
                Save
              </button>
            </div>
          ) : (
            <div
              onClick={() => { setStepInput(currentLog.steps.toString()); setIsEditingSteps(true); }}
              className="cursor-pointer group"
            >
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                {currentLog.steps.toLocaleString()} <span className="text-xs font-normal text-slate-400">(click to edit)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (currentLog.steps / 10000) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Night Sleep Duration Tracker */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-400 rounded-xl">
                <Moon className="w-5 h-5" />
              </span>
              <span className="font-bold text-sm text-slate-900 dark:text-white">Sleep Hours</span>
            </div>
            <span className="text-xs font-medium text-indigo-400">Optimal: 8h</span>
          </div>

          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {currentLog.sleepHours} <span className="text-xs font-normal text-slate-400">hours</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSleepChange(-0.5)}
              className="flex-1 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold"
            >
              - 0.5h
            </button>
            <button
              onClick={() => handleSleepChange(0.5)}
              className="flex-1 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
            >
              + 0.5h
            </button>
          </div>
        </div>

        {/* Daily Mood Selection */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-purple-50 dark:bg-purple-950 text-purple-500 rounded-xl">
              <Smile className="w-5 h-5" />
            </span>
            <span className="font-bold text-sm text-slate-900 dark:text-white">Daily Mood</span>
          </div>

          <div className="flex items-center justify-between gap-1">
            {moods.map((m) => {
              const isSelected = currentLog.mood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleMoodSelect(m.id)}
                  className={`p-2 rounded-xl text-lg flex flex-col items-center transition-all ${
                    isSelected
                      ? `${m.color} border-2 scale-110 shadow-sm font-bold`
                      : 'bg-slate-50 dark:bg-slate-800/60 opacity-60 hover:opacity-100'
                  }`}
                  title={m.label}
                >
                  <span>{m.emoji}</span>
                  <span className="text-[10px] mt-0.5 capitalize">{m.id}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Workout Logs & Wellness Journal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Workout Sessions */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-rose-500" />
                Workouts & Exercise Sessions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logged {currentLog.workouts.length} workout{currentLog.workouts.length !== 1 ? 's' : ''} ({totalWorkoutMinutes} mins, {totalCaloriesBurned} kcal burned)
              </p>
            </div>

            <button
              onClick={() => setIsWorkoutModalOpen(true)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-xs transition-all shadow-md shadow-rose-600/20 flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Log Workout</span>
            </button>
          </div>

          <div className="space-y-3">
            {currentLog.workouts.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No workouts logged for this date. Click 'Log Workout' above.</p>
            ) : (
              currentLog.workouts.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-2.5 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-xl">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {w.type}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Duration: {w.durationMinutes} minutes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <Flame className="w-4 h-4" />
                      {w.caloriesBurned} kcal
                    </span>
                    <button
                      onClick={() => deleteWorkout(selectedDate, w.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      title="Delete workout"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Daily Wellness Diary Notes */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Wellness Diary Notes
          </h3>

          <textarea
            rows={6}
            placeholder="How are you feeling today? Write down thoughts, energy levels, meal reflections or gratitude..."
            value={currentLog.notes || ''}
            onChange={handleNotesChange}
            className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />

          <p className="text-[11px] text-slate-400">
            Notes are saved automatically as you type for {selectedDate}.
          </p>
        </div>

      </div>

      {/* Log Workout Modal */}
      {isWorkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Log Exercise Activity
              </h3>
              <button
                onClick={() => setIsWorkoutModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddWorkoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Activity Type
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Running, Yoga, HIIT, Cycling, Gym"
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={workoutDuration}
                    onChange={(e) => setWorkoutDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Calories Burned (kcal)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={workoutCalories}
                    onChange={(e) => setWorkoutCalories(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsWorkoutModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-rose-600/20"
                >
                  Save Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
