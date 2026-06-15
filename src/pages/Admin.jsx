import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Shield, Users, Trash2, ShieldAlert, ArrowUpDown, MessageSquare, Database } from 'lucide-react';
import axios from 'axios';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      const [usersRes, chatsRes] = await Promise.all([
        axios.get('/api/v1/users'),
        axios.get('/api/v1/ai/admin/chats')
      ]);
      
      if (usersRes.data?.data?.data) {
        setUsers(usersRes.data.data.data);
      }
      if (chatsRes.data?.data?.data) {
        setChats(chatsRes.data.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load administration database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      await axios.delete(`/api/v1/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      setError('Failed to delete user.');
    }
  };

  const handleToggleRole = async (userItem) => {
    const nextRole = userItem.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change ${userItem.name}'s role to ${nextRole}?`)) return;

    try {
      const res = await axios.patch(`/api/v1/users/${userItem._id}`, { role: nextRole });
      if (res.data?.data?.data) {
        setUsers(prev => 
          prev.map(u => u._id === userItem._id ? res.data.data.data : u)
        );
      }
    } catch (err) {
      setError('Failed to update user role.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      <Sidebar />

      <main style={{ flex: 1, padding: '40px', backgroundColor: 'var(--bg-primary)', overflowY: 'auto' }} className="animate-fade">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={28} color="var(--accent)" />
            Admin Command Center
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage account authorizations, review user catalogs, and inspect real-time AI prompt volumes.</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#fca5a5',
            padding: '12px 16px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
            marginBottom: '24px'
          }}>
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Admin Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Registered Accounts</span>
              <Users size={20} color="var(--primary)" />
            </div>
            <h2>{users.length}</h2>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Global Chat logs Persistent</span>
              <MessageSquare size={20} color="var(--secondary)" />
            </div>
            <h2>{chats.length}</h2>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Active DB Collections</span>
              <Database size={20} color="var(--accent)" />
            </div>
            <h2>3 (User, Chat, Course)</h2>
          </div>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading administrative dashboard logs...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* User Catalog Section */}
            <div className="glass-panel" style={{ borderRadius: '16px', padding: '24px', overflowX: 'auto' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: '#fff' }}>Registered Users</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px 16px' }}>User Details</th>
                    <th style={{ padding: '12px 16px' }}>Email</th>
                    <th style={{ padding: '12px 16px' }}>Role</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={u.photo && u.photo !== 'default.jpg' ? `https://bharat-backend-63qv.onrender.com/public/img/users/${u.photo}` : `https://api.dicebear.com/7.x/adventurer/svg?seed=${u.name}`}
                          alt="Photo"
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 500 }}>{u.name}</span>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{u.email}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: u.role === 'admin' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.05)',
                          color: u.role === 'admin' ? 'var(--accent)' : 'var(--text-secondary)',
                          textTransform: 'uppercase'
                        }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '12px' }}>
                          <button
                            onClick={() => handleToggleRole(u)}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '6px', cursor: 'pointer' }}
                          >
                            <ArrowUpDown size={12} /> Toggle Role
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            style={{
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                              backgroundColor: 'rgba(239, 68, 68, 0.05)'
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* AI Prompts Inspection logs */}
            <div className="glass-panel" style={{ borderRadius: '16px', padding: '24px', overflowX: 'auto' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: '#fff' }}>AI Prompt Inspections</h3>
              {chats.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No AI logs recorded on the database yet.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '12px 16px' }}>Student</th>
                      <th style={{ padding: '12px 16px' }}>Topic</th>
                      <th style={{ padding: '12px 16px' }}>Action</th>
                      <th style={{ padding: '12px 16px' }}>Prompt Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chats.slice(0, 10).map(c => (
                      <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '16px', fontSize: '0.9rem', fontWeight: 500 }}>{c.user?.name || 'Deleted Account'}</td>
                        <td style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>{c.topic}</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor: 'rgba(168, 85, 247, 0.1)',
                            color: 'var(--secondary)'
                          }}>{c.actionType}</span>
                        </td>
                        <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '350px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.prompt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
