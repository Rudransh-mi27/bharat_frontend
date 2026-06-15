import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { BookOpen, Terminal, Sparkles, Brain, Award, Search, Layers, BookCheck, HelpCircle } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [metrics, setMetrics] = useState({ totalQuestions: 0, byTopic: { Math: 0, Science: 0, Coding: 0, General: 0, History: 0, Languages: 0 } });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [coursesRes, metricsRes] = await Promise.all([
          axios.get('/api/v1/courses'),
          axios.get('/api/v1/ai/metrics')
        ]);
        
        if (coursesRes.data?.data?.data) {
          setCourses(coursesRes.data.data.data);
        }
        if (metricsRes.data?.data) {
          setMetrics(metricsRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleEnroll = (courseId, courseTitle) => {
    if (enrolledCourses.includes(courseId)) return;
    setEnrolledCourses([...enrolledCourses, courseId]);
    
    // Update local state to reflect simulated count
    setCourses(prev =>
      prev.map(c => c._id === courseId ? { ...c, enrollmentCount: c.enrollmentCount + 1 } : c)
    );
  };

  const handleQuickAction = (actionType) => {
    // Navigates to AI study console with preset configurations
    navigate('/chat', { state: { presetAction: actionType } });
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      <Sidebar />
      
      <main style={{ flex: 1, padding: '40px', backgroundColor: 'var(--bg-primary)', overflowY: 'auto' }} className="animate-fade">
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Welcome back, {user?.name}!</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Track your courses, metrics, and collaborate with your AI Study Buddy.</p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'var(--bg-secondary)',
            padding: '10px 20px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}>
            <Sparkles size={16} color="var(--accent)" />
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Account Rank: {user?.role?.toUpperCase()}</span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Active Courses</span>
              <BookOpen size={20} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '4px' }}>{courses.length}</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Curated learning tracks available</p>
          </div>

          <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>AI Queries</span>
              <Terminal size={20} color="var(--secondary)" />
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '4px' }}>{metrics.totalQuestions}</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Conversations with Study Buddy</p>
          </div>

          <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Enrolled Lectures</span>
              <BookCheck size={20} color="var(--accent)" />
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '4px' }}>{enrolledCourses.length}</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lectures you are actively taking</p>
          </div>

          <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--success)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>AI Core Topic</span>
              <Brain size={20} color="var(--success)" />
            </div>
            <h2 style={{ fontSize: '1.25rem', padding: '6px 0', textTransform: 'capitalize' }}>
              {Object.keys(metrics.byTopic).reduce((a, b) => metrics.byTopic[a] > metrics.byTopic[b] ? a : b, 'None') === 'None' || metrics.totalQuestions === 0
                ? 'No activity'
                : Object.keys(metrics.byTopic).reduce((a, b) => metrics.byTopic[a] > metrics.byTopic[b] ? a : b)
              }
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Based on your chat logs</p>
          </div>
        </div>

        {/* AI Quick Tasks Banner */}
        <div className="glass-panel" style={{
          padding: '30px',
          borderRadius: '16px',
          marginBottom: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          boxShadow: '0 8px 30px rgba(99, 102, 241, 0.05)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '6px', color: '#fff' }}>Need fast assistance with your studies?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Choose a quick task to start prompting your Google Gemini study advisor.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => handleQuickAction('explain')} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '10px 16px' }}>
              <Brain size={16} color="var(--primary)" /> Explain a Concept
            </button>
            <button onClick={() => handleQuickAction('quiz')} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '10px 16px' }}>
              <HelpCircle size={16} color="var(--secondary)" /> Generate Quiz
            </button>
            <button onClick={() => handleQuickAction('summarize')} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '10px 16px' }}>
              <Layers size={16} color="var(--accent)" /> Summarize Notes
            </button>
          </div>
        </div>

        {/* Courses Listing */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h2 style={{ fontSize: '1.6rem' }}>Available Lecture Series</h2>
            
            {/* Search inputs */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
              <input
                type="text"
                placeholder="Search subject, level, titles..."
                className="form-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '44px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', width: '100%', borderRadius: '10px' }}
              />
            </div>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading lectures...</p>
          ) : filteredCourses.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No courses matched your query.</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {filteredCourses.map((course) => (
                <div key={course._id} className="glass-card" style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '260px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: course.level === 'Beginner' ? '#10b981' : course.level === 'Intermediate' ? '#f59e0b' : '#ef4444'
                  }}>
                    {course.level}
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                      {course.subject}
                    </div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#fff', lineHeight: '1.4' }}>{course.title}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '20px' }}>
                      {course.description}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span>Instructor: <strong>{course.instructor}</strong></span>
                      <span>{course.duration} hours</span>
                    </div>

                    <button
                      onClick={() => handleEnroll(course._id, course.title)}
                      className={enrolledCourses.includes(course._id) ? 'btn-secondary' : 'btn-primary'}
                      style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '0.85rem',
                        borderRadius: '10px',
                        cursor: enrolledCourses.includes(course._id) ? 'default' : 'pointer'
                      }}
                    >
                      {enrolledCourses.includes(course._id)
                        ? `Enrolled ✓ (${course.enrollmentCount} total)`
                        : `Enroll in Course (${course.enrollmentCount} enrolled)`
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
