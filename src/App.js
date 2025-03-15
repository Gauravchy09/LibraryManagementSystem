import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/auth/signin';
import SignUp from './components/auth/signup';
import Home from './Pages/Home';
import AdminDashboard from './Pages/AdminDashboard';
import Profile from './components/common/profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <SignIn />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/signin"
          element={isAuthenticated ? <Home /> : <SignIn />}
        />
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <SignIn />}
        />
        <Route
          path="/admin/dashboard"
          element={
            isAuthenticated && localStorage.getItem('role') === 'ROLE_ADMIN'
              ? <AdminDashboard />
              : <SignIn />
          }
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <SignIn />}
        />
      </Routes>
    </Router>
  );
}

export default App;
