import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types';

interface ProfileProps {
  currentUser: User;
  onUpdatePassword?: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const Profile: React.FC<ProfileProps> = ({ currentUser, onUpdatePassword }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match!');
      return;
    }
    if (onUpdatePassword) {
      try {
        await onUpdatePassword(currentPassword, newPassword);
        setMessage('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowChangePassword(false);
      } catch (err) {
        setMessage('Failed to change password!');
      }
    } else {
      setMessage('Password changed successfully! (Mock)');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePassword(false);
    }
  };
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="title">My Profile</h1>
          <p className="subtitle">Manage your account</p>
        </div>
      </div>

      <div className="reports-grid">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px'
            }}>
              👤
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {currentUser.role}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Staff ID
            </label>
            <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '4px' }}>
              {currentUser.staffId}
            </div>
          </div>

          {currentUser.assignedCategory && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Assigned Category
              </label>
              <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '4px' }}>
                {currentUser.assignedCategory}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="title" style={{ fontSize: '20px', marginBottom: '20px' }}>Account Settings</h2>
          
          {message && (
            <div style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '16px',
              background: message.includes('success') ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' : 'linear-gradient(135deg, #fee2e2 0%, #fca5a5 100%)',
              color: message.includes('success') ? '#065f46' : '#991b1b'
            }}>
              {message}
            </div>
          )}

          <button className="btn btn-primary" onClick={() => setShowChangePassword(!showChangePassword)} style={{ marginBottom: '12px', width: '100%' }}>
            🔐 Change Password
          </button>

          {showChangePassword && (
            <form onSubmit={handleChangePassword} style={{ marginBottom: '16px' }}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Save Password
              </button>
            </form>
          )}

          {currentUser.role === 'Admin' && (
            <div style={{ marginTop: '24px' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', 
                padding: '16px', 
                borderRadius: '12px', 
                color: '#065f46',
                marginBottom: '16px'
              }}>
                <strong>Admin Account</strong><br />
                You have full access to all system features
              </div>
              <Link to="/audit" style={{ textDecoration: 'none' }}>
                <button className="btn" style={{ background: 'var(--border)', color: 'var(--text)', width: '100%' }}>
                  📜 View All Audit Logs
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
