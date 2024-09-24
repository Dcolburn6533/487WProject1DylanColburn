
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './UserManagement.css';
import {Link} from "react-router-dom";

function UserManagement() {
    const [students, setStudents] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('studentID');

    // New state variables for filtering
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [studentIdQuery, setStudentIdQuery] = useState('');
    // Fetch students from Firestore
    const fetchStudents = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'accessLogs'));
            const studentList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStudents(studentList);
        } catch (err) {
            console.error('Error fetching students:', err);
        }
    };
    // Update student status in Firestore
    const updateStudentStatus = async (studentId, status) => {
        try {
            const studentRef = doc(db, 'accessLogs', studentId);
            await updateDoc(studentRef, { status });
            fetchStudents(); // Refresh the list after updating
        } catch (err) {
            console.error('Error updating student status:', err);
        }
    };
    // Sort students based on either time or id number
    const sortStudents = (field) => {
        const sortedStudents = [...students].sort((a, b) => {
            if (field === 'studentID') {
                return sortOrder === 'asc'
                    ? String(a.studentID).localeCompare(String(b.studentID))
                    : String(b.studentID).localeCompare(String(a.studentID));
            } else if (field === 'timestamp') {
                const aTimestamp = a.timestamp ? a.timestamp.seconds : 0;
                const bTimestamp = b.timestamp ? b.timestamp.seconds : 0;
                return sortOrder === 'asc' ? aTimestamp - bTimestamp : bTimestamp - aTimestamp;
            }
            return 0;
        });
        setStudents(sortedStudents);
    };
    // Handle sort change
    const handleSortChange = (field) => {
        setSortField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        sortStudents(field);
    };

    // Filter students based on date range and/or student ID
    const filterStudents = () => {
        return students.filter(student => {
            const timestamp = student.timestamp ? new Date(student.timestamp.seconds * 1000) : null;

            // Filter by date range
            const withinDateRange = (!startDate || timestamp >= new Date(startDate)) &&
                (!endDate || timestamp <= new Date(endDate));

            // Ensure studentID is treated as a string for filtering
            const studentIDStr = String(student.studentID); // Convert studentID to string
            const matchesStudentId = studentIdQuery ? studentIDStr.includes(studentIdQuery) : true;

            return withinDateRange && matchesStudentId;
        });
    };

    useEffect(() => {
        fetchStudents(); // Fetch students on component mount
    }, []);

    const filteredStudents = filterStudents();
    // Render the user management table
    return (
        <div className="user-management-container">
            <h2>User Management</h2>

            {/* Date Range Input */}
            <div className="filter-controls">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Start Date"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="End Date"
                />
                <input
                    type="text"
                    value={studentIdQuery}
                    onChange={(e) => setStudentIdQuery(e.target.value)}
                    placeholder="Student ID"
                />
            </div>

            <div className="sort-controls">
                <button onClick={() => handleSortChange('studentID')}>Sort by Student ID</button>
                <button onClick={() => handleSortChange('timestamp')}>Sort by Timestamp</button>
            </div>

            <table>
                <thead>
                <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredStudents.map(student => (
                    <tr key={student.id}>
                        <td>{student.studentID}</td>
                        <td>{student.Name}</td>
                        <td>{student.timestamp ? new Date(student.timestamp.seconds * 1000).toLocaleString() : 'N/A'}</td>
                        <td>{student.status}</td>
                        <td>
                            <button
                                onClick={() => {
                                    console.log(`Updating status for student ID: ${student.id} to ${student.status === 'active' ? 'suspended' : 'active'}`);
                                    updateStudentStatus(student.id, student.status === 'active' ? 'suspended' : 'active');
                                }}
                                className={student.status === 'active' ? 'suspend-btn' : 'reactivate-btn'}
                            >
                                {student.status === 'active' ? 'Suspend' : 'Reactivate'}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="navigation">
                <Link to="/Dashboard">Go to Dashboard</Link>
            </div>
        </div>
    );
}

export default UserManagement;
