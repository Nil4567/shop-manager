import React from 'react';
import { Job } from '../types';

type Props = { jobs: Job[] };

const Dashboard: React.FC<Props> = ({ jobs }) => {
  return (
    <div>
      <h2>Dashboard</h2>
      <div>Total jobs: {jobs.length}</div>
    </div>
  );
};

export default Dashboard;
