import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  Task,
  EventItem,
  Account,
  Transaction,
  Bill,
  DebtLoan,
  BudgetCategory,
  SavingsGoal,
  HealthVitals,
  SleepData,
  HydrationData,
  Meal,
  ExerciseWorkout,
  MedicalRecord,
  SymptomLog,
  SpiritualData,
  DailyPlanBlock,
  SmartAlert,
  UserProfile,
  TransportMode,
  ChecklistItem
} from '../types/hubwork';

interface HubWorkContextType {
  userProfile: UserProfile;
  tasks: Task[];
  events: EventItem[];
  accounts: Account[];
  transactions: Transaction[];
  bills: Bill[];
  debts: DebtLoan[];
  budgets: BudgetCategory[];
  savingsGoals: SavingsGoal[];
  vitals: HealthVitals;
  sleep: SleepData;
  hydration: HydrationData;
  meals: Meal[];
  workouts: ExerciseWorkout[];
  medicalRecords: MedicalRecord[];
  symptoms: SymptomLog[];
  spiritual: SpiritualData;
  dailyPlan: DailyPlanBlock[];
  smartAlerts: SmartAlert[];

  // Actions
  addTask: (task: Partial<Task>) => void;
  toggleTaskComplete: (id: string) => void;
  toggleChecklistItem: (taskId: string, checklistItemId: string) => void;
  addChecklistItem: (taskId: string, text: string) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  deleteTask: (id: string) => void;
  convertTaskToEvent: (taskId: string, date: string, startTime: string, durationMinutes: number) => void;

  addEvent: (event: Partial<EventItem>) => void;
  calculateMultiModeRoutes: (eventId: string, distanceKm: number, prepMins: number) => void;
  selectEventRouteMode: (eventId: string, mode: TransportMode) => void;
  deleteEvent: (id: string) => void;

  addTransaction: (tx: Partial<Transaction>) => void;
  addBill: (bill: Partial<Bill>) => void;
  toggleBillPaid: (id: string) => void;
  depositToSavingsGoal: (goalId: string, amount: number, accountId: string) => void;

  addMeal: (meal: Partial<Meal>) => void;
  addWorkout: (workout: Partial<ExerciseWorkout>) => void;
  toggleWorkoutComplete: (id: string) => void;
  toggleWorkoutSetComplete: (workoutId: string, setNumber: number) => void;
  addWaterGlass: () => void;
  togglePrayerComplete: (id: string) => void;
  toggleBibleReading: () => void;
  addSymptom: (symptom: Partial<SymptomLog>) => void;
  updateJournal: (text: string) => void;
  addGratitudeNote: (note: string) => void;
  togglePlanBlockComplete: (id: string) => void;
  autoResolveScheduleConflicts: () => void;
  exportDailyReport: () => void;

  // Active View Navigation State
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Modal Quick Actions State
  isQuickActionOpen: boolean;
  setIsQuickActionOpen: (open: boolean) => void;
  quickActionDefaultTab?: string;
  openQuickActionWithTab: (tab?: string) => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Calculated Summaries & Macro Targets
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  totalCaloriesLogged: number;
  totalProteinLogged: number;
  totalCarbsLogged: number;
  totalFatsLogged: number;
  healthScore: number;
  taskCompletionPercent: number;
  scheduleConflictsCount: number;
}

const HubWorkContext = createContext<HubWorkContextType | undefined>(undefined);

