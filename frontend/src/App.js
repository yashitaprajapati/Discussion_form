import React, { createContext, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import CreateThread from './components/CreateThread';
import ThreadDetail from './components/ThreadDetail';
import Navbar from './components/Navbar';
import './App.css';

// Auth Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser ] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser (userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser (null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/home" />} />
            <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
            <Route path="/create-thread" element={isAuthenticated ? <CreateThread /> : <Navigate to="/login" />} />
            <Route path="/thread/:id" element={isAuthenticated ? <ThreadDetail /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to="/home" />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
