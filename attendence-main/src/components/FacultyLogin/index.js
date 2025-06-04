import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';

const FacultyLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        facultyId: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8000/api/faculty/login', {
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

            // Store faculty data in localStorage
            localStorage.setItem('facultyData', JSON.stringify(data.faculty));
            
            // Navigate to faculty profile
            navigate('/faculty-profile');
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
                    <div className="welcome-text">
                        <h1>Welcome Back!</h1>
                        <p>Login to access your faculty dashboard</p>
                    </div>
                </div>
                <div className="login-card">
                    <h2>Faculty Login</h2>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Faculty ID</label>
                            <input
                                type="text"
                                name="facultyId"
                                value={formData.facultyId}
                                onChange={handleChange}
                                required
                                placeholder="Enter your faculty ID"
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                                disabled={loading}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <p className="signup-link">
                        Don't have an account? <Link to="/faculty-signup">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FacultyLogin;