const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Submit University Application',
    description: 'Upload transcript, passport scan, and statement of purpose.',
    category: 'Education',
    project: 'Degree 2027',
    status: 'In Progress',
    priority: 'Critical',
    dueDate: '2026-09-30',
    startTime: '14:00',
    endTime: '15:00',
    estimatedDurationMinutes: 60,
    completionPercent: 66,
    checklist: [
      { id: 'c1', text: 'Transcript attached', completed: true },
      { id: 'c2', text: 'Passport copy uploaded', completed: true },
      { id: 'c3', text: 'Pay application fee', completed: false }
    ],
    linkedEventId: 'evt-1',
    linkedExpenseId: 'tx-2',
    createdAt: '2026-09-20',
    updatedAt: '2026-09-26'
  },
  {
    id: 'task-2',
    title: 'Prepare Medical Records for Specialist',
    description: 'Gather blood test results and previous prescriptions.',
    category: 'Medical',
    status: 'Planned',
    priority: 'High',
    dueDate: '2026-09-26',
    startTime: '08:30',
    endTime: '09:00',
    estimatedDurationMinutes: 30,
    completionPercent: 0,
    checklist: [
      { id: 'c4', text: 'Locate cardiology lab report', completed: false },
      { id: 'c5', text: 'Print current prescription list', completed: false }
    ],
    linkedEventId: 'evt-2',
    createdAt: '2026-09-25',
    updatedAt: '2026-09-26'
  },
  {
    id: 'task-3',
    title: 'Review Q3 Freelance Deliverables',
    description: 'Check UI components and test responsive views.',
    category: 'Freelance',
    status: 'Completed',
    priority: 'Medium',
    dueDate: '2026-09-26',
    completionPercent: 100,
    checklist: [
      { id: 'c6', text: 'Run lighthouse audit', completed: true },
      { id: 'c7', text: 'Verify cross-browser layout', completed: true }
    ],
    createdAt: '2026-09-24',
    updatedAt: '2026-09-26'
  }
];

const initialEvents: EventItem[] = [
  {
    id: 'evt-1',
    title: 'University Application Session',
    category: 'Education',
    date: '2026-09-28',
    startTime: '14:00',
    endTime: '15:00',
    durationMinutes: 60,
    timeZone: 'UTC+2',
    location: 'University Admissions Portal',
    isOnline: true,
    meetingLink: 'https://admissions.univ.edu/apply',
    linkedTaskId: 'task-1',
    syncedToGoogle: true,
    createdAt: '2026-09-20',
    updatedAt: '2026-09-26'
  },
  {
    id: 'evt-2',
    title: 'Cardiology Health Checkup',
    category: 'Medical',
    date: '2026-09-26',
    startTime: '10:00',
    endTime: '11:00',
    durationMinutes: 60,
    timeZone: 'UTC+2',
    location: 'Central Medical Clinic, Ave 45',
    originLocation: 'Home Base',
    isOnline: false,
    selectedTransportMode: 'Driving',
    preparationTimeMinutes: 20,
    bufferTimeMinutes: 10,
    recommendedLeaveTime: '09:05',
    arrivalStatus: 'On Time',
    routes: [
      { mode: 'Driving', distanceKm: 8.5, travelTimeMinutes: 25, recommendedLeaveTime: '09:05', carbonKg: 1.8 },
      { mode: 'Public Transport', distanceKm: 8.5, travelTimeMinutes: 35, recommendedLeaveTime: '08:55', carbonKg: 0.4 },
      { mode: 'Bike', distanceKm: 8.5, travelTimeMinutes: 30, recommendedLeaveTime: '09:00', carbonKg: 0.0 },
      { mode: 'Walking', distanceKm: 8.5, travelTimeMinutes: 100, recommendedLeaveTime: '07:50', carbonKg: 0.0 }
    ],
    linkedTaskId: 'task-2',
    syncedToGoogle: true,
    syncedToApple: true,
    createdAt: '2026-09-22',
    updatedAt: '2026-09-26'
  }
];

const initialAccounts: Account[] = [
  { id: 'acc-1', name: 'Primary Checking', type: 'Bank Account', balance: 4250.00, accountNumberMasked: '•••• 8812', color: 'bg-sky-500' },
  { id: 'acc-2', name: 'Emergency Reserve', type: 'Savings Account', balance: 12500.00, accountNumberMasked: '•••• 4019', color: 'bg-emerald-500' },
  { id: 'acc-3', name: 'Cash Wallet', type: 'Cash Wallet', balance: 180.50, color: 'bg-amber-500' }
];

const initialTransactions: Transaction[] = [
  { id: 'tx-1', title: 'Freelance Software Retainer', amount: 3200.00, type: 'Income', category: 'Freelance', accountId: 'acc-1', date: '2026-09-25' },
  { id: 'tx-2', title: 'University Application Fee', amount: 85.00, type: 'Expense', category: 'Education', accountId: 'acc-1', date: '2026-09-26', linkedTaskId: 'task-1' },
  { id: 'tx-3', title: 'Organic Grocery Store', amount: 64.30, type: 'Expense', category: 'Food', accountId: 'acc-1', date: '2026-09-26' }
];

