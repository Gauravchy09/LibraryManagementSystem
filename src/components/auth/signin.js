import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './styles/signin.css';

function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/auth/signin`, {
                username,
                password,
            });

            const token = response.data.token;
            localStorage.setItem('token', token);

            const decodedToken = jwtDecode(token);
            const role = decodedToken.role;
            localStorage.setItem('role', role);

            if (role === 'ROLE_ADMIN') {
                navigate('/admin/dashboard', { replace: true });
                window.location.reload();
            } else {
                navigate('/home', { replace: true });
                window.location.reload();
            }

        } catch (error) {
            alert('Sign In failed: ' + error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="auth-container">
            {/* Particles */}
            <div className="particle particle-1" style={{ top: '10%', left: '10%' }}></div>
            <div className="particle particle-2" style={{ top: '30%', right: '15%' }}></div>
            <div className="particle particle-3" style={{ bottom: '20%', left: '20%' }}></div>
            <div className="particle particle-4" style={{ bottom: '10%', right: '10%' }}></div>
            <div className="particle particle-5" style={{ top: '40%', left: '30%' }}></div>
            <div className="particle particle-6" style={{ bottom: '30%', right: '25%' }}></div>

            <div className="auth-card">
                <h1 style={{ textAlign: 'center' }} className="logo">
                    Library<span className="highlight">MS</span>
                </h1>
                <h2 className="auth-title">Sign In</h2>
                <form onSubmit={handleSignIn} className="auth-form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="auth-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="auth-input"
                        required
                    />
                    <button type="submit" className="auth-button">Sign In</button>
                </form>
                <div className="switch-form">
                    <p>Don't have an account? <a href="/signup" className="auth-link">Sign Up</a></p>
                </div>
            </div>
        </div>
    );
}

export default SignIn;