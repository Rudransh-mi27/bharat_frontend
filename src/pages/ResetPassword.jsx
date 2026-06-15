import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Lock, ShieldCheck, ShieldAlert } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState('');
  const { refetchMe } = useAuth(); // To sync user state upon reset
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    
    if (password !== passwordConfirm) {
      setErr('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setErr('Password must be at least 8 characters.');
      return;
    }

    setLocalLoading(true);

    try {
      const res = await axios.patch(`/api/v1/users/resetPassword/${token}`, {
        password,
        passwordConfirm
      });
      
      setSuccess(true);
      
      // Let the browser load cookie and sync authentication context
      await refetchMe();
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      setErr(error.response?.data?.message || 'Token is invalid or has expired.');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="bg-gradient-mesh" style={{
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div className="glass-panel animate-slide-up" style={{
        width: '100%',
        maxWidth: '450px',
        borderRadius: '24px',
        padding: '40px 32px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-title)', marginBottom: '8px' }}>Setup New Password</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enter and confirm your new secure account password.</p>
        </div>

        {success && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: '#a7f3d0',
            padding: '16px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.88rem',
            marginBottom: '24px'
          }}>
            <ShieldCheck size={20} style={{ color: 'var(--success)', flexShrink: 0 }} />
            <span>Password reset successful! Redirecting...</span>
          </div>
        )}

        {err && (
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
            <span>{err}</span>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="password">New Password (min 8 chars)</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '48px', width: '100%' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="passwordConfirm">Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                <input
                  id="passwordConfirm"
                  type="password"
                  placeholder="••••••••"
                  className="form-input"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  style={{ paddingLeft: '48px', width: '100%' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '14px', marginTop: '10px' }}
              disabled={localLoading}
            >
              {localLoading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Back to{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
