import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { User, Mail, ShieldCheck, ShieldAlert, Upload, Shield } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, loading } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const [success, setSuccess] = useState('');
  const [err, setErr] = useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErr('Only image files are permitted.');
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setSuccess('');

    if (!name || !email) {
      setErr('Name and email are required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setPhotoFile(null); // Clean up uploaded file reference
    } catch (error) {
      setErr(error.message);
    }
  };

  const avatarUrl = photoPreview || (user?.photo && user.photo !== 'default.jpg'
    ? `https://bharat-backend-63qv.onrender.com/public/img/users/${user.photo}`
    : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name || 'Guest'}`);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      <Sidebar />

      <main style={{ flex: 1, padding: '40px', backgroundColor: 'var(--bg-primary)', overflowY: 'auto' }} className="animate-fade">
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Profile Settings</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Update your account credentials, avatar, and review security levels.</p>
          </div>

          {/* Success Notification */}
          {success && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              color: '#a7f3d0',
              padding: '12px 16px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.88rem',
              marginBottom: '24px'
            }}>
              <ShieldCheck size={18} style={{ color: 'var(--success)' }} />
              <span>{success}</span>
            </div>
          )}

          {/* Error Notification */}
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

          {/* Profile Card Container */}
          <div className="glass-panel" style={{ borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Photo Upload segment */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--primary)',
                    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.2)'
                  }}
                  onError={(e) => {
                    e.target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name || 'Guest'}`;
                  }}
                />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="photo" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer', gap: '8px' }}>
                    <Upload size={14} /> Upload Custom Photo
                  </label>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>JPG, PNG or SVG. Max 5MB.</span>
                </div>
              </div>

              {/* Form Input fields */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                    <input
                      id="name"
                      type="text"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ paddingLeft: '48px', width: '100%' }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                    <input
                      id="email"
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ paddingLeft: '48px', width: '100%' }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Access Role (Disabled view) */}
              <div className="form-group" style={{ maxWidth: '300px' }}>
                <label className="form-label">Platform Role</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  color: 'var(--text-secondary)'
                }}>
                  <Shield size={16} color="var(--primary)" />
                  <span style={{ fontSize: '0.9rem', textTransform: 'capitalize' }}>{user?.role}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '10px' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ minWidth: '150px' }}
                  disabled={loading}
                >
                  {loading ? 'Saving Changes...' : 'Save Settings'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
