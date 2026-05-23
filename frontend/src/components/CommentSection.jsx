import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Send, Trash2, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function CommentSection({ postId }) {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/posts/${postId}/comments`);
      setComments(data);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post('/comments', { content, post_id: postId });
      setComments((prev) => [...prev, data.data]);
      setContent('');
      toast.success('Comment added!');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  const canDelete = (comment) => user?.id === comment.user_id || user?.is_admin === 1;

  return (
    <section className="mt-12 pt-8 border-t border-border dark:border-border-dark">
      <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-6">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h3>

      {/* Comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            id="comment-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="input resize-none mb-3"
          />
          <div className="flex justify-end">
            <button type="submit" disabled={submitting || !content.trim()} className="btn-primary flex items-center gap-2">
              {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              Post comment
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-accent-light rounded-card p-5 mb-8 text-center">
          <p className="text-text-secondary dark:text-gray-400 text-sm">
            <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link> to join the discussion.
          </p>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="skeleton w-9 h-9 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-24 rounded" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-3/4 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-6">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex gap-3 group"
              >
                <Link to={`/profile/${comment.user?.id}`} className="flex-shrink-0">
                  {comment.user?.avatar ? (
                    <img src={comment.user.avatar} alt={comment.user.username} className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-accent-light flex items-center justify-center">
                      <User size={15} className="text-accent" />
                    </div>
                  )}
                </Link>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Link to={`/profile/${comment.user?.id}`} className="text-sm font-semibold text-text-primary dark:text-white hover:text-accent">
                        {comment.user?.username}
                      </Link>
                      <span className="text-xs text-text-muted dark:text-gray-500">{timeAgo(comment.created_at)}</span>
                    </div>
                    {canDelete(comment) && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        aria-label="Delete comment"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary dark:text-gray-300 leading-relaxed">{comment.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </section>
  );
}