const initialBills: Bill[] = [
  { id: 'bill-1', title: 'Fiber Internet & Wifi', amount: 55.00, dueDate: '2026-09-28', category: 'Utilities', isPaid: false, autoPay: true, recurringFrequency: 'Monthly' },
  { id: 'bill-2', title: 'Medical Insurance Premium', amount: 140.00, dueDate: '2026-10-01', category: 'Health', isPaid: false, autoPay: true, recurringFrequency: 'Monthly' }
];

const initialDebts: DebtLoan[] = [
  { id: 'debt-1', title: 'Car Loan', type: 'Bank Loan', totalAmount: 18000.00, remainingBalance: 6400.00, monthlyInstallment: 350.00, interestRate: 4.2, nextPaymentDate: '2026-10-05', dueDate: '2028-03-01', lenderOrBorrower: 'First National Bank' }
];

const initialBudgets: BudgetCategory[] = [
  { id: 'b-1', category: 'Food & Dining', allocatedAmount: 500, spentAmount: 320 },
  { id: 'b-2', category: 'Housing & Utilities', allocatedAmount: 1100, spentAmount: 980 },
  { id: 'b-3', category: 'Transportation & Fuel', allocatedAmount: 250, spentAmount: 145 },
  { id: 'b-4', category: 'Health & Fitness', allocatedAmount: 200, spentAmount: 110 }
];

const initialSavings: SavingsGoal[] = [
  { id: 's-1', title: 'Emergency Fund (6 Months)', targetAmount: 15000, currentAmount: 12500, targetDate: '2026-12-31', monthlyContribution: 500 },
  { id: 's-2', title: 'New Workstation Setup', targetAmount: 2500, currentAmount: 1800, targetDate: '2026-11-15', monthlyContribution: 300 }
];

const initialVitals: HealthVitals = {
  weightKg: 74.5,
  heightCm: 178,
  bmi: 23.5,
  heartRateBpm: 68,
  bloodPressureSystolic: 118,
  bloodPressureDiastolic: 78,
  bodyTemperatureC: 36.6,
  bloodOxygenPercent: 99,
  updatedAt: '2026-09-26 07:30'
};

const initialSleep: SleepData = {
  bedtime: '23:15',
  wakeTime: '06:45',
  durationHours: 7,
  durationMinutes: 30,
  qualityPercent: 88,
  targetHours: 8
};

const initialHydration: HydrationData = {
  targetLiters: 2.5,
  consumedLiters: 1.5,
  glassCount: 6,
  glassSizeMl: 250
};

const initialMeals: Meal[] = [
  { id: 'm-1', type: 'Breakfast', title: 'Oatmeal with Berries & Almonds', calories: 420, proteinGrams: 18, carbsGrams: 62, fatsGrams: 12, timeLogged: '07:30' },
  { id: 'm-2', type: 'Lunch', title: 'Grilled Chicken Salad & Quinoa', calories: 610, proteinGrams: 48, carbsGrams: 45, fatsGrams: 18, timeLogged: '12:45' }
];

const initialWorkouts: ExerciseWorkout[] = [
  {
    id: 'w-1',
    title: 'Morning Mobility & Core Routine',
    category: 'Mobility',
    durationMinutes: 20,
    caloriesBurned: 110,
    completed: true,
    scheduledTime: '07:00',
    sets: [
      { setNumber: 1, reps: 15, completed: true },
      { setNumber: 2, reps: 15, completed: true },
      { setNumber: 3, reps: 15, completed: true }
    ]
  },
  {
    id: 'w-2',
    title: 'Evening Strength & Upper Body',
    category: 'Strength',
    durationMinutes: 45,
    caloriesBurned: 320,
    completed: false,
    scheduledTime: '18:00',
    sets: [
      { setNumber: 1, reps: 10, weightKg: 60, completed: false },
      { setNumber: 2, reps: 10, weightKg: 60, completed: false },
      { setNumber: 3, reps: 8, weightKg: 65, completed: false }
    ]
  }
];

const initialMedicalRecords: MedicalRecord[] = [
  { id: 'med-1', title: 'Cardiology Consultation', type: 'Appointment', doctorName: 'Dr. Sarah Jenkins', notes: 'Annual heart wellness evaluation' }
];

