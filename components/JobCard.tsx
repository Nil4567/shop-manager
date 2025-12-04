import React from 'react';
import { Job, JobStage } from '../types';
import { STAGE_COLORS, getNextStage } from '../constants';

interface JobCardProps {
  job: Job;
  onAdvance: (id: string) => void;
  onDelete: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onAdvance, onDelete }) => {
  const isCompleted = job.currentStage === JobStage.COMPLETED;
  const nextStage = getNextStage(job.currentStage, job.type);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-lg hover:border-indigo-100 transition-all duration-200 flex flex-col h-full border-l-[6px] ${
      job.priority === 'Urgent' ? 'border-l-red-500' : 'border-l-indigo-500'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">#{job.id}</span>
        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
          job.priority === 'Urgent' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
        }`}>
          {job.priority}
        </span>
      </div>
      
      <div className="mb-3">
        <h3 className="font-bold text-slate-800 text-lg truncate" title={job.customerName}>{job.customerName}</h3>
        {job.customerContact && (
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            {job.customerContact}
          </p>
        )}
      </div>

      <p className="text-sm text-slate-600 mb-4 flex-grow line-clamp-3 leading-relaxed">{job.description}</p>
      
      <div className="flex flex-col gap-3 mt-auto">
        <div className="flex justify-between items-center text-sm font-medium pt-3 border-t border-slate-100">
          <span className="text-slate-500">{job.type}</span>
          <span className="text-slate-800">₹{job.price}</span>
        </div>
        
        <div className="flex justify-between items-center bg-slate-50 rounded-lg p-2">
           <div className="text-xs text-slate-400 font-medium">Stage</div>
           <div className={`text-xs px-2 py-1 rounded font-semibold border ${STAGE_COLORS[job.currentStage]}`}>
            {job.currentStage}
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          {job.assignedTo}
        </div>

        <div className="flex gap-2 mt-2">
          {!isCompleted && nextStage && (
            <button 
              onClick={() => onAdvance(job.id)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors shadow-sm shadow-indigo-100"
            >
              Move to {nextStage}
            </button>
          )}
          {isCompleted && (
             <span className="flex-1 text-center bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold py-2 rounded-lg">
               Completed
             </span>
          )}
          <button 
             onClick={() => onDelete(job.id)}
             className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
             title="Delete Job"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
