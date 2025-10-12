import React, { useEffect, useState } from 'react';
import axios from '../api';
import ThreadList from '../components/ThreadList';
import { Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [threads, setThreads] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    axios.get('http://localhost:3000/api/threads', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setThreads(res.data))
      .catch(err => {
        setError('Failed to fetch threads');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      });
  }, [navigate]);

  return (
    <Box sx={{ mt: 4 }}>
      {error && <Typography color="error">{error}</Typography>}
      <ThreadList threads={threads} />
    </Box>
  );
}