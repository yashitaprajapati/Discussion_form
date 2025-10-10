import React, { useState } from 'react';
import axios from '../api';
import { Button, Box } from '@mui/material';

export default function VoteButton({ threadId }) {
  const [votes, setVotes] = useState(0);

  const handleVote = async (type) => {
    const res = await axios.post(
      `http://localhost:3000/api/vote/threads/${threadId}`,
      { type }
    );
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