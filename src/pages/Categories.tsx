import React, { useState, useEffect } from 'react';
import type { Category } from '../types';
import { apiService } from '../services/apiService';

interface CategoriesProps {
}

export const Categories: React.FC<CategoriesProps> = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    try {
      await apiService.addCategory({ name: newCategoryName.trim() });
      setShowAddCategory(false);
      setNewCategoryName('');
      loadCategories();
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCategoryName.trim()) return;
    
    try {
      await apiService.updateCategory({ 
        ...editingCategory, 
        name: editCategoryName.trim() 
      });
      setEditingCategory(null);
      setEditCategoryName('');
      loadCategories();
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}" category?`)) return;
    
    try {
      await apiService.deleteCategory(categoryId);
      loadCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="title">Category Management</h1>
          <p className="subtitle">Manage product categories</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddCategory(!showAddCategory)}>
          {showAddCategory ? '✕ Cancel' : '➕ Add Category'}
        </button>
      </div>

      {showAddCategory && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 className="title" style={{ fontSize: '20px', marginBottom: '20px' }}>➕ Add New Category</h2>
          <form onSubmit={handleAddCategory}>
            <div className="form-group">
              <label>Category Name</label>
              <input
                type="text"
                className="input"
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Category</button>
          </form>
        </div>
      )}

      {editingCategory && (
        <div className="modal-overlay" onClick={() => setEditingCategory(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>✏️ Edit Category</h2>
            <form onSubmit={handleEditCategory}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  className="input"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingCategory(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="title" style={{ fontSize: '20px', marginBottom: '20px' }}>Current Categories</h2>
        {categories.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No categories found!</p>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {categories.map(category => (
              <div key={category.id} className="staff-card" style={{ marginBottom: '0' }}>
                <div>
                  <div className="staff-name">📁 {category.name}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={() => {
                      setEditingCategory(category);
                      setEditCategoryName(category.name);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
