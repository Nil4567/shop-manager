import React, { useState } from 'react';
import { User } from '../types';

type Props = {
  onLogin: (u: User) => void;
};

const Login: React.FC<Props> = ({ onLogin }) => {
  const [name, setName] = useState('Test User');

  const handle = () => {
    const user: User = { id: 'u1', name, role: 'Admin' };
    onLogin(user);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <div>
        <label>Name: </label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <button onClick={handle} style={{ marginTop: 8 }}>Login</button>
    </div>
  );
};

export default Login;
