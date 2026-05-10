import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import type { User, Product, SupportWeek, Category } from '../types';

interface ProductsProps {
  currentUser: User;
  products: Product[];
  categories: Category[];
  onAddProduct: (product: any) => Promise<Product>;
  onUpdateProduct: (product: Product) => Promise<Product>;
  onDeleteProduct: (productId: string, productName: string) => Promise<boolean>;
}

export const Products: React.FC<ProductsProps> = ({ 
  currentUser, 
  products, 
  categories, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct 
}) => {
  const [activeTab, setActiveTab] = useState('products');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchStatus, setSearchStatus] = useState('all');
  const [newProduct, setNewProduct] = useState({
    name: '',
    barcode: '',
    expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    quantity: 1,
    supportType: 'Return' as 'Return' | 'Non-Support',
    supportWeek: '1 week' as SupportWeek,
    category: currentUser.assignedCategory || (categories.length > 0 ? categories[0].name : '')
  });

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    if (currentUser.role === 'Staff') {
      result = result.filter(p => p.assignedStaffId === currentUser.id);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.barcode.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.assignedStaffName.toLowerCase().includes(query)
      );
    }

    if (searchStatus !== 'all') {
      if (searchStatus === 'expired') result = result.filter(p => p.lifecycle === 'Expired');
      if (searchStatus === 'returnDue') result = result.filter(p => p.lifecycle === 'Return Due');
      if (searchStatus === 'warning') result = result.filter(p => p.lifecycle === 'Warning');
    }

    if (activeTab === 'expiring7') result = result.filter(p => p.daysLeft > 0 && p.daysLeft <= 7);
    if (activeTab === 'expiring14') result = result.filter(p => p.daysLeft > 0 && p.daysLeft <= 14);
    if (activeTab === 'expiring30') result = result.filter(p => p.daysLeft > 0 && p.daysLeft <= 30);
    if (activeTab === 'expired') result = result.filter(p => p.lifecycle === 'Expired');

    return result;
  }, [products, currentUser, searchQuery, searchStatus, activeTab]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddProduct({
      name: newProduct.name,
      barcode: newProduct.barcode,
      expireDate: newProduct.expireDate,
      quantity: newProduct.quantity,
      supportType: newProduct.supportType,
      supportWeek: newProduct.supportWeek,
      assignedStaffId: currentUser.id,
      assignedStaffName: currentUser.name,
      category: newProduct.category
    });
    setShowAddProduct(false);
    setNewProduct({
      name: '',
      barcode: '',
      expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      quantity: 1,
      supportType: 'Return',
      supportWeek: '1 week',
      category: currentUser.assignedCategory || (categories.length > 0 ? categories[0].name : '')
    });
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    await onUpdateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleExport = (type: 'all' | 'expiring7' | 'expiring14' | 'expiring30' | 'expired') => {
    let exportProducts = [...products];
    if (type === 'expiring7') exportProducts = exportProducts.filter(p => p.daysLeft > 0 && p.daysLeft <= 7);
    if (type === 'expiring14') exportProducts = exportProducts.filter(p => p.daysLeft > 0 && p.daysLeft <= 14);
    if (type === 'expiring30') exportProducts = exportProducts.filter(p => p.daysLeft > 0 && p.daysLeft <= 30);
    if (type === 'expired') exportProducts = exportProducts.filter(p => p.lifecycle === 'Expired');

    const data = exportProducts.map(p => ({
      'Product Name': p.name,
      'Barcode': p.barcode,
      'Category': p.category,
      'Assigned Staff': p.assignedStaffName,
      'Expire Date': p.expireDate,
      'Days Left': p.daysLeft,
      'Status': p.lifecycle,
      'Alert Level': p.alertLevel,
      'Support Type': p.supportType,
      'Support Week': p.supportWeek || '',
      'Quantity': p.quantity,
      'QR Data': `Name: ${p.name}, Barcode: ${p.barcode}, Expire: ${p.expireDate}, Category: ${p.category}`
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    XLSX.writeFile(workbook, `products_${type}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getAlertBadgeClass = (level: string) => {
    switch (level) {
      case 'Critical': return 'badge-critical';
      case 'Red': return 'badge-danger';
      case 'Orange': return 'badge-warning';
      case 'Yellow': return 'badge-success';
      default: return 'badge-info';
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="title">Products</h1>
          <p className="subtitle">Manage your products</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setShowAddProduct(!showAddProduct)}>
            {showAddProduct ? '✕ Cancel' : '➕ Add Product'}
          </button>
          {currentUser.role === 'Admin' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn" style={{ background: 'var(--card-bg)', border: '2px solid var(--border)', color: 'var(--text)' }} onClick={() => handleExport('all')}>📋 All</button>
              <button className="btn" style={{ background: 'var(--card-bg)', border: '2px solid var(--border)', color: 'var(--text)' }} onClick={() => handleExport('expiring7')}>7d</button>
              <button className="btn" style={{ background: 'var(--card-bg)', border: '2px solid var(--border)', color: 'var(--text)' }} onClick={() => handleExport('expiring14')}>14d</button>
              <button className="btn" style={{ background: 'var(--card-bg)', border: '2px solid var(--border)', color: 'var(--text)' }} onClick={() => handleExport('expiring30')}>30d</button>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn'}`} onClick={() => setActiveTab('products')} style={activeTab !== 'products' ? { background: 'var(--card-bg)', border: '2px solid var(--border)', color: 'var(--text)' } : undefined}>
          📦 All Products
        </button>
        <button className={`btn ${activeTab === 'expiring7' ? 'btn-primary' : 'btn'}`} onClick={() => setActiveTab('expiring7')} style={activeTab !== 'expiring7' ? { background: 'var(--card-bg)', border: '2px solid var(--border)', color: 'var(--text)' } : undefined}>
          ⚠️ Expiring 7d
        </button>
        <button className={`btn ${activeTab === 'expiring14' ? 'btn-primary' : 'btn'}`} onClick={() => setActiveTab('expiring14')} style={activeTab !== 'expiring14' ? { background: 'var(--card-bg)', border: '2px solid var(--border)', color: 'var(--text)' } : undefined}>
          ⚠️ Expiring 14d
        </button>
        <button className={`btn ${activeTab === 'expiring30' ? 'btn-primary' : 'btn'}`} onClick={() => setActiveTab('expiring30')} style={activeTab !== 'expiring30' ? { background: 'var(--card-bg)', border: '2px solid var(--border)', color: 'var(--text)' } : undefined}>
          ⚠️ Expiring 30d
        </button>
        <button className={`btn ${activeTab === 'expired' ? 'btn-primary' : 'btn'}`} onClick={() => setActiveTab('expired')} style={activeTab !== 'expired' ? { background: 'var(--card-bg)', border: '2px solid var(--border)', color: 'var(--text)' } : undefined}>
          🔴 Expired
        </button>
      </div>

      {showAddProduct && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 className="title" style={{ fontSize: '20px', marginBottom: '20px' }}>➕ Add New Product</h2>
          <form onSubmit={handleAddProduct}>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" className="input" placeholder="Enter product name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Barcode</label>
                <input type="text" className="input" placeholder="Enter barcode" value={newProduct.barcode} onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expire Date</label>
                <input type="date" className="input" value={newProduct.expireDate} onChange={(e) => setNewProduct({ ...newProduct, expireDate: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" className="input" placeholder="Enter quantity" value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 1 })} min="1" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Support Type</label>
                <select className="input" value={newProduct.supportType} onChange={(e) => setNewProduct({ ...newProduct, supportType: e.target.value as 'Return' | 'Non-Support' })} required>
                  <option value="Return">Return</option>
                  <option value="Non-Support">Non-Support</option>
                </select>
              </div>
              {newProduct.supportType === 'Return' && (
                <div className="form-group">
                  <label>Support Week</label>
                  <select className="input" value={newProduct.supportWeek} onChange={(e) => setNewProduct({ ...newProduct, supportWeek: e.target.value as SupportWeek })}>
                    <option value="1 week">1 week</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="3 weeks">3 weeks</option>
                    <option value="1 month">1 month</option>
                  </select>
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Category</label>
              <select className="input" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} required>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Add Product</button>
          </form>
        </div>
      )}

      {editingProduct && (
        <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>✏️ Edit Product</h2>
            <form onSubmit={handleEditProduct}>
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" className="input" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" className="input" value={editingProduct.quantity} onChange={(e) => setEditingProduct({ ...editingProduct, quantity: parseInt(e.target.value) || 1 })} min="1" required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" style={{ background: 'var(--card-bg)', border: '2px solid var(--border)', color: 'var(--text)' }} onClick={() => setEditingProduct(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input type="text" className="input" placeholder="Search by name, barcode, staff, or category..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, minWidth: '200px' }} />
        <select className="input" value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)} style={{ width: '200px' }}>
          <option value="all">All Status</option>
          <option value="warning">Warning</option>
          <option value="returnDue">Return Due</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>📦 No products found</div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card" style={{ borderLeft: `6px solid ${product.lifecycle === 'Expired' ? 'var(--danger)' : product.lifecycle === 'Return Due' ? 'var(--warning)' : product.lifecycle === 'Warning' ? 'var(--orange)' : 'var(--success)'}` }}>
              <div className="product-header">
                <div>
                  <div className="product-name">{product.name}</div>
                  <div className="product-meta">{product.category} • {product.supportType}</div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)' }}>{product.quantity}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                <div>
                  <div className="product-meta">Barcode</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{product.barcode}</div>
                </div>
                <div>
                  <div className="product-meta">Expire Date</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{product.expireDate}</div>
                </div>
                <div>
                  <div className="product-meta">Assigned Staff</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{product.assignedStaffName}</div>
                </div>
                <div>
                  <div className="product-meta">Days Left</div>
                  <div className={`product-meta ${product.daysLeft < 0 ? 'text-danger' : product.daysLeft <= 7 ? 'text-warning' : 'text-success'}`} style={{ fontSize: '14px', fontWeight: '700' }}>{product.daysLeft} days</div>
                </div>
                {product.supportType === 'Return' && product.supportWeek && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div className="product-meta">Support Week</div>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{product.supportWeek}</div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                <span className="lifecycle-badge" style={{
                  background: product.lifecycle === 'Expired' ? 'rgba(239, 68, 68, 0.15)' : product.lifecycle === 'Return Due' ? 'rgba(245, 158, 11, 0.15)' : product.lifecycle === 'Warning' ? 'rgba(249, 115, 22, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: product.lifecycle === 'Expired' ? 'var(--danger)' : product.lifecycle === 'Return Due' ? 'var(--warning)' : product.lifecycle === 'Warning' ? 'var(--orange)' : 'var(--success)'
                }}>
                  {product.lifecycle}
                </span>
                <span className={`alert-badge ${getAlertBadgeClass(product.alertLevel)}`}>{product.alertLevel}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                {(currentUser.role === 'Admin' || product.assignedStaffId === currentUser.id) && (
                  <button className="btn btn-primary btn-sm" onClick={() => setEditingProduct(product)}>✏️ Edit</button>
                )}
                {currentUser.role === 'Admin' && (
                  <button className="btn btn-danger btn-sm" onClick={() => {
                    if (confirm('Are you sure you want to delete this product?')) {
                      onDeleteProduct(product.id, product.name);
                    }
                  }}>🗑️ Delete</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

