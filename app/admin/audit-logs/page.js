import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import AuditLogsViewer from '@/app/components/AuditLogsViewer';

export const metadata = {
  title: 'Audit Logs - Admin',
};

export default async function AuditLogsPage() {
  // Check if user is authenticated
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    redirect('/admin/login');
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            Security Audit Logs
          </h1>
          <p style={{ color: '#6b7280' }}>
            View and monitor all security-relevant events and administrative actions
          </p>
        </div>

        <AuditLogsViewer />

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a
            href="/admin/dashboard"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#ffffff',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
