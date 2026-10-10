import React, { useMemo } from 'react';
import { BarChart3, CheckSquare, Wallet } from 'lucide-react';
import { useHubWork } from '../../context/HubWorkContext';

export const AnalyticsView: React.FC = () => {
  const { tasks, monthlyIncome, monthlyExpenses } = useHubWork();

  // Memoize task completion metrics to avoid array filtering and calculation on every re-render
  const taskCompletionPercent = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completedCount = tasks.filter(t => t.status === 'Completed').length;
    return Math.round((completedCount / tasks.length) * 100);
  }, [tasks]);

  // Memoize financial margin metrics to avoid arithmetic and string formatting on every re-render
  const financialMetrics = useMemo(() => {
    const netSavings = monthlyIncome - monthlyExpenses;
    const retentionRate = Math.round((netSavings / (monthlyIncome || 1)) * 100);
    return {
      savingsFormatted: netSavings.toFixed(2),
      retentionRate
    };
  }, [monthlyIncome, monthlyExpenses]);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto pb-24">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-sky-400" />
          <h1 className="text-2xl font-bold text-slate-100">HubWork System Analytics</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Performance, productivity trends, financial flow, and wellness index across all operational modules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-sky-400" />
            <span>Task Completion Rates</span>
          </h3>
          <p className="text-2xl font-extrabold text-sky-400">
            {taskCompletionPercent}%
          </p>
          <p className="text-xs text-slate-400">Total active tasks tracked: {tasks.length}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>Financial Savings Margin</span>
          </h3>
          <p className="text-2xl font-extrabold text-emerald-400">
            ${financialMetrics.savingsFormatted}
          </p>
          <p className="text-xs text-slate-400">Net monthly retention rate: {financialMetrics.retentionRate}%</p>
        </div>
      </div>
    </div>
  );
};
