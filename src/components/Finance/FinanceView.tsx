import React from 'react';
import {
  Wallet,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  PieChart,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useHubWork } from '../../context/HubWorkContext';

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
    openQuickActionWithTab
  } = useHubWork();

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
            Accounts, income, expenses, recurring bills, debts, bank loans, budget allocations, and savings goals.
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

      {/* 1. FINANCIAL DASHBOARD CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Net Cash</span>
          <h2 className="text-2xl font-extrabold text-slate-100">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
          <p className="text-[11px] text-emerald-400 font-medium">Across {accounts.length} active accounts</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Monthly Income</span>
          <h2 className="text-2xl font-extrabold text-emerald-400">+${monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
          <p className="text-[11px] text-slate-400 font-medium">Retainers & freelance</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Monthly Expenses</span>
          <h2 className="text-2xl font-extrabold text-rose-400">-${monthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
          <p className="text-[11px] text-slate-400 font-medium">Net cash flow: +${(monthlyIncome - monthlyExpenses).toFixed(2)}</p>
        </div>
      </div>

      {/* 2. ACCOUNTS & RECURRING BILLS */}
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
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>Upcoming Bills & Payments</span>
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

      {/* 3. DEBTS, BANK LOANS & BUDGET ALLOCATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Debts & Loans */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-slate-200 text-base flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span>Debts & Bank Loans</span>
          </h3>

          <div className="space-y-3">
            {debts.map(debt => (
              <div key={debt.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-200 text-sm">{debt.title}</h4>
                    <span className="text-[10px] text-slate-400">{debt.lenderOrBorrower} • {debt.type}</span>
                  </div>
                  <span className="font-bold text-rose-400 text-sm">${debt.remainingBalance.toLocaleString()} left</span>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${((debt.totalAmount - debt.remainingBalance) / debt.totalAmount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budgets & Savings Goals */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-slate-200 text-base flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-400" />
            <span>Budget Categories & Progress</span>
          </h3>

          <div className="space-y-3">
            {budgets.map(b => (
              <div key={b.id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{b.category}</span>
                  <span className="text-slate-400">${b.spentAmount} / ${b.allocatedAmount}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${b.spentAmount > b.allocatedAmount ? 'bg-rose-500' : 'bg-sky-500'}`}
                    style={{ width: `${Math.min(100, (b.spentAmount / b.allocatedAmount) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