const initialSymptoms: SymptomLog[] = [
  { id: 'sym-1', symptom: 'Mild Knee Stiffness', severity: 'Mild', dateLogged: '2026-09-25', notes: 'Resolved with mobility routine.' }
];

const initialSpiritual: SpiritualData = {
  prayersCompletedToday: 2,
  targetPrayers: 3,
  prayerList: [
    { id: 'p-1', title: 'Morning Prayer & Reflection', time: '07:00', completed: true },
    { id: 'p-2', title: 'Midday Prayer for Guidance', time: '13:00', completed: true },
    { id: 'p-3', title: 'Evening Gratitude Prayer', time: '20:30', completed: false }
  ],
  bibleReadingCompleted: true,
  biblePassageToday: 'Psalms 23 & Matthew 6:25-34',
  devotionMinutes: 15,
  journalEntry: 'Grateful for clarity today. Focused on steady progress.',
  gratitudeNotes: ['Good health and energy', 'Completed major project milestone', 'Quality time with family']
};

const initialDailyPlan: DailyPlanBlock[] = [
  { id: 'dp-1', timeSlot: '06:30 - 07:00', period: 'Morning', title: 'Morning Hydration & Wake Up Routine', type: 'Routine', completed: true },
  { id: 'dp-2', timeSlot: '07:00 - 07:30', period: 'Prayer', title: 'Morning Prayer & Scripture Devotion', type: 'Prayer', completed: true },
  { id: 'dp-3', timeSlot: '07:30 - 08:00', period: 'Meals', title: 'Nutritious Oatmeal & Berry Breakfast', type: 'Meal', completed: true },
  { id: 'dp-4', timeSlot: '08:30 - 09:00', period: 'Personal', title: 'Prepare Medical Documents for Visit', type: 'Task', linkedId: 'task-2', completed: false },
  { id: 'dp-5', timeSlot: '09:05 - 09:30', period: 'Personal', title: 'Travel to Cardiology Clinic (Driving)', type: 'Routine', location: 'Ave 45 Clinic', completed: false, hasConflict: true },
  { id: 'dp-6', timeSlot: '09:15 - 10:15', period: 'Work', title: 'Overlapping Client Call (Detected Conflict)', type: 'Event', completed: false, hasConflict: true },
  { id: 'dp-7', timeSlot: '10:00 - 11:00', period: 'Personal', title: 'Cardiology Health Checkup', type: 'Event', linkedId: 'evt-2', completed: false },
  { id: 'dp-8', timeSlot: '12:45 - 13:30', period: 'Meals', title: 'Balanced Lunch & Midday Refresh', type: 'Meal', completed: true },
  { id: 'dp-9', timeSlot: '18:00 - 18:45', period: 'Exercise', title: 'Evening Strength Workout', type: 'Workout', linkedId: 'w-2', completed: false }
];

