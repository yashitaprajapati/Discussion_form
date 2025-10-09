import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate} from 'react-router-dom';
import ThreadList from './components/ThreadList';
import ThreadDetail from './components/ThreadDetail';
import Login from './components/Login';
import Register from './components/Register';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import Profile  from './pages/Profile'
import axios from 'axios';


const API_URL = 'http://localhost:5000'; // Change if your backend runs on another port

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Forum App</Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          {!user && <Button color="inherit" component={Link} to="/login">Login</Button>}
          {!user && <Button color="inherit" component={Link} to="/register">Register</Button>}
          {user && <Button color="inherit" component={Link} to="/profile">{user.name}</Button>} 
      
        </Toolbar>
      </AppBar>
      <Routes>
  <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect root to /home */}
  <Route path="/home" element={<ThreadList />} />
  <Route path="/thread/:id" element={<ThreadDetail />} />
  <Route path="/login" element={<Login onLogin={setUser} />} />
  <Route path="/register" element={<Register onRegister={setUser} />} />
  <Route path="/profile" element={<Profile user={user} />} /> {/* Add this line */}
</Routes>
    </Router>
    
  );
}

export default App;