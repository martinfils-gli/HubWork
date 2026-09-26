import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  Trash2,
  X,
  PiggyBank
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransactionType, FinanceCategory } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';

export const FinanceView: React.FC = () => {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    budgets,
    setBudget,
    searchQuery
  } = useApp();

  // Modal State
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // New Transaction Form State
  const [txDescription, setTxDescription] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<TransactionType>('expense');
  const [txCategory, setTxCategory] = useState<FinanceCategory>('Food & Dining');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);

  // Budget Goal State
  const [selectedBudgetCategory, setSelectedBudgetCategory] = useState<FinanceCategory>('Food & Dining');
  const [budgetLimitInput, setBudgetLimitInput] = useState('500');

  const categories: FinanceCategory[] = [
    'Salary',
    'Freelance',
    'Investments',
    'Food & Dining',
    'Housing',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Healthcare',
    'Bills & Utilities',
    'Other',
  ];

  const handleAddTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(txAmount);
    if (!txDescription.trim() || isNaN(amountNum) || amountNum <= 0) return;

    addTransaction({
      description: txDescription.trim(),
      amount: amountNum,
      type: txType,
      category: txCategory,
      date: txDate,
    });

    setTxDescription('');
    setTxAmount('');
    setIsTxModalOpen(false);
  };

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limitNum = parseFloat(budgetLimitInput);
    if (isNaN(limitNum) || limitNum < 0) return;

    setBudget(selectedBudgetCategory, limitNum);
    setIsBudgetModalOpen(false);
  };

  // Calculations
  const filteredTransactions = transactions.filter(t => {
    if (!searchQuery) return true;
    return t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           t.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  // Category spending total map
  const categorySpendingMap: Record<string, number> = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    categorySpendingMap[t.category] = (categorySpendingMap[t.category] || 0) + t.amount;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Total Balance */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 bg-white/20 rounded-xl">
              <Wallet className="w-5 h-5" />
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20">
              Cash Flow
            </span>
          </div>
          <div className="text-2xl font-extrabold tracking-tight">
            {formatCurrency(netBalance)}
          </div>
          <p className="text-xs text-emerald-100 mt-1">
            Total Net Balance Available
          </p>
        </div>

        {/* Total Income */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <ArrowUpRight className="w-5 h-5" />
            </span>
            <span className="text-xs font-medium text-slate-400">Income</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(totalIncome)}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Total earned funds
          </p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-xl">
              <ArrowDownRight className="w-5 h-5" />
            </span>
            <span className="text-xs font-medium text-slate-400">Expenses</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(totalExpense)}
          </div>
          <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> Outflow transactions
          </p>
        </div>

        {/* Savings Rate */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 rounded-xl">
              <PiggyBank className="w-5 h-5" />
            </span>
            <span className="text-xs font-medium text-slate-400">Savings Rate</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {savingsRate.toFixed(1)}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-sky-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, savingsRate)}%` }}
            />
          </div>
        </div>

      </div>

      {/* Main Finance Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2 cols): Transaction History & Log button */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Transaction Log
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Track every income stream and expenditure.
                </p>
              </div>

              <button
                onClick={() => setIsTxModalOpen(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Transaction</span>
              </button>
            </div>

            {/* Transactions List */}
            <div className="space-y-3">
              {filteredTransactions.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No transactions found.</p>
              ) : (
                filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className={`p-2.5 rounded-xl ${
                        tx.type === 'income'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                      }`}>
                        {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {tx.description}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                          <span>{tx.category}</span>
                          <span>•</span>
                          <span>{formatDate(tx.date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`text-sm font-bold ${
                        tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                      }`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Budget Goals & Category Breakdown */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-sky-500" />
                Category Budgets
              </h3>

              <button
                onClick={() => setIsBudgetModalOpen(true)}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
              >
                Set Limits →
              </button>
            </div>

            <div className="space-y-4">
              {budgets.map((b) => {
                const spent = categorySpendingMap[b.category] || 0;
                const percent = Math.min(100, (spent / b.limit) * 100);
                const isOver = spent > b.limit;

                return (
                  <div key={b.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {b.category}
                      </span>
                      <span className={`font-bold ${isOver ? 'text-rose-500' : 'text-slate-600 dark:text-slate-400'}`}>
                        {formatCurrency(spent)} / {formatCurrency(b.limit)}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isOver ? 'bg-rose-500' : percent > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Add Transaction Modal */}
      {isTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Log New Transaction
              </h3>
              <button
                onClick={() => setIsTxModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTxSubmit} className="space-y-4">
              {/* Type Switcher */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTxType('expense')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    txType === 'expense'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('income')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    txType === 'income'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Income
                </button>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Whole Foods Groceries"
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Amount ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value as FinanceCategory)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTxModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/20"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Set Budget Goal Modal */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Configure Budget Goal
              </h3>
              <button
                onClick={() => setIsBudgetModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBudgetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={selectedBudgetCategory}
                  onChange={(e) => setSelectedBudgetCategory(e.target.value as FinanceCategory)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Limit ($)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={budgetLimitInput}
                  onChange={(e) => setBudgetLimitInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-sky-600/20"
                >
                  Save Budget Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
