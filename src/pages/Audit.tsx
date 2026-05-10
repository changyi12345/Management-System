import React from 'react';
import type { AuditLog as AuditLogType } from '../types';

interface AuditProps {
  auditLogs: AuditLogType[];
}

export const Audit: React.FC<AuditProps> = ({ auditLogs }) => {
  return (
    <div>
      <h1 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: '800' }}>
        Audit Log
      </h1>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        View system activity
      </p>

      <div className="card">
        <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>Audit Trail</h3>
        {auditLogs.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No logs yet</p>
        ) : (
          auditLogs.slice(0, 50).map(log => (
            <div key={log.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: '600' }}>{log.action}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {log.userName} - {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
