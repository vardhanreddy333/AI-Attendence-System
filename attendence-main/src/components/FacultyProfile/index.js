import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import FacultyStudents from '../FacultyStudents';

const FacultyProfile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFacultyData = async () => {
            try {
                const facultyData = localStorage.getItem('facultyData');
                if (!facultyData) {
                    navigate('/faculty-login');
                    return;
                }

                const faculty = JSON.parse(facultyData);
                setProfileData(faculty);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching faculty data:', error);
                setError('Failed to load profile data');
                setLoading(false);
            }
        };

        fetchFacultyData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('facultyData');
        navigate('/faculty-login');
    };

    const FloatingMenu = () => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className={`floating-menu-container ${isOpen ? 'active' : ''}`}>
                <button 
                    className="floating-button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="floating-icon">
                        {isOpen ? '×' : '+'}
                    </span>
                </button>
                
                <div className="floating-menu">
                    <button className="floating-item">
                        <i className="fas fa-user"></i>
                        <span>Profile</span>
                    </button>
                    <button className="floating-item">
                        <i className="fas fa-users"></i>
                        <span>Students</span>
                    </button>
                    <button className="floating-item">
                        <i className="fas fa-clock"></i>
                        <span>Attendance</span>
                    </button>
                    <button className="floating-item">
                        <i className="fas fa-calendar"></i>
                        <span>Schedule</span>
                    </button>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'students':
                return <FacultyStudents />;
            case 'profile':
                return (
                    <div className="profile-card">
                        <h2 style={{ 
                            marginBottom: '30px', 
                            color: '#111827', 
                            fontSize: '1.5em', 
                            fontWeight: '500',
                            borderBottom: '1px solid #f0f0f0',
                            paddingBottom: '20px'
                        }}>
                            Faculty Profile
                        </h2>
                        <div className="profile-section">
                            <div className="profile-info">
                                <div className="info-group">
                                    <label>Faculty ID</label>
                                    <p>{profileData.faculty_id}</p>
                                </div>
                                <div className="info-group">
                                    <label>Full Name</label>
                                    <p>{profileData.name}</p>
                                </div>
                                <div className="info-group">
                                    <label>Email Address</label>
                                    <p>{profileData.email}</p>
                                </div>
                                <div className="info-group">
                                    <label>Department</label>
                                    <p>{profileData.department}</p>
                                </div>
                                <div className="info-group">
                                    <label>Teaching Subjects</label>
                                    <p>{profileData.subjects}</p>
                                </div>
                                <div className="info-group">
                                    <label>Assigned Sections</label>
                                    <p>{profileData.sections}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return <div>Coming Soon</div>;
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!profileData) return <div className="error">No profile data found</div>;

    return (
        <div className="faculty-dashboard">
            <div className="sidebar">
                <div className="sidebar-header">
                    <h3>Faculty Portal</h3>
                </div>
                <div className="sidebar-menu">
                    <button 
                        className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <i className="fas fa-user"></i>
                        Profile
                    </button>
                    <button 
                        className={`menu-item ${activeTab === 'students' ? 'active' : ''}`}
                        onClick={() => setActiveTab('students')}
                    >
                        <i className="fas fa-users"></i>
                        Students
                    </button>
                    <button className="menu-item">
                        <i className="fas fa-clock"></i>
                        Attendance
                    </button>
                    <button className="menu-item">
                        <i className="fas fa-calendar"></i>
                        Schedule
                    </button>
                    <button className="menu-item logout-btn" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        Logout
                    </button>
                </div>
            </div>

            <div className="main-content">
                {renderContent()}
            </div>
            <FloatingMenu />
        </div>
    );
};

export default FacultyProfile; 