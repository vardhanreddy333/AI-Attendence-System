import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    registration_number: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/students/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('userData', JSON.stringify(data.student));
      navigate('/student-profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-left">
          <h1>Welcome Back!</h1>
          <p>Access your academic dashboard and stay updated with your courses.</p>
          <img src="/student-illustration.svg" alt="Student Login" className="login-illustration" />
        </div>
        
        <div className="login-right">
          <div className="login-form-container">
            <h2>Student Login</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="registration_number">Registration Number</label>
                <div className="input-container">
                  <i className="fas fa-id-card input-icon"></i>
                  <input
                    type="text"
                    id="registration_number"
                    name="registration_number"
                    value={formData.registration_number}
                    onChange={handleChange}
                    placeholder="Enter your registration number"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-container">
                  <i className="fas fa-lock input-icon"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                  <button 
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <i className="fas fa-eye-slash"></i>
                    ) : (
                      <i className="fas fa-eye"></i>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-button">Login</button>
            </form>
            <p>
              Don't have an account? <Link to="/student-signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
