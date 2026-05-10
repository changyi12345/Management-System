import React, { useState } from 'react';
import type { User, Category } from '../types';

interface StaffProps {
  users: User[];
  categories: Category[];
  onAddUser: (user: Omit<User, 'id'>) => Promise<User>;
  onDeleteUser: (userId: string, userName: string) => Promise<boolean>;
  onUpdateUser?: (user: User) => Promise<User>;
}

export const Staff: React.FC<StaffProps> = ({ users, categories, onAddUser, onDeleteUser, onUpdateUser }) => {
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [editingStaff, setEditingStaff] = useState<User | null>(null);
  const [newStaff, setNewStaff] = useState({
    name: '',
    staffId: '',
    password: '',
    assignedCategory: '',
  });
  const [editPassword, setEditPassword] = useState('');

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddUser({
      staffId: newStaff.staffId,
      name: newStaff.name,
      password: newStaff.password,
      role: 'Staff',
      assignedCategory: newStaff.assignedCategory
    });
    setShowAddStaff(false);
    setNewStaff({ name: '', staffId: '', password: '', assignedCategory: '' });
  };

  const handleEditStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    const updatedStaff = { ...editingStaff };
    if (editPassword) {
      updatedStaff.password = editPassword;
    }
    if (onUpdateUser) {
      await onUpdateUser(updatedStaff);
    }
    setEditingStaff(null);
    setEditPassword('');
  };

  const handleDeleteStaff = async (staffId: string, staffName: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    await onDeleteUser(staffId, staffName);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="title">Staff Management</h1>
          <p className="subtitle">Manage staff members</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddStaff(!showAddStaff)}>
          {showAddStaff ? '✕ Cancel' : '➕ Add Staff'}
        </button>
      </div>

      {showAddStaff && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 className="title" style={{ fontSize: '20px', marginBottom: '20px' }}>➕ Add New Staff</h2>
          <form onSubmit={handleAddStaff}>
            <div className="form-row">
              <div className="form-group">
                <label>Staff Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter staff name"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Staff ID</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter staff ID"
                  value={newStaff.staffId}
                  onChange={(e) => setNewStaff({ ...newStaff, staffId: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Enter password"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Assigned Category</label>
                <select
                  className="input"
                  value={newStaff.assignedCategory}
                  onChange={(e) => setNewStaff({ ...newStaff, assignedCategory: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Add Staff</button>
          </form>
        </div>
      )}

      {editingStaff && (
        <div className="modal-overlay" onClick={() => setEditingStaff(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>✏️ Edit Staff</h2>
            <form onSubmit={handleEditStaff}>
              <div className="form-group">
                <label>Staff Name</label>
                <input
                  type="text"
                  className="input"
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Staff ID</label>
                <input
                  type="text"
                  className="input"
                  value={editingStaff.staffId}
                  onChange={(e) => setEditingStaff({ ...editingStaff, staffId: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Enter new password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Assigned Category</label>
                <select
                  className="input"
                  value={editingStaff.assignedCategory}
                  onChange={(e) => setEditingStaff({ ...editingStaff, assignedCategory: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingStaff(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="title" style={{ fontSize: '20px', marginBottom: '20px' }}>Current Staff</h2>
        {users.filter(u => u.role === 'Staff').map(staff => (
          <div key={staff.id} className="staff-card" style={{ marginBottom: '12px' }}>
            <div>
              <div className="staff-name">{staff.name}</div>
              <div className="staff-info">
                {staff.staffId} - {staff.assignedCategory}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-primary btn-sm" 
                onClick={() => setEditingStaff(staff)}
              >
                ✏️ Edit
              </button>
              <button 
                className="btn btn-danger btn-sm" 
                onClick={() => handleDeleteStaff(staff.id, staff.name)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
