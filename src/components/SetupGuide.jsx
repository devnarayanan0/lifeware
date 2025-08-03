import React from 'react';
import { isSupabaseConfigured } from '../services/supabase';

const SetupGuide = ({ children }) => {
  if (isSupabaseConfigured()) {
    return children;
  }

  return (
    <div style={{
      padding: '2rem',
      textAlign: 'center',
      fontFamily: 'Poppins, sans-serif',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{ color: '#667eea', marginBottom: '1rem' }}>🔧 Setup Required</h1>
        <p style={{ color: '#4a5568', marginBottom: '1.5rem' }}>
          To use the full features of this app, you need to configure Supabase.
        </p>
        
        <div style={{
          background: '#f7fafc',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          textAlign: 'left'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>📝 Steps to set up:</h3>
          <ol style={{ color: '#4a5568', lineHeight: '1.6' }}>
            <li>Create a <strong>Supabase project</strong> at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>supabase.com</a></li>
            <li>Create a <strong>.env</strong> file in your project root</li>
            <li>Add your Supabase credentials:</li>
          </ol>
          
          <pre style={{
            background: '#2d3748',
            color: '#e2e8f0',
            padding: '1rem',
            borderRadius: '0.5rem',
            fontSize: '0.9rem',
            overflow: 'auto',
            marginTop: '1rem'
          }}>
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your_supabase_anon_key`}
          </pre>
        </div>
        
        <div style={{
          background: '#fef5e7',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: '1px solid #f6ad55',
          marginBottom: '1.5rem'
        }}>
          <p style={{ color: '#744210', margin: 0, fontSize: '0.9rem' }}>
            <strong>💡 Note:</strong> The app will work with demo data until you configure Supabase.
          </p>
        </div>
        
        <button 
          onClick={() => window.location.reload()} 
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          🔄 Continue with Demo Data
        </button>
      </div>
    </div>
  );
};

export default SetupGuide; 