import React, { useState } from 'react';
import {
  Heart,
  Droplet,
  Moon,
  Utensils,
  Dumbbell,
  BookOpen,
  Plus,
  CheckCircle2,
  Activity,
  Award,
  Sparkles
} from 'lucide-react';
import { useHubWork } from '../../context/HubWorkContext';

export const HealthView: React.FC = () => {
  const {
    vitals,
    sleep,
    hydration,
    meals,
    workouts,
    medicalRecords,
    symptoms,
    spiritual,
    healthScore,
    addWaterGlass,
    toggleWorkoutComplete,
    togglePrayerComplete,
    toggleBibleReading,
    addSymptom,
    openQuickActionWithTab
  } = useHubWork();

  const [symptomInput, setSymptomInput] = useState('');

  const handleAddSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomInput) return;
    addSymptom({ symptom: symptomInput, severity: 'Mild' });
    setSymptomInput('');
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-400" />
            <h1 className="text-2xl font-bold text-slate-100">Health & Spiritual Operating Module</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Vitals, hydration, sleep quality, nutrition planner, workout builder, medical history, and spiritual routines.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => openQuickActionWithTab('meal')}
            className="flex items-center gap-1.5 bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold px-3.5 py-2.5 rounded-xl text-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Meal</span>
          </button>
          <button
            onClick={() => openQuickActionWithTab('workout')}
            className="flex items-center gap-1.5 bg-purple-500 hover:bg-purple-400 text-white font-semibold px-3.5 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Workout</span>
          </button>
        </div>
      </div>

      {/* 1. HEALTH SCORE & VITALS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2 text-center md:text-left">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Overall Health Score</span>
          <h2 className="text-3xl font-extrabold text-sky-400">{healthScore} / 100</h2>
          <p className="text-[11px] text-emerald-400 font-medium">Optimal energy balance</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-bold">Hydration Target</span>
            <button
              onClick={addWaterGlass}
              className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 text-[10px] font-bold"
            >
              +1 Glass
            </button>
          </div>
          <h2 className="text-2xl font-extrabold text-sky-400">{hydration.consumedLiters}L / {hydration.targetLiters}L</h2>
          <p className="text-[11px] text-slate-400">{hydration.glassCount} glasses consumed today</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-bold">Sleep Quality</span>
          <h2 className="text-2xl font-extrabold text-indigo-400">{sleep.durationHours}h {sleep.durationMinutes}m</h2>
          <p className="text-[11px] text-slate-400">{sleep.qualityPercent}% score • Bedtime {sleep.bedtime}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-bold">Vitals Check</span>
          <h2 className="text-2xl font-extrabold text-rose-400">{vitals.heartRateBpm} BPM</h2>
          <p className="text-[11px] text-slate-400">BP: {vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic} mmHg</p>
        </div>
      </div>

      {/* 2. NUTRITION & WORKOUT BUILDER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nutrition Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-slate-200 text-base flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-400" />
            <span>Today's Nutrition Log</span>
          </h3>

          <div className="space-y-3">
            {meals.map(m => (
              <div key={m.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 uppercase">
                    {m.type}
                  </span>
                  <h4 className="font-semibold text-slate-200 text-sm mt-1">{m.title}</h4>
                  <p className="text-[10px] text-slate-400">Logged at {m.timeLogged}</p>
                </div>
                <span className="font-extrabold text-amber-400 text-sm">{m.calories} kcal</span>
              </div>
            ))}
          </div>
        </div>

        {/* Workouts */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-slate-200 text-base flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-purple-400" />
            <span>Exercise & Recovery</span>
          </h3>

          <div className="space-y-3">
            {workouts.map(w => (
              <div key={w.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={w.completed}
                    onChange={() => toggleWorkoutComplete(w.id)}
                    className="w-4 h-4 rounded border-slate-700 text-purple-500 focus:ring-0 bg-slate-900 cursor-pointer"
                  />
                  <div>
                    <h4 className={`font-semibold text-sm ${w.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {w.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">{w.durationMinutes} mins • ~{w.caloriesBurned} kcal burned</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400">
                  {w.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. SPIRITUAL WELLBEING & PRAYER TRACKER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-slate-100 text-base">Spiritual & Mindful Practices</h3>
          </div>
          <span className="text-xs text-teal-400 font-bold">
            Prayers: {spiritual.prayersCompletedToday} / {spiritual.targetPrayers}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Prayers List */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Daily Prayers</h4>
            <div className="space-y-2">
              {spiritual.prayerList.map(p => (
                <div key={p.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-900/60">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={p.completed}
                      onChange={() => togglePrayerComplete(p.id)}
                      className="w-4 h-4 rounded border-slate-700 text-teal-500 focus:ring-0 bg-slate-900 cursor-pointer"
                    />
                    <span className={p.completed ? 'line-through text-slate-500' : 'text-slate-200'}>{p.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{p.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scripture & Journaling */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Bible Reading</h4>
              <button
                onClick={toggleBibleReading}
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                  spiritual.bibleReadingCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {spiritual.bibleReadingCompleted ? 'Completed' : 'Mark Done'}
              </button>
            </div>
            <p className="text-xs text-slate-300 font-medium">{spiritual.biblePassageToday}</p>
            {spiritual.journalEntry && (
              <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 italic">
                "{spiritual.journalEntry}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
