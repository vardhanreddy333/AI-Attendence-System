import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';

const StudentSignup = () => {
  const [formData, setFormData] = useState({
    registration_number: '',
    name: '',
    section: '',
    email: '',
    department: '',
    year: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
        console.log('Sending registration data:', {
            ...formData,
            password: '[HIDDEN]'
        });

        const response = await fetch('http://localhost:8000/api/students/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                registration_number: formData.registration_number,
                name: formData.name,
                section: formData.section,
                email: formData.email,
                department: formData.department,
                year: formData.year,
                password: formData.password
            }),
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (response.ok) {
            alert('Registration successful!');
            navigate('/student-login');
        } else {
            const errorMessage = data.error || 'Registration failed';
            console.error('Registration error:', errorMessage);
            setError(errorMessage);
            alert(errorMessage);
        }
    } catch (error) {
        console.error('Network error:', error);
        setError('An error occurred during registration');
        alert('An error occurred during registration');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Student Sign Up</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="registration_number"
              placeholder="Registration Number"
              value={formData.registration_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="section"
              placeholder="Section"
              value={formData.section}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="year"
              placeholder="Year"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        <p>
          Already have an account? <Link to="/student-login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default StudentSignup;
