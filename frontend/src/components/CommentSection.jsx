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
    <section className="mt-8">
      <h3 className="text-xl font-black text-text-primary dark:text-white uppercase tracking-tighter mb-8 border-b-4 border-text-primary dark:border-white pb-4">
        {comments.length} {comments.length === 1 ? 'COMMENT' : 'COMMENTS'}
      </h3>

      {/* Comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-12 border-b-4 border-text-primary dark:border-white pb-8">
          <textarea
            id="comment-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="SHARE YOUR THOUGHTS..."
            rows={3}
            className="input resize-none mb-4 font-bold text-lg"
          />
          <div className="flex justify-end">
            <button type="submit" disabled={submitting || !content.trim()} className="btn-primary flex items-center gap-2">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              POST COMMENT
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-muted dark:bg-[#111] border-4 border-text-primary dark:border-white p-6 mb-12 text-center">
          <p className="text-text-primary dark:text-gray-300 font-bold uppercase tracking-widest text-sm">
            <Link to="/login" className="text-accent hover:bg-accent hover:text-white transition-colors px-1 border-b-2 border-accent">SIGN IN</Link> TO JOIN THE DISCUSSION.
          </p>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="skeleton w-12 h-12 rounded-none flex-shrink-0 border-2 border-border" />
              <div className="flex-1 space-y-3">
                <div className="skeleton h-4 w-32 rounded-none" />
                <div className="skeleton h-4 w-full rounded-none" />
                <div className="skeleton h-4 w-3/4 rounded-none" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-8">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex gap-4 group"
              >
                <Link to={`/profile/${comment.user?.id}`} className="flex-shrink-0">
                  {comment.user?.avatar ? (
                    <img src={comment.user.avatar} alt={comment.user.username} className="w-12 h-12 rounded-none border-2 border-text-primary dark:border-white object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-none bg-text-primary dark:bg-white flex items-center justify-center border-2 border-text-primary dark:border-white">
                      <User size={18} className="text-white dark:text-black" />
                    </div>
                  )}
                </Link>
                <div className="flex-1 border-b-2 border-border dark:border-border-dark pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Link to={`/profile/${comment.user?.id}`} className="text-sm font-black uppercase tracking-widest text-text-primary dark:text-white hover:text-accent transition-colors">
                        {comment.user?.username}
                      </Link>
                      <span className="text-xs font-bold uppercase tracking-widest text-text-muted dark:text-gray-500">{timeAgo(comment.created_at)}</span>
                    </div>
                    {canDelete(comment) && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-accent hover:bg-accent hover:text-white transition-all border-2 border-transparent hover:border-accent"
                        aria-label="Delete comment"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-base font-medium text-text-secondary dark:text-gray-300 leading-relaxed">{comment.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </section>
  );
}
