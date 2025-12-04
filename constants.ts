import { JobStage } from './types';

export const APP_VERSION = '1.1.0';

export const STAGE_COLORS: Record<JobStage, string> = {
  [JobStage.COUNTER]: 'bg-slate-100 text-slate-700 border-slate-300',
  [JobStage.DESIGN]: 'bg-blue-100 text-blue-700 border-blue-300',
  [JobStage.PRODUCTION]: 'bg-purple-100 text-purple-700 border-purple-300',
  [JobStage.FINISHING]: 'bg-orange-100 text-orange-700 border-orange-300',
  [JobStage.CASHIER]: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  [JobStage.COMPLETED]: 'bg-gray-200 text-gray-500 border-gray-300',
};

export const STAGE_ORDER = [
  JobStage.COUNTER,
  JobStage.DESIGN,
  JobStage.PRODUCTION,
  JobStage.FINISHING,
  JobStage.CASHIER,
  JobStage.COMPLETED,
];

export const EMPLOYEES = [
  'Alice (Counter)',
  'Bob (Designer)',
  'Charlie (Production)',
  'David (Finisher)',
  'Eva (Cashier)',
];

// Map stages to the person who typically handles that stage
export const STAGE_DEFAULT_ASSIGNEE: Record<JobStage, string> = {
  [JobStage.COUNTER]: 'Alice (Counter)',
  [JobStage.DESIGN]: 'Bob (Designer)',
  [JobStage.PRODUCTION]: 'Charlie (Production)',
  [JobStage.FINISHING]: 'David (Finisher)',
  [JobStage.CASHIER]: 'Eva (Cashier)',
  [JobStage.COMPLETED]: 'Eva (Cashier)',
};

// Fallback values for data migration (Future Proofing)
// If a new feature adds a field, old backups won't crash
export const JOB_DEFAULTS = {
  customerName: 'Unknown Customer',
  type: 'Print',
  priority: 'Normal',
  currentStage: JobStage.COUNTER,
  price: 0,
  assignedTo: 'Unassigned',
  description: 'No description provided',
};

/**
 * Determines the next stage based on current stage and job type.
 * Smart Workflow: Xerox jobs skip the DESIGN stage.
 */
export const getNextStage = (currentStage: JobStage, jobType: string): JobStage | null => {
  const currentIndex = STAGE_ORDER.indexOf(currentStage);
  
  // Standard End of Line
  if (currentIndex >= STAGE_ORDER.length - 1) return null;

  let nextStage = STAGE_ORDER[currentIndex + 1];

  // Exception: Xerox jobs skip DESIGN and go straight to PRODUCTION
  if (jobType === 'Xerox' && nextStage === JobStage.DESIGN) {
    const designIndex = STAGE_ORDER.indexOf(JobStage.DESIGN);
    nextStage = STAGE_ORDER[designIndex + 1]; // Move to Production
  }

  return nextStage;
};
