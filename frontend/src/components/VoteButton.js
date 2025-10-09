import React, { useState } from 'react';
import { api } from '../api';
import { Button, Box } from '@mui/material';

export default function VoteButton({ threadId }) {
  const [votes, setVotes] = useState(0);

  const handleVote = async (type) => {
    const res = await api.post('/votes', { threadId, type });
    setVotes(res.data.votes);
  };

  return (
    <Box>
      <Button onClick={() => handleVote('upvote')}>Upvote</Button>
      <Button onClick={() => handleVote('downvote')}>Downvote</Button>
      <span>Votes: {votes}</span>
    </Box>
  );
}