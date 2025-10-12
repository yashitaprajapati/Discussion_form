import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, Grid, IconButton, Button, TextField, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from '../api';

export default function ThreadList({ threads }) {
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});
  const [votes, setVotes] = useState({});
  const [liked, setLiked] = useState({});

  // Fetch comments for all threads when threads change
  useEffect(() => {
    const fetchComments = async () => {
      const newComments = {};
      for (const thread of threads) {
        try {
          const res = await axios.get(`/api/comments/thread/${thread._id}`);
          newComments[thread._id] = res.data;
        } catch (err) {
          newComments[thread._id] = [];
        }
      }
      setComments(newComments);
    };
    if (threads.length) fetchComments();
  }, [threads]);

  // Set initial votes from backend
  useEffect(() => {
    const newVotes = {};
    for (const thread of threads) {
      newVotes[thread._id] = thread.upvotes || 0;
    }
    setVotes(newVotes);
  }, [threads]);

  // Handle upvote (like)
  const handleUpvote = async (threadId) => {
    try {
      const res = await axios.post(`/api/vote/threads/${threadId}`, { type: 'upvote' });
      setVotes(prev => ({ ...prev, [threadId]: res.data.votes }));
      setLiked(prev => ({ ...prev, [threadId]: true }));
    } catch (err) {
      // handle error
    }
  };

  // Handle downvote (unlike)
  const handleDownvote = async (threadId) => {
    try {
      const res = await axios.post(`/api/vote/threads/${threadId}`, { type: 'downvote' });
      setVotes(prev => ({ ...prev, [threadId]: res.data.votes }));
      setLiked(prev => ({ ...prev, [threadId]: false }));
    } catch (err) {
      // handle error
    }
  };

  // Handle comment input change
  const handleCommentChange = (threadId, value) => {
    setCommentInput(prev => ({ ...prev, [threadId]: value }));
  };

  // Handle comment submit
  const handleCommentSubmit = async (threadId) => {
    const comment = commentInput[threadId];
    if (!comment) return;
    try {
      const res = await axios.post(`/api/comments/${threadId}`, { comments: comment });
      setComments(prev => ({
        ...prev,
        [threadId]: [...(prev[threadId] || []), res.data.comment]
      }));
      setCommentInput(prev => ({ ...prev, [threadId]: '' }));
    } catch (err) {
      // handle error
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {threads.map(thread => (
          <Grid item xs={12} sm={6} md={4} key={thread._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Link to={`/thread/${thread._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {thread.title}
                  </Link>
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {thread.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <IconButton
                    color={liked[thread._id] ? 'error' : 'default'}
                    onClick={() =>
                      liked[thread._id]
                        ? handleDownvote(thread._id)
                        : handleUpvote(thread._id)
                    }
                  >
                    {liked[thread._id] ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <Typography variant="body2">
                    Likes: {votes[thread._id] || 0}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box>
                  <Typography variant="subtitle2">Comments:</Typography>
                  {(comments[thread._id] || []).map((c, idx) => (
                    <Typography key={c._id || idx} variant="body2" sx={{ ml: 1 }}>
                      {c.text}
                    </Typography>
                  ))}
                  <Box sx={{ display: 'flex', mt: 1 }}>
                    <TextField
                      size="small"
                      label="Add a comment"
                      value={commentInput[thread._id] || ''}
                      onChange={e => handleCommentChange(thread._id, e.target.value)}
                      variant="outlined"
                      sx={{ flex: 1, mr: 1 }}
                    />
                    <Button variant="contained" size="small" onClick={() => handleCommentSubmit(thread._id)}>
                      Comment
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}