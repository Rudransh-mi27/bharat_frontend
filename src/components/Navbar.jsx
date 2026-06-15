import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User as UserIcon, LogOut, Terminal, LayoutDashboard, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const avatarUrl = user?.photo && user.photo !== 'default.jpg'
    ? `https://bharat-backend-63qv.onrender.com/public/img/users/${user.photo}`
    : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name || 'Guest'}`;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 40px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      height: '70px',
      borderRadius: 0
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)'
        }}>
          <BookOpen size={20} color="white" />
        </div>
        <span style={{
          fontFamily: 'var(--font-title)',
          fontSize: '1.4rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #ffffff 40%, #a855f7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.03em'
        }}>EduSpark <span style={{ color: '#06b6d4', WebkitTextFillColor: 'initial', fontSize: '0.8rem', fontWeight: 600, verticalAlign: 'super', marginLeft: '2px' }}>AI</span></span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {user ? (
          <>
            <Link to="/dashboard" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: isActive('/dashboard') ? '#6366f1' : 'var(--text-secondary)',
              transition: 'color 0.2s'
            }}>
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <Link to="/chat" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: isActive('/chat') ? '#6366f1' : 'var(--text-secondary)',
              transition: 'color 0.2s'
            }}>
              <Terminal size={16} />
              AI Study Buddy
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: isActive('/admin') ? '#06b6d4' : '#0891b2',
                transition: 'color 0.2s'
              }}>
                <Shield size={16} />
                Admin
              </Link>
            )}
            <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-color)' }}></div>
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={avatarUrl}
                alt="Profile"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--primary)'
                }}
                onError={(e) => {
                  e.target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name || 'Guest'}`;
                }}
              />
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user.name.split(' ')[0]}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem',
                color: '#ef4444',
                cursor: 'pointer',
                fontWeight: 500,
                padding: '6px 12px',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--text-primary)'
            }}>
              Sign In
            </Link>
            <Link to="/signup" className="btn-primary" style={{
              padding: '8px 18px',
              fontSize: '0.9rem',
              borderRadius: '10px'
            }}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
