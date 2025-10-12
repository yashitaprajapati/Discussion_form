import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, Grid, IconButton, TextField, Button, Divider, Chip, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ForumIcon from '@mui/icons-material/Forum';
import axios from '../api';

export default function ThreadList({ threads }) {
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});
  const [votes, setVotes] = useState({});
  const [liked, setLiked] = useState({});

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

  useEffect(() => {
    const newVotes = {};
    for (const thread of threads) {
      newVotes[thread._id] = thread.upvotes || 0;
    }
    setVotes(newVotes);
  }, [threads]);

  const handleUpvote = async (threadId) => {
    try {
      const res = await axios.post(`/api/vote/threads/${threadId}`, { type: 'upvote' });
      setVotes(prev => ({ ...prev, [threadId]: res.data.votes }));
      setLiked(prev => ({ ...prev, [threadId]: true }));
    } catch (err) {}
  };

  const handleDownvote = async (threadId) => {
    try {
      const res = await axios.post(`/api/vote/threads/${threadId}`, { type: 'downvote' });
      setVotes(prev => ({ ...prev, [threadId]: res.data.votes }));
      setLiked(prev => ({ ...prev, [threadId]: false }));
    } catch (err) {}
  };

  const handleCommentChange = (threadId, value) => {
    setCommentInput(prev => ({ ...prev, [threadId]: value }));
  };

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
    } catch (err) {}
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {threads.map(thread => (
          <Grid item xs={12} sm={6} md={4} key={thread._id}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: 6,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.03)', boxShadow: 12 },
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #e3f2fd 60%, #fff 100%)'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: '#1976d2', mr: 1 }}>
                    <ForumIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    <Link to={`/thread/${thread._id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                      {thread.title}
                    </Link>
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 1, color: '#333' }}>
                  {thread.description}
                </Typography>
                {thread.tags && thread.tags.length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    {thread.tags.map((tag, idx) => (
                      <Chip key={idx} label={tag} size="small" sx={{ mr: 0.5, bgcolor: '#bbdefb' }} />
                    ))}
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
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
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Likes: {votes[thread._id] || 0}
                  </Typography>
                  {thread.category && (
                    <Chip label={thread.category} size="small" sx={{ ml: 1, bgcolor: '#c8e6c9' }} />
                  )}
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Comments:</Typography>
                  <Box sx={{ maxHeight: 80, overflowY: 'auto', mb: 1 }}>
                    {(comments[thread._id] || []).map((c, idx) => (
                      <Typography key={c._id || idx} variant="body2" sx={{ ml: 1, color: '#555' }}>
                        {c.text}
                      </Typography>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', mt: 1 }}>
                    <TextField
                      size="small"
                      label="Add a comment"
                      value={commentInput[thread._id] || ''}
                      onChange={e => handleCommentChange(thread._id, e.target.value)}
                      variant="outlined"
                      sx={{ flex: 1, mr: 1, bgcolor: '#fff' }}
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