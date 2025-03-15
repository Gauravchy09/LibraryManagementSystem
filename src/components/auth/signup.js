import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/signup.css'; // Assuming you have your CSS file

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('ROLE_USER');
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userData = {
                username,
                email,
                password,
                address,
                role,
            };

            const endpoint = role === 'ROLE_ADMIN' ? '/auth/signup/admin' : '/auth/signup';
            const response = await axios.post(`${backendUrl}${endpoint}`, userData);

            alert(response.data.message);
            localStorage.setItem('role', role);
            navigate('/signin');
        } catch (error) {
            alert('Sign Up failed: ' + error.response?.data?.message || error.message);
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

            {/* Sign Up Card */}
            <div className="auth-card">
                <h1 style={{ textAlign: 'center' }} className="logo">
                    Library<span className="highlight">MS</span>
                </h1>
                <h2 className="auth-title">Create an Account</h2>
                <form onSubmit={handleSignUp} className="auth-form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="auth-input"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    <textarea
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="auth-input"
                        required
                    />
                    {/* Role selection */}
                    <div className="role-selection">
                        <label className="role-label">
                            <input
                                type="radio"
                                name="role"
                                value="ROLE_USER"
                                checked={role === 'ROLE_USER'}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            />
                            User
                        </label>
                        <label className="role-label">
                            <input
                                type="radio"
                                name="role"
                                value="ROLE_ADMIN"
                                checked={role === 'ROLE_ADMIN'}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            />
                            Admin
                        </label>
                    </div>
                    <button type="submit" className="auth-button">
                        Sign Up
                    </button>
                </form>
                <div className="switch-form">
                    <p>
                        Already have an account? <a href="/signin" className="auth-link">Sign In</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;