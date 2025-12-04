import { Job, JobStage, Customer, User } from '../types';

const JOBS_KEY = 'printflow_jobs_v2';
const CUSTOMERS_KEY = 'printflow_customers_v1';
const USERS_KEY = 'printflow_users_v1';
const AUTH_KEY = 'printflow_current_user';

// --- Jobs ---

export const getJobs = (): Job[] => {
  try {
    const data = localStorage.getItem(JOBS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load jobs', e);
    return [];
  }
};

export const saveJobs = (jobs: Job[]) => {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
};

// --- Customers ---

export const getCustomers = (): Customer[] => {
  try {
    const data = localStorage.getItem(CUSTOMERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load customers', e);
    return [];
  }
};

export const saveCustomers = (customers: Customer[]) => {
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
};

export const saveOrUpdateCustomer = (name: string, phone: string, email: string) => {
  const customers = getCustomers();
  const existingIndex = customers.findIndex(c => c.name.toLowerCase() === name.toLowerCase());
  
  const now = Date.now();

  if (existingIndex >= 0) {
    // Update existing
    customers[existingIndex] = {
      ...customers[existingIndex],
      phone: phone || customers[existingIndex].phone,
      email: email || customers[existingIndex].email,
      lastVisit: now,
      totalVisits: (customers[existingIndex].totalVisits || 0) + 1
    };
  } else {
    // Create new
    const newCustomer: Customer = {
      id: `CUST-${Date.now()}`,
      name,
      phone,
      email,
      lastVisit: now,
      totalVisits: 1
    };
    customers.push(newCustomer);
  }
  saveCustomers(customers);
};

// --- Users ---

export const getUsers = (): User[] => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : null;
};

export const loginUser = (user: User) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
};

export const logoutUser = () => {
  localStorage.removeItem(AUTH_KEY);
};

// --- Database Restoration ---

export const restoreDatabase = (data: { jobs: Job[], customers: Customer[], users: User[] }) => {
  if (data.jobs) saveJobs(data.jobs);
  if (data.customers) saveCustomers(data.customers);
  if (data.users) saveUsers(data.users);
};

export const seedData = (): Job[] => {
  const now = Date.now();
  const hour = 3600000;
  const day = 24 * hour;
  
  // Seed Users if empty
  const users = getUsers();
  if (users.length === 0) {
    saveUsers([
      { id: 'u1', username: 'admin', password: '123', name: 'System Admin', role: 'Admin', isActive: true },
      { id: 'u2', username: 'alice', password: '123', name: 'Alice (Counter)', role: 'Counter', isActive: true },
      { id: 'u3', username: 'bob', password: '123', name: 'Bob (Designer)', role: 'Designer', isActive: true },
      { id: 'u4', username: 'eva', password: '123', name: 'Eva (Cashier)', role: 'Cashier', isActive: true },
    ]);
  }

  const mockJobs: Job[] = [
    {
      id: 'JOB-1001',
      customerName: 'Acme Corp',
      customerContact: '9876543210',
      customerEmail: 'contact@acme.com',
      description: '500 Business Cards',
      type: 'Print',
      priority: 'Urgent',
      currentStage: JobStage.DESIGN,
      assignedTo: 'Bob (Designer)',
      price: 1500,
      createdAt: now - 4 * hour,
      updatedAt: now - 2 * hour,
      history: [
        { stage: JobStage.COUNTER, timestamp: now - 4 * hour },
        { stage: JobStage.DESIGN, timestamp: now - 2 * hour },
      ]
    },
    {
      id: 'JOB-1002',
      customerName: 'Amit Sharma',
      customerContact: '9988776655',
      customerEmail: 'amit.sharma@example.com',
      description: 'Thesis Binding',
      type: 'Binding',
      priority: 'Normal',
      currentStage: JobStage.FINISHING,
      assignedTo: 'David (Finisher)',
      price: 300,
      createdAt: now - 5 * hour,
      updatedAt: now - 1 * hour,
      history: [
        { stage: JobStage.COUNTER, timestamp: now - 5 * hour },
        { stage: JobStage.PRODUCTION, timestamp: now - 3 * hour },
        { stage: JobStage.FINISHING, timestamp: now - 1 * hour },
      ]
    },
    {
      id: 'JOB-900', // Completed yesterday
      customerName: 'Local Gym',
      customerContact: '8888888888',
      customerEmail: '',
      description: 'Flyers',
      type: 'Print',
      priority: 'Normal',
      currentStage: JobStage.COMPLETED,
      assignedTo: 'Eva (Cashier)',
      price: 5000,
      createdAt: now - 2 * day,
      updatedAt: now - 1.5 * day,
      completedAt: now - 1.5 * day,
      history: [
         { stage: JobStage.COUNTER, timestamp: now - 2 * day },
         { stage: JobStage.DESIGN, timestamp: now - 1.9 * day },
         { stage: JobStage.PRODUCTION, timestamp: now - 1.8 * day },
         { stage: JobStage.CASHIER, timestamp: now - 1.6 * day },
         { stage: JobStage.COMPLETED, timestamp: now - 1.5 * day },
      ]
    }
  ];
  saveJobs(mockJobs);
  
  const seedCustomers: Customer[] = [
     { id: '1', name: 'Acme Corp', phone: '9876543210', email: 'contact@acme.com', totalVisits: 1, lastVisit: now },
     { id: '2', name: 'Amit Sharma', phone: '9988776655', email: 'amit.sharma@example.com', totalVisits: 1, lastVisit: now },
  ];
  saveCustomers(seedCustomers);

  return mockJobs;
};