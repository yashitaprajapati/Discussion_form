import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ThreadDetail from './components/ThreadDetail';
import Login from './components/Login';
import Register from './components/Register';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import Profile from './pages/Profile';
import Home from './pages/Home';
import axios from './api';

function App() {
  const [user, setUser] = useState(null);

  const token = sessionStorage.getItem('token');

  // Fetch user data from backend when token changes
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axios.get('/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (err) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, [token]);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    setUser(null);
    window.location.reload();
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Forum App</Typography>
          <Button color="inherit" component={Link} to="/home">Home</Button>
          <Button color="inherit" component={Link} to="/profile">Profile</Button>
          {!token && <Button color="inherit" component={Link} to="/login">Login</Button>}
          {!token && <Button color="inherit" component={Link} to="/register">Register</Button>}
          {token && (
            <Button color="inherit" component={Link} to="/profile">
              {user?.email || user?.name || 'Profile'}
            </Button>
          )}
          {token && <Button color="inherit" onClick={handleLogout}>Logout</Button>}
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/thread/:id" element={<ThreadDetail />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register onRegister={setUser} />} />
        <Route path="/profile" element={<Profile user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;