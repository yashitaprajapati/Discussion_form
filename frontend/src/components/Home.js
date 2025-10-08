import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';

const Home = () => {
  const [threads, setThreads] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/api/threads', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Assuming backend returns array directly; adjust if response.data.data
        setThreads(response.data || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch threads');
      } finally {
        setLoading(false);
      }
    };
    fetchThreads();
  }, [token]);

  if (loading) return <p className="loading">Loading threads...</p>;

  return (
    <div>
      <h2>Threads</h2>
      {error && <p className="error">{error}</p>}
      <ul className="thread-list">
        {threads.map((thread) => (
          <li key={thread._id} className="thread-item">
            <h3><Link to={`/thread/${thread._id}`} style={{ textDecoration: 'none', color: '#007bff' }}>{thread.title}</Link></h3>
            <p>{thread.description}</p>
            <p>By: {thread.createdBy?.emailId || thread.createdBy} | {new Date(thread.createdAt).toLocaleDateString()} | Likes: {thread.likes?.length || 0}</p>
          </li>
        ))}
      </ul>
      {threads.length === 0 && !loading && <p>No threads found. Create one!</p>}
    </div>
  );
};

export default Home;
