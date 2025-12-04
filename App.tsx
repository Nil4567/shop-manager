import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import JobBoard from './pages/JobBoard';
import NewJob from './pages/NewJob';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import { Job, JobStage, JobHistory, User } from './types';
import { getJobs, saveJobs, seedData, getCurrentUser, loginUser, logoutUser } from './services/storageService';
import { STAGE_DEFAULT_ASSIGNEE, getNextStage } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Auth Check
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }

    // Data Load
    const loadedJobs = getJobs();
    if (loadedJobs.length === 0) {
      setJobs(seedData());
    } else {
      setJobs(loadedJobs);
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    loginUser(u);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    logoutUser();
  };

  const handleCreateJob = (newJobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => {
    const now = Date.now();
    const newJob: Job = {
      ...newJobData,
      id: `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: now,
      updatedAt: now,
      history: [{ stage: JobStage.COUNTER, timestamp: now }]
    };
    
    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    saveJobs(updatedJobs);
    setActiveTab('jobs');
  };

  const handleAdvanceJob = (id: string) => {
    const updatedJobs = jobs.map(job => {
      if (job.id === id) {
        const nextStage = getNextStage(job.currentStage, job.type);

        if (nextStage) {
          const now = Date.now();
          
          const historyEntry: JobHistory = {
            stage: nextStage,
            timestamp: now
          };

          const nextAssignee = STAGE_DEFAULT_ASSIGNEE[nextStage] || job.assignedTo;

          return {
            ...job,
            currentStage: nextStage,
            assignedTo: nextAssignee,
            updatedAt: now,
            completedAt: nextStage === JobStage.COMPLETED ? now : undefined,
            history: [...job.history, historyEntry]
          };
        }
      }
      return job;
    });
    setJobs(updatedJobs);
    saveJobs(updatedJobs);
  };

  const handleDeleteJob = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      const updatedJobs = jobs.filter(j => j.id !== id);
      setJobs(updatedJobs);
      saveJobs(updatedJobs);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} user={user} onLogout={handleLogout}>
      {activeTab === 'dashboard' && <Dashboard jobs={jobs} />}
      {activeTab === 'jobs' && (
        <JobBoard 
          jobs={jobs} 
          onAdvance={handleAdvanceJob}
          onDelete={handleDeleteJob}
        />
      )}
      {activeTab === 'new' && (
        <NewJob 
          onSubmit={handleCreateJob} 
          onCancel={() => setActiveTab('jobs')} 
        />
      )}
      {activeTab === 'admin' && user.role === 'Admin' && (
        <AdminPanel jobs={jobs} />
      )}
    </Layout>
  );
};

export default App;
