import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ThreadDetail from './components/ThreadDetail';
import Login from './components/Login';
import Register from './components/Register';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import Profile from './pages/Profile';
import Home from './pages/Home';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const token = sessionStorage.getItem('token');
  const User = token ? JSON.parse(sessionStorage.getItem('user') || '{}') : null;

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Forum App</Typography>
          <Button color="inherit" component={Link} to="/home">Home</Button>
          {!token && <Button color="inherit" component={Link} to="/login">Login</Button>}
          {!token && <Button color="inherit" component={Link} to="/register">Register</Button>}
          {token && <Button color="inherit" component={Link} to="/profile">{user?.emailId || user?.name}</Button>}
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
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