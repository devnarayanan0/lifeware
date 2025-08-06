import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { mockDonors } from '../data/mockDonors';
import './HomePage.css';

const HomePage = () => {
  const [lifewareData, setLifewareData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    const fetchLifewareData = async () => {
      try {
        const { data, error } = await supabase
          .from('LIFEWARE') // Important: match table name exactly
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          console.error('Error fetching data from LIFEWARE:', error);
          setLifewareData([]);
        } else {
          setLifewareData(data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLifewareData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLifewareData();
  }, []);

  // Filter donors based on search criteria
  const filteredDonors = lifewareData.filter(donor => {
    const matchesSearch = !searchQuery || 
      donor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBloodGroup = !bloodGroupFilter || 
      donor.blood_group === bloodGroupFilter;
    
    const matchesLocation = !locationFilter || 
      donor.location?.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesBloodGroup && matchesLocation;
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="highlight">Lifeware Collective</span>
          </h1>
          <p className="hero-subtitle">
            Your comprehensive platform for Thalassemia support, donor search, and AI-powered health guidance.
            Together, we're building a stronger, healthier community.
          </p>
          
          {/* Live Donor Stats */}
          <div className="live-stats">
            <div className="stats-badge">
              <div className="stats-icon">🩸</div>
              <div className="stats-content">
                <div className="stats-number">
                  {loading ? (
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    `25+`
                  )}
                </div>
                <div className="stats-label">Currently registered donors</div>
              </div>
            </div>
          </div>
          
          <div className="hero-buttons">
            <Link to="/donors" className="btn btn-secondary hero-btn-secondary">
              <span className="btn-icon">🔍</span>
              Find Donors
            </Link>
            <Link to="/register-donor" className="btn btn-secondary hero-btn-secondary">
              <span className="btn-icon">❤️</span>
              Become a Donor
            </Link>
            <Link to="/chatbot" className="btn btn-primary hero-btn-primary">
              <span className="btn-icon">🤖</span>
              Lifelaa
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-graphic">
            <div className="pulse-circle"></div>
            <div className="heart-icon">❤️</div>
          </div>
        </div>
      </section>

      {/* Donor List Section */}
      <section className="donor-list-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Donors</h2>
            <p className="section-subtitle">
              Preview of our registered donors. Visit the donors page to see all available donors.
            </p>
            <Link to="/donors" className="btn btn-primary">
              View All Donors
            </Link>
          </div>

           
          {/* Donor Grid */}
          <div className="donor-grid">
            {mockDonors.slice(0, 3).map((donor) => (
              <div key={donor.id} className="donor-card">
                <div className="donor-avatar">
                  <div className="avatar-initial">
                    {donor.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'D'}
                  </div>
                  <div className="availability-badge">
                    🟢 {donor.availability || 'Available'}
                  </div>
                </div>
                <div className="donor-info">
                  <h3 className="donor-name">{donor.full_name}</h3>
                  <div className="donor-details">
                    <span className="blood-group">{donor.blood_type}</span>
                    <span className="location">📍 {donor.location}</span>
                    {donor.age && <span className="age">Age: {donor.age}</span>}
                    {donor.last_donation_date && (
                      <span className="last-donation">
                        Last donation: {new Date(donor.last_donation_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="donor-actions">
                  <button className="btn btn-outline contact-btn">
                    📞 Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">How We Help</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Donor Search</h3>
              <p>Find compatible blood donors quickly and efficiently with our advanced matching system.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Health Assistant</h3>
              <p>Get personalized health guidance and support through our intelligent chatbot.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Community Support</h3>
              <p>Connect with others facing similar challenges and share experiences.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Educational Resources</h3>
              <p>Access comprehensive information about Thalassemia and treatment options.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{lifewareData.length}+</div>
              <div className="stat-label">Donors Registered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">Lives Saved</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">AI Support</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About Thalassemia</h2>
              <p>
                Thalassemia is a genetic blood disorder that affects the body's ability to produce hemoglobin. 
                Our platform is dedicated to supporting individuals and families affected by this condition, 
                providing them with the resources and connections they need to lead healthier lives.
              </p>
              <p>
                Through our innovative donor matching system and AI-powered health assistant, 
                we're making it easier than ever to find the support you need when you need it most.
              </p>
            </div>
            <div className="about-image">
              <div className="about-graphic">
                <div className="dna-helix">🧬</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Make a Difference?</h2>
          <p>Join our community of lifesavers and help those in need.</p>
          <div className="cta-buttons">
            <Link to="/register-donor" className="btn btn-primary">
              Register as Donor
            </Link>
            <Link to="/donors" className="btn btn-primary">
              Find Donors
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container" >
          <p>&copy; 2025 Lifeware Collective.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;