import React, { useState } from 'react';
import { chatbotApi } from '../services/api';
import './ChatbotPage.css';

const LifelaAIPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m Lifela AI, your intelligent health assistant. I\'m here to help you with questions about Thalassemia, diet, care, and support. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Use the Groq chatbot API
      const response = await chatbotApi.sendMessage(inputMessage);
      
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: 'I\'m having trouble connecting right now. Please try again later or contact our support team.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-page">
      <div className="container">
        {/* Header Section */}
        <div className="chatbot-header">
          <div className="header-content">
            <h1 className="gradient-text">Lifela AI Assistant</h1>
            <p>Your intelligent companion for Thalassemia support and guidance</p>
          </div>
          <div className="header-graphic">
            <div className="ai-avatar">
              <div className="avatar-glow"></div>
              <div className="avatar-icon">🧠</div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-avatar">
                  {message.type === 'bot' ? '🧠' : '👤'}
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    <div className="message-text">
                      {message.content.split('\n').map((line, index) => {
                        // Skip empty lines but preserve spacing
                        if (line.trim() === '') {
                          return <div key={index} className="message-line empty-line"></div>;
                        }
                        
                        // Handle bold text **text**
                        let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                        
                        // Handle numbered lists
                        if (/^\d+\.\s/.test(line)) {
                          formattedLine = formattedLine.replace(/^(\d+\.\s)/, '<strong>$1</strong>');
                        }
                        
                        return (
                          <div key={index} className="message-line">
                            <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">🧠</div>
                <div className="message-content">
                  <div className="message-bubble typing">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Section */}
          <div className="chat-input-container">
            <div className="input-wrapper">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about Thalassemia, diet, care, or support..."
                className="chat-input"
                rows="1"
                disabled={isTyping}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="send-button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22,2 15,22 11,13 2,9"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Questions</h3>
          <div className="action-buttons">
            <button 
              onClick={() => setInputMessage("What should I know about diet for Thalassemia?")}
              className="action-btn"
              disabled={isTyping}
            >
              💊 Diet & Nutrition
            </button>
            <button 
              onClick={() => setInputMessage("What are the treatment options?")}
              className="action-btn"
              disabled={isTyping}
            >
              🏥 Treatment Options
            </button>
            <button 
              onClick={() => setInputMessage("What symptoms should I watch for?")}
              className="action-btn"
              disabled={isTyping}
            >
              ⚠️ Symptoms
            </button>
            <button 
              onClick={() => setInputMessage("Where can I find support?")}
              className="action-btn"
              disabled={isTyping}
            >
              🤝 Support Groups
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2>How Lifela AI Can Help You</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Educational Resources</h3>
              <p>Get comprehensive information about Thalassemia, its types, and management strategies.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🍎</div>
              <h3>Dietary Guidance</h3>
              <p>Receive personalized dietary recommendations and nutrition tips for better health.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Lifestyle Tips</h3>
              <p>Learn about lifestyle modifications and daily practices for managing your condition.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔗</div>
              <h3>Resource Connections</h3>
              <p>Find support groups, healthcare providers, and community resources in your area.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifelaAIPage;
