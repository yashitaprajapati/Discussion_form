import React, { useState } from 'react';
import axios from '../api';
import { TextField, Button, Box, Typography } from '@mui/material';

export default function Register({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const [firstName, lastName = ''] = name.split(' ');
      const res = await axios.post('http://localhost:3000/api/user/register', {
        firstName,
        lastName,
        emailId: email,
        password
      });
      if (onRegister) onRegister(res.data);
    } catch (err) {
      console.error(err.response?.data || err); // backend error
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" mb={2}>Register</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)} />
        <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
        <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Register</Button>
      </form>
    </Box>
  );
}