export const HubWorkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState<boolean>(false);
  const [quickActionDefaultTab, setQuickActionDefaultTab] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [debts, setDebts] = useState<DebtLoan[]>(initialDebts);
  const [budgets, setBudgets] = useState<BudgetCategory[]>(initialBudgets);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(initialSavings);
  const [vitals] = useState<HealthVitals>(initialVitals);
  const [sleep] = useState<SleepData>(initialSleep);
  const [hydration, setHydration] = useState<HydrationData>(initialHydration);
  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  const [workouts, setWorkouts] = useState<ExerciseWorkout[]>(initialWorkouts);
  const [medicalRecords] = useState<MedicalRecord[]>(initialMedicalRecords);
  const [symptoms, setSymptoms] = useState<SymptomLog[]>(initialSymptoms);
  const [spiritual, setSpiritual] = useState<SpiritualData>(initialSpiritual);
  const [dailyPlan, setDailyPlan] = useState<DailyPlanBlock[]>(initialDailyPlan);

  const userProfile: UserProfile = {
    name: 'Martin',
    location: 'Geneva, Switzerland',
    weatherTempC: 19,
    weatherCondition: 'Partly Cloudy',
    currentDate: 'Saturday, 26 September 2026',
    currentTime: '09:15 AM',
    dayProgressPercent: 42,
    healthScore: 84
  };

  const openQuickActionWithTab = (tab?: string) => {
    setQuickActionDefaultTab(tab);
    setIsQuickActionOpen(true);
  };

  // Task Actions & Checklist Toggle
  const addTask = (newTask: Partial<Task>) => {
    const created: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title || 'Untitled Task',
      description: newTask.description || '',
      category: newTask.category || 'Personal',
      status: newTask.status || 'Planned',
      priority: newTask.priority || 'Medium',
      dueDate: newTask.dueDate || '2026-09-26',
      startTime: newTask.startTime,
      endTime: newTask.endTime,
      completionPercent: 0,
      checklist: newTask.checklist || [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setTasks(prev => [created, ...prev]);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextDone = t.status !== 'Completed';
        const updatedChecklist = t.checklist?.map(c => ({ ...c, completed: nextDone }));
        return {
          ...t,
          status: nextDone ? 'Completed' : 'In Progress',
          completionPercent: nextDone ? 100 : 50,
          checklist: updatedChecklist,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return t;
    }));
  };

  const toggleChecklistItem = (taskId: string, checklistItemId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId && t.checklist) {
        const nextChecklist = t.checklist.map(item =>
          item.id === checklistItemId ? { ...item, completed: !item.completed } : item
        );
        const completedCount = nextChecklist.filter(item => item.completed).length;
        const percent = Math.round((completedCount / nextChecklist.length) * 100);
        return {
          ...t,
          checklist: nextChecklist,
          completionPercent: percent,
          status: percent === 100 ? 'Completed' : 'In Progress'
        };
      }
      return t;
    }));
  };

  const addChecklistItem = (taskId: string, text: string) => {
    if (!text.trim()) return;
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newItem: ChecklistItem = { id: `c-${Date.now()}`, text, completed: false };
        const updated = [...(t.checklist || []), newItem];
        return { ...t, checklist: updated };
      }
      return t;
    }));
  };

  const updateTaskStatus = (id: string, status: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const convertTaskToEvent = (taskId: string, date: string, startTime: string, durationMinutes: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const [h, m] = startTime.split(':').map(Number);
    const endMins = h * 60 + m + durationMinutes;
    const endTime = `${String(Math.floor(endMins / 60) % 24).padStart(2, '0')}:${String(endMins % 60).padStart(2, '0')}`;

    const newEvt: EventItem = {
      id: `evt-from-task-${Date.now()}`,
      title: task.title,
      description: task.description,
      category: task.category,
      date,
      startTime,
      endTime,
      durationMinutes,
      timeZone: 'UTC+2',
      isOnline: true,
      linkedTaskId: task.id,
      syncedToGoogle: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setEvents(prev => [...prev, newEvt]);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, linkedEventId: newEvt.id } : t));
  };

  // Event Actions & Multi-Mode Route Engine
  const addEvent = (newEvent: Partial<EventItem>) => {
    const created: EventItem = {
      id: `evt-${Date.now()}`,
      title: newEvent.title || 'New Event',
      category: newEvent.category || 'Personal',
      date: newEvent.date || '2026-09-26',
      startTime: newEvent.startTime || '10:00',
      endTime: newEvent.endTime || '11:00',
      durationMinutes: newEvent.durationMinutes || 60,
      timeZone: 'UTC+2',
      location: newEvent.location || '',
      isOnline: newEvent.isOnline ?? false,
      syncedToGoogle: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setEvents(prev => [created, ...prev]);
  };

  const calculateMultiModeRoutes = (eventId: string, distanceKm: number, prepMins: number) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        const [h, m] = e.startTime.split(':').map(Number);
        const eventStartMinutes = h * 60 + m;

        const modes: { mode: TransportMode; speed: number; carbon: number }[] = [
          { mode: 'Driving', speed: 30, carbon: Number((distanceKm * 0.21).toFixed(1)) },
          { mode: 'Public Transport', speed: 20, carbon: Number((distanceKm * 0.05).toFixed(1)) },
          { mode: 'Bike', speed: 16, carbon: 0.0 },
          { mode: 'Walking', speed: 5, carbon: 0.0 }
        ];

        const routes = modes.map(item => {
          const travelMins = Math.round((distanceKm / item.speed) * 60);
          let leaveMins = eventStartMinutes - (prepMins + travelMins + 10);
          if (leaveMins < 0) leaveMins += 1440;
          const recLeave = `${String(Math.floor(leaveMins / 60)).padStart(2, '0')}:${String(leaveMins % 60).padStart(2, '0')}`;
          return {
            mode: item.mode,
            distanceKm,
            travelTimeMinutes: travelMins,
            recommendedLeaveTime: recLeave,
            carbonKg: item.carbon
          };
        });

        const selectedRoute = routes[0];
        return {
          ...e,
          routes,
          selectedTransportMode: selectedRoute.mode,
          preparationTimeMinutes: prepMins,
          bufferTimeMinutes: 10,
          recommendedLeaveTime: selectedRoute.recommendedLeaveTime,
          arrivalStatus: 'On Time'
        };
      }
      return e;
    }));
  };

  const selectEventRouteMode = (eventId: string, mode: TransportMode) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId && e.routes) {
        const route = e.routes.find(r => r.mode === mode);
        if (route) {
          return {
            ...e,
            selectedTransportMode: mode,
            recommendedLeaveTime: route.recommendedLeaveTime
          };
        }
      }
      return e;
    }));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Finance Actions & Savings Deposit Allocator
  const addTransaction = (tx: Partial<Transaction>) => {
    const amount = tx.amount || 0;
    const type = tx.type || 'Expense';
    const accId = tx.accountId || accounts[0]?.id || 'acc-1';

    const created: Transaction = {
      id: `tx-${Date.now()}`,
      title: tx.title || 'Untitled Transaction',
      amount,
      type,
      category: tx.category || 'General',
      accountId: accId,
      date: tx.date || new Date().toISOString().split('T')[0],
      notes: tx.notes
    };

    setTransactions(prev => [created, ...prev]);

    setAccounts(prev => prev.map(acc => {
      if (acc.id === accId) {
        const delta = type === 'Income' ? amount : -amount;
        return { ...acc, balance: acc.balance + delta };
      }
      return acc;
    }));
  };

  const depositToSavingsGoal = (goalId: string, amount: number, accountId: string) => {
    setSavingsGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return { ...g, currentAmount: g.currentAmount + amount };
      }
      return g;
    }));

    // Deduct from checking account
    setAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        return { ...acc, balance: acc.balance - amount };
      }
      return acc;
    }));

    // Log transaction
    setTransactions(prev => [
      {
        id: `tx-savings-${Date.now()}`,
        title: `Savings Allocation to Goal`,
        amount,
        type: 'Expense',
        category: 'Savings',
        accountId,
        date: new Date().toISOString().split('T')[0]
      },
      ...prev
    ]);
  };

  const addBill = (bill: Partial<Bill>) => {
    const created: Bill = {
      id: `bill-${Date.now()}`,
      title: bill.title || 'New Bill',
      amount: bill.amount || 0,
      dueDate: bill.dueDate || '2026-10-01',
      category: bill.category || 'Utilities',
      isPaid: false,
      autoPay: bill.autoPay ?? false,
      recurringFrequency: bill.recurringFrequency || 'Monthly'
    };
    setBills(prev => [...prev, created]);
  };

  const toggleBillPaid = (id: string) => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, isPaid: !b.isPaid } : b));
  };

  // Health Actions
  const addMeal = (meal: Partial<Meal>) => {
    const created: Meal = {
      id: `meal-${Date.now()}`,
      type: meal.type || 'Lunch',
      title: meal.title || 'Logged Meal',
      calories: meal.calories || 350,
      proteinGrams: meal.proteinGrams || 25,
      carbsGrams: meal.carbsGrams || 40,
      fatsGrams: meal.fatsGrams || 10,
      timeLogged: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMeals(prev => [...prev, created]);
  };

  const addWorkout = (workout: Partial<ExerciseWorkout>) => {
    const created: ExerciseWorkout = {
      id: `w-${Date.now()}`,
      title: workout.title || 'Exercise Session',
      category: workout.category || 'Cardio',
      durationMinutes: workout.durationMinutes || 30,
      caloriesBurned: workout.caloriesBurned || 200,
      completed: true,
      scheduledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sets: [
        { setNumber: 1, reps: 10, completed: true },
        { setNumber: 2, reps: 10, completed: true }
      ]
    };
    setWorkouts(prev => [...prev, created]);
  };

  const toggleWorkoutComplete = (id: string) => {
    setWorkouts(prev => prev.map(w => w.id === id ? { ...w, completed: !w.completed } : w));
  };

  const toggleWorkoutSetComplete = (workoutId: string, setNumber: number) => {
    setWorkouts(prev => prev.map(w => {
      if (w.id === workoutId && w.sets) {
        const nextSets = w.sets.map(s => s.setNumber === setNumber ? { ...s, completed: !s.completed } : s);
        const allDone = nextSets.every(s => s.completed);
        return { ...w, sets: nextSets, completed: allDone };
      }
      return w;
    }));
  };

  const addWaterGlass = () => {
    setHydration(prev => {
      const nextGlasses = prev.glassCount + 1;
      const nextLiters = Math.min(prev.targetLiters, Number((nextGlasses * 0.25).toFixed(2)));
      return { ...prev, glassCount: nextGlasses, consumedLiters: nextLiters };
    });
  };

  const togglePrayerComplete = (id: string) => {
    setSpiritual(prev => {
      const updatedList = prev.prayerList.map(p => p.id === id ? { ...p, completed: !p.completed } : p);
      const count = updatedList.filter(p => p.completed).length;
      return { ...prev, prayerList: updatedList, prayersCompletedToday: count };
    });
  };

  const toggleBibleReading = () => {
    setSpiritual(prev => ({ ...prev, bibleReadingCompleted: !prev.bibleReadingCompleted }));
  };

  const addSymptom = (symptom: Partial<SymptomLog>) => {
    const created: SymptomLog = {
      id: `sym-${Date.now()}`,
      symptom: symptom.symptom || 'Unspecified Symptom',
      severity: symptom.severity || 'Mild',
      dateLogged: new Date().toISOString().split('T')[0],
      notes: symptom.notes
    };
    setSymptoms(prev => [created, ...prev]);
  };

  const updateJournal = (text: string) => {
    setSpiritual(prev => ({ ...prev, journalEntry: text }));
  };

  const addGratitudeNote = (note: string) => {
    if (!note.trim()) return;
    setSpiritual(prev => ({ ...prev, gratitudeNotes: [...prev.gratitudeNotes, note] }));
  };

  const togglePlanBlockComplete = (id: string) => {
    setDailyPlan(prev => prev.map(block => block.id === id ? { ...block, completed: !block.completed } : block));
  };

  const autoResolveScheduleConflicts = () => {
    setDailyPlan(prev => prev.map(block => {
      if (block.hasConflict) {
        return {
          ...block,
          timeSlot: '11:15 - 12:15',
          hasConflict: false,
          subtitle: 'Auto-rescheduled by HubWork Engine'
        };
      }
      return block;
    }));
  };

  const exportDailyReport = () => {
    const reportText = `HUBWORK DAILY OPERATING REPORT
Date: ${userProfile.currentDate}
User: ${userProfile.name}

TASKS SUMMARY:
Completed: ${tasks.filter(t => t.status === 'Completed').length} / ${tasks.length}
Task Completion: ${taskCompletionPercent}%

FINANCE SUMMARY:
Total Balance: $${totalBalance.toFixed(2)}
Monthly Income: $${monthlyIncome.toFixed(2)}
Monthly Expenses: $${monthlyExpenses.toFixed(2)}

HEALTH SUMMARY:
Health Score: ${healthScore} / 100
Water: ${hydration.consumedLiters}L / ${hydration.targetLiters}L
Sleep: ${sleep.durationHours}h ${sleep.durationMinutes}m
Calories Logged: ${meals.reduce((acc, m) => acc + m.calories, 0)} kcal

SPIRITUAL:
Prayers Completed: ${spiritual.prayersCompletedToday} / ${spiritual.targetPrayers}
Bible Reading: ${spiritual.bibleReadingCompleted ? 'Done' : 'Pending'}
`;

    const element = document.createElement('a');
    const file = new Blob([reportText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `HubWork-Daily-Report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Metrics
  const totalBalance = useMemo(() => accounts.reduce((acc, a) => acc + a.balance, 0), [accounts]);
  const monthlyIncome = useMemo(() => transactions.filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0), [transactions]);
  const monthlyExpenses = useMemo(() => transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0), [transactions]);

  const totalCaloriesLogged = useMemo(() => meals.reduce((acc, m) => acc + m.calories, 0), [meals]);
  const totalProteinLogged = useMemo(() => meals.reduce((acc, m) => acc + m.proteinGrams, 0), [meals]);
  const totalCarbsLogged = useMemo(() => meals.reduce((acc, m) => acc + m.carbsGrams, 0), [meals]);
  const totalFatsLogged = useMemo(() => meals.reduce((acc, m) => acc + m.fatsGrams, 0), [meals]);

  const taskCompletionPercent = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100);
  }, [tasks]);

  const scheduleConflictsCount = useMemo(() => dailyPlan.filter(b => b.hasConflict).length, [dailyPlan]);

  const healthScore = useMemo(() => {
    let score = 70;
    if (hydration.consumedLiters >= hydration.targetLiters) score += 10;
    if (sleep.durationHours >= 7) score += 10;
    if (workouts.some(w => w.completed)) score += 5;
    if (spiritual.bibleReadingCompleted) score += 5;
    return Math.min(100, score);
  }, [hydration, sleep, workouts, spiritual]);

  const smartAlerts = useMemo<SmartAlert[]>(() => {
    const alerts: SmartAlert[] = [];

    if (scheduleConflictsCount > 0) {
      alerts.push({
        id: 'alt-conflict',
        title: `Schedule Overlap Detected`,
        description: `${scheduleConflictsCount} time slot conflict detected in today's daily plan. Click Auto-Resolve to reschedule.`,
        module: 'System',
        severity: 'critical',
        actionText: 'Auto-Resolve',
        createdAt: 'Just now'
      });
    }

    const nextTravelEvent = events.find(e => e.recommendedLeaveTime && !e.isOnline);
    if (nextTravelEvent) {
      alerts.push({
        id: 'alt-travel',
        title: `Departure Reminder: ${nextTravelEvent.title}`,
        description: `Recommended leave time is ${nextTravelEvent.recommendedLeaveTime} via ${nextTravelEvent.selectedTransportMode || 'Driving'}.`,
        module: 'Events',
        severity: 'warning',
        actionText: 'View Routes',
        createdAt: 'Just now'
      });
    }

    return alerts;
  }, [scheduleConflictsCount, events]);

  return (
    <HubWorkContext.Provider
      value={{
        userProfile,
        tasks,
        events,
        accounts,
        transactions,
        bills,
        debts,
        budgets,
        savingsGoals,
        vitals,
        sleep,
        hydration,
        meals,
        workouts,
        medicalRecords,
        symptoms,
        spiritual,
        dailyPlan,
        smartAlerts,

        addTask,
        toggleTaskComplete,
        toggleChecklistItem,
        addChecklistItem,
        updateTaskStatus,
        deleteTask,
        convertTaskToEvent,

        addEvent,
        calculateMultiModeRoutes,
        selectEventRouteMode,
        deleteEvent,

        addTransaction,
        addBill,
        toggleBillPaid,
        depositToSavingsGoal,

        addMeal,
        addWorkout,
        toggleWorkoutComplete,
        toggleWorkoutSetComplete,
        addWaterGlass,
        togglePrayerComplete,
        toggleBibleReading,
        addSymptom,
        updateJournal,
        addGratitudeNote,
        togglePlanBlockComplete,
        autoResolveScheduleConflicts,
        exportDailyReport,

        activeTab,
        setActiveTab,

        isQuickActionOpen,
        setIsQuickActionOpen,
        quickActionDefaultTab,
        openQuickActionWithTab,

        isSearchOpen,
        setIsSearchOpen,

        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        totalCaloriesLogged,
        totalProteinLogged,
        totalCarbsLogged,
        totalFatsLogged,
        healthScore,
        taskCompletionPercent,
        scheduleConflictsCount
      }}
    >
      {children}
    </HubWorkContext.Provider>
  );
};

export const useHubWork = () => {
  const context = useContext(HubWorkContext);
  if (!context) {
    throw new Error('useHubWork must be used within a HubWorkProvider');
  }
  return context;
};
