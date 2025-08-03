import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
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
            <h1 style={{ color: '#e53e3e', marginBottom: '1rem' }}>🚨 Something went wrong</h1>
            <p style={{ color: '#4a5568', marginBottom: '1.5rem' }}>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ 
                background: '#f7fafc', 
                padding: '1rem', 
                borderRadius: '0.5rem',
                marginTop: '1rem',
                textAlign: 'left'
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Error Details (Development)
                </summary>
                <pre style={{ 
                  fontSize: '0.8rem', 
                  color: '#e53e3e',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap'
                }}>
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            
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
                fontWeight: '600',
                marginTop: '1rem'
              }}
            >
              🔄 Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 