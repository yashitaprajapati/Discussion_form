import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function ThreadList() {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    api.get('/threads')
    .then(res => setThreads(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" mb={2}>Threads</Typography>
      {threads.map(thread => (
        <Card key={thread._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{thread.title}</Typography>
            <Typography variant="body2">{thread.content}</Typography>
            <Button component={Link} to={`/thread/${thread._id}`} sx={{ mt: 1 }}>View Details</Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}