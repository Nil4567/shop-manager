import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Job, JobStage, StageTatStats } from '../types';
import { generateShopReport } from '../services/geminiService';
import { STAGE_ORDER } from '../constants';

interface DashboardProps {
  jobs: Job[];
}

const Dashboard: React.FC<DashboardProps> = ({ jobs }) => {
  const [aiReport, setAiReport] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  const stats = useMemo(() => {
    const total = jobs.length;
    const completed = jobs.filter(j => j.currentStage === JobStage.COMPLETED);
    const pending = total - completed.length;
    
    // Calculate Today's Completion
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const completedToday = completed.filter(j => (j.completedAt || 0) > startOfDay.getTime());

    // Revenue
    const realizedRev = completed.reduce((acc, curr) => acc + curr.price, 0);
    const pendingRev = jobs.filter(j => j.currentStage !== JobStage.COMPLETED).reduce((acc, curr) => acc + curr.price, 0);

    return { total, pending, completedToday: completedToday.length, realizedRev, pendingRev };
  }, [jobs]);

  // --- TAT Calculation (Stage-wise) ---
  const tatData: StageTatStats[] = useMemo(() => {
    const stageDurations: Record<JobStage, number[]> = {
      [JobStage.COUNTER]: [],
      [JobStage.DESIGN]: [],
      [JobStage.PRODUCTION]: [],
      [JobStage.FINISHING]: [],
      [JobStage.CASHIER]: [],
      [JobStage.COMPLETED]: [],
    };

    jobs.forEach(job => {
      // Sort history by time to be safe
      const history = [...job.history].sort((a, b) => a.timestamp - b.timestamp);
      
      for (let i = 0; i < history.length - 1; i++) {
        const current = history[i];
        const next = history[i + 1];
        
        // Calculate duration in minutes
        const diffMs = next.timestamp - current.timestamp;
        const diffMins = diffMs / 60000;
        
        if (stageDurations[current.stage]) {
          stageDurations[current.stage].push(diffMins);
        }
      }
    });

    const results: StageTatStats[] = [];
    const relevantStages = [JobStage.DESIGN, JobStage.PRODUCTION, JobStage.FINISHING];
    
    relevantStages.forEach(stage => {
      const times = stageDurations[stage];
      let avgMins = 0;
      if (times.length > 0) {
        avgMins = times.reduce((a, b) => a + b, 0) / times.length;
      }
      
      results.push({
        stage,
        avgTimeMinutes: Math.round(avgMins),
        avgTimeDays: parseFloat((avgMins / 1440).toFixed(2)) // 1440 mins in a day
      });
    });

    return results;
  }, [jobs]);

  const employeeData = useMemo(() => {
    const counts: Record<string, { active: number, completed: number }> = {};
    
    jobs.forEach(j => {
      const name = j.assignedTo.split(' (')[0];
      if (!counts[name]) counts[name] = { active: 0, completed: 0 };
      if (j.currentStage === JobStage.COMPLETED) {
        counts[name].completed += 1;
      } else {
        counts[name].active += 1;
      }
    });

    return Object.keys(counts).map(name => ({
      name,
      active: counts[name].active,
      completed: counts[name].completed,
      total: counts[name].active + counts[name].completed
    })).sort((a,b) => b.total - a.total);
  }, [jobs]);

  const handleAiAnalysis = async () => {
    setLoadingAi(true);
    const report = await generateShopReport(jobs);
    setAiReport(report);
    setLoadingAi(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-orange-400 to-red-500"></div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Pending Jobs</p>
          <div className="flex items-end justify-between mt-3">
            <h3 className="text-4xl font-extrabold text-slate-800">{stats.pending}</h3>
            <span className="text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full border border-orange-100 font-medium">Active</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden">
           <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-400 to-teal-500"></div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Completed Today</p>
          <div className="flex items-end justify-between mt-3">
            <h3 className="text-4xl font-extrabold text-slate-800">{stats.completedToday}</h3>
            <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100 font-medium">Daily</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden">
           <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-purple-400 to-fuchsia-500"></div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Pipeline Value</p>
          <div className="flex items-end justify-between mt-3">
            <h3 className="text-4xl font-extrabold text-slate-800">₹{stats.pendingRev}</h3>
            <span className="text-xs text-slate-400 font-medium">Total: ₹{stats.realizedRev + stats.pendingRev}</span>
          </div>
        </div>

        {/* Overall TAT Card */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden">
           <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400 to-indigo-500"></div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Avg Shop TAT</p>
          <div className="flex items-end justify-between mt-3">
            <div className="flex items-baseline">
                <h3 className="text-3xl font-extrabold text-slate-800">
                    {tatData.length ? (tatData.reduce((acc, curr) => acc + curr.avgTimeDays, 0)).toFixed(1) : 0}
                </h3>
                <span className="text-lg text-slate-400 font-medium ml-1">Days</span>
            </div>
             <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 font-medium">Metric</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Stage Wise TAT Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Stage Turnaround Time (TAT)</h3>
              <p className="text-xs text-slate-400">Average time spent in each processing stage</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tatData} layout="vertical" margin={{top: 5, right: 30, left: 40, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tickFormatter={(val) => `${val} days`} tick={{fontSize: 10, fill: '#64748b'}} />
                <YAxis dataKey="stage" type="category" width={80} tick={{fontSize: 12, fill: '#64748b'}} />
                <RechartsTooltip 
                  cursor={{fill: '#f8fafc'}}
                  formatter={(value: any) => [`${value} Days`, 'Avg Time']}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="avgTimeDays" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={25}>
                    <Cell fill="#60a5fa" /> {/* Design */}
                    <Cell fill="#a855f7" /> {/* Production */}
                    <Cell fill="#f97316" /> {/* Finishing */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Person Wise Summary Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Employee Workload</h3>
              <p className="text-xs text-slate-400">Current workload distribution across team</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeData} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 10, fill: '#64748b'}} />
                <YAxis allowDecimals={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <RechartsTooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  cursor={{fill: '#f8fafc'}} 
                />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}} />
                <Bar dataKey="active" name="Active Jobs" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} barSize={30} />
                <Bar dataKey="completed" name="Completed" stackId="a" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insight Panel */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-8 rounded-2xl shadow-lg border border-slate-700">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Smart Shop Manager</h3>
                <p className="text-slate-400 text-sm">AI-driven analysis of your workflow efficiency</p>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 text-sm leading-relaxed border border-white/10 min-h-[120px]">
              {loadingAi ? (
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="animate-spin h-5 w-5 border-2 border-indigo-400 border-t-transparent rounded-full"></div>
                  Analyzing production data...
                </div>
              ) : aiReport ? (
                <p className="whitespace-pre-line text-slate-200">{aiReport}</p>
              ) : (
                <p className="text-slate-500 italic">Generate a report to see insights about bottlenecks and priority jobs.</p>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-auto flex flex-col justify-end">
             <button 
              onClick={handleAiAnalysis}
              disabled={loadingAi}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-900/50 hover:shadow-indigo-900/70 whitespace-nowrap"
            >
              Generate AI Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;