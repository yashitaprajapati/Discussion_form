import React, { useEffect, useState } from 'react';
import axios from '../api';
import { useParams } from 'react-router-dom';
import { Typography, Box, Card, CardContent } from '@mui/material';
import CommentList from './CommentList';

export default function ThreadDetail() {
  const { id } = useParams();
  const [thread, setThread] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/threads/${id}`).then(res => setThread(res.data));
  }, [id]);

  if (!thread) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5">{thread.title}</Typography>
          <Typography variant="body1">{thread.content}</Typography>
        </CardContent>
      </Card>
      <CommentList threadId={id} />
    </Box>
  );
}