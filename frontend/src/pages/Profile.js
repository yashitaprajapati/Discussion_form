import React from 'react';
import { Box, Typography, Avatar, Divider } from '@mui/material';

export default function Profile({ user }) {
  if (!user) {
    return <Typography variant="h6" sx={{ mt: 4 }}>Please log in to view your profile.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, textAlign: 'center' }}>
      <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}>
        {user.firstName ? user.firstName[0].toUpperCase() : '?'}
      </Avatar>
      <Typography variant="h5">{user.firstName} {user.lastName}</Typography>
      <Typography variant="body1">{user.emailId}</Typography>
      <Divider sx={{ my: 2 }} />
      {/* Show all user fields except password */}
      {Object.entries(user).map(([key, value]) =>
        key !== 'password' && (
          <Typography key={key} variant="body2">
            <strong>{key}:</strong> {String(value)}
          </Typography>
        )
      )}
    </Box>
  );
}