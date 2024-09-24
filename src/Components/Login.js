
import React, { useState } from 'react';
import './Login.css';
// logs in the admin to the dashboard
function Login() {
    // State variables for email, password, and error message
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // logs in the admin to the dashboard
    const handleLogin = (e) => {
        // Prevent the form from submitting
        e.preventDefault();

        // Mock login, accept any email/password combination
        if (email && password) {
            localStorage.setItem('token', 'mock-token'); // Store a mock token for session management
            window.location.href = '/dashboard'; // Redirect to the dashboard
        } else {
            // Display an error message if email or password is missing
            setError('Please enter both email and password.');
        }
    };

    return (
        // Login form
        <div className="login-container">
            <h2>Admin Login</h2>

            <form onSubmit={handleLogin}>
                <div className="form-group">
                    // Email input
                    <label>Email:</label>
                    <input
                        // Email input field
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>

                    <input
                        // Password input field
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                // Display error message if there is one
                {error && <p className="error-message">{error}</p>}
                // Login button
                <button type="submit" className="btn">Login</button>
            </form>
        </div>
    );
}

export default Login;
