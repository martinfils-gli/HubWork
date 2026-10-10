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
  Sparkles,
  Flame
} from 'lucide-react';
import { useHubWork } from '../../context/HubWorkContext';

// Dedicated memoized gratitude form component to isolate input keystroke state locally
// and prevent full HealthView re-renders (including workout sets and macro cards) on every keystroke.
const GratitudeInputForm: React.FC<{ onAddGratitude: (note: string) => void }> = React.memo(({ onAddGratitude }) => {
  const [gratitudeInput, setGratitudeInput] = useState('');

  const handleAddGratitude = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitudeInput.trim()) return;
    onAddGratitude(gratitudeInput.trim());
    setGratitudeInput('');
  };

  return (
    <form onSubmit={handleAddGratitude} className="flex gap-2 pt-2">
      <input
        type="text"
        placeholder="+ Add gratitude note..."
        value={gratitudeInput}
        onChange={e => setGratitudeInput(e.target.value)}
        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
      />
      <button type="submit" className="px-3 py-1.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs">
        Add
      </button>
    </form>
  );
});

export const HealthView: React.FC = () => {
  const {
    vitals,
    sleep,
    hydration,
    meals,
    workouts,
    spiritual,
    healthScore,
    totalCaloriesLogged,
    totalProteinLogged,
    totalCarbsLogged,
    totalFatsLogged,
    addWaterGlass,
    toggleWorkoutComplete,
    toggleWorkoutSetComplete,
    togglePrayerComplete,
    toggleBibleReading,
    addGratitudeNote,
    openQuickActionWithTab
  } = useHubWork();

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-400" />
            <h1 className="text-2xl font-bold text-slate-100">Health, Fitness & Spiritual Module</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Macro nutrition tracking, workout set/rep logger, vitals, hydration, and spiritual reflection routines.
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

      {/* 1. NUTRITION MACROS BREAKDOWN CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-200 text-base flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>Daily Nutrition & Macro Progress</span>
          </h3>
          <span className="text-xs text-amber-400 font-bold">{totalCaloriesLogged} / 2200 kcal Goal</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">Protein</span>
              <span className="text-sky-400 font-bold">{totalProteinLogged}g / 140g</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: `${Math.min(100, (totalProteinLogged / 140) * 100)}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">Carbohydrates</span>
              <span className="text-amber-400 font-bold">{totalCarbsLogged}g / 220g</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, (totalCarbsLogged / 220) * 100)}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">Healthy Fats</span>
              <span className="text-purple-400 font-bold">{totalFatsLogged}g / 65g</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${Math.min(100, (totalFatsLogged / 65) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. WORKOUT BUILDER & INTERACTIVE SET/REP TRACKER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workouts with Sets/Reps */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-slate-200 text-base flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-purple-400" />
            <span>Workouts & Set/Rep Tracker</span>
          </h3>

          <div className="space-y-4">
            {workouts.map(w => (
              <div key={w.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-bold text-sm ${w.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {w.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">{w.category} • {w.durationMinutes} mins • ~{w.caloriesBurned} kcal</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${w.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'}`}>
                    {w.completed ? 'Completed' : 'In Progress'}
                  </span>
                </div>

                {/* Individual Sets */}
                {w.sets && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Set Counter:</span>
                    <div className="grid grid-cols-3 gap-2">
                      {w.sets.map(s => (
                        <button
                          key={s.setNumber}
                          onClick={() => toggleWorkoutSetComplete(w.id, s.setNumber)}
                          className={`p-2 rounded-xl text-center text-xs font-semibold transition-all border ${
                            s.completed
                              ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          Set {s.setNumber}: {s.reps} reps {s.weightKg ? `@ ${s.weightKg}kg` : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Spiritual Wellbeing & Gratitude Journal */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-slate-200 text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <span>Spiritual & Gratitude Journal</span>
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Gratitude Notes</h4>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {spiritual.gratitudeNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>

              <GratitudeInputForm onAddGratitude={addGratitudeNote} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
