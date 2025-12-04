import { Job, User } from '../types';
import { JobStage } from '../types';

const JOBS_KEY = 'shop_manager_jobs';
const USER_KEY = 'shop_manager_user';

export function getJobs(): Job[] {
  try {
    const v = localStorage.getItem(JOBS_KEY);
    return v ? JSON.parse(v) : [];
  } catch {
    return [];
  }
}

export function saveJobs(jobs: Job[]) {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

export function seedData(): Job[] {
  const now = Date.now();
  const j: Job = {
    id: 'JOB-1001',
    type: 'General',
    title: 'Sample Job',
    currentStage: JobStage.COUNTER as any,
    assignedTo: 'Unassigned',
    createdAt: now,
    updatedAt: now,
    history: [{ stage: JobStage.COUNTER as any, timestamp: now }]
  } as any;
  saveJobs([j]);
  return [j];
}

export function getCurrentUser(): User | null {
  try {
    const v = localStorage.getItem(USER_KEY);
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}

export function loginUser(u: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(u));
}

export function logoutUser() {
  localStorage.removeItem(USER_KEY);
}
