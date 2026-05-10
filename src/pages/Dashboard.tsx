import React from 'react';
import type { User, Product } from '../types';
import * as XLSX from 'xlsx';

interface DashboardProps {
  currentUser: User;
  onLogout: () => void;
  products: Product[];
  users: User[];
}

export const Dashboard: React.FC<DashboardProps> = ({ currentUser, products, users }) => {
  const stats = React.useMemo(() => {
    const staff = users.filter(u => u.role === 'Staff');
    const allProducts = products;
    
    const expiring7 = allProducts.filter(p => p.daysLeft > 0 && p.daysLeft <= 7);
    const expiring14 = allProducts.filter(p => p.daysLeft > 0 && p.daysLeft <= 14);
    const expiring30 = allProducts.filter(p => p.daysLeft > 0 && p.daysLeft <= 30);
    const expired = allProducts.filter(p => p.lifecycle === 'Expired');
    const returnPending = allProducts.filter(p => p.lifecycle === 'Return Due' && p.supportType === 'Return');
    const totalStock = allProducts.reduce((sum, p) => sum + p.quantity, 0);

    const staffPerformance = staff.map(s => {
      const count = allProducts.filter(p => p.assignedStaffId === s.id).length;
      const expiredCount = allProducts.filter(p => p.assignedStaffId === s.id && p.lifecycle === 'Expired').length;
      return { name: s.name, count, expiredCount };
    });

    return {
      totalStaff: staff.length,
      totalProducts: allProducts.length,
      totalStock,
      expiring7,
      expiring14,
      expiring30,
      expired,
      returnPending,
      staffPerformance
    };
  }, [products, users]);

  const notifications = React.useMemo(() => {
    const relevantProducts = currentUser.role === 'Admin' 
      ? products 
      : products.filter(p => p.assignedStaffId === currentUser.id);
    
    const alerts = [];
    
    relevantProducts.forEach(p => {
      if (p.lifecycle === 'Expired') {
        alerts.push({
          id: `${p.id}-expired`,
          type: 'critical',
          title: '🔴 Product Expired',
          message: `${p.name} has expired!`,
          product: p
        });
      } else if (p.lifecycle === 'Return Due') {
        alerts.push({
          id: `${p.id}-return`,
          type: 'warning',
          title: '⚠️ Return Due Soon',
          message: `${p.name} - ${p.daysLeft} days left`,
          product: p
        });
      } else if (p.daysLeft <= 7) {
        alerts.push({
          id: `${p.id}-warning`,
          type: 'alert',
          title: '⚠️ Expiring Soon',
          message: `${p.name} - ${p.daysLeft} days left`,
          product: p
        });
      }
    });
    
    return alerts;
  }, [products, currentUser]);

  const exportToExcel = (type: 'daily' | 'weekly' | 'monthly' | 'all') => {
    let data;
    let filename;
    
    if (type === 'all') {
      data = products.map(p => ({
        'Product Name': p.name,
        'Barcode': p.barcode,
        'Expire Date': p.expireDate,
        'Days Left': p.daysLeft,
        'Quantity': p.quantity,
        'Support Type': p.supportType,
        'Lifecycle': p.lifecycle,
        'Alert Level': p.alertLevel,
        'Assigned Staff': p.assignedStaffName,
        'Category': p.category
      }));
      filename = 'G0018F_Products.xlsx';
    } else if (type === 'daily') {
      const today = new Date().toISOString().split('T')[0];
      const todayAdded = products.filter(p => {
        const addedDate = new Date(parseInt(p.id)).toISOString().split('T')[0];
        return addedDate === today;
      });
      const todayExpired = products.filter(p => p.lifecycle === 'Expired');
      data = [
        { 'Report Type': 'Daily Report', 'Date': today },
        {},
        { 'Section': 'Today Added' },
        ...todayAdded.map(p => ({ 'Product Name': p.name, 'Barcode': p.barcode })),
        {},
        { 'Section': 'Expired Products' },
        ...todayExpired.map(p => ({ 'Product Name': p.name, 'Barcode': p.barcode }))
      ];
      filename = 'G0018F_Daily_Report.xlsx';
    } else if (type === 'weekly') {
      const returnPending = products.filter(p => p.lifecycle === 'Return Due');
      const expired = products.filter(p => p.lifecycle === 'Expired');
      data = [
        { 'Report Type': 'Weekly Report' },
        {},
        { 'Section': 'Return Pending' },
        ...returnPending.map(p => ({ 'Product Name': p.name, 'Days Left': p.daysLeft })),
        {},
        { 'Section': 'Expired Loss' },
        ...expired.map(p => ({ 'Product Name': p.name, 'Days Expired': Math.abs(p.daysLeft) }))
      ];
      filename = 'G0018F_Weekly_Report.xlsx';
    } else {
      const staff = products.map(p => p.assignedStaffName).filter((v, i, a) => a.indexOf(v) === i);
      const staffPerformance = staff.map(name => {
        const count = products.filter(p => p.assignedStaffName === name).length;
        const expiredCount = products.filter(p => p.assignedStaffName === name && p.lifecycle === 'Expired').length;
        return { name, count, expiredCount };
      });
      data = [
        { 'Report Type': 'Monthly Report' },
        {},
        { 'Metric': 'Total Products', 'Value': products.length },
        {},
        { 'Section': 'Staff Performance' },
        ...staffPerformance.map(s => ({ 'Staff Name': s.name, 'Products Added': s.count, 'Expired': s.expiredCount }))
      ];
      filename = 'G0018F_Monthly_Report.xlsx';
    }
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, filename);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="title">Dashboard</h1>
          <p className="subtitle">Welcome back, {currentUser.name}!</p>
        </div>
        {notifications.length > 0 && (
          <div style={{ 
            background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
            padding: '12px 20px',
            borderRadius: '12px',
            color: 'white',
            fontWeight: '700',
            fontSize: '14px'
          }}>
            🔔 {notifications.length} Notification{notifications.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 className="title" style={{ fontSize: '20px', marginBottom: '16px' }}>🔔 Notifications</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className="card" 
                style={{ 
                  borderLeft: `6px solid ${notification.type === 'critical' ? 'var(--danger)' : notification.type === 'warning' ? 'var(--warning)' : 'var(--orange)'}`,
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>
                      {notification.title}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {notification.message}
                    </div>
                  </div>
                  <span className="lifecycle-badge" style={{ 
                    background: notification.type === 'critical' 
                      ? 'rgba(239, 68, 68, 0.15)' 
                      : notification.type === 'warning' 
                        ? 'rgba(245, 158, 11, 0.15)' 
                        : 'rgba(249, 115, 22, 0.15)',
                    color: notification.type === 'critical' 
                      ? 'var(--danger)' 
                      : notification.type === 'warning' 
                        ? 'var(--warning)' 
                        : 'var(--orange)'
                  }}>
                    {notification.product.lifecycle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentUser.role === 'Admin' && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">📦 Total Products</div>
              <div className="stat-value">{stats.totalProducts}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">📊 Total Stock</div>
              <div className="stat-value">{stats.totalStock}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">🔴 Expired</div>
              <div className="stat-value">{stats.expired.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">⚠️ Expiring (7d)</div>
              <div className="stat-value">{stats.expiring7.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">♻️ Return Pending</div>
              <div className="stat-value">{stats.returnPending.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">🟡 Expiring (14d)</div>
              <div className="stat-value">{stats.expiring14.length}</div>
            </div>
          </div>

          <div className="reports-grid">
            <div className="card">
              <h2 className="title" style={{ fontSize: '20px', marginBottom: '20px' }}>📊 Quick Reports</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button className="btn btn-primary" onClick={() => exportToExcel('daily')}>
                  📅 Daily Report
                </button>
                <button className="btn btn-primary" onClick={() => exportToExcel('weekly')}>
                  📆 Weekly Report
                </button>
                <button className="btn btn-primary" onClick={() => exportToExcel('monthly')}>
                  🗓️ Monthly Report
                </button>
                <button className="btn btn-secondary" onClick={() => exportToExcel('all')}>
                  📊 Full Export
                </button>
              </div>
            </div>

            <div className="card">
              <h2 className="title" style={{ fontSize: '20px', marginBottom: '20px' }}>👷 Staff Performance</h2>
              {stats.staffPerformance.map((s, i) => (
                <div key={i} className="staff-card" style={{ marginBottom: '12px', padding: '16px' }}>
                  <div className="staff-name">{s.name}</div>
                  <div className="staff-info">
                    {s.count} Products
                    {s.expiredCount > 0 && (
                      <span style={{ marginLeft: '12px', color: 'var(--danger)', fontWeight: '700' }}>
                        ({s.expiredCount} Expired)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginTop: '24px' }}>
            <h2 className="title" style={{ fontSize: '20px', marginBottom: '20px' }}>⚠️ Expiring Soon (7 Days)</h2>
            {stats.expiring7.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No products expiring soon!</p>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {stats.expiring7.map((product, i) => (
                  <div key={i} className="product-card lifecycle-Warning" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div className="product-name">{product.name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {product.category} • {product.daysLeft} days left</div>
                      </div>
                      <span className="lifecycle-badge">Warning</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {currentUser.role === 'Staff' && (
        <div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">📦 My Products</div>
              <div className="stat-value">
                {products.filter(p => p.assignedStaffId === currentUser.id).length}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">🔴 My Expired</div>
              <div className="stat-value">
                {products.filter(p => p.assignedStaffId === currentUser.id && p.lifecycle === 'Expired').length}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">⚠️ Expiring (7d)</div>
              <div className="stat-value">
                {products.filter(p => p.assignedStaffId === currentUser.id && p.daysLeft > 0 && p.daysLeft <= 7).length}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">♻️ Return Pending</div>
              <div className="stat-value">
                {products.filter(p => p.assignedStaffId === currentUser.id && p.lifecycle === 'Return Due' && p.supportType === 'Return').length}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">🟡 Expiring (14d)</div>
              <div className="stat-value">
                {products.filter(p => p.assignedStaffId === currentUser.id && p.daysLeft > 0 && p.daysLeft <= 14).length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
