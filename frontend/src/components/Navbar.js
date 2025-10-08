import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ backgroundColor: '#f8f9fa', padding: '10px', borderBottom: '1px solid #ddd' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/home" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold', fontSize: '1.5em' }}>Discussion Forum</Link>
        <div>
          {isAuthenticated ? (
            <>
              <Link to="/create-thread" style={{ marginRight: '10px', textDecoration: 'none', color: '#007bff' }}>Create Thread</Link>
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: '10px', textDecoration: 'none', color: '#007bff' }}>Login</Link>
              <Link to="/register" style={{ textDecoration: 'none', color: '#007bff' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
