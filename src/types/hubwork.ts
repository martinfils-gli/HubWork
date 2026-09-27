export type CategoryType = 'Personal' | 'Education' | 'Work' | 'Freelance' | 'Medical' | 'Travel' | 'Family' | 'Finance' | 'Fitness' | 'Spiritual';

export type TaskStatus = 'Inbox' | 'Planned' | 'In Progress' | 'Waiting' | 'Blocked' | 'Completed' | 'Cancelled' | 'Archived';
export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: CategoryType;
  subcategory?: string;
  project?: string;
  status: TaskStatus;
  priority: PriorityLevel;
  startDate?: string;
  dueDate: string; // ISO Date YYYY-MM-DD or string
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  estimatedDurationMinutes?: number;
  actualDurationMinutes?: number;
  location?: string;
  assignee?: string;
  collaborators?: string[];
  tags?: string[];
  checklist?: { id: string; text: string; completed: boolean }[];
  dependencies?: string[]; // Task IDs required before this task
  recurrence?: 'Daily' | 'Weekly' | 'Monthly' | 'None';
  linkedEventId?: string; // Connection to Events
  linkedExpenseId?: string; // Connection to Finance
  linkedHealthId?: string; // Connection to Health
  completionPercent: number;
  createdAt: string;
  updatedAt: string;
}

export type TransportMode = 'Walking' | 'Bike' | 'Scooter' | 'Bus' | 'Tram' | 'Metro' | 'Taxi' | 'Ride-hailing' | 'Driving' | 'Public Transport';

export interface EventItem {
  id: string;
  title: string;
  description?: string;
  category: CategoryType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  timeZone: string;
  organizer?: string;
  participants?: string[];
  location?: string;
  isOnline: boolean;
  meetingLink?: string;
  notes?: string;
  linkedTaskId?: string;
  // Punctuality & Travel Engine
  originLocation?: string;
  transportMode?: TransportMode;
  distanceKm?: number;
  estimatedTravelTimeMinutes?: number;
  preparationTimeMinutes?: number;
  bufferTimeMinutes?: number;
  recommendedLeaveTime?: string; // HH:mm
  arrivalStatus?: 'On Time' | 'At Risk' | 'Late' | 'Arrived';
  recurring?: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'None';
  syncedToGoogle?: boolean;
  syncedToApple?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AccountType = 'Bank Account' | 'Cash Wallet' | 'Savings Account' | 'Credit Card' | 'Digital Wallet' | 'Investment';
export type TransactionType = 'Income' | 'Expense' | 'Transfer' | 'Refund';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  accountNumberMasked?: string;
  color?: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  accountId: string;
  date: string; // YYYY-MM-DD
  isRecurring?: boolean;
  linkedTaskId?: string;
  linkedEventId?: string;
  notes?: string;
}

export interface Bill {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  category: string;
  isPaid: boolean;
  autoPay: boolean;
  recurringFrequency: 'Monthly' | 'Yearly' | 'Weekly';
}

export interface DebtLoan {
  id: string;
  title: string;
  type: 'Owed To Others' | 'Owed To Me' | 'Bank Loan' | 'Personal Loan';
  totalAmount: number;
  remainingBalance: number;
  monthlyInstallment?: number;
  interestRate?: number;
  nextPaymentDate: string;
  dueDate: string;
  lenderOrBorrower: string;
}

export interface BudgetCategory {
  id: string;
  category: string;
  allocatedAmount: number;
  spentAmount: number;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
}

export interface HealthVitals {
  weightKg: number;
  heightCm: number;
  bmi: number;
  heartRateBpm: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  bodyTemperatureC: number;
  bloodOxygenPercent: number;
  updatedAt: string;
}

export interface SleepData {
  bedtime: string; // HH:mm
  wakeTime: string; // HH:mm
  durationHours: number;
  durationMinutes: number;
  qualityPercent: number;
  targetHours: number;
}

export interface HydrationData {
  targetLiters: number;
  consumedLiters: number;
  glassCount: number;
  glassSizeMl: number;
}

export interface Meal {
  id: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  title: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  timeLogged: string;
}

export interface ExerciseWorkout {
  id: string;
  title: string;
  category: 'Walking' | 'Running' | 'Cycling' | 'Strength' | 'Cardio' | 'Stretching' | 'Mobility';
  durationMinutes: number;
  caloriesBurned: number;
  setsRepsInfo?: string;
  completed: boolean;
  scheduledTime?: string;
}

export interface MedicalRecord {
  id: string;
  title: string;
  type: 'Appointment' | 'Medication' | 'Diagnosis' | 'Test Result';
  doctorName?: string;
  dosage?: string;
  frequency?: string;
  nextDoseTime?: string;
  notes?: string;
}

export interface SymptomLog {
  id: string;
  symptom: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  dateLogged: string;
  notes?: string;
}

export interface SpiritualData {
  prayersCompletedToday: number;
  targetPrayers: number;
  prayerList: { id: string; title: string; time: string; completed: boolean }[];
  bibleReadingCompleted: boolean;
  biblePassageToday: string;
  devotionMinutes: number;
  journalEntry?: string;
  gratitudeNotes: string[];
}

export interface DailyPlanBlock {
  id: string;
  timeSlot: string; // e.g. "07:00 - 08:00"
  period: 'Morning' | 'Work' | 'Education' | 'Personal' | 'Freelance' | 'Meals' | 'Exercise' | 'Prayer' | 'Evening';
  title: string;
  type: 'Task' | 'Event' | 'Meal' | 'Workout' | 'Prayer' | 'Routine';
  linkedId?: string;
  completed: boolean;
  location?: string;
  subtitle?: string;
}

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface SmartAlert {
  id: string;
  title: string;
  description: string;
  module: 'Tasks' | 'Events' | 'Finance' | 'Health' | 'System';
  severity: AlertSeverity;
  actionText?: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  avatarUrl?: string;
  location: string;
  weatherTempC: number;
  weatherCondition: string;
  currentDate: string; // e.g. "Saturday, 26 September 2026"
  currentTime: string;
  dayProgressPercent: number;
  healthScore: number;
}
