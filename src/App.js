// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import AdminDashboard from './Components/AdminDashboard';
import UserManagement from "./Components/UserManagement";

function App() {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <Router>
            <Routes>
                <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
                <Route path="/dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/" />} />
                <Route path= "/user-management" element={isAuthenticated ? <UserManagement /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;