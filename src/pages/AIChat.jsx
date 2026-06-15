import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Send, Trash2, Sparkles, Brain, Code, FileText, BookOpen, AlertCircle } from 'lucide-react';
import axios from 'axios';

const AIChat = () => {
  const { user } = useAuth();
  const location = useLocation();
  const messagesEndRef = useRef(null);

  const [chats, setChats] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [topic, setTopic] = useState('General');
  const [actionType, setActionType] = useState('chat');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [historyLoading, setHistoryLoading] = useState(true);

  // Sync scroll to the bottom of the chat logs
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Check navigation state for presets passed from dashboard
  useEffect(() => {
    if (location.state && location.state.presetAction) {
      const action = location.state.presetAction;
      setActionType(action);
      if (action === 'explain') {
        setPrompt('Explain the core concept of: ');
      } else if (action === 'quiz') {
        setPrompt('Generate a 5-question multiple choice quiz on: ');
      } else if (action === 'summarize') {
        setPrompt('Summarize the key study notes for: ');
      }
    }
  }, [location.state]);

  // Fetch past conversations on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setHistoryLoading(true);
        const res = await axios.get('/api/v1/ai/history');
        if (res.data?.data?.chats) {
          // Sync history (ascending order for thread representation)
          setChats(res.data.data.chats.reverse());
        }
      } catch (err) {
        console.error('Failed to load chat history', err);
      } finally {
        setHistoryLoading(false);
        setTimeout(scrollToBottom, 100);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setError('');
    const userPrompt = prompt;
    setPrompt('');
    setLoading(true);

    // Append user message immediately to interface
    const tempUserMessage = {
      _id: `temp-${Date.now()}`,
      prompt: userPrompt,
      response: '',
      topic,
      actionType,
      user: { name: user.name },
      createdAt: new Date()
    };
    setChats(prev => [...prev, tempUserMessage]);

    try {
      const res = await axios.post('/api/v1/ai/ask', {
        prompt: userPrompt,
        topic,
        actionType
      });

      if (res.data?.data?.chat) {
        // Replace temporary entry with actual DB logged response
        setChats(prev => 
          prev.map(c => c._id === tempUserMessage._id ? res.data.data.chat : c)
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || 'AI assistant request failed. Rate limit exceeded?');
      // Remove the failed temporary message
      setChats(prev => prev.filter(c => c._id !== tempUserMessage._id));
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your conversation history?')) return;
    try {
      await axios.delete('/api/v1/ai/history');
      setChats([]);
    } catch (err) {
      setError('Could not clear history.');
    }
  };

  const handleApplyTemplate = (type, topicLabel) => {
    setActionType(type);
    setTopic(topicLabel);
    if (type === 'explain') {
      setPrompt(`Explain the concept of quantum computing in simple terms.`);
    } else if (type === 'quiz') {
      setPrompt(`Generate a 3-question multiple choice quiz on Javascript arrays.`);
    } else if (type === 'summarize') {
      setPrompt(`Summarize the main events of World War I.`);
    }
  };

  // Helper formatting engine (Bold notes, Code blocks and Linebreaks)
  const formatText = (text) => {
    if (!text) return '';
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code style="background: rgba(255, 255, 255, 0.1); padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #a855f7;">$1</code>')
      .replace(/\n/g, '<br />');
    return <div dangerouslySetInnerHTML={{ __html: formatted }} style={{ lineHeight: '1.6', fontSize: '0.95rem' }} />;
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      <Sidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
        
        {/* Chat Header */}
        <div style={{
          padding: '20px 40px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-secondary)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="var(--primary)" />
              AI Study Buddy
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Powered by Google Gemini Generative AI</p>
          </div>
          {chats.length > 0 && (
            <button
              onClick={handleClearHistory}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                color: '#ef4444',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={14} /> Clear Chat
            </button>
          )}
        </div>

        {/* Error Notification banner */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            padding: '12px 40px',
            borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#fca5a5',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.88rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Message Thread Feed */}
        <div style={{ flex: 1, padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {historyLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Fetching history log...</p>
            </div>
          ) : chats.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              maxWidth: '500px',
              margin: '0 auto',
              gap: '20px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: 'rgba(99, 102, 241, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}>
                <Brain size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>No conversations yet</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Ask your study buddy to explain concepts, generate quizzes, or summarize complex notes. Choose a quick template to start:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '10px' }}>
                <button onClick={() => handleApplyTemplate('quiz', 'Coding')} className="btn-secondary" style={{ fontSize: '0.85rem', width: '100%', justifyContent: 'flex-start', padding: '12px' }}>
                  <Code size={16} color="var(--primary)" /> Generate Javascript Quiz
                </button>
                <button onClick={() => handleApplyTemplate('explain', 'Science')} className="btn-secondary" style={{ fontSize: '0.85rem', width: '100%', justifyContent: 'flex-start', padding: '12px' }}>
                  <Brain size={16} color="var(--secondary)" /> Explain Quantum Computing
                </button>
                <button onClick={() => handleApplyTemplate('summarize', 'History')} className="btn-secondary" style={{ fontSize: '0.85rem', width: '100%', justifyContent: 'flex-start', padding: '12px' }}>
                  <FileText size={16} color="var(--accent)" /> Summarize World War I History
                </button>
              </div>
            </div>
          ) : (
            chats.map((chat) => (
              <div key={chat._id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {/* User Prompt */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    padding: '16px 20px',
                    borderRadius: '16px 16px 0 16px',
                    maxWidth: '80%',
                    color: 'white'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px', display: 'flex', gap: '8px' }}>
                      <span>You</span>
                      <span>•</span>
                      <span>{chat.topic}</span>
                    </div>
                    <p style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{chat.prompt}</p>
                  </div>
                </div>

                {/* AI Response */}
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    padding: '20px',
                    borderRadius: '16px 16px 16px 0',
                    maxWidth: '85%',
                    color: 'var(--text-primary)'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={12} />
                      <span>EduSpark Study Buddy</span>
                    </div>
                    {chat.response ? (
                      formatText(chat.response)
                    ) : (
                      <div style={{ display: 'flex', gap: '4px', padding: '8px 0' }}>
                        <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--text-muted)', borderRadius: '50%', animation: 'bounce 0.6s infinite alternate' }}></div>
                        <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--text-muted)', borderRadius: '50%', animation: 'bounce 0.6s infinite alternate 0.2s' }}></div>
                        <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--text-muted)', borderRadius: '50%', animation: 'bounce 0.6s infinite alternate 0.4s' }}></div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))
          )}
          
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>AI Study Buddy is drafting response...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Form */}
        <form onSubmit={handleSubmit} style={{
          padding: '24px 40px',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Controls Dropdown selectors */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Topic:</span>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem'
                }}
              >
                <option value="General">General</option>
                <option value="Math">Mathematics</option>
                <option value="Science">Sciences</option>
                <option value="Coding">Computer Science</option>
                <option value="History">History</option>
                <option value="Languages">Languages</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Task:</span>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem'
                }}
              >
                <option value="chat">General Conversation</option>
                <option value="explain">Explain Concept</option>
                <option value="quiz">Generate Practice Quiz</option>
                <option value="summarize">Summarize Text</option>
              </select>
            </div>
          </div>

          {/* Prompt Message bar */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Ask your Study Buddy anything..."
              className="form-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{ flex: 1, padding: '14px 18px', borderRadius: '10px' }}
              disabled={loading}
              required
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '14px 20px', borderRadius: '10px', height: '48px', flexShrink: 0 }}
              disabled={loading}
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </main>
      
      <style>{`
        @keyframes bounce {
          to { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default AIChat;
