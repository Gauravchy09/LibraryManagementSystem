import React from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/signin', { replace: true });
        window.location.reload();  // Force page reload to reflect changes immediately
    };

    return (
        <div className="navbar">
            <div className="navbar-left">
                <h1 className="logo">Library<span className="highlight">MS</span></h1>
            </div>

            <div className="navbar-right">
                {token ? (
                    <>
                        <Link to="/home" className="navbar-link">Home</Link>
                        <Link to="/profile" className="navbar-link">Profile</Link>
                        <Button
                            onClick={handleSignOut}
                            variant="outlined"
                            className="navbar-button"
                        >
                            Sign Out
                        </Button>
                    </>
                ) : (
                    <>
                        <Link to="/signin" className="navbar-link">Sign In</Link>
                        <Link to="/signup" className="navbar-link">Sign Up</Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default Navbar;
