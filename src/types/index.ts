export type TabType = 'home' | 'tasks' | 'schedule' | 'finance' | 'health';

// Task Types
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 'Work' | 'Personal' | 'Finance' | 'Health' | 'Study' | 'Shopping';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  subtasks: { id: string; title: string; completed: boolean }[];
  createdAt: string;
}

// Schedule Types
export type EventCategory = 'Work' | 'Personal' | 'Meeting' | 'Health' | 'Finance' | 'Other';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location?: string;
  color?: string;
}

// Finance Types
export type TransactionType = 'income' | 'expense';
export type FinanceCategory =
  | 'Salary'
  | 'Freelance'
  | 'Investments'
  | 'Food & Dining'
  | 'Housing'
  | 'Transportation'
  | 'Shopping'
  | 'Entertainment'
  | 'Healthcare'
  | 'Bills & Utilities'
  | 'Other';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: FinanceCategory;
  date: string; // YYYY-MM-DD
}

export interface BudgetGoal {
  category: FinanceCategory;
  limit: number;
}

// Health Types
export interface HealthLog {
  date: string; // YYYY-MM-DD
  waterGlasses: number; // e.g. 8 target
  steps: number; // e.g. 10000 target
  sleepHours: number; // e.g. 8 hrs
  mood: 'great' | 'good' | 'okay' | 'tired' | 'stressed';
  workouts: {
    id: string;
    type: string; // e.g. 'Running', 'Yoga', 'Gym', 'Cycling'
    durationMinutes: number;
    caloriesBurned: number;
  }[];
  notes?: string;
}

// Initial/Sample Data interface
export interface AppData {
  tasks: Task[];
  events: CalendarEvent[];
  transactions: Transaction[];
  budgets: BudgetGoal[];
  healthLogs: Record<string, HealthLog>; // keyed by date YYYY-MM-DD
}
