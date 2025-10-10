import React, { useEffect, useState } from 'react';
import axios from '../api';
import { Typography, Box, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';

export default function ThreadList() {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/threads').then(res => setThreads(res.data));
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4">Threads</Typography>
      {threads.map(thread => (
        <Card key={thread._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">
              <Link to={`/thread/${thread._id}`}>{thread.title}</Link>
            </Typography>
            <Typography variant="body2">{thread.content}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}