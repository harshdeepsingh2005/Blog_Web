import { motion } from 'framer-motion';
import { Eye, Heart, MessageCircle, PenLine, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-card flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-text-primary dark:text-white">{value}</p>
        <p className="text-xs text-text-secondary dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get(`/users/${user.id}/posts`)
      .then(({ data }) => setPosts(data.data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [user]);

  const totalLikes = posts.reduce((sum, p) => sum + (p.likes_count || 0), 0);
  const totalComments = posts.reduce((sum, p) => sum + (p.comments_count || 0), 0);
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

  return (
    <div className="max-w-content mx-auto px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8 flex-wrap gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-text-primary dark:text-white">
            Welcome back, {user?.username} 👋
          </h1>
          <p className="text-text-secondary dark:text-gray-400 text-sm mt-1">Manage your posts and track engagement</p>
        </div>
        <Link to="/create-post" className="btn-primary flex items-center gap-2" id="create-post-btn">
          <Plus size={16} /> New Post
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={PenLine} label="Posts" value={posts.length} color="bg-accent" />
        <StatCard icon={Eye} label="Total views" value={totalViews} color="bg-purple-500" />
        <StatCard icon={Heart} label="Total likes" value={totalLikes} color="bg-red-500" />
        <StatCard icon={MessageCircle} label="Comments" value={totalComments} color="bg-emerald-500" />
      </div>

      {/* Posts list */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary dark:text-white mb-5">Your posts</h2>
        {loading ? (
          <LoadingSkeleton type="card" count={3} />
        ) : posts.length === 0 ? (
          <div className="card p-12 text-center flex flex-col items-center justify-center min-h-[300px] border-dashed border-2 bg-transparent">
            <div className="w-16 h-16 rounded-full bg-accent-light flex items-center justify-center mb-4">
              <PenLine size={28} className="text-accent" />
            </div>
            <h3 className="text-lg font-bold text-text-primary dark:text-white mb-2">No posts yet</h3>
            <p className="text-text-secondary dark:text-gray-400 mb-6 max-w-sm">
              You haven't published anything yet. Start writing and share your ideas with the community.
            </p>
            <Link to="/create-post" className="btn-primary">Write your first post</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
