import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '40px 20px',
      textAlign: 'center',
      color: 'var(--text-muted)',
      fontSize: '0.85rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>EduSpark AI</span>
          <span style={{ 
            fontSize: '0.75rem', 
            padding: '2px 8px', 
            background: 'rgba(99, 102, 241, 0.1)', 
            color: 'var(--primary)', 
            borderRadius: '4px', 
            border: '1px solid rgba(99, 102, 241, 0.2)',
            fontWeight: 600
          }}>
            MERN + GEMINI
          </span>
        </div>
        <p style={{ maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          A secure, modular, production-ready Educational platform built following strict enterprise coding architectures.
        </p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: '16px 24px', 
          color: 'var(--text-secondary)',
          fontWeight: 500,
          marginTop: '10px'
        }}>
          <span>React 19</span>
          <span>Node.js</span>
          <span>Express.js</span>
          <span>MongoDB Atlas</span>
          <span>Google Gemini AI</span>
        </div>
        <div style={{ marginTop: '20px', fontSize: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.03)', paddingTop: '20px' }}>
          &copy; {new Date().getFullYear()} EduSpark AI. All rights reserved. Built with passion for modern EdTech.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
