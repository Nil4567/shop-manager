import React from 'react';
import { Job, JobStage } from '../types';
import JobCard from '../components/JobCard';
import { STAGE_ORDER } from '../constants';

interface JobBoardProps {
  jobs: Job[];
  onAdvance: (id: string) => void;
  onDelete: (id: string) => void;
}

const JobBoard: React.FC<JobBoardProps> = ({ jobs, onAdvance, onDelete }) => {
  return (
    <div className="flex gap-6 overflow-x-auto pb-6 min-h-[calc(100vh-12rem)]">
      {STAGE_ORDER.map(stage => {
        const stageJobs = jobs.filter(j => j.currentStage === stage);
        
        return (
          <div key={stage} className="min-w-[300px] w-[300px] flex-shrink-0 flex flex-col bg-gray-50 rounded-xl border border-gray-200 max-h-full">
            <div className={`p-3 border-b border-gray-200 rounded-t-xl font-semibold text-gray-700 flex justify-between items-center sticky top-0 bg-gray-100 z-10`}>
              <span>{stage}</span>
              <span className="bg-white px-2 py-0.5 rounded-full text-xs border border-gray-300 shadow-sm">{stageJobs.length}</span>
            </div>
            
            <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
              {stageJobs.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm italic">
                  No jobs in {stage}
                </div>
              )}
              {stageJobs.map(job => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onAdvance={onAdvance} 
                  onDelete={onDelete} 
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JobBoard;