import * as XLSX from 'xlsx';
import { Job, Customer, User } from '../types';
import { JOB_DEFAULTS } from '../constants';

export const exportDatabaseToExcel = (jobs: Job[], customers: Customer[], users: User[]) => {
  const wb = XLSX.utils.book_new();

  // 1. Jobs Sheet
  // Flatten complex objects for Excel readability if needed, or keep JSON for restore fidelity
  const jobsData = jobs.map(j => ({
    ...j,
    history: JSON.stringify(j.history) // Serialize history to preserve it exactly
  }));
  const wsJobs = XLSX.utils.json_to_sheet(jobsData);
  XLSX.utils.book_append_sheet(wb, wsJobs, "Jobs");

  // 2. Customers Sheet
  const wsCustomers = XLSX.utils.json_to_sheet(customers);
  XLSX.utils.book_append_sheet(wb, wsCustomers, "Customers");

  // 3. Users Sheet
  const wsUsers = XLSX.utils.json_to_sheet(users);
  XLSX.utils.book_append_sheet(wb, wsUsers, "Users");

  // Generate Filename with Date
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `PrintFlow_DB_${dateStr}.xlsx`);
};

export const importDatabaseFromExcel = async (file: File): Promise<{ jobs: Job[], customers: Customer[], users: User[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Parse Jobs with Smart Migration Logic
        const jobsSheet = workbook.Sheets["Jobs"];
        let jobs: Job[] = [];
        if (jobsSheet) {
          const rawJobs = XLSX.utils.sheet_to_json(jobsSheet);
          jobs = rawJobs.map((j: any) => ({
            ...JOB_DEFAULTS, // 1. Apply defaults first (Safe against missing fields)
            ...j,            // 2. Overwrite with actual data from Excel
            // 3. Handle complex fields that need manual parsing
            history: j.history ? JSON.parse(j.history) : [] 
          })) as Job[];
        }

        // Parse Customers
        const custSheet = workbook.Sheets["Customers"];
        let customers: Customer[] = [];
        if (custSheet) {
          customers = XLSX.utils.sheet_to_json(custSheet) as Customer[];
        }

        // Parse Users
        const usersSheet = workbook.Sheets["Users"];
        let users: User[] = [];
        if (usersSheet) {
          users = XLSX.utils.sheet_to_json(usersSheet) as User[];
        }

        resolve({ jobs, customers, users });
      } catch (err) {
        reject(err);
      }
    };
    
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};