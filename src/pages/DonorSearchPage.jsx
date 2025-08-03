import React, { useState, useEffect } from 'react';
import { supabaseApi } from '../services/api';
import './DonorSearchPage.css';

const DonorSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [donors, setDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [donorForm, setDonorForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    bloodGroup: '',
    location: '',
    lastDonated: ''
  });

  // Fetch all donors on component mount
  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setIsLoading(true);
      const data = await supabaseApi.getDonors();
      setDonors(data);
    } catch (error) {
      console.error('Error fetching donors:', error);
      // Fallback to mock data if API fails
      setDonors([
        { id: 1, full_name: 'Sarah Johnson', blood_type: 'O+', location: 'New York, NY', last_donation_date: '2024-01-15', availability: 'available' },
        { id: 2, full_name: 'Michael Chen', blood_type: 'A-', location: 'Los Angeles, CA', last_donation_date: '2024-02-01', availability: 'available' },
        { id: 3, full_name: 'Emily Rodriguez', blood_type: 'B+', location: 'Chicago, IL', last_donation_date: '2024-01-20', availability: 'available' },
        { id: 4, full_name: 'David Kim', blood_type: 'AB+', location: 'Houston, TX', last_donation_date: '2024-02-10', availability: 'available' },
        { id: 5, full_name: 'Lisa Thompson', blood_type: 'O-', location: 'Phoenix, AZ', last_donation_date: '2024-01-25', availability: 'available' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDonors = donors.filter(donor => {
    const matchesQuery = donor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        donor.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBloodGroup = !bloodGroup || donor.blood_group === bloodGroup;
    const matchesLocation = !location || donor.location?.toLowerCase().includes(location.toLowerCase());
    
    return matchesQuery && matchesBloodGroup && matchesLocation;
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const searchParams = {
        searchQuery: searchQuery || undefined,
        bloodGroup: bloodGroup || undefined,
        location: location || undefined
      };
      
      const data = await supabaseApi.searchDonors(searchParams);
      setDonors(data);
    } catch (error) {
      console.error('Error searching donors:', error);
      // If search fails, filter the existing donors
      fetchDonors();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      const donorData = {
        name: donorForm.name,
        blood_group: donorForm.bloodGroup,
        age: parseInt(donorForm.age) || null,
        location: donorForm.location,
        email: donorForm.email || null,
        phone_number: donorForm.phoneNumber || null,
        last_donated: donorForm.lastDonated || null
      };

      await supabaseApi.registerDonor(donorData);
      
      // Refresh the donors list
      await fetchDonors();
      
      setIsRegistering(false);
      setDonorForm({
        name: '',
        email: '',
        phoneNumber: '',
        bloodGroup: '',
        location: '',
        lastDonated: ''
      });
      
      // Show success message (you could add a toast notification here)
      alert('Donor registered successfully!');
      
    } catch (error) {
      console.error('Error registering donor:', error);
      alert('Failed to register donor. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDonorForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="donor-page">
      <div className="container">
        {/* Header Section */}
        <div className="donor-header">
          <div className="header-content">
            <h1 className="gradient-text">Find Blood Donors</h1>
            <p>Connect with compatible donors and help save lives. Search for donors or register to become one.</p>
          </div>
          <div className="header-graphic">
            <div className="donor-illustration">
              <div className="blood-drop">🩸</div>
              <div className="connection-lines">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-container">
            <h2>Search for Donors</h2>
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-inputs">
                <div className="input-group">
                  <label htmlFor="searchQuery">Search by name or location</label>
                  <input
                    type="text"
                    id="searchQuery"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter name or location..."
                    className="search-input"
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="bloodGroup">Blood Group</label>
                  <select
                    id="bloodGroup"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="search-input"
                  >
                    <option value="">All Blood Groups</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                
                <div className="input-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter city or state..."
                    className="search-input"
                  />
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary search-btn" disabled={isLoading}>
                {isLoading ? '🔍 Searching...' : '🔍 Search Donors'}
              </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        <div className="results-section">
          <div className="results-header">
            <h3>Available Donors ({filteredDonors.length})</h3>
            <button 
              onClick={() => setIsRegistering(true)}
              className="btn btn-secondary"
            >
              ➕ Register as Donor
            </button>
          </div>
          
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading donors...</p>
            </div>
          ) : (
            <div className="donors-grid">
              {filteredDonors.map(donor => (
                <div key={donor.id || donor.name} className="donor-card">
                  <div className="donor-avatar">
                    <div className="avatar-initial">
                      {donor.name?.split(' ').map(n => n[0]).join('') || 'D'}
                    </div>
                    <div className="availability-badge">
                      🟢 Available
                    </div>
                  </div>
                  
                  <div className="donor-info">
                    <h4>{donor.name || 'Anonymous Donor'}</h4>
                    <div className="donor-details">
                      <span className="blood-type">{donor.blood_group}</span>
                      <span className="location">📍 {donor.location}</span>
                      <span className="last-donation">
                        Last donation: {donor.last_donated ? new Date(donor.last_donated).toLocaleDateString() : 'Not specified'}
                      </span>
                      {donor.age && <span className="age">Age: {donor.age}</span>}
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
          )}
          
          {!isLoading && filteredDonors.length === 0 && (
            <div className="no-results">
              <p>No donors found matching your criteria.</p>
              <p>Try adjusting your search parameters or register as a donor to help others.</p>
            </div>
          )}
        </div>

        {/* Registration Modal */}
        {isRegistering && (
          <div className="modal-overlay" onClick={() => setIsRegistering(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Register as a Donor</h2>
                <button 
                  onClick={() => setIsRegistering(false)}
                  className="close-btn"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleRegister} className="registration-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={donorForm.name}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={donorForm.email}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={donorForm.phoneNumber}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="donorBloodGroup">Blood Group *</label>
                    <select
                      id="donorBloodGroup"
                      name="bloodGroup"
                      value={donorForm.bloodGroup}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="donorLocation">Location *</label>
                    <input
                      type="text"
                      id="donorLocation"
                      name="location"
                      value={donorForm.location}
                      onChange={handleInputChange}
                      placeholder="City, State"
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastDonated">Last Donation Date</label>
                    <input
                      type="date"
                      id="lastDonated"
                      name="lastDonated"
                      value={donorForm.lastDonated}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={() => setIsRegistering(false)} className="btn btn-outline">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Register as Donor
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Statistics Section */}
        <div className="stats-section">
          <h2>Donor Network Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-number">{donors.length}+</div>
              <div className="stat-label">Registered Donors</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏥</div>
              <div className="stat-number">150+</div>
              <div className="stat-label">Partner Hospitals</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🩸</div>
              <div className="stat-number">5,000+</div>
              <div className="stat-label">Lives Saved</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🌍</div>
              <div className="stat-number">25</div>
              <div className="stat-label">Cities Covered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorSearchPage;