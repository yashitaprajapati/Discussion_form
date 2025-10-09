import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

export default function Profile({ user }) {
  if (!user) {
    return <Typography variant="h6" sx={{ mt: 4 }}>Please log in to view your profile.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, textAlign: 'center' }}>
      <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}>
        {user.name ? user.name[0].toUpperCase() : '?'}
      </Avatar>
      <Typography variant="h5">{user.name}</Typography>
      <Typography variant="body1">{user.email}</Typography>
    </Box>
  );
}