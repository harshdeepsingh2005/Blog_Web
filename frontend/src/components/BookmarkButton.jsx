import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function BookmarkButton({ postId, className = "" }) {
  const [bookmarked, setBookmarked] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      api.get(`/bookmarks/${postId}/status`)
        .then(({ data }) => setBookmarked(data.data.bookmarked))
        .catch(() => {});
    }
  }, [postId, isAuthenticated]);

  const toggleBookmark = async (e) => {
    e.preventDefault(); // Prevent navigating to post if used inside a Link
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Optimistic UI
    setBookmarked(!bookmarked);

    try {
      const { data } = await api.post(`/bookmarks/${postId}`);
      setBookmarked(data.data.bookmarked);
      if (data.data.bookmarked) {
        toast.success("Saved to bookmarks", { id: 'bookmark' });
      } else {
        toast.success("Removed from bookmarks", { id: 'bookmark' });
      }
    } catch (err) {
      setBookmarked(!bookmarked); // Revert
      toast.error('Failed to update bookmark');
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`p-2 rounded-none transition-colors border-2 border-text-primary dark:border-white ${bookmarked ? 'bg-accent border-accent text-white' : 'hover:bg-text-primary hover:text-white dark:hover:bg-white dark:hover:text-black'} ${className}`}
      title={bookmarked ? "Remove bookmark" : "Bookmark post"}
    >
      <Bookmark 
        size={18} 
        className={bookmarked ? "fill-white text-white" : "text-text-primary dark:text-white group-hover:text-white dark:group-hover:text-black"} 
      />
    </button>
  );
}
