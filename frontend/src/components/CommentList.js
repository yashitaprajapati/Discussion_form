import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Typography, Box, Card, CardContent, TextField, Button } from '@mui/material';

export default function CommentList({ threadId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    api.get(`/comments/thread/${threadId}`).then(res => setComments(res.data));
  }, [threadId]);

  const handleAddComment = async () => {
    if (!content) return;
    const res = await api.post('/comments', { threadId, content });
    setComments([...comments, res.data]);
    setContent('');
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Comments</Typography>
      {comments.map(comment => (
        <Card key={comment._id} sx={{ mb: 1 }}>
          <CardContent>
            <Typography>{comment.content}</Typography>
            <Typography variant="caption">By {comment.user?.name || 'Anonymous'}</Typography>
          </CardContent>
        </Card>
      ))}
      <TextField
        label="Add a comment"
        fullWidth
        value={content}
        onChange={e => setContent(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" sx={{ mt: 1 }} onClick={handleAddComment}>Post</Button>
    </Box>
  );
}