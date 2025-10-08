import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/user/login', { emailId, password });
      if (response.data.message === 'Logged In Successfully') {
        // Backend update needed: Return token like in register. For now, simulate or fetch profile.
        // Assuming backend now returns { tokenGen, user } after update.
        const token = response.data.data?.tokenGen || 'simulated-token-for-login'; // Replace with actual
        const userData = response.data.data?.user || { emailId };
        login(token, userData);
        navigate('/home');
      } else {
        setError('Login failed: Invalid credentials');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={emailId} 
            onChange={(e) => setEmailId(e.target.value)} 
            required 
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
