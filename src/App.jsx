import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import ChatbotPage from './pages/ChatbotPage';
import DonorSearchPage from './pages/DonorSearchPage';
import RegisterDonorPage from './pages/RegisterDonorPage';
import NotFoundPage from './pages/NotFoundPage';
import SetupGuide from './components/SetupGuide';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <SetupGuide>
      <Router>
        <ScrollToTop />
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/donors" element={<DonorSearchPage />} />
          <Route path="/register-donor" element={<RegisterDonorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </SetupGuide>
  );
}

export default App;