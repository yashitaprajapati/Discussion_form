import React, { useState } from 'react';
import { api } from '../App';
import { TextField, Button, Box, Typography } from '@mui/material';

export default function Register({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/register', { email, password, name });
      onRegister(res.data.user);
    } catch (err) {
      setError('Registration failed');
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