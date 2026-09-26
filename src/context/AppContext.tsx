import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, CalendarEvent, Transaction, BudgetGoal, HealthLog, TabType } from '../types';
import { generateId } from '../lib/utils';

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  toggleSubtaskComplete: (taskId: string, subtaskId: string) => void;

  // Events
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;

  // Finance
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  budgets: BudgetGoal[];
  setBudget: (category: BudgetGoal['category'], limit: number) => void;

  // Health
  healthLogs: Record<string, HealthLog>;
  getHealthLog: (dateStr: string) => HealthLog;
  updateHealthLog: (dateStr: string, updates: Partial<HealthLog>) => void;
  addWorkout: (dateStr: string, workout: { type: string; durationMinutes: number; caloriesBurned: number }) => void;
  deleteWorkout: (dateStr: string, workoutId: string) => void;

  // Reset demo data
  resetToDefaultData: () => void;
}

const todayStr = new Date().toISOString().split('T')[0];

const defaultTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Review Q3 Financial Strategy',
    description: 'Go over balance sheets and budget allocations for upcoming quarters.',
    completed: false,
    priority: 'high',
    category: 'Finance',
    dueDate: todayStr,
    dueTime: '14:00',
    subtasks: [
      { id: 'st-1', title: 'Compile expense reports', completed: true },
      { id: 'st-2', title: 'Prepare slide deck', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Schedule Annual Physical Exam',
    description: 'Call Dr. Smith clinic and verify health insurance coverage.',
    completed: false,
    priority: 'medium',
    category: 'Health',
    dueDate: todayStr,
    dueTime: '16:30',
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Team Product Sync & Sprint Planning',
    description: 'Discuss upcoming Tempus feature updates with design team.',
    completed: true,
    priority: 'urgent',
    category: 'Work',
    dueDate: todayStr,
    dueTime: '10:00',
    subtasks: [
      { id: 'st-3', title: 'Draft agenda', completed: true },
      { id: 'st-4', title: 'Share meeting notes', completed: true },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Grocery Shopping & Meal Prep',
    description: 'Buy high-protein groceries for workout fuel.',
    completed: false,
    priority: 'low',
    category: 'Shopping',
    dueDate: todayStr,
    dueTime: '18:00',
    subtasks: [
      { id: 'st-5', title: 'Chicken breast & salmon', completed: false },
      { id: 'st-6', title: 'Fresh veggies & fruits', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
];

const defaultEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Product Engineering Sync',
    description: 'Sprint planning and architecture review.',
    category: 'Work',
    date: todayStr,
    startTime: '09:30',
    endTime: '10:30',
    location: 'Conference Room B / Zoom',
    color: '#3b6cf2',
  },
  {
    id: 'evt-2',
    title: 'Lunch with Alex & Sarah',
    description: 'Discuss investment strategies and upcoming trip.',
    category: 'Personal',
    date: todayStr,
    startTime: '12:30',
    endTime: '13:30',
    location: 'Green Bistro',
    color: '#10b981',
  },
  {
    id: 'evt-3',
    title: 'HIIT Workout & Cardio',
    description: '45 mins interval training.',
    category: 'Health',
    date: todayStr,
    startTime: '17:00',
    endTime: '18:00',
    location: 'Fitness Center',
    color: '#f59e0b',
  },
  {
    id: 'evt-4',
    title: 'Budget Review & Investment Check',
    description: 'Monthly savings & portfolio rebalancing.',
    category: 'Finance',
    date: todayStr,
    startTime: '19:00',
    endTime: '19:45',
    location: 'Home Office',
    color: '#8b5cf6',
  },
];

const defaultTransactions: Transaction[] = [
  {
    id: 'tx-1',
    description: 'Monthly Salary Deposit',
    amount: 5200.00,
    type: 'income',
    category: 'Salary',
    date: todayStr,
  },
  {
    id: 'tx-2',
    description: 'Whole Foods Market',
    amount: 142.50,
    type: 'expense',
    category: 'Food & Dining',
    date: todayStr,
  },
  {
    id: 'tx-3',
    description: 'Fitness Club Membership',
    amount: 65.00,
    type: 'expense',
    category: 'Healthcare',
    date: todayStr,
  },
  {
    id: 'tx-4',
    description: 'Freelance UI Design Client',
    amount: 850.00,
    type: 'income',
    category: 'Freelance',
    date: todayStr,
  },
  {
    id: 'tx-5',
    description: 'Electric & Internet Utilities',
    amount: 120.00,
    type: 'expense',
    category: 'Bills & Utilities',
    date: todayStr,
  },
];

const defaultBudgets: BudgetGoal[] = [
  { category: 'Food & Dining', limit: 600 },
  { category: 'Housing', limit: 1500 },
  { category: 'Transportation', limit: 300 },
  { category: 'Shopping', limit: 400 },
  { category: 'Entertainment', limit: 250 },
  { category: 'Healthcare', limit: 200 },
  { category: 'Bills & Utilities', limit: 350 },
];

const defaultHealthLog: HealthLog = {
  date: todayStr,
  waterGlasses: 6,
  steps: 7420,
  sleepHours: 7.5,
  mood: 'great',
  workouts: [
    {
      id: 'wo-1',
      type: 'Running',
      durationMinutes: 30,
      caloriesBurned: 310,
    },
  ],
  notes: 'Felt energetic after morning run! Drank plenty of water.',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [searchQuery, setSearchQuery] = useState('');

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('tempus_dark_mode');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tempus_tasks');
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('tempus_events');
    return saved ? JSON.parse(saved) : defaultEvents;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('tempus_transactions');
    return saved ? JSON.parse(saved) : defaultTransactions;
  });

  const [budgets, setBudgets] = useState<BudgetGoal[]>(() => {
    const saved = localStorage.getItem('tempus_budgets');
    return saved ? JSON.parse(saved) : defaultBudgets;
  });

  const [healthLogs, setHealthLogs] = useState<Record<string, HealthLog>>(() => {
    const saved = localStorage.getItem('tempus_health_logs');
    return saved ? JSON.parse(saved) : { [todayStr]: defaultHealthLog };
  });

  // Sync state with LocalStorage
  useEffect(() => {
    localStorage.setItem('tempus_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('tempus_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('tempus_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('tempus_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('tempus_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('tempus_health_logs', JSON.stringify(healthLogs));
  }, [healthLogs]);

  // Task handlers
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const newStatus = !t.completed;
          const updatedSubtasks = t.subtasks.map(s => ({ ...s, completed: newStatus }));
          return { ...t, completed: newStatus, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  const toggleSubtaskComplete = (taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map(s =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
          );
          const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every(s => s.completed);
          return { ...t, subtasks: updatedSubtasks, completed: allDone };
        }
        return t;
      })
    );
  };

  // Event handlers
  const addEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = { ...eventData, id: generateId() };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Finance handlers
  const addTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = { ...txData, id: generateId() };
    setTransactions(prev => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const setBudget = (category: BudgetGoal['category'], limit: number) => {
    setBudgets(prev => {
      const exists = prev.some(b => b.category === category);
      if (exists) {
        return prev.map(b => (b.category === category ? { ...b, limit } : b));
      }
      return [...prev, { category, limit }];
    });
  };

  // Health handlers
  const getHealthLog = (dateStr: string): HealthLog => {
    if (healthLogs[dateStr]) {
      return healthLogs[dateStr];
    }
    return {
      date: dateStr,
      waterGlasses: 0,
      steps: 0,
      sleepHours: 7,
      mood: 'good',
      workouts: [],
      notes: '',
    };
  };

  const updateHealthLog = (dateStr: string, updates: Partial<HealthLog>) => {
    setHealthLogs(prev => {
      const existing = prev[dateStr] || getHealthLog(dateStr);
      return {
        ...prev,
        [dateStr]: { ...existing, ...updates },
      };
    });
  };

  const addWorkout = (dateStr: string, workout: { type: string; durationMinutes: number; caloriesBurned: number }) => {
    setHealthLogs(prev => {
      const existing = prev[dateStr] || getHealthLog(dateStr);
      const newWorkout = { ...workout, id: generateId() };
      return {
        ...prev,
        [dateStr]: {
          ...existing,
          workouts: [...existing.workouts, newWorkout],
        },
      };
    });
  };

  const deleteWorkout = (dateStr: string, workoutId: string) => {
    setHealthLogs(prev => {
      const existing = prev[dateStr];
      if (!existing) return prev;
      return {
        ...prev,
        [dateStr]: {
          ...existing,
          workouts: existing.workouts.filter(w => w.id !== workoutId),
        },
      };
    });
  };

  const resetToDefaultData = () => {
    setTasks(defaultTasks);
    setEvents(defaultEvents);
    setTransactions(defaultTransactions);
    setBudgets(defaultBudgets);
    setHealthLogs({ [todayStr]: defaultHealthLog });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        darkMode,
        setDarkMode,
        searchQuery,
        setSearchQuery,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        toggleSubtaskComplete,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        transactions,
        addTransaction,
        deleteTransaction,
        budgets,
        setBudget,
        healthLogs,
        getHealthLog,
        updateHealthLog,
        addWorkout,
        deleteWorkout,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
