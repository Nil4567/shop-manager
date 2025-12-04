import React from 'react';
import { Job } from '../types';

type Props = { jobs: Job[] };

const AdminPanel: React.FC<Props> = ({ jobs }) => {
  return (
    <div>
      <h2>Admin Panel</h2>
      <div>Admin can view {jobs.length} jobs</div>
    </div>
  );
};

export default AdminPanel;
