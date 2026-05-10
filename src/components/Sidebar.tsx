import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { User, Product } from '../types';

interface SidebarProps {
  currentUser: User;
  onLogout: () => void;
  products?: Product[];
}

export const Sidebar: React.FC<SidebarProps> = ({ currentUser, onLogout, products = [] }) => {
  const location = useLocation();

  const notificationCount = React.useMemo(() => {
    const relevantProducts = currentUser.role === 'Admin' 
      ? products 
      : products.filter(p => p.assignedStaffId === currentUser.id);
    
    let count = 0;
    relevantProducts.forEach(p => {
      if (p.lifecycle === 'Expired' || p.lifecycle === 'Return Due' || p.daysLeft <= 7) {
        count++;
      }
    });
    return count;
  }, [products, currentUser]);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/products', label: currentUser.role === 'Admin' ? 'Products' : 'My Products', icon: '📦' },
    ...(currentUser.role === 'Admin' ? [
      { path: '/categories', label: 'Categories', icon: '📁' },
      { path: '/staff', label: 'Staff', icon: '👥' },
      { path: '/reports', label: 'Reports', icon: '📊' },
      { path: '/audit', label: 'Audit Log', icon: '📜' },
    ] : []),
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <>
      <div className="sidebar sidebar-desktop">
        <div className="sidebar-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div className="sidebar-logo">🏪 G&G G0018F</div>
            {notificationCount > 0 && (
              <div style={{ 
                background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
                color: 'white',
                fontSize: '12px',
                fontWeight: '800',
                padding: '4px 10px',
                borderRadius: '20px',
                minWidth: '28px',
                textAlign: 'center'
              }}>
                {notificationCount}
              </div>
            )}
          </div>
          
          <div className="sidebar-user">
            <div className="sidebar-user-name">{currentUser.name}</div>
            <div className="sidebar-user-role">{currentUser.role}</div>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <button className="sidebar-logout" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="bottom-nav">
        <nav className="bottom-nav-items">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="bottom-nav-icon">{item.icon}</span>
              <span className="bottom-nav-label">{item.label}</span>
            </Link>
          ))}
          <button className="bottom-nav-item bottom-nav-logout" onClick={onLogout}>
            <span className="bottom-nav-icon">🚪</span>
            <span className="bottom-nav-label">Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
};

