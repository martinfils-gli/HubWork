import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Plus,
  Calendar,
  LayoutList,
  Kanban,
  Trash2,
  ListTodo
} from 'lucide-react';
import { useHubWork } from '../../context/HubWorkContext';

// Static category list moved outside component to avoid re-creating array on each render
const CATEGORIES = ['All', 'Personal', 'Education', 'Work', 'Freelance', 'Medical', 'Finance'];

// Isolated subtask form component to localize input state and prevent full TasksView re-renders on keystrokes
const SubtaskInputForm: React.FC<{ taskId: string; onAddSubtask: (taskId: string, text: string) => void }> = React.memo(({ taskId, onAddSubtask }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddSubtask(taskId, text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
      <input
        type="text"
        placeholder="+ Add subtask item..."
        value={text}
        onChange={e => setText(e.target.value)}
        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
      />
      <button
        type="submit"
        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
      >
        Add
      </button>
    </form>
  );
});

/**
 * ScheduleTaskModal
 * Isolated modal form component wrapped in React.memo.
 * Isolating eventScheduleTime input state prevents time picker changes from
 * re-rendering the parent TasksView component and all rendered task cards.
 */
interface ScheduleTaskModalProps {
  taskId: string;
  onClose: () => void;
  onConfirm: (taskId: string, date: string, startTime: string, durationMinutes: number) => void;
}

const ScheduleTaskModal: React.FC<ScheduleTaskModalProps> = React.memo(({
  taskId,
  onClose,
  onConfirm
}) => {
  const [eventScheduleTime, setEventScheduleTime] = useState('14:00');

  const handleConfirm = () => {
    onConfirm(taskId, '2026-09-28', eventScheduleTime, 60);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
        <h3 className="font-bold text-slate-100 text-base">Schedule Task onto Calendar</h3>
        <p className="text-xs text-slate-400">This turns the task into an official scheduled event/time block on your calendar.</p>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Scheduled Start Time</label>
          <input
            type="time"
            value={eventScheduleTime}
            onChange={e => setEventScheduleTime(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2.5 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="w-1/2 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold py-2.5 rounded-xl shadow-lg shadow-indigo-500/20"
          >
            Confirm & Sync Event
          </button>
        </div>
      </div>
    </div>
  );
});

export const TasksView: React.FC = () => {
  const {
    tasks,
    toggleTaskComplete,
    toggleChecklistItem,
    addChecklistItem,
    deleteTask,
    convertTaskToEvent,
    openQuickActionWithTab
  } = useHubWork();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeView, setActiveView] = useState<'List' | 'Kanban'>('List');
  const [selectedTaskForEvent, setSelectedTaskForEvent] = useState<string | null>(null);

  // Memoize filtered task list to avoid re-filtering on unrelated state updates
  const filteredTasks = useMemo(() => {
    if (activeCategory === 'All') return tasks;
    return tasks.filter(t => t.category === activeCategory);
  }, [tasks, activeCategory]);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-sky-400" />
            <h1 className="text-2xl font-bold text-slate-100">Tasks & Project Subtasks Hub</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Break down complex projects into subtask checklists, manage priorities, and convert tasks into scheduled calendar blocks.
          </p>
        </div>

        <button
          onClick={() => openQuickActionWithTab('task')}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-sky-500/20"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Category Filter & View Switches */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Switches */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveView('List')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === 'List' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>List & Checklists</span>
          </button>
          <button
            onClick={() => setActiveView('Kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === 'Kanban' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban Board</span>
          </button>
        </div>
      </div>

      {/* Main Task View */}
      {activeView === 'List' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">No tasks match selected filter.</div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.status === 'Completed'}
                      onChange={() => toggleTaskComplete(task.id)}
                      className="w-5 h-5 rounded border-slate-700 text-sky-500 focus:ring-0 bg-slate-900 mt-0.5 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold text-base ${task.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                          {task.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.priority === 'Critical' ? 'bg-rose-500/20 text-rose-400' :
                          task.priority === 'High' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-400 mt-1">{task.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400 font-medium">
                        <span>🏷 {task.category}</span>
                        <span>📅 Due {task.dueDate}</span>
                        <span>📊 Progress: {task.completionPercent}%</span>
                        {task.linkedEventId && (
                          <span className="text-indigo-400 font-bold">📅 Calendar Block Sync</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    {!task.linkedEventId && (
                      <button
                        onClick={() => setSelectedTaskForEvent(task.id)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-400 text-xs font-semibold border border-indigo-500/30 transition-all flex items-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Convert to Event</span>
                      </button>
                    )}

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtask Checklist Section */}
                <div className="pt-3 border-t border-slate-800/80 pl-8 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold flex items-center gap-1.5">
                      <ListTodo className="w-3.5 h-3.5 text-sky-400" /> Subtask Checklist ({task.checklist?.length || 0})
                    </span>
                  </div>

                  {task.checklist && task.checklist.map(item => (
                    <div key={item.id} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleChecklistItem(task.id, item.id)}
                        className="w-4 h-4 rounded border-slate-700 text-sky-500 focus:ring-0 bg-slate-900 cursor-pointer"
                      />
                      <span className={item.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                        {item.text}
                      </span>
                    </div>
                  ))}

                  {/* Add Subtask Input */}
                  <SubtaskInputForm taskId={task.id} onAddSubtask={addChecklistItem} />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeView === 'Kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Planned', 'In Progress', 'Completed'].map(statusName => {
            const columnTasks = filteredTasks.filter(t => t.status === statusName);
            return (
              <div key={statusName} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider">{statusName}</h3>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-bold">{columnTasks.length}</span>
                </div>

                <div className="space-y-2.5">
                  {columnTasks.map(task => (
                    <div key={task.id} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                      <p className={`text-xs font-semibold ${task.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{task.category}</span>
                        <span className="font-bold text-sky-400">{task.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task to Event Modal */}
      {selectedTaskForEvent && (
        <ScheduleTaskModal
          taskId={selectedTaskForEvent}
          onClose={() => setSelectedTaskForEvent(null)}
          onConfirm={convertTaskToEvent}
        />
      )}
    </div>
  );
};
