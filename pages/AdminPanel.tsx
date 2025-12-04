import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, Job, JobStage, DailyCashSummary, Customer } from '../types';
import { getUsers, saveUsers, getCustomers, restoreDatabase, getJobs } from '../services/storageService';
import { exportDatabaseToExcel, importDatabaseFromExcel } from '../services/excelService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

interface AdminPanelProps {
  jobs: Job[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ jobs }) => {
  const [users, setUsers] = useState<User[]>(getUsers());
  const [activeSubTab, setActiveSubTab] = useState<'finance' | 'users' | 'database'>('finance');
  
  // Stats for Diagnostics
  const [stats, setStats] = useState({ jobCount: 0, customerCount: 0, userCount: 0, dbSize: '0 KB' });

  // User Management State
  const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'Counter' });

  // Database State
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Calculate simple storage stats
    const j = jobs.length;
    const c = getCustomers().length;
    const u = users.length;
    // Rough estimate of localStorage usage
    const totalChars = JSON.stringify(jobs).length + JSON.stringify(getCustomers()).length + JSON.stringify(users).length;
    const sizeKB = (totalChars / 1024).toFixed(2);
    setStats({ jobCount: j, customerCount: c, userCount: u, dbSize: `${sizeKB} KB` });
  }, [jobs, users]);

  // --- Financials Logic ---
  const dailyCashData: DailyCashSummary[] = useMemo(() => {
    const summary: Record<string, DailyCashSummary> = {};
    
    jobs.forEach(job => {
      if (job.currentStage === JobStage.COMPLETED && job.completedAt) {
        const dateKey = new Date(job.completedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        
        if (!summary[dateKey]) {
          summary[dateKey] = { date: dateKey, amount: 0, count: 0 };
        }
        
        summary[dateKey].amount += job.price;
        summary[dateKey].count += 1;
      }
    });

    return Object.values(summary).reverse().slice(0, 14).reverse(); 
  }, [jobs]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password) return;

    const userToAdd: User = {
      id: `u-${Date.now()}`,
      username: newUser.username,
      password: newUser.password,
      name: newUser.name,
      role: newUser.role as any,
      isActive: true
    };
    
    const updatedUsers = [...users, userToAdd];
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    setNewUser({ username: '', password: '', name: '', role: 'Counter' });
  };

  const deleteUser = (id: string) => {
    if (window.confirm('Delete user?')) {
      const updated = users.filter(u => u.id !== id);
      setUsers(updated);
      saveUsers(updated);
    }
  };

  const handleBackup = () => {
    const customers = getCustomers();
    exportDatabaseToExcel(jobs, customers, users);
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (window.confirm("WARNING: This will OVERWRITE all current data with the data from the Excel file. Continue?")) {
      try {
        const data = await importDatabaseFromExcel(file);
        restoreDatabase(data);
        alert("Database restored successfully! The page will reload.");
        window.location.reload();
      } catch (err) {
        console.error(err);
        alert("Failed to restore database. Please check the file format.");
      }
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-200 pb-2 overflow-x-auto">
        <button 
          onClick={() => setActiveSubTab('finance')}
          className={`px-4 py-2 font-medium rounded-lg transition-colors whitespace-nowrap ${activeSubTab === 'finance' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          Daily Cash Summary
        </button>
        <button 
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2 font-medium rounded-lg transition-colors whitespace-nowrap ${activeSubTab === 'users' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          User Management
        </button>
        <button 
          onClick={() => setActiveSubTab('database')}
          className={`px-4 py-2 font-medium rounded-lg transition-colors whitespace-nowrap ${activeSubTab === 'database' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          Database & Drive
        </button>
      </div>

      {activeSubTab === 'finance' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Trend (Last 14 Days)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyCashData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{fontSize: 12}} />
                  <YAxis tickFormatter={(val) => `₹${val}`} />
                  <RechartsTooltip formatter={(val) => `₹${val}`} />
                  <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jobs Completed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Collection</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dailyCashData.map((day) => (
                  <tr key={day.date}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{day.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">₹{day.amount}</td>
                  </tr>
                ))}
                 {dailyCashData.length === 0 && (
                   <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">No data available</td></tr>
                 )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Create New User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input required type="text" className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-indigo-500" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username (Gmail ID)</label>
                <input required type="text" placeholder="e.g. shop@gmail.com" className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-indigo-500" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input required type="password" className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-indigo-500" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-indigo-500" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="Counter">Counter Staff</option>
                  <option value="Designer">Designer</option>
                  <option value="Production">Production</option>
                  <option value="Finisher">Finisher</option>
                  <option value="Cashier">Cashier</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">Add User</button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-4 bg-yellow-50 border-b border-yellow-100 text-yellow-800 text-sm">
                <strong>Note:</strong> Only users with the <strong>Admin</strong> role can access this Admin Panel and the Database Backup tools.
             </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                          {u.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{u.name}</div>
                          <div className="text-xs text-gray-500">{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {u.username !== 'admin' && (
                        <button onClick={() => deleteUser(u.id)} className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded hover:bg-red-100 transition-colors">Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'database' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">Database & Cloud Sync</h3>
              <p className="text-gray-500 text-sm">Manage your shop data and synchronize with Google Drive.</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="text-center">
                <span className="block text-lg font-bold text-slate-700">{stats.jobCount}</span>
                <span className="text-[10px] uppercase text-slate-400 font-bold">Jobs</span>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="text-center">
                 <span className="block text-lg font-bold text-slate-700">{stats.customerCount}</span>
                 <span className="text-[10px] uppercase text-slate-400 font-bold">Customers</span>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
               <div className="text-center">
                 <span className="block text-lg font-bold text-slate-700">{stats.dbSize}</span>
                 <span className="text-[10px] uppercase text-slate-400 font-bold">Size</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Backup Section */}
            <div className="border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-8 rounded-xl flex flex-col items-center text-center shadow-sm">
              <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-3xl shadow-inner">
                📥
              </div>
              <h4 className="text-lg font-bold text-indigo-900 mb-2">1. Backup to Excel</h4>
              <p className="text-sm text-indigo-700/80 mb-6 px-4">
                Download your entire database as a <strong>.xlsx</strong> file. Upload this file to your <strong>Google Drive</strong> folder for safe keeping and cloud access.
              </p>
              <button 
                onClick={handleBackup}
                className="w-full max-w-xs px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Backup File
              </button>
            </div>

            {/* Restore Section */}
            <div className="border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-8 rounded-xl flex flex-col items-center text-center shadow-sm">
              <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-3xl shadow-inner">
                📤
              </div>
              <h4 className="text-lg font-bold text-emerald-900 mb-2">2. Restore from Drive</h4>
              <p className="text-sm text-emerald-700/80 mb-6 px-4">
                Working from a new location? Download your backup from Google Drive and upload it here to restore your shop's data instantly.
              </p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".xlsx, .xls" 
                onChange={handleFileChange}
              />
              <button 
                onClick={handleRestoreClick}
                className="w-full max-w-xs px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Select File & Restore
              </button>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
             <div className="text-blue-500 mt-1">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
               </svg>
             </div>
             <div>
               <h5 className="font-bold text-blue-900 text-sm">Security Tip</h5>
               <p className="text-xs text-blue-800 mt-1">
                 Ensure your Google Drive folder is shared only with the specific Gmail IDs of your authorized Admin staff. This software processes data locally; your data privacy depends on who has access to your backup files.
               </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;