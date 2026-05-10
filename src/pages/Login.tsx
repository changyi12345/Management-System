import React, { useState } from 'react';
import type { User } from '../types';

interface LoginProps {
  onLogin: (staffId: string, password: string) => Promise<User>;
  users: User[];
}

export const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  const [staffIdInput, setStaffIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(staffIdInput, passwordInput);
    } catch (err) {
      alert('Invalid Staff ID or Password!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '24px',
      background: 'linear-gradient(135deg, var(--bg) 0%, #0f172a 50%, var(--bg-secondary) 100%)'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '450px' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            fontSize: '72px', 
            marginBottom: '16px',
            filter: 'drop-shadow(0 10px 25px rgba(139, 92, 246, 0.3))'
          }}>🏪</div>
          <h1 style={{ 
            fontSize: '36px', 
            marginBottom: '8px', 
            fontWeight: '800',
            background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>G&G G0018F</h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            marginBottom: '8px', 
            fontSize: '16px',
            fontWeight: '500'
          }}>Expire Management System</p>
        </div>
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.9) 100%)',
          border: '2px solid rgba(139, 92, 246, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.1) inset'
        }}>
          <form onSubmit={handleSubmit}>
            <h2 className="title" style={{ textAlign: 'center', marginBottom: '4px' }}>👤 Login</h2>
            <p className="subtitle" style={{ textAlign: 'center' }}>Enter your Staff ID and Password</p>
            <input
              type="text"
              className="input"
              placeholder="Staff ID"
              value={staffIdInput}
              onChange={(e) => setStaffIdInput(e.target.value)}
              disabled={loading}
              style={{ 
                background: 'rgba(15, 23, 42, 0.8)',
                border: '2px solid rgba(71, 85, 105, 0.5)',
                transition: 'all 0.3s ease'
              }}
            />
            <input
              type="password"
              className="input"
              placeholder="Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              disabled={loading}
              style={{ 
                background: 'rgba(15, 23, 42, 0.8)',
                border: '2px solid rgba(71, 85, 105, 0.5)',
                transition: 'all 0.3s ease'
              }}
            />
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ 
                marginTop: '12px',
                width: '100%',
                fontSize: '16px',
                padding: '14px',
                boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.4)'
              }}
              disabled={loading}
            >
              {loading ? 'Loading...' : '🔐 Login'}
            </button>
          </form>
          <div style={{ 
            marginTop: '28px', 
            fontSize: '13px', 
            color: 'var(--text-secondary)', 
            lineHeight: '2',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(71, 85, 105, 0.3)'
          }}>
            <p style={{ marginBottom: '8px', fontWeight: '700', color: 'var(--text)' }}>📋 Demo Accounts:</p>
            <p style={{ marginBottom: '6px' }}><strong style={{ color: 'var(--primary-light)' }}>Admin:</strong> ADMIN001 / admin123</p>
            <p style={{ marginBottom: '6px' }}><strong style={{ color: 'var(--success)' }}>Mg Mg:</strong> SFF001 / mgmg123</p>
            <p style={{ marginBottom: '6px' }}><strong style={{ color: 'var(--warning)' }}>Su Su:</strong> SFF002 / susu123</p>
            <p><strong style={{ color: 'var(--orange)' }}>Kyaw Kyaw:</strong> SFF003 / kyawkyaw123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

