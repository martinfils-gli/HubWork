import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  MapPin,
  Navigation,
  Clock,
  CheckCircle2,
  RefreshCw,
  Car,
  Footprints,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useHubWork } from '../../context/HubWorkContext';
import { TransportMode } from '../../types/hubwork';

export const EventsView: React.FC = () => {
  const { events, addEvent, updateEventPunctuality, deleteEvent, openQuickActionWithTab } = useHubWork();
  const [selectedEventPunctuality, setSelectedEventPunctuality] = useState<string | null>(null);
  const [mode, setMode] = useState<TransportMode>('Driving');
  const [distanceKm, setDistanceKm] = useState('8.5');
  const [prepMins, setPrepMins] = useState('20');

  const handlePunctualitySubmit = (eventId: string) => {
    updateEventPunctuality(eventId, mode, parseFloat(distanceKm) || 5, parseInt(prepMins) || 15);
    setSelectedEventPunctuality(null);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold text-slate-100">Events & Punctuality Engine</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Schedule meetings, calculate travel departure alerts, and maintain 2-way calendar sync with Google & Apple.
          </p>
        </div>

        <button
          onClick={() => openQuickActionWithTab('event')}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Event</span>
        </button>
      </div>

      {/* Calendar Integration Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-bold">
            <RefreshCw className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-bold text-slate-200 text-sm">Two-Way External Calendar Sync</h3>
            <p className="text-xs text-slate-400">Google Calendar & Apple iCal accounts linked and synchronized.</p>
          </div>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold self-start sm:self-auto">
          ● Synced 2m ago
        </span>
      </div>

      {/* Events Agenda Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-200 uppercase tracking-wider">Scheduled Events & Routes</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map(evt => (
            <div
              key={evt.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {evt.category}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{evt.date} @ {evt.startTime} - {evt.endTime}</span>
                </div>

                <h3 className="font-bold text-slate-100 text-base">{evt.title}</h3>

                {evt.description && (
                  <p className="text-xs text-slate-400">{evt.description}</p>
                )}

                {evt.isOnline ? (
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Online Meeting</span>
                    {evt.meetingLink && (
                      <a href={evt.meetingLink} target="_blank" rel="noreferrer" className="text-indigo-400 font-semibold flex items-center gap-1 hover:underline">
                        <span>Join Call</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="font-medium">{evt.location}</span>
                    </div>

                    {evt.recommendedLeaveTime ? (
                      <div className="p-2.5 rounded-xl bg-indigo-950/50 border border-indigo-800/60 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <Navigation className="w-3.5 h-3.5 text-sky-400" />
                          <span className="text-indigo-200 font-semibold">Leave at {evt.recommendedLeaveTime} ({evt.transportMode})</span>
                        </div>
                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                          {evt.arrivalStatus}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedEventPunctuality(evt.id)}
                        className="w-full text-center py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold transition-colors"
                      >
                        Calculate Travel & Departure Time
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Google & Apple Synced</span>
                <button
                  onClick={() => deleteEvent(evt.id)}
                  className="text-slate-500 hover:text-rose-400 text-xs font-medium"
                >
                  Delete Event
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Punctuality Engine Modal */}
      {selectedEventPunctuality && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-bold text-slate-100 text-base">Punctuality Engine Calculation</h3>
            <p className="text-xs text-slate-400">Calculate optimal departure time based on distance, transport mode, and prep time.</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Transport Mode</label>
                <select
                  value={mode}
                  onChange={e => setMode(e.target.value as TransportMode)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                >
                  <option value="Driving">Driving</option>
                  <option value="Public Transport">Public Transport</option>
                  <option value="Walking">Walking</option>
                  <option value="Bike">Bike</option>
                  <option value="Taxi">Taxi / Ride-hailing</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    value={distanceKm}
                    onChange={e => setDistanceKm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Preparation (mins)</label>
                  <input
                    type="number"
                    value={prepMins}
                    onChange={e => setPrepMins(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedEventPunctuality(null)}
                className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2.5 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePunctualitySubmit(selectedEventPunctuality)}
                className="w-1/2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold py-2.5 rounded-xl shadow-lg shadow-sky-500/20"
              >
                Calculate Route
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
