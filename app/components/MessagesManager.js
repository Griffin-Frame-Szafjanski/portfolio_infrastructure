'use client'

import { useState, useEffect } from 'react';

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    try {
      const response = await fetch('/api/admin/messages');
      const result = await response.json();
      
      if (result.success) {
        setMessages(result.data || []);
        setUnreadCount(result.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleRead(id, currentReadStatus) {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !currentReadStatus })
      });

      const result = await response.json();
      if (result.success) {
        await loadMessages();
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  }

  async function deleteMessage(id) {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        await loadMessages();
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }

  return (
    <div className="messages-manager">
      <div className="messages-header">
        <h2>Contact Messages</h2>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount} Unread</span>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="no-messages">
          <p>No messages yet</p>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message-card ${!message.read ? 'unread' : ''}`}
            >
              <div className="message-header" onClick={() => setExpandedId(expandedId === message.id ? null : message.id)}>
                <div className="message-info">
                  <div className="message-from">
                    {!message.read && <span className="unread-dot"></span>}
                    <strong>{message.name}</strong>
                    <span className="message-email">({message.email})</span>
                  </div>
                  <div className="message-subject">{message.subject}</div>
                  <div className="message-date">{formatDate(message.created_at)}</div>
                </div>
                <button className="expand-btn">
                  {expandedId === message.id ? '▼' : '▶'}
                </button>
              </div>

              {expandedId === message.id && (
                <div className="message-body">
                  <div className="message-content">
                    <p>{message.message}</p>
                  </div>
                  <div className="message-actions">
                    <button 
                      onClick={() => toggleRead(message.id, message.read)}
                      className="btn btn-secondary btn-sm"
                    >
                      Mark as {message.read ? 'Unread' : 'Read'}
                    </button>
                    <button 
                      onClick={() => deleteMessage(message.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                    <a 
                      href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                      className="btn btn-primary btn-sm"
                    >
                      Reply via Email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .messages-manager {
          max-width: 900px;
        }

        .messages-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        .messages-header h2 {
          margin: 0;
        }

        .unread-badge {
          background: var(--color-danger);
          color: white;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 600;
        }

        .no-messages {
          text-align: center;
          padding: var(--spacing-2xl);
          color: var(--color-text-light);
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .message-card {
          background: white;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: var(--transition);
        }

        .message-card.unread {
          border-color: var(--color-primary);
          background: #f0f4ff;
        }

        .message-header {
          padding: var(--spacing-md);
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .message-header:hover {
          background: rgba(0, 0, 0, 0.02);
        }

        .message-info {
          flex: 1;
        }

        .message-from {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-xs);
        }

        .unread-dot {
          width: 8px;
          height: 8px;
          background: var(--color-primary);
          border-radius: 50%;
        }

        .message-email {
          color: var(--color-text-light);
          font-size: 0.875rem;
        }

        .message-subject {
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
        }

        .message-date {
          font-size: 0.875rem;
          color: var(--color-text-light);
        }

        .expand-btn {
          background: none;
          border: none;
          font-size: 1.25rem;
          color: var(--color-text-light);
          cursor: pointer;
          padding: var(--spacing-sm);
        }

        .message-body {
          border-top: 1px solid var(--color-border);
          padding: var(--spacing-md);
        }

        .message-content {
          margin-bottom: var(--spacing-md);
          padding: var(--spacing-md);
          background: white;
          border-radius: var(--radius-md);
        }

        .message-content p {
          margin: 0;
          white-space: pre-wrap;
          line-height: 1.6;
        }

        .message-actions {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .btn-danger {
          background: var(--color-danger);
          color: white;
        }

        .btn-danger:hover {
          background: #c53030;
        }
      `}</style>
    </div>
  );
}
