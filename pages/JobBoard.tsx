import React from 'react';
import { Job } from '../types';

type Props = {
  jobs: Job[];
  onAdvance: (id: string) => void;
  onDelete: (id: string) => void;
};

const JobBoard: React.FC<Props> = ({ jobs, onAdvance, onDelete }) => {
  return (
    <div>
      <h2>Jobs</h2>
      <ul>
        {jobs.map(j => (
          <li key={j.id}>
            {j.id} - {j.title ?? j.type} - Stage: {j.currentStage}
            <button onClick={() => onAdvance(j.id)} style={{ marginLeft: 8 }}>Advance</button>
            <button onClick={() => onDelete(j.id)} style={{ marginLeft: 8 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobBoard;
