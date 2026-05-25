import { AnimatePresence, motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function LikeButton({ postId, initialCount = 0, initialLiked = false, className }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // Fetch status when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      api.get(`/posts/${postId}/like-status`)
        .then(({ data }) => {
          setLiked(data.data.liked);
          setCount(data.data.likes_count);
        })
        .catch(() => {});
    }
  }, [postId, isAuthenticated]);

  const handleToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (loading) return;
    setLoading(true);
    // Optimistic update
    setLiked((v) => !v);
    setCount((v) => liked ? v - 1 : v + 1);
    try {
      const { data } = await api.post(`/posts/${postId}/like`);
      setLiked(data.data.liked);
      setCount(data.data.likes_count);
    } catch {
      // Revert
      setLiked((v) => !v);
      setCount((v) => liked ? v + 1 : v - 1);
      toast.error('Failed to update like');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      id={`like-btn-${postId}`}
      className={`flex items-center gap-3 px-6 py-3 rounded-none text-sm font-bold uppercase tracking-widest transition-colors duration-150 border-2 ${
        liked
          ? 'bg-accent text-white border-accent'
          : 'bg-surface text-text-primary border-text-primary hover:bg-text-primary hover:text-white dark:bg-surface-dark dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black'
      } ${className || ''}`}
      aria-label={liked ? 'Unlike post' : 'Like post'}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={liked ? 'liked' : 'unliked'}
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.7 }}
          transition={{ duration: 0.15 }}
        >
          <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : ''} />
        </motion.div>
      </AnimatePresence>
      {count}
    </button>
  );
}
