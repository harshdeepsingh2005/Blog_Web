import { AnimatePresence, motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function LikeButton({ postId, initialCount = 0, initialLiked = false }) {
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
      className={`flex items-center gap-2 px-4 py-2 rounded-btn text-sm font-medium transition-all duration-200 ${
        liked
          ? 'bg-red-50 text-red-500 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
          : 'btn-secondary'
      }`}
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
