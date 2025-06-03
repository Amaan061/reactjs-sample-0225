import React, { useState } from 'react';
import AuthForm from './AuthForm';

const AuthFormExample: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  return (
    <div style={{ maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h1>Auth Form Example</h1>
        <div>
          <button 
            onClick={() => setMode('login')}
            style={{
              padding: '8px 16px',
              marginRight: '10px',
              background: mode === 'login' ? '#3f51b5' : '#f5f5f5',
              color: mode === 'login' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Login Mode
          </button>
          <button 
            onClick={() => setMode('signup')}
            style={{
              padding: '8px 16px',
              background: mode === 'signup' ? '#3f51b5' : '#f5f5f5',
              color: mode === 'signup' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Signup Mode
          </button>
        </div>
      </div>
      
      <AuthForm initialMode={mode} />
      
      <div style={{ marginTop: '40px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
        <h2>Component Notes</h2>
        <ul style={{ textAlign: 'left' }}>
          <li><strong>Login Mode</strong>: Email and password with "Remember Me" option</li>
          <li><strong>Signup Mode</strong>: Username, email, password with strength meter, and Terms checkbox</li>
          <li><strong>Validation</strong>: Try submitting empty fields or invalid data to see validation in action</li>
          <li><strong>Password Strength</strong>: In signup mode, type different passwords to see the strength meter change</li>
          <li><strong>Username Availability</strong>: In signup mode, usernames containing "admin" or "test" will show as unavailable</li>
        </ul>
      </div>
    </div>
  );
};

export default AuthFormExample;
