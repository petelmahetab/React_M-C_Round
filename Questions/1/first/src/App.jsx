
import React, { useState } from 'react';
import './index.css';

const App = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    
 
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

  
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation on touched fields
    if (touched[name]) {
      validate();
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validate();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        alert('Form Submitted Successfully! 🎉');
        setIsSubmitting(false);
        setForm({ name: '', email: '', password: '' });
        setTouched({});
        setErrors({});
      }, 1000);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const { password } = form;
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getPasswordStrength();
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['#ff4444', '#ff8844', '#ffaa44', '#88cc44', '#44aa44', '#228844'];

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <h2 className="form-title">Create Account</h2>
        <p className="form-subtitle">Join us today! Please fill in your information.</p>
        
        <form onSubmit={handleSubmit} className="form">
          
          {/* Name Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name
            </label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your full name"
                className={`form-input ${errors.name && touched.name ? 'error' : ''} ${form.name && !errors.name ? 'success' : ''}`}
              />
              {form.name && !errors.name && <span className="validation-icon success">✓</span>}
            </div>
            {errors.name && touched.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your email"
                className={`form-input ${errors.email && touched.email ? 'error' : ''} ${form.email && !errors.email ? 'success' : ''}`}
              />
              {form.email && !errors.email && <span className="validation-icon success">✓</span>}
            </div>
            {errors.email && touched.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Create a password"
                className={`form-input ${errors.password && touched.password ? 'error' : ''} ${form.password && !errors.password ? 'success' : ''}`}
              />
            </div>
            
            {/* Password Strength Bar */}
            {form.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <div
                      key={level}
                      className={`strength-segment ${strength >= level ? 'active' : ''}`}
                      style={{ backgroundColor: strength >= level ? strengthColors[strength - 1] : '#ddd' }}
                    />
                  ))}
                </div>
                <span className="strength-text" style={{ color: strengthColors[strength - 1] || '#666' }}>
                  {strengthLabels[strength - 1] || 'Enter password'}
                </span>
              </div>
            )}
            
            {errors.password && touched.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Footer */}
          <p className="form-footer">
            Already have an account? <a href="#" className="link">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default App;