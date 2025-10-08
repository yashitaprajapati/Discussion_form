import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const ThreadDetail = () => {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null); // ID of comment being replied to
  const [newReply, setNewReply] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchThreadAndComments = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch thread details
        const threadRes = await axios.get(`/api/threads/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setThread(threadRes.data);

        // Fetch comments for this thread (adjust endpoint if backend differs)
        const commentRes = await axios.get(`/api/comment/thread/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComments(commentRes.data || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load thread and comments');
      } finally {
        setLoading(false);
      }
    };
    fetchThreadAndComments();
  }, [id, token]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setError('');
    try {
      // Assuming backend POST /api/comment/:threadId with { comments: text }
      const res = await axios.post(`/api/comment/${id}`, { comments: newComment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optimistically add the new comment (adjust based on backend response)
      const newCommentObj = {
        _id: Date.now().toString(), // Temp ID; replace with res.data._id if returned
        text: newComment, // Or 'comments' field
        UserID: user.emailId,
        type_of_comment: 'comment',
        likes: [],
        replies: [],
        createdAt: new Date().toISOString()
      };
      setComments([...comments, newCommentObj]);
      setNewComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;
    setError('');
    try {
      // Assuming backend POST /api/comment/reply with { commentReply: text, parentCommentId: replyTo }
      const res = await axios.post('/api/comment/reply', { 
        commentReply: newReply,
        parentCommentId: replyTo 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optimistically add the reply to the parent comment
      const updatedComments = comments.map(comment => {
        if (comment._id === replyTo) {
          const newReplyObj = {
            _id: Date.now().toString() + Math.random(), // Temp ID
            commentReply: newReply,
            UserID: user.emailId,
            likes: [],
            createdAt: new Date().toISOString()
          };
          return { ...comment, replies: [...(comment.replies || []), newReplyObj] };
        }
        return comment;
      });
      setComments(updatedComments);
      setReplyTo(null);
      setNewReply('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add reply');
    }
  };

  const handleVote = async (type, typeId, currentLikes = 0) => {
    // type: 'thread' (post), 'comment', 'reply'
    setError('');
    try {
      // Backend endpoint: e.g., POST /api/vote/threads/:id or /comments/:id
      const endpoint = `/api/vote/${type}s/${typeId}`;
      await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optimistic update: Toggle like count (assume backend toggles; here we increment for simplicity)
      // In real: Check if already liked via backend response or local state
      if (type === 'thread') {
        setThread(prev => ({ ...prev, likes: (prev.likes || []).length + 1 }));
      } else if (type === 'comment') {
        setComments(prev => prev.map(c => 
          c._id === typeId ? { ...c, likes: (c.likes || []).length + 1 } : c
        ));
      } else if (type === 'reply') {
        setComments(prev => prev.map(c => ({
          ...c,
          replies: (c.replies || []).map(r => 
            r._id === typeId ? { ...r, likes: (r.likes || []).length + 1 } : r
          )
        })));
      }
    } catch (err) {
      setError('Vote failed');
    }
  };

  const handleReplyClick = (commentId) => {
    setReplyTo(replyTo === commentId ? null : commentId); // Toggle
    setNewReply('');
  };

  if (loading) return <p className="loading">Loading thread...</p>;
  if (!thread) return <p>Thread not found. <button onClick={() => navigate('/home')} className="btn">Go Home</button></p>;

  return (
    <div>
      <h2>{thread.title}</h2>
      <p>{thread.description}</p>
      <p>By: {thread.createdBy?.emailId || thread.createdBy} | {new Date(thread.createdAt).toLocaleDateString()} | Likes: {(thread.likes || []).length}</p>
      <button onClick={() => handleVote('thread', id, (thread.likes || []).length)} className="like-btn">
        Like Thread ({(thread.likes || []).length})
      </button>
      <button onClick={() => navigate('/home')} className="btn">Back to Threads</button>

      <h3>Comments ({comments.length})</h3>
      {error && <p className="error">{error}</p>}
      {comments.map((comment) => (
        <div key={comment._id} className="comment">
          <p><strong>{comment.text || comment.comments}</strong></p>
          <p>By: {comment.UserID?.emailId || comment.UserID} | Type: {comment.type_of_comment} | Likes: {(comment.likes || []).length}</p>
          <button onClick={() => handleVote('comment', comment._id, (comment.likes || []).length)} className="like-btn">
            Like Comment ({(comment.likes || []).length})
          </button>
          {comment.type_of_comment === 'comment' && (
            <button onClick={() => handleReplyClick(comment._id)} className="btn">
              {replyTo === comment._id ? 'Cancel Reply' : 'Reply'}
            </button>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <div>
              {comment.replies.map((reply) => (
                <div key={reply._id} className="reply">
                  <p>{reply.commentReply}</p>
                  <p>Reply by: {reply.UserID?.emailId || reply.UserID} | Likes: {(reply.likes || []).length}</p>
                  <button onClick={() => handleVote('reply', reply._id, (reply.likes || []).length)} className="like-btn">
                    Like Reply ({(reply.likes || []).length})
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <form onSubmit={handleAddComment}>
        <div className="form-group">
          <label>Add Comment:</label>
          <textarea 
            value={newComment} 
            onChange={(e) => setNewComment(e.target.value)} 
            rows="3" 
            placeholder="Share your thoughts..." 
            required 
          />
        </div>
        <button type="submit" className="btn">Add Comment</button>
      </form>

      {replyTo && (
        <form onSubmit={handleAddReply}>
          <div className="form-group">
            <label>Reply to comment:</label>
            <textarea 
              value={newReply} 
              onChange={(e) => setNewReply(e.target.value)} 
              rows="3" 
              placeholder="Your reply..." 
              required 
            />
          </div>
          <button type="submit" className="btn">Add Reply</button>
          <button type="button" onClick={() => setReplyTo(null)} className="btn btn-danger">Cancel</button>
        </form>
      )}
    </div>
  );
};

export default ThreadDetail;
