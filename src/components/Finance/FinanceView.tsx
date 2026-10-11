import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  CreditCard,
  PieChart,
  AlertTriangle,
  TrendingUp,
  PiggyBank,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { useHubWork } from '../../context/HubWorkContext';

/**
 * SavingsDepositModal
 * Isolated deposit form component wrapped in React.memo.
 * Isolating depositAmount and depositAccountId form input state prevents
 * every input keystroke from triggering full re-renders of the FinanceView
 * parent component and its sub-trees (accounts, bills, savings goal progress cards).
 */
interface SavingsDepositModalProps {
  goalId: string;
  accounts: Array<{ id: string; name: string; balance: number }>;
  onClose: () => void;
  onDeposit: (goalId: string, amount: number, accountId: string) => void;
}

const SavingsDepositModal: React.FC<SavingsDepositModalProps> = React.memo(({
  goalId,
  accounts,
  onClose,
  onDeposit
}) => {
  const [depositAmount, setDepositAmount] = useState('250');
  const [depositAccountId, setDepositAccountId] = useState(accounts[0]?.id || 'acc-1');

  const handleDepositSubmit = () => {
    onDeposit(goalId, parseFloat(depositAmount) || 100, depositAccountId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
        <h3 className="font-bold text-slate-100 text-base">Direct Savings Deposit</h3>
        <p className="text-xs text-slate-400">Transfer funds directly from your checking account into this savings goal.</p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Deposit Amount ($)</label>
            <input
              type="number"
              value={depositAmount}
              onChange={e => setDepositAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Source Account</label>
            <select
              value={depositAccountId}
              onChange={e => setDepositAccountId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name} (${acc.balance.toFixed(2)})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2.5 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleDepositSubmit}
            className="w-1/2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold py-2.5 rounded-xl shadow-lg shadow-emerald-500/20"
          >
            Confirm Transfer
          </button>
        </div>
      </div>
    </div>
  );
});

export const FinanceView: React.FC = () => {
  const {
    accounts,
    transactions,
    bills,
    debts,
    budgets,
    savingsGoals,
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    toggleBillPaid,
    depositToSavingsGoal,
    openQuickActionWithTab
  } = useHubWork();

  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const netCashFlow = monthlyIncome - monthlyExpenses;

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-slate-100">Finance Operating Module</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cash flow projections, 1-click savings allocation, accounts, debts, loans, and budget controls.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => openQuickActionWithTab('income')}
            className="flex items-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 font-semibold px-3.5 py-2.5 rounded-xl text-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Income</span>
          </button>
          <button
            onClick={() => openQuickActionWithTab('expense')}
            className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-400 text-white font-semibold px-3.5 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-rose-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Expense</span>
          </button>
        </div>
      </div>

      {/* 1. FINANCIAL DASHBOARD & FORECAST CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Net Cash</span>
          <h2 className="text-2xl font-extrabold text-slate-100">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
          <p className="text-[11px] text-emerald-400 font-medium">Across {accounts.length} accounts</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Monthly Income</span>
          <h2 className="text-2xl font-extrabold text-emerald-400">+${monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
          <p className="text-[11px] text-slate-400 font-medium">Active retainers</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Monthly Expenses</span>
          <h2 className="text-2xl font-extrabold text-rose-400">-${monthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
          <p className="text-[11px] text-slate-400 font-medium">Net flow: +${netCashFlow.toFixed(2)}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">90-Day Forecast</span>
          <h2 className="text-2xl font-extrabold text-sky-400">${(totalBalance + netCashFlow * 3).toLocaleString('en-US', { minimumFractionDigits: 0 })}</h2>
          <p className="text-[11px] text-slate-400 font-medium">Projected cumulative balance</p>
        </div>
      </div>

      {/* 2. SAVINGS GOALS ALLOCATOR */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-200 text-base flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-emerald-400" />
            <span>Savings Goals & Direct Allocator</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">Auto Contribution Ready</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savingsGoals.map(goal => (
            <div key={goal.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">{goal.title}</h4>
                  <p className="text-[11px] text-slate-400">Target: ${goal.targetAmount.toLocaleString()} • Due {goal.targetDate}</p>
                </div>
                <button
                  onClick={() => setSelectedGoalId(goal.id)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold transition-all"
                >
                  + Deposit
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Progress</span>
                  <span className="text-emerald-400 font-bold">${goal.currentAmount.toLocaleString()} ({Math.round((goal.currentAmount / goal.targetAmount) * 100)}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ACCOUNTS & UPCOMING BILLS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accounts List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-slate-200 text-base flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-sky-400" />
            <span>Bank & Cash Accounts</span>
          </h3>

          <div className="space-y-3">
            {accounts.map(acc => (
              <div key={acc.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${acc.color || 'bg-sky-500'}`} />
                  <div>
                    <h4 className="font-semibold text-slate-200 text-sm">{acc.name}</h4>
                    <span className="text-[10px] text-slate-400">{acc.type} {acc.accountNumberMasked ? `• ${acc.accountNumberMasked}` : ''}</span>
                  </div>
                </div>
                <span className="font-extrabold text-slate-100 text-sm">${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recurring Bills */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-slate-200 text-base flex items-center gap-2">
            <PieChart className="w-5 h-5 text-amber-400" />
            <span>Upcoming Recurring Bills</span>
          </h3>

          <div className="space-y-3">
            {bills.map(bill => (
              <div key={bill.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-200 text-sm">{bill.title}</h4>
                  <p className="text-[10px] text-slate-400">Due {bill.dueDate} • {bill.category} {bill.autoPay ? '• Auto-Pay' : ''}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-100 text-sm">${bill.amount.toFixed(2)}</span>
                  <button
                    onClick={() => toggleBillPaid(bill.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      bill.isPaid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                    }`}
                  >
                    {bill.isPaid ? 'Paid' : 'Pay Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Savings Goal Deposit Modal */}
      {selectedGoalId && (
        <SavingsDepositModal
          goalId={selectedGoalId}
          accounts={accounts}
          onClose={() => setSelectedGoalId(null)}
          onDeposit={depositToSavingsGoal}
        />
      )}
    </div>
  );
};
