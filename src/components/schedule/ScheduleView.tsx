import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit3,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent, EventCategory } from '../../types';
import { formatDate } from '../../lib/utils';

export const ScheduleView: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent, searchQuery } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('Work');
  const [date, setDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('');
  const [color, setColor] = useState('#3b6cf2');

  const categories: EventCategory[] = ['Work', 'Personal', 'Meeting', 'Health', 'Finance', 'Other'];
  const colorOptions = ['#3b6cf2', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

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

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const handleOpenAddModal = () => {
    setEditingEventId(null);
    setTitle('');
    setDescription('');
    setCategory('Work');
    setDate(selectedDate);
    setStartTime('09:00');
    setEndTime('10:00');
    setLocation('');
    setColor('#3b6cf2');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: CalendarEvent) => {
    setEditingEventId(event.id);
    setTitle(event.title);
    setDescription(event.description || '');
    setCategory(event.category);
    setDate(event.date);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setLocation(event.location || '');
    setColor(event.color || '#3b6cf2');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingEventId) {
      updateEvent(editingEventId, {
        title: title.trim(),
        description: description.trim(),
        category,
        date,
        startTime,
        endTime,
        location: location.trim(),
        color,
      });
    } else {
      addEvent({
        title: title.trim(),
        description: description.trim(),
        category,
        date,
        startTime,
        endTime,
        location: location.trim(),
        color,
      });
    }

    setIsModalOpen(false);
  };

  // Filter events for selected date or search query
  const dayEvents = events.filter(e => {
    if (searchQuery) {
      return e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return e.date === selectedDate;
  }).sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Time slots for day timeline (8:00 AM to 8:00 PM)
  const timeSlots = Array.from({ length: 13 }).map((_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {formatDate(selectedDate)}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {dayEvents.length} scheduled event{dayEvents.length !== 1 ? 's' : ''} for this date
            </p>
          </div>
        </div>

        {/* Date Selector Navigation */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={handlePrevDay}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 rounded-lg transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
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

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-purple-600/20 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Main Schedule Grid: Timeline Agenda & Quick Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Timeline View (2 cols wide) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Daily Timeline ({selectedDate})
          </h3>

          <div className="space-y-4 relative before:absolute before:left-14 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
            {timeSlots.map((slot) => {
              // find events in this hour slot
              const slotEvents = dayEvents.filter(e => e.startTime.startsWith(slot.substring(0, 2)));

              return (
                <div key={slot} className="flex items-start space-x-4 relative">
                  <span className="text-xs font-medium text-slate-400 w-10 text-right shrink-0 pt-1">
                    {slot}
                  </span>

                  <div className="flex-1 min-h-[48px] space-y-2">
                    {slotEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-start justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-start space-x-3 min-w-0">
                          <div
                            className="w-2 h-10 rounded-full shrink-0"
                            style={{ backgroundColor: evt.color || '#3b6cf2' }}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                {evt.title}
                              </h4>
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                {evt.category}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                              {evt.description}
                            </p>

                            <div className="flex items-center space-x-4 text-[11px] text-slate-400 mt-2">
                              <span className="flex items-center gap-1 font-medium text-purple-600 dark:text-purple-400">
                                <Clock className="w-3 h-3" />
                                {evt.startTime} - {evt.endTime}
                              </span>
                              {evt.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {evt.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            onClick={() => handleOpenEditModal(evt)}
                            className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-white dark:hover:bg-slate-900"
                            title="Edit Event"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteEvent(evt.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-white dark:hover:bg-slate-900"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Event List Cards & Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              All Scheduled Events ({events.length})
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedDate(evt.date)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    evt.date === selectedDate
                      ? 'border-purple-500 bg-purple-50/30 dark:bg-purple-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                      {formatDate(evt.date)}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {evt.startTime}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {evt.title}
                  </h4>
                  {evt.location && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {evt.location}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Add/Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingEventId ? 'Edit Event' : 'Add New Event'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Event Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Sync & Demo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Meeting link, agenda, or notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Date & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Start & End Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Location & Color Accent */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location / Call Link
                </label>
                <input
                  type="text"
                  placeholder="e.g. Room 302 or Zoom URL"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Color Tag
                </label>
                <div className="flex items-center space-x-3">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-2 ring-purple-500' : 'hover:scale-110'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-purple-600/20"
                >
                  {editingEventId ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
