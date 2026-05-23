import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Eye, MessageCircle, Share2, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import LikeButton from '../components/LikeButton';
import LoadingSkeleton from '../components/LoadingSkeleton';
import BlogCard from '../components/BlogCard';
import { useAuth } from '../context/AuthContext';
import { useReadingProgress } from '../hooks/useReadingProgress';
import api from '../services/api';
import toast from 'react-hot-toast';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function readTime(content) {
  const words = content?.split(' ').length || 0;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const progress = useReadingProgress();

  const [post, setPost] = useState(null);
  const [morePosts, setMorePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data);
        // Fetch more posts by same author
        const authorRes = await api.get(`/users/${data.author_id}/posts`);
        setMorePosts(
          (authorRes.data.data || [])
            .filter((p) => p.id !== data.id)
            .slice(0, 3)
        );
      } catch {
        setError('Post not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      toast.success('Post deleted');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to delete post');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const scrollToComments = () => {
    document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const isOwner = user?.id === post?.author_id;
  const canEdit = isOwner || user?.is_admin === 1;

  if (loading) {
    return (
      <div className="max-w-reading mx-auto px-6 py-12">
        <LoadingSkeleton type="post" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center px-6">
        <p className="text-5xl mb-4">📄</p>
        <h1 className="text-xl font-bold text-text-primary dark:text-white mb-2">Post not found</h1>
        <p className="text-text-secondary dark:text-gray-400 text-sm mb-6">This post may have been removed or doesn't exist.</p>
        <Link to="/" className="btn-primary">Go home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ── Reading progress bar ────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-border dark:bg-border-dark">
        <motion.div
          className="h-full bg-accent origin-left"
          style={{ scaleX: progress / 100 }}
          transition={{ ease: 'linear', duration: 0 }}
        />
      </div>

      {/* ── Cover image ─────────────────────────────────────────────── */}
      {post.cover_image && (
        <div className="w-full h-72 md:h-[28rem] overflow-hidden">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-reading mx-auto px-6 py-12">
        {/* ── Back ──────────────────────────────────────────────────── */}
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost flex items-center gap-1.5 text-sm mb-8 -ml-2"
        >
          <ArrowLeft size={15} /> Back
        </button>

        {/* ── Category ──────────────────────────────────────────────── */}
        {post.category && (
          <span className="badge-terra mb-4 inline-flex">{post.category.name}</span>
        )}

        {/* ── Title ─────────────────────────────────────────────────── */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-3xl md:text-4xl font-bold text-text-primary dark:text-white leading-tight mb-6"
        >
          {post.title}
        </motion.h1>

        {/* ── Author meta ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-8 border-b border-border dark:border-border-dark">
          <Link to={`/profile/${post.author?.id}`} className="flex items-center gap-3 group">
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-accent-light"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-accent-light flex items-center justify-center">
                <User size={18} className="text-accent" />
              </div>
            )}
            <div>
              <p className="font-semibold text-text-primary dark:text-white group-hover:text-accent transition-colors">
                {post.author?.username}
              </p>
              <div className="flex items-center gap-3 text-xs text-text-muted dark:text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {formatDate(post.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {readTime(post.content)} min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={11} />
                  {post.views} views
                </span>
              </div>
            </div>
          </Link>

          {/* Owner actions */}
          {canEdit && (
            <div className="flex gap-2">
              <Link to={`/edit-post/${post.id}`} className="btn-secondary text-sm">
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-btn hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* ── Article content ───────────────────────────────────────── */}
        <motion.div
          id="article-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="prose-editorial"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
        />

        {/* ── Post actions bar ──────────────────────────────────────── */}
        <div className="flex items-center gap-3 mt-12 pt-8 border-t border-border dark:border-border-dark flex-wrap">
          <LikeButton postId={post.id} initialCount={post.likes_count} />
          <button
            onClick={scrollToComments}
            className="btn-secondary flex items-center gap-2 text-sm"
            id="scroll-to-comments"
          >
            <MessageCircle size={15} />
            {post.comments_count} comments
          </button>
          <button
            onClick={handleShare}
            className="btn-secondary flex items-center gap-2 text-sm ml-auto"
          >
            <Share2 size={15} /> Share
          </button>
        </div>

        {/* ── Author card ───────────────────────────────────────────── */}
        <div className="mt-12 p-6 rounded-card bg-accent-light dark:bg-gray-800 border border-accent/10 dark:border-border-dark flex items-center gap-5">
          <Link to={`/profile/${post.author?.id}`} className="flex-shrink-0">
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
            )}
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text-muted dark:text-gray-500 uppercase tracking-wider mb-1">
              Written by
            </p>
            <Link
              to={`/profile/${post.author?.id}`}
              className="font-bold text-text-primary dark:text-white hover:text-accent transition-colors"
            >
              {post.author?.username}
            </Link>
            {post.author?.bio && (
              <p className="text-sm text-text-secondary dark:text-gray-400 mt-1 line-clamp-2">
                {post.author.bio}
              </p>
            )}
          </div>
          <Link
            to={`/profile/${post.author?.id}`}
            className="btn-secondary text-sm flex-shrink-0 hidden sm:block"
          >
            View profile
          </Link>
        </div>

        {/* ── More from this author ─────────────────────────────────── */}
        {morePosts.length > 0 && (
          <section className="mt-12 pt-8 border-t border-border dark:border-border-dark">
            <h2 className="text-lg font-semibold text-text-primary dark:text-white mb-5">
              More from {post.author?.username}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {morePosts.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}

        {/* ── Comments ──────────────────────────────────────────────── */}
        <div id="comments-section">
          <CommentSection postId={post.id} />
        </div>
      </div>
    </div>
  );
}
