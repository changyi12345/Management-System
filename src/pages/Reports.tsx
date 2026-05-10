import React from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import type { User, Product } from '../types';

interface ReportsProps {
  currentUser: User;
  products: Product[];
}

export const Reports: React.FC<ReportsProps> = ({ currentUser, products }) => {
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
      <h1 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: '800' }}>
        Reports
      </h1>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        View and export reports
      </p>

      <div className="card">
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '800' }}>📊 Export Reports</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="btn" style={{ background: '#2563eb', color: 'white' }} onClick={() => exportToExcel('daily')}>
            📅 Daily Report
          </button>
          <button className="btn" style={{ background: '#10b981', color: 'white' }} onClick={() => exportToExcel('weekly')}>
            📆 Weekly Report
          </button>
          <button className="btn" style={{ background: '#f59e0b', color: 'white' }} onClick={() => exportToExcel('monthly')}>
            🗓️ Monthly Report
          </button>
          <button className="btn" style={{ background: '#1f2937', color: 'white' }} onClick={() => exportToExcel('all')}>
            📊 Full Export
          </button>
        </div>
      </div>
    </div>
  );
};
