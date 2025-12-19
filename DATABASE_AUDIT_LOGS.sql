-- Audit Logs Table
-- Stores security-relevant events for compliance and incident response
-- Run this SQL to create the audit_logs table in your PostgreSQL database

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL DEFAULT 'INFO',
  user_id INTEGER,
  username VARCHAR(100),
  resource_type VARCHAR(50),
  resource_id VARCHAR(100),
  action VARCHAR(50),
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_username ON audit_logs(username);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_address ON audit_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_audit_logs_success ON audit_logs(success);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_time ON audit_logs(username, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_time ON audit_logs(event_type, timestamp DESC);

-- Comments
COMMENT ON TABLE audit_logs IS 'Security audit log for tracking all system events';
COMMENT ON COLUMN audit_logs.event_type IS 'Type of event (LOGIN_SUCCESS, CREATE, UPDATE, etc.)';
COMMENT ON COLUMN audit_logs.severity IS 'Severity level: INFO, WARNING, ERROR, CRITICAL';
COMMENT ON COLUMN audit_logs.details IS 'JSON object with additional event details';
COMMENT ON COLUMN audit_logs.ip_address IS 'Client IP address (supports IPv4 and IPv6)';
COMMENT ON COLUMN audit_logs.success IS 'Whether the operation was successful';

-- Optional: Create a function to automatically delete old audit logs
-- Uncomment if you want to auto-delete logs older than 90 days
/*
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM audit_logs 
  WHERE timestamp < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-audit-logs', '0 0 * * 0', 'SELECT cleanup_old_audit_logs()');
*/
