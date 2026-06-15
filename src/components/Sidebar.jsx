import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Terminal, User, Shield, GraduationCap } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      height: 'calc(100vh - 70px)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      position: 'sticky',
      top: '70px',
      overflowY: 'auto'
    }}>
      <div style={{ padding: '0 12px 12px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Navigation</p>
      </div>

      <NavLink
        to="/dashboard"
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          borderRadius: '10px',
          color: isActive ? 'white' : 'var(--text-secondary)',
          backgroundColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
          borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
          fontWeight: isActive ? 600 : 500,
          transition: 'all 0.2s'
        })}
      >
        <LayoutDashboard size={18} />
        Dashboard
      </NavLink>

      <NavLink
        to="/chat"
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          borderRadius: '10px',
          color: isActive ? 'white' : 'var(--text-secondary)',
          backgroundColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
          borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
          fontWeight: isActive ? 600 : 500,
          transition: 'all 0.2s'
        })}
      >
        <Terminal size={18} />
        AI Study Buddy
      </NavLink>

      <NavLink
        to="/profile"
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          borderRadius: '10px',
          color: isActive ? 'white' : 'var(--text-secondary)',
          backgroundColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
          borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
          fontWeight: isActive ? 600 : 500,
          transition: 'all 0.2s'
        })}
      >
        <User size={18} />
        My Profile
      </NavLink>

      {user?.role === 'admin' && (
        <>
          <div style={{ padding: '24px 12px 12px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px', marginTop: '16px' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Management</p>
          </div>

          <NavLink
            to="/admin"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '10px',
              color: isActive ? '#22d3ee' : '#0891b2',
              backgroundColor: isActive ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
              borderLeft: isActive ? '3px solid #06b6d4' : '3px solid transparent',
              fontWeight: isActive ? 600 : 500,
              transition: 'all 0.2s'
            })}
          >
            <Shield size={18} />
            Admin Panel
          </NavLink>
        </>
      )}
      
      <div style={{ marginTop: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }} className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GraduationCap size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>EduSpark Assistant</span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Use our Gemini AI system to draft essays, solve coding queries, and generate quizzes in real time.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
