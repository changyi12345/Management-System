import React, { useState } from 'react';
import type { User } from '../types';

interface LoginProps {
  onLogin: (staffId: string, password: string) => Promise<User>;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
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
      background: 'linear-gradient(135deg, #020617 0%, #1e1b4b 25%, #312e81 50%, #1e1b4b 75%, #020617 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        top: '-100px',
        right: '-100px',
        animation: 'float 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        bottom: '-50px',
        left: '-50px',
        animation: 'float 6s ease-in-out infinite reverse'
      }} />
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
        }
      `}</style>
      <div style={{ 
        width: '100%', 
        maxWidth: '420px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ 
            fontSize: '80px', 
            marginBottom: '20px',
            filter: 'drop-shadow(0 20px 40px rgba(139, 92, 246, 0.4))',
            animation: 'pulse-glow 3s ease-in-out infinite'
          }}>🏪</div>
          <h1 style={{ 
            fontSize: '40px', 
            marginBottom: '10px', 
            fontWeight: '900',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #6366f1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.5px'
          }}>G&G G0018F</h1>
          <p style={{ 
            color: '#a5b4fc', 
            marginBottom: '0', 
            fontSize: '18px',
            fontWeight: '600',
            letterSpacing: '1px'
          }}>Expire Management System</p>
        </div>
        <div className="card" style={{ 
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 92, 246, 0.1) inset, 0 0 80px rgba(139, 92, 246, 0.1)',
          borderRadius: '24px',
          padding: '36px'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '32px',
              paddingBottom: '24px',
              borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <h2 className="title" style={{ 
                fontSize: '28px',
                fontWeight: '800',
                marginBottom: '6px',
                background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>👤 Welcome Back</h2>
              <p className="subtitle" style={{ 
                color: '#94a3b8',
                fontSize: '15px',
                fontWeight: '500'
              }}>Enter your Staff ID and Password</p>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <input
                type="text"
                className="input"
                placeholder="Staff ID"
                value={staffIdInput}
                onChange={(e) => setStaffIdInput(e.target.value)}
                disabled={loading}
                style={{ 
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '2px solid rgba(71, 85, 105, 0.6)',
                  transition: 'all 0.3s ease',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              />
            </div>
            <div style={{ marginBottom: '28px' }}>
              <input
                type="password"
                className="input"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                disabled={loading}
                style={{ 
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '2px solid rgba(71, 85, 105, 0.6)',
                  transition: 'all 0.3s ease',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ 
                marginTop: '0',
                width: '100%',
                fontSize: '17px',
                padding: '16px',
                fontWeight: '700',
                borderRadius: '16px',
                boxShadow: '0 20px 40px -10px rgba(139, 92, 246, 0.5)',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                border: 'none',
                transition: 'all 0.3s ease'
              }}
              disabled={loading}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 25px 50px -10px rgba(139, 92, 246, 0.6)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(139, 92, 246, 0.5)';
              }}
            >
              {loading ? 'Loading...' : '🔐 Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

