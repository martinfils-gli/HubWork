import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, CheckSquare, Calendar, Wallet, Heart } from 'lucide-react';
import { useHubWork } from '../../context/HubWorkContext';

const GlobalSearchModalComponent: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, tasks, events, transactions, meals, setActiveTab } = useHubWork();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  // Memoize search calculations and short-circuit empty queries to avoid redundant array iterations and string operations
  const { filteredTasks, filteredEvents, filteredTx, filteredMeals } = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { filteredTasks: [], filteredEvents: [], filteredTx: [], filteredMeals: [] };
    }
    return {
      filteredTasks: tasks.filter(t => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)),
      filteredEvents: events.filter(e => e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)),
      filteredTx: transactions.filter(t => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)),
      filteredMeals: meals.filter(m => m.title.toLowerCase().includes(q))
    };
  }, [query, tasks, events, transactions, meals]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/50">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Global search tasks, events, transactions, meals..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-4">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Type to search across all operational modules in HubWork OS.
            </div>
          ) : (
            <>
              {/* Tasks */}
              {filteredTasks.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-sky-400" />
                    <span>Tasks ({filteredTasks.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {filteredTasks.map(task => (
                      <div
                        key={task.id}
                        onClick={() => {
                          setActiveTab('tasks');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/30 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-200">{task.title}</p>
                          <span className="text-[10px] text-slate-400">{task.category} • Due {task.dueDate}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/20 text-sky-400">
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {filteredEvents.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Events ({filteredEvents.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {filteredEvents.map(evt => (
                      <div
                        key={evt.id}
                        onClick={() => {
                          setActiveTab('events');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/30 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-200">{evt.title}</p>
                          <span className="text-[10px] text-slate-400">{evt.category} • {evt.date} @ {evt.startTime}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-400">
                          {evt.isOnline ? 'Online' : evt.location || 'In Person'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transactions */}
              {filteredTx.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Transactions ({filteredTx.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {filteredTx.map(tx => (
                      <div
                        key={tx.id}
                        onClick={() => {
                          setActiveTab('finance');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/30 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-200">{tx.title}</p>
                          <span className="text-[10px] text-slate-400">{tx.category} • {tx.date}</span>
                        </div>
                        <span className={`text-xs font-bold ${tx.type === 'Income' ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {tx.type === 'Income' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const GlobalSearchModal = React.memo(GlobalSearchModalComponent);
