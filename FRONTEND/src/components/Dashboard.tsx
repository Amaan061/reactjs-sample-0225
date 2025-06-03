import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '24px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{ color: '#3f51b5' }}>Task Board</h1>
        <button 
          onClick={logout}
          style={{
            background: 'transparent',
            border: '1px solid #3f51b5',
            color: '#3f51b5',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Sign Out
        </button>
      </div>
      
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
      }}>
        <h2>Welcome to your Task Board!</h2>
        <p>You are successfully logged in.</p>
        <p>This is a placeholder for the actual task board functionality.</p>
      </div>
    </div>
  );
};

export default Dashboard;
