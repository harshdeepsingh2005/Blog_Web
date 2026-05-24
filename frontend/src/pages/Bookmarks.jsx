import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark as BookmarkIcon } from 'lucide-react';
import api from '../services/api';
import BlogCard from '../components/BlogCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const { data } = await api.get('/bookmarks');
        setBookmarks(data.data);
      } catch (err) {
        console.error('Failed to fetch bookmarks', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  return (
    <div className="max-w-content mx-auto px-6 py-12 min-h-[calc(100vh-140px)]">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex items-center gap-3 border-b border-border dark:border-border-dark pb-6">
        <div className="p-3 bg-accent/10 rounded-full text-accent">
          <BookmarkIcon size={24} className="fill-current" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold text-text-primary dark:text-white">Your Bookmarks</h1>
          <p className="text-text-secondary dark:text-gray-400 mt-1">Saved articles to read later</p>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton type="card" count={3} />
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-20 card border-dashed border-2 bg-transparent">
          <BookmarkIcon size={48} className="mx-auto text-text-muted dark:text-gray-600 mb-4" />
          <h2 className="text-xl font-bold text-text-primary dark:text-white mb-2">No bookmarks yet</h2>
          <p className="text-text-secondary dark:text-gray-400">Posts you bookmark will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
