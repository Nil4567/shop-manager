import React, { useState } from 'react';
import { Job } from '../types';

type Props = {
  onSubmit: (data: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => void;
  onCancel: () => void;
};

const NewJob: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const submit = () => {
    onSubmit({ title, type: 'General', currentStage: 'COUNTER', assignedTo: 'Unassigned' } as any);
  };
  return (
    <div>
      <h2>New Job</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <div>
        <button onClick={submit}>Create</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default NewJob;
