'use client';

import { useState, useEffect } from 'react';

export default function AuditLogsViewer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    eventType: '',
    severity: '',
    username: '',
  });
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false
  });

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString(),
        ...(filters.eventType && { eventType: filters.eventType }),
        ...(filters.severity && { severity: filters.severity }),
        ...(filters.username && { username: filters.username }),
      });

      const response = await fetch(`/api/admin/audit-logs?${params}`);
      const data = await response.json();

      if (data.success) {
        setLogs(data.data.logs);
        setPagination(data.data.pagination);
      } else {
        setError(data.error || 'Failed to fetch audit logs');
      }
    } catch (err) {
      setError('An error occurred while fetching audit logs');
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [pagination.offset, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, offset: 0 })); // Reset to first page
  };

  const handleNextPage = () => {
    if (pagination.hasMore) {
      setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.offset > 0) {
      setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }));
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'rgb(153, 27, 27)'; // red-900
      case 'ERROR': return 'rgb(185, 28, 28)'; // red-700
      case 'WARNING': return 'rgb(161, 98, 7)'; // yellow-700
      case 'INFO': return 'rgb(29, 78, 216)'; // blue-700
      default: return 'rgb(55, 65, 81)'; // gray-700
    }
  };

  const getSuccessColor = (success) => {
    return success ? 'rgb(21, 128, 61)' : 'rgb(185, 28, 28)'; // green-700 : red-700
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDetails = (details) => {
    if (!details) return 'N/A';
    if (typeof details === 'string') {
      try {
        return JSON.stringify(JSON.parse(details), null, 2);
      } catch {
        return details;
      }
    }
    return JSON.stringify(details, null, 2);
  };

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
        Audit Logs
      </h2>

      {/* Filters */}
      <div style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Event Type
          </label>
          <select
            value={filters.eventType}
            onChange={(e) => handleFilterChange('eventType', e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              color: '#111827',
              backgroundColor: '#ffffff'
            }}
          >
            <option value="">All Events</option>
            <option value="LOGIN_SUCCESS">Login Success</option>
            <option value="LOGIN_FAILURE">Login Failure</option>
            <option value="LOGOUT">Logout</option>
            <option value="PASSWORD_CHANGE">Password Change</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="FILE_UPLOAD">File Upload</option>
            <option value="RATE_LIMIT_EXCEEDED">Rate Limit Exceeded</option>
            <option value="UNAUTHORIZED_ACCESS">Unauthorized Access</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Severity
          </label>
          <select
            value={filters.severity}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              color: '#111827',
              backgroundColor: '#ffffff'
            }}
          >
            <option value="">All Severities</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Warning</option>
            <option value="ERROR">Error</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Username
          </label>
          <input
            type="text"
            value={filters.username}
            onChange={(e) => handleFilterChange('username', e.target.value)}
            placeholder="Filter by username..."
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              color: '#111827',
              backgroundColor: '#ffffff'
            }}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          Loading audit logs...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '0.375rem', color: '#991b1b' }}>
          {error}
        </div>
      )}

      {/* Logs Table */}
      {!loading && !error && logs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          No audit logs found
        </div>
      )}

      {!loading && !error && logs.length > 0 && (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#111827' }}>Timestamp</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#111827' }}>Event</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#111827' }}>Severity</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#111827' }}>User</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#111827' }}>Action</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#111827' }}>Resource</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#111827' }}>IP Address</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#111827' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem', color: '#374151' }}>
                      {formatDate(log.timestamp)}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#111827', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {log.event_type}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#ffffff',
                        backgroundColor: getSeverityColor(log.severity)
                      }}>
                        {log.severity}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#111827' }}>
                      {log.username || 'anonymous'}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#374151' }}>
                      {log.action || 'N/A'}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#374151' }}>
                      {log.resource_type && log.resource_id
                        ? `${log.resource_type}/${log.resource_id}`
                        : 'N/A'}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#374151', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {log.ip_address || 'unknown'}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#ffffff',
                        backgroundColor: getSuccessColor(log.success)
                      }}>
                        {log.success ? '✓ Success' : '✗ Failed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} logs
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handlePrevPage}
                disabled={pagination.offset === 0}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  backgroundColor: pagination.offset === 0 ? '#f3f4f6' : '#ffffff',
                  color: pagination.offset === 0 ? '#9ca3af' : '#374151',
                  cursor: pagination.offset === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={!pagination.hasMore}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  backgroundColor: !pagination.hasMore ? '#f3f4f6' : '#ffffff',
                  color: !pagination.hasMore ? '#9ca3af' : '#374151',
                  cursor: !pagination.hasMore ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
