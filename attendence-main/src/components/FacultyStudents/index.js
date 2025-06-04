import React, { useState, useEffect } from 'react';
import './index.css';

const FacultyStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSection, setSelectedSection] = useState('all');
    const [selectedView, setSelectedView] = useState('grid');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const facultyData = JSON.parse(localStorage.getItem('facultyData'));
                if (!facultyData) {
                    throw new Error('No faculty data found');
                }

                const response = await fetch(`http://localhost:8000/api/faculty/students/${facultyData.faculty_id}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch students');
                }

                setStudents(data.students);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching students:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.student_id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSection = selectedSection === 'all' || student.section === selectedSection;
        return matchesSearch && matchesSection;
    });

    const sections = [...new Set(students.map(student => student.section))];

    if (loading) return (
        <div className="students-loading">
            <div className="loader"></div>
            <p>Loading students data...</p>
        </div>
    );
    
    if (error) return (
        <div className="students-error">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
        </div>
    );

    return (
        <div className="students-dashboard">
            <div className="dashboard-header">
                <div className="header-title">
                    <h2>Student Management</h2>
                    <p>Manage and monitor your students</p>
                </div>
                <div className="header-actions">
                    <button className="action-button primary">
                        <i className="fas fa-plus"></i>
                        Add New Student
                    </button>
                    <button className="action-button secondary">
                        <i className="fas fa-download"></i>
                        Export Data
                    </button>
                </div>
            </div>

            <div className="dashboard-stats">
                <div className="stat-box">
                    <div className="stat-icon students">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-details">
                        <h3>Total Students</h3>
                        <p>{students.length}</p>
                        <span className="trend positive">
                            <i className="fas fa-arrow-up"></i> 5% from last semester
                        </span>
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-icon attendance">
                        <i className="fas fa-clock"></i>
                    </div>
                    <div className="stat-details">
                        <h3>Average Attendance</h3>
                        <p>85%</p>
                        <span className="trend positive">
                            <i className="fas fa-arrow-up"></i> 2% this week
                        </span>
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-icon performance">
                        <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="stat-details">
                        <h3>Performance</h3>
                        <p>76%</p>
                        <span className="trend negative">
                            <i className="fas fa-arrow-down"></i> 3% this month
                        </span>
                    </div>
                </div>
            </div>

            <div className="dashboard-controls">
                <div className="search-filters">
                    <div className="search-box">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search by name, ID, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filters">
                        <select 
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Sections</option>
                            {sections.map(section => (
                                <option key={section} value={section}>Section {section}</option>
                            ))}
                        </select>
                        <div className="view-toggle">
                            <button 
                                className={`toggle-btn ${selectedView === 'grid' ? 'active' : ''}`}
                                onClick={() => setSelectedView('grid')}
                            >
                                <i className="fas fa-th-large"></i>
                            </button>
                            <button 
                                className={`toggle-btn ${selectedView === 'list' ? 'active' : ''}`}
                                onClick={() => setSelectedView('list')}
                            >
                                <i className="fas fa-list"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {selectedView === 'grid' ? (
                <div className="students-grid">
                    {filteredStudents.map((student, index) => (
                        <div key={index} className="student-card">
                            <div className="card-header">
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${student.name}&background=random&size=72`} 
                                    alt={student.name}
                                    className="student-avatar"
                                />
                                <div className="student-info">
                                    <h3>{student.name}</h3>
                                    <div className="student-badges">
                                        <span className="badge badge-id">{student.student_id}</span>
                                        <span className="badge badge-section">Section {student.section}</span>
                                        <span className="badge-status active">
                                            {student.status || 'Active'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="student-details">
                                <div className="detail-item">
                                    <span className="detail-label">Email</span>
                                    <span className="detail-value">{student.email}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Department</span>
                                    <span className="detail-value">{student.department}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Phone</span>
                                    <span className="detail-value">{student.phone || 'N/A'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Enrollment Date</span>
                                    <span className="detail-value">{student.enrollmentDate || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="card-footer">
                                <button className="card-btn view">
                                    <i className="fas fa-eye"></i> View Details
                                </button>
                                <button className="card-btn edit">
                                    <i className="fas fa-edit"></i> Edit
                                </button>
                                <button className="card-btn attendance">
                                    <i className="fas fa-clock"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="students-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>ID</th>
                                <th>Section</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student, index) => (
                                <tr key={index}>
                                    <td className="student-cell">
                                        <img 
                                            src={`https://ui-avatars.com/api/?name=${student.name}&background=random&size=32`} 
                                            alt={student.name}
                                        />
                                        <div>
                                            <span className="student-name">{student.name}</span>
                                            <span className="student-email">{student.email}</span>
                                        </div>
                                    </td>
                                    <td>{student.student_id}</td>
                                    <td>Section {student.section}</td>
                                    <td>{student.department}</td>
                                    <td>
                                        <span className={`status-badge ${student.status || 'active'}`}>
                                            {student.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <button className="table-btn" title="View Details">
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button className="table-btn" title="Edit">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="table-btn" title="Attendance">
                                            <i className="fas fa-clock"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FacultyStudents; 