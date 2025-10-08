import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';

const CreateThread = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/threads', {
        title,
        description,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag), // Convert to array, filter empty
        category,
        createdBy: user.emailId // Use emailId as identifier; adjust if backend expects ObjectId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Success: Redirect to home
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to create thread');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create New Thread</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            rows="4" 
            required 
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Tags (comma-separated):</label>
          <input 
            type="text" 
            value={tags} 
            onChange={(e) => setTags(e.target.value)} 
            placeholder="e.g., tech, javascript" 
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input 
            type="text" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Thread'}
        </button>
        <button type="button" onClick={() => navigate('/home')} className="btn btn-danger" disabled={loading}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateThread;
