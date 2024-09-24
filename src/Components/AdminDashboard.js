// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Ensure this is imported
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import './AdminDashboard.css';

function AdminDashboard() {
    // State variable to store access logs
    const [accessLogs, setAccessLogs] = useState([]);
    // Fetch access logs from Firestore
    const fetchAccessLogs = async () => {
        try {
            const q = query(collection(db, 'accessLogs'), orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            const logs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setAccessLogs(logs);
        } catch (err) {
            console.error('Error fetching access logs', err);
        }
    };

    useEffect(() => {
        fetchAccessLogs();
    }, []);
    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };
    // Render the dashboard using a table
    return (
        <div className="dashboard-container">
            <div className="header">
                <h2>SUN Lab Access Logs</h2>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>

            <div className="navigation">
                <Link to="/user-management">Go to User Management</Link>
            </div>

            <div className="log-table">
                <table>
                    <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Timestamp</th>
                    </tr>
                    </thead>
                    <tbody>
                    {accessLogs.map((log) => (
                        <tr key={log.id}>
                            <td>{log.studentID}</td>
                            <td>{new Date(log.timestamp.seconds * 1000).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;
