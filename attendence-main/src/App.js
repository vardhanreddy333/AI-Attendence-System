import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import StudentLogin from './components/StudentLogin';
import StudentSignup from './components/StudentSignup';
import StudentProfile from './components/Studentprofile';
import FacultyLogin from './components/FacultyLogin';
import FacultySignup from './components/FacultySignup';
import FacultyProfile from './components/FacultyProfile';
import './App.css';

// Protected Route for Students
const ProtectedStudentRoute = ({ children }) => {
    const userData = localStorage.getItem('userData');
    
    if (!userData) {
        return <Navigate to="/student-login" />;
    }
    
    return children;
};

// Protected Route for Faculty
const ProtectedFacultyRoute = ({ children }) => {
    const facultyData = localStorage.getItem('facultyData');
    
    if (!facultyData) {
        return <Navigate to="/faculty-login" />;
    }
    
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Student Routes */}
                <Route path="/student-login" element={<StudentLogin />} />
                <Route path="/student-signup" element={<StudentSignup />} />
                <Route 
                    path="/student-profile" 
                    element={
                        <ProtectedStudentRoute>
                            <StudentProfile />
                        </ProtectedStudentRoute>
                    } 
                />

                {/* Faculty Routes */}
                <Route path="/faculty-login" element={<FacultyLogin />} />
                <Route path="/faculty-signup" element={<FacultySignup />} />
                <Route 
                    path="/faculty-profile" 
                    element={
                        <ProtectedFacultyRoute>
                            <FacultyProfile />
                        </ProtectedFacultyRoute>
                    } 
                />

                {/* Updated Home Route */}
                <Route 
                    path="/" 
                    element={
                        <div className="home-container">
                            <div className="animated-background">
                                <div className="shape shape1"></div>
                                <div className="shape shape2"></div>
                                <div className="shape shape3"></div>
                            </div>
                            
                            <div className="content-wrapper">
                                <div className="hero-section">
                                    <h1>Welcome to Academic Portal</h1>
                                    <p>Your gateway to seamless academic management</p>
                                </div>

                                <div className="login-options">
                                    <Link to="/student-login" className="login-card">
                                        <div className="card-icon">
                                            <i className="fas fa-user-graduate"></i>
                                        </div>
                                        <h2>Student Portal</h2>
                                        <p>Access your courses and track your progress</p>
                                        <span className="card-btn">Login as Student</span>
                                    </Link>

                                    <Link to="/faculty-login" className="login-card">
                                        <div className="card-icon">
                                            <i className="fas fa-chalkboard-teacher"></i>
                                        </div>
                                        <h2>Faculty Portal</h2>
                                        <p>Manage your classes and student records</p>
                                        <span className="card-btn">Login as Faculty</span>
                                    </Link>
                                </div>

                                <div className="features">
                                    <div className="feature">
                                        <i className="fas fa-shield-alt"></i>
                                        <span>Secure Access</span>
                                    </div>
                                    <div className="feature">
                                        <i className="fas fa-clock"></i>
                                        <span>24/7 Available</span>
                                    </div>
                                    <div className="feature">
                                        <i className="fas fa-sync"></i>
                                        <span>Real-time Updates</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    } 
                />
            </Routes>
        </Router>
    );
}

export default App;
