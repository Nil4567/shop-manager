export enum JobStage {
  COUNTER = 'Counter',
  DESIGN = 'Design',
  PRODUCTION = 'Production', // Job Creator/Printer
  FINISHING = 'Finishing',
  CASHIER = 'Cashier',
  COMPLETED = 'Completed'
}

export type UserRole = 'Admin' | 'Manager' | 'Counter' | 'Designer' | 'Production' | 'Finisher' | 'Cashier';

export interface User {
  id: string;
  username: string;
  password: string; // Stored simply for this demo
  name: string;
  role: UserRole;
  isActive: boolean;
}

export interface JobHistory {
  stage: JobStage;
  timestamp: number;
  note?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalVisits: number;
  lastVisit: number;
}

export interface Job {
  id: string;
  customerName: string;
  customerContact: string;
  customerEmail: string;
  description: string;
  type: 'Xerox' | 'Print' | 'Design' | 'Binding' | 'Large Format';
  priority: 'Low' | 'Normal' | 'Urgent';
  currentStage: JobStage;
  assignedTo: string;
  price: number;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  history: JobHistory[];
}

export interface StageTatStats {
  stage: JobStage;
  avgTimeMinutes: number;
  avgTimeDays: number;
}

export interface DailyCashSummary {
  date: string;
  amount: number;
  count: number;
}

export interface DashboardStats {
  totalJobs: number;
  pendingJobs: number;
  completedToday: number;
  revenueToday: number;
  avgTatMinutes: number;
}