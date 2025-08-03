import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => (
  <nav className="navbar">
    <div className="nav-container">
      <div className="nav-brand">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">❤️</span>
          <h2>Lifeware Collective</h2>
        </Link>
      </div>
      
      <ul className="nav-menu">
        <li><Link to="/" className="nav-link">Home</Link></li>
        <li><Link to="/donors" className="nav-link">Find Donors</Link></li>
        <li><Link to="/register-donor" className="nav-link nav-link-primary">Register as Donor</Link></li>
        <li><Link to="/chatbot" className="nav-link">AI Health Assistant</Link></li>
      </ul>
    </div>
  </nav>
);

export default NavBar;