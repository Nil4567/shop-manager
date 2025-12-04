import React from 'react';
import { User } from '../types';

type Props = {
  activeTab: string;
  onTabChange: (t: string) => void;
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ activeTab, onTabChange, user, onLogout, children }) => {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <header style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
        <strong>Shop Manager</strong>
        <span style={{ marginLeft: 12 }}>{user?.name ?? 'Guest'}</span>
        <button style={{ float: 'right' }} onClick={onLogout}>Logout</button>
      </header>
      <nav style={{ padding: 8, borderBottom: '1px solid #eee' }}>
        <button onClick={() => onTabChange('dashboard')} disabled={activeTab === 'dashboard'}>Dashboard</button>
        <button onClick={() => onTabChange('jobs')} disabled={activeTab === 'jobs'}>Jobs</button>
        <button onClick={() => onTabChange('new')} disabled={activeTab === 'new'}>New Job</button>
        {user?.role === 'Admin' && <button onClick={() => onTabChange('admin')} disabled={activeTab === 'admin'}>Admin</button>}
      </nav>
      <main style={{ padding: 12 }}>{children}</main>
    </div>
  );
};

export default Layout;
