import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
      const response = await axios.post('/api/user/register', { firstName, lastName, emailId, password });
      if (response.data.message && response.data.message.includes('Registered Successfully')) {
        const { tokenGen, user } = response.data.data;
        login(tokenGen, user);
        navigate('/home');
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input 
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            required 
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            disabled={loading}
          />
        </div>
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
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
