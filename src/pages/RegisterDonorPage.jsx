import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import './RegisterDonorPage.css';

const RegisterDonorPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '',
    age: '',
    location: '',
    email: '',
    phoneNumber: '',
    lastDonated: ''
  });

  const [errors, setErrors] = useState({});

  const bloodGroups = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.bloodGroup) {
      newErrors.bloodGroup = 'Blood group is required';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (parseInt(formData.age) < 18 || parseInt(formData.age) > 65) {
      newErrors.age = 'Age must be between 18 and 65';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.email.trim() && !formData.phoneNumber.trim()) {
      newErrors.email = 'Either email or phone number is required';
      newErrors.phoneNumber = 'Either email or phone number is required';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const donorData = {
        name: formData.name,
        blood_group: formData.bloodGroup,
        age: parseInt(formData.age),
        location: formData.location,
        email: formData.email || null,
        phone_number: formData.phoneNumber || null,
        last_donated: formData.lastDonated || null
      };

      const { data, error } = await supabase
        .from('LIFEWARE')
        .insert([donorData])
        .select();

      if (error) {
        throw new Error(error.message);
      }
      
      setShowSuccess(true);
      
      // Redirect to home page after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error('Error registering donor:', error);
      setErrors({ submit: 'Failed to register. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="register-page">
        <div className="container">
          <div className="success-container">
            <div className="success-icon">✅</div>
            <h1>Registration Successful!</h1>
            <p>Thank you for registering as a donor. Your information has been saved and you can now be contacted by those in need.</p>
                               <div className="success-details">
                     <p><strong>Name:</strong> {formData.name}</p>
                     <p><strong>Blood Group:</strong> {formData.bloodGroup}</p>
                     <p><strong>Location:</strong> {formData.location}</p>
                   </div>
            <p className="redirect-message">Redirecting to home page in a few seconds...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="container">
        {/* Header Section */}
        <div className="register-header">
          <div className="header-content">
            <h1 className="gradient-text">Register as a Donor</h1>
            <p>Join our community of lifesavers. Your registration helps connect those in need with compatible donors.</p>
          </div>
          <div className="header-graphic">
            <div className="donor-illustration">
              <div className="heart-pulse">❤️</div>
              <div className="pulse-rings">
                <div className="ring"></div>
                <div className="ring"></div>
                <div className="ring"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="form-section">
          <div className="form-container">
            <h2>Donor Information</h2>
            <p className="form-subtitle">Please provide your details to help us connect you with those in need.</p>
            
            <form onSubmit={handleSubmit} className="registration-form">
              <div className="form-grid">
                                       {/* Name */}
                       <div className="form-group full-width">
                         <label htmlFor="name">Name *</label>
                         <input
                           type="text"
                           id="name"
                           name="name"
                           value={formData.name}
                           onChange={handleInputChange}
                           className={`form-input ${errors.name ? 'error' : ''}`}
                           placeholder="Enter your full name"
                         />
                         {errors.name && <span className="error-message">{errors.name}</span>}
                       </div>

                       {/* Blood Group */}
                       <div className="form-group">
                         <label htmlFor="bloodGroup">Blood Group *</label>
                         <select
                           id="bloodGroup"
                           name="bloodGroup"
                           value={formData.bloodGroup}
                           onChange={handleInputChange}
                           className={`form-input ${errors.bloodGroup ? 'error' : ''}`}
                         >
                           <option value="">Select Blood Group</option>
                           {bloodGroups.map(group => (
                             <option key={group.value} value={group.value}>
                               {group.label}
                             </option>
                           ))}
                         </select>
                         {errors.bloodGroup && <span className="error-message">{errors.bloodGroup}</span>}
                       </div>

                {/* Age */}
                <div className="form-group">
                  <label htmlFor="age">Age *</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className={`form-input ${errors.age ? 'error' : ''}`}
                    placeholder="Enter your age"
                    min="18"
                    max="65"
                  />
                  {errors.age && <span className="error-message">{errors.age}</span>}
                </div>

                {/* Location */}
                <div className="form-group full-width">
                  <label htmlFor="location">Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`form-input ${errors.location ? 'error' : ''}`}
                    placeholder="City, State"
                  />
                  {errors.location && <span className="error-message">{errors.location}</span>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                </div>

                {/* Last Donation Date */}
                <div className="form-group">
                  <label htmlFor="lastDonated">Last Donation Date</label>
                  <input
                    type="date"
                    id="lastDonated"
                    name="lastDonated"
                    value={formData.lastDonated}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>


              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="submit-error">
                  <span className="error-message">{errors.submit}</span>
                </div>
              )}

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner"></span>
                      Registering...
                    </>
                  ) : (
                    'Register as Donor'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="benefits-section">
          <h2>Why Register as a Donor?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🩸</div>
              <h3>Save Lives</h3>
              <p>Your donation can save up to 3 lives and help patients with Thalassemia and other blood disorders.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🤝</div>
              <h3>Community Support</h3>
              <p>Join a network of compassionate donors dedicated to helping those in need.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📱</div>
              <h3>Easy Matching</h3>
              <p>Our platform makes it easy for patients to find compatible donors quickly.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🏥</div>
              <h3>Professional Network</h3>
              <p>Connect with healthcare professionals and blood banks in your area.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterDonorPage; 