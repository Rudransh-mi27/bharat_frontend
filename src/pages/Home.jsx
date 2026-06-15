import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Terminal, Shield, GraduationCap, ArrowRight, BookOpen, Brain, Layers } from 'lucide-react';
import axios from 'axios';
import Footer from '../components/Footer';

const Home = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const res = await axios.get('/api/v1/courses');
        if (res.data?.data?.data) {
          setCourses(res.data.data.data.slice(0, 3));
        }
      } catch (err) {
        // Safe mock fallback if guest or server offline
      } finally {
        setLoadingCourses(false);
      }
    };
    if (user) fetchCourses();
  }, [user]);

  const displayCourses = user && courses.length > 0 ? courses : [
    {
      title: 'Introduction to Python Programming',
      description: 'Learn the fundamentals of Python syntax, loops, functions, and object-oriented paradigms.',
      level: 'Beginner',
      duration: 12,
      subject: 'Coding',
      instructor: 'Dr. Jane Smith'
    },
    {
      title: 'Calculus I: Limits and Derivatives',
      description: 'A comprehensive study of limits, continuity, derivative techniques, and applications of differentiation.',
      level: 'Intermediate',
      duration: 18,
      subject: 'Math',
      instructor: 'Prof. Alan Turing'
    },
    {
      title: 'Modern Quantum Mechanics',
      description: 'Explore Schrödinger equations, wavefunctions, quantum state operations, and subatomic dynamics.',
      level: 'Advanced',
      duration: 24,
      subject: 'Science',
      instructor: 'Dr. Richard Feynman'
    }
  ];

  return (
    <div className="bg-gradient-mesh" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '100px 20px 80px 20px',
        textAlign: 'center',
        flex: 1
      }} className="animate-slide-up">
        
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '50px',
          padding: '6px 16px',
          color: '#818cf8',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '24px'
        }}>
          <Sparkles size={14} /> Powered by Google Gemini AI
        </div>

        <h1 style={{
          fontSize: '4rem',
          fontWeight: 800,
          lineHeight: '1.15',
          fontFamily: 'var(--font-title)',
          marginBottom: '24px'
        }}>
          Personalized Learning,<br />
          <span className="text-gradient">Supercharged by AI</span>
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          maxWidth: '650px',
          margin: '0 auto 40px auto',
          lineHeight: '1.6'
        }}>
          Master complex coding, science, history, and math topics. Generate quizzes, summarize notes, and learn with an AI tutor that knows your academic profile.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          {user ? (
            <Link to="/dashboard" className="btn-primary">
              Access My Dashboard <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn-primary">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-secondary">
                View Catalog
              </Link>
            </>
          )}
        </div>

        {/* Feature Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginTop: '100px',
          textAlign: 'left'
        }}>
          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{
              background: 'rgba(99, 102, 241, 0.15)',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              color: 'var(--primary)'
            }}>
              <Brain size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>AI Study Buddy</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Engage with an intelligent AI study agent that remembers context, explains topics step-by-step, and creates customized lesson summaries.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{
              background: 'rgba(168, 85, 247, 0.15)',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              color: 'var(--secondary)'
            }}>
              <Terminal size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Mock Test Generator</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Instantly draft multi-subject study quizzes. Choose question count, receive detailed scoring keys, and track your metrics.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{
              background: 'rgba(6, 182, 212, 0.15)',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              color: 'var(--accent)'
            }}>
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Natours-Grade Security</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Built with HTTP-only cookie authentication, XSS filters, NoSQL injection blockers, and rate limiters to protect user credentials and platform data.
            </p>
          </div>
        </div>

        {/* Featured Courses Section */}
        <div style={{ marginTop: '120px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>Featured Courses</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '48px' }}>Start browsing high-quality lecture series compiled by our specialist team.</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            textAlign: 'left'
          }}>
            {displayCourses.map((course, idx) => (
              <div key={idx} className="glass-card" style={{ 
                padding: '24px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                minHeight: '260px',
                position: 'relative',
                overflow: 'hidden'
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
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '20px' }}>
                    {course.description}
                  </p>
                </div>

                <div style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)'
                }}>
                  <span>Instructor: <strong>{course.instructor}</strong></span>
                  <span>{course.duration} hours</span>
                </div>
              </div>
            ))}
          </div>

          {!user && (
            <div style={{ marginTop: '40px' }}>
              <Link to="/login" className="btn-secondary" style={{ gap: '6px' }}>
                Sign in to view all courses <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
