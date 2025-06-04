import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const StudentProfile = () => {
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);
    const [showAttendance, setShowAttendance] = useState(false);
    const [showCourses, setShowCourses] = useState(false);
    const [showSchedule, setShowSchedule] = useState(false);
    const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [coursesData, setCoursesData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sample attendance data
    const attendanceData = [
        { subject: 'Data Structures', total: 45, present: 42, percentage: 93.33 },
        { subject: 'Database Management', total: 40, present: 38, percentage: 95 },
        { subject: 'Web Development', total: 35, present: 32, percentage: 91.43 },
        { subject: 'Computer Networks', total: 42, present: 39, percentage: 92.86 },
        { subject: 'Operating Systems', total: 38, present: 35, percentage: 92.11 }
    ];

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('userData');
        if (!userData) {
            navigate('/student-login');
            return;
        }

        // Set profile data
        setProfileData(JSON.parse(userData));
        setLoading(false);
    }, [navigate]);

    const handleViewProfile = () => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            setProfileData(JSON.parse(userData));
            setShowProfile(true);
            setShowAttendance(false);
            setShowCourses(false);
            setShowSchedule(false);
        }
        setIsFloatingMenuOpen(false);
    };

    const handleViewAttendance = () => {
        setShowAttendance(true);
        setShowProfile(false);
        setShowCourses(false);
        setShowSchedule(false);
        setIsFloatingMenuOpen(false);
    };

    const handleViewCourses = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (!userData || !userData.section) {
                console.error('No user data or section found');
                alert('User section not found. Please login again.');
                return;
            }
            
            console.log('Fetching courses for section:', userData.section);
            
            const response = await fetch(`http://localhost:8000/api/courses/${userData.section}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.courses) {
                setCoursesData(data.courses);
                setShowCourses(true);
                setShowProfile(false);
                setShowAttendance(false);
                setShowSchedule(false);
            } else {
                console.error('No courses data in response:', data);
                alert('No courses found for your section');
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            alert('Error loading courses. Please try again later.');
        }
        setIsFloatingMenuOpen(false);
    };

    const handleViewSchedule = () => {
        setShowSchedule(true);
        setShowProfile(false);
        setShowAttendance(false);
        setShowCourses(false);
        setIsFloatingMenuOpen(false);
    };

    const toggleFloatingMenu = () => {
        setIsFloatingMenuOpen(!isFloatingMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('userData');
        navigate('/student-login');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-main">
            <div className="sidebar">
                <div className="sidebar-header">
                    <h3>Student Dashboard</h3>
                </div>
                <div className="sidebar-menu">
                    <button className="menu-item" onClick={handleViewProfile}>
                        Profile
                    </button>
                    <button className="menu-item" onClick={handleViewAttendance}>
                        Attendance
                    </button>
                    <button className="menu-item" onClick={handleViewCourses}>
                        Courses
                    </button>
                    <button className="menu-item" onClick={handleViewSchedule}>
                        Schedule
                    </button>
                    <button className="menu-item logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <div className="main-content">
                <div className="welcome-section">
                    <h1>Welcome to Student Dashboard</h1>
                    <p>Access your profile and manage your academic information</p>
                </div>

                <div className="dashboard-cards">
                    <div className="card" onClick={handleViewProfile}>
                        <h3>My Profile</h3>
                        <p>View and manage your profile</p>
                    </div>
                    <div className="card" onClick={handleViewAttendance}>
                        <h3>Attendance</h3>
                        <p>Check your attendance records</p>
                    </div>
                    <div className="card" onClick={handleViewCourses}>
                        <h3>Courses</h3>
                        <p>View your enrolled courses</p>
                    </div>
                    <div className="card" onClick={handleViewSchedule}>
                        <h3>Schedule</h3>
                        <p>View your class schedule</p>
                    </div>
                </div>

                {/* Floating Menu Button */}
                <div className="floating-menu-container">
                    <button 
                        className={`floating-button ${isFloatingMenuOpen ? 'active' : ''}`} 
                        onClick={toggleFloatingMenu}
                    >
                        +
                    </button>
                    
                    {isFloatingMenuOpen && (
                        <div className="floating-menu">
                            <button onClick={handleViewProfile}>Profile</button>
                            <button onClick={handleViewAttendance}>Attendance</button>
                            <button onClick={handleViewCourses}>Courses</button>
                            <button onClick={handleViewSchedule}>Schedule</button>
                        </div>
                    )}
                </div>

                {/* Modals */}
                {showProfile && profileData && (
                    <div className="profile-modal">
                        <div className="profile-card">
                            <div className="profile-header">
                                <h2>Student Profile</h2>
                                <button 
                                    className="close-button"
                                    onClick={() => setShowProfile(false)}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="profile-info">
                                <div className="info-group">
                                    <label>Registration Number:</label>
                                    <p>{profileData.registration_number}</p>
                                </div>
                                <div className="info-group">
                                    <label>Name:</label>
                                    <p>{profileData.name}</p>
                                </div>
                                <div className="info-group">
                                    <label>Email:</label>
                                    <p>{profileData.email}</p>
                                </div>
                                <div className="info-group">
                                    <label>Department:</label>
                                    <p>{profileData.department}</p>
                                </div>
                                <div className="info-group">
                                    <label>Section:</label>
                                    <p>{profileData.section}</p>
                                </div>
                                <div className="info-group">
                                    <label>Year:</label>
                                    <p>{profileData.year}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showAttendance && (
                    <div className="profile-modal">
                        <div className="profile-card">
                            <div className="profile-header">
                                <h2>Attendance Record</h2>
                                <button 
                                    className="close-button"
                                    onClick={() => setShowAttendance(false)}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="attendance-info">
                                <table className="attendance-table">
                                    <thead>
                                        <tr>
                                            <th>Subject</th>
                                            <th>Total Classes</th>
                                            <th>Classes Attended</th>
                                            <th>Percentage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceData.map((subject, index) => (
                                            <tr key={index}>
                                                <td>{subject.subject}</td>
                                                <td>{subject.total}</td>
                                                <td>{subject.present}</td>
                                                <td>
                                                    <div className="percentage-bar">
                                                        <div 
                                                            className="percentage-fill"
                                                            style={{ 
                                                                width: `${subject.percentage}%`,
                                                                backgroundColor: subject.percentage < 75 ? '#e74c3c' : '#2ecc71'
                                                            }}
                                                        ></div>
                                                        <span>{subject.percentage.toFixed(2)}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {showCourses && (
                    <div className="profile-modal">
                        <div className="profile-card">
                            <div className="profile-header">
                                <h2>My Courses</h2>
                                <button 
                                    className="close-button"
                                    onClick={() => setShowCourses(false)}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="courses-info">
                                {coursesData.length > 0 ? (
                                    <table className="courses-table">
                                        <thead>
                                            <tr>
                                                <th>Course Code</th>
                                                <th>Course Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {coursesData.map((course, index) => (
                                                <tr key={index}>
                                                    <td>{course.course_code}</td>
                                                    <td>{course.course_name}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="no-courses-message">
                                        No courses found for your section.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {showSchedule && (
                    <div className="profile-modal">
                        <div className="profile-card">
                            <div className="profile-header">
                                <h2>Class Schedule</h2>
                                <button 
                                    className="close-button"
                                    onClick={() => setShowSchedule(false)}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="schedule-content">
                                <img 
                                    src="https://res.cloudinary.com/dcehhrctc/image/upload/v1731609483/Schedule_tlxw2h.jpg" 
                                    alt="Class Schedule" 
                                    className="schedule-image"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentProfile;
