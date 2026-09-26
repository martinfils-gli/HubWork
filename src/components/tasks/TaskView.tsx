import React, { useState } from 'react';
import {
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  Tag,
  ChevronDown,
  ChevronUp,
  X,
  ListTodo,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, TaskPriority, TaskCategory } from '../../types';
import { formatDate } from '../../lib/utils';

export const TaskView: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    toggleSubtaskComplete,
    searchQuery
  } = useApp();

  // Filters & State
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  // New / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('Work');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('');
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Expandable subtasks state in card
  const [expandedTaskIds, setExpandedTaskIds] = useState<Record<string, boolean>>({});

  const categories: TaskCategory[] = ['Work', 'Personal', 'Finance', 'Health', 'Study', 'Shopping'];

  const toggleExpand = (id: string) => {
    setExpandedTaskIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenAddModal = () => {
    setEditingTaskId(null);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('Work');
    setDueDate(new Date().toISOString().split('T')[0]);
    setDueTime('');
    setSubtasks([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority);
    setCategory(task.category);
    setDueDate(task.dueDate);
    setDueTime(task.dueTime || '');
    setSubtasks(task.subtasks || []);
    setIsModalOpen(true);
  };

  const handleAddSubtaskInput = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks(prev => [
      ...prev,
      { id: Math.random().toString(36).substring(2, 9), title: newSubtaskTitle.trim(), completed: false }
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtaskInput = (id: string) => {
    setSubtasks(prev => prev.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTaskId) {
      updateTask(editingTaskId, {
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        dueDate,
        dueTime,
        subtasks,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        completed: false,
        priority,
        category,
        dueDate,
        dueTime,
        subtasks,
      });
    }

    setIsModalOpen(false);
  };

  // Filter Tasks
  const filteredTasks = tasks.filter(task => {
    // Search Filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    // Status Filter
    if (filterStatus === 'active' && task.completed) return false;
    if (filterStatus === 'completed' && !task.completed) return false;

    // Category Filter
    if (filterCategory !== 'All' && task.category !== filterCategory) return false;

    // Priority Filter
    if (filterPriority !== 'All' && task.priority !== filterPriority) return false;

    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-tempus-600 dark:text-tempus-400" />
            Task Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Organize tasks, subtasks, priorities, and deadlines seamlessly.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-tempus-600 hover:bg-tempus-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-tempus-600/20 flex items-center justify-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Tabs & Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
        {/* Status Pills */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === 'active'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Active ({tasks.filter(t => !t.completed).length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === 'completed'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Completed ({tasks.filter(t => t.completed).length})
          </button>
        </div>

        {/* Category & Priority Selectors */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-medium border-0 focus:ring-1 focus:ring-tempus-500 cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <span>Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-medium border-0 focus:ring-1 focus:ring-tempus-500 cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
            <ListTodo className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No tasks match your filter</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try resetting filters or create a new task.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isExpanded = !!expandedTaskIds[task.id];
            const completedSubtasksCount = task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;
            const totalSubtasksCount = task.subtasks ? task.subtasks.length : 0;

            return (
              <div
                key={task.id}
                className={`bg-white dark:bg-slate-900 border transition-all rounded-2xl p-5 shadow-sm hover:shadow-md ${
                  task.completed
                    ? 'border-slate-200 dark:border-slate-800/60 opacity-80'
                    : 'border-slate-200 dark:border-slate-800 hover:border-tempus-300 dark:hover:border-tempus-700'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Checkbox + Title */}
                  <div className="flex items-start space-x-3.5 flex-1">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className="mt-1 text-slate-400 hover:text-tempus-600 transition-colors shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <h3 className={`text-base font-semibold ${
                          task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                        }`}>
                          {task.title}
                        </h3>

                        {/* Badges */}
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                          task.priority === 'urgent' ? 'bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-300' :
                          task.priority === 'high' ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300' :
                          task.priority === 'medium' ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {task.priority.toUpperCase()}
                        </span>

                        <span className="text-[11px] px-2.5 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {task.category}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Due Date & Time */}
                      <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(task.dueDate)}
                        </span>
                        {task.dueTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {task.dueTime}
                          </span>
                        )}
                        {totalSubtasksCount > 0 && (
                          <button
                            onClick={() => toggleExpand(task.id)}
                            className="font-medium text-tempus-600 dark:text-tempus-400 hover:underline flex items-center gap-1"
                          >
                            Subtasks ({completedSubtasksCount}/{totalSubtasksCount})
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions (Edit / Delete) */}
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(task)}
                      className="p-2 text-slate-400 hover:text-tempus-600 dark:hover:text-tempus-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit task"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtask checklist if present or expanded */}
                {totalSubtasksCount > 0 && isExpanded && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 pl-8 space-y-2">
                    {task.subtasks.map((st) => (
                      <div key={st.id} className="flex items-center space-x-2.5">
                        <button
                          onClick={() => toggleSubtaskComplete(task.id, st.id)}
                          className="text-slate-400 hover:text-tempus-600 transition-colors"
                        >
                          {st.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                        <span className={`text-xs ${st.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {st.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Task Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingTaskId ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete quarterly budget summary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tempus-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional context or notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tempus-500"
                />
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tempus-500"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tempus-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Due Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tempus-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Due Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tempus-500"
                  />
                </div>
              </div>

              {/* Subtasks Section */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Subtasks Checklist
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a subtask step..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtaskInput}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-medium hover:bg-slate-300"
                  >
                    Add Step
                  </button>
                </div>

                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {subtasks.map((st) => (
                    <div key={st.id} className="flex items-center justify-between px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-xs">
                      <span>{st.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtaskInput(st.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
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
                  className="px-5 py-2 bg-tempus-600 hover:bg-tempus-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-tempus-600/20"
                >
                  {editingTaskId ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
