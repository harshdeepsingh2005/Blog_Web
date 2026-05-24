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
import api, { API_BASE_URL } from '../services/api';
import DOMPurify from 'dompurify';
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
        const authorRes = await api.get(`/users/${data.author_id}/posts`);
        setMorePosts(
          (authorRes.data.data || [])
            .filter((p) => p.id !== data.id)
            .slice(0, 2)
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
    if (!window.confirm('DELETE THIS POST?')) return;
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
      <div className="max-w-content mx-auto px-6 py-24">
        <LoadingSkeleton type="post" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 swiss-noise bg-bg dark:bg-bg-dark">
        <p className="text-8xl mb-8">📄</p>
        <h1 className="text-6xl font-black text-text-primary dark:text-white uppercase tracking-tighter mb-4">NOT FOUND.</h1>
        <Link to="/" className="btn-primary mt-8">GO BACK TO HOME</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark swiss-noise">
      {/* ── Reading progress bar ────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1.5 bg-border dark:bg-border-dark">
        <motion.div
          className="h-full bg-accent origin-left"
          style={{ scaleX: progress / 100 }}
          transition={{ ease: 'linear', duration: 0 }}
        />
      </div>

      <div className="max-w-content mx-auto border-x-4 border-text-primary dark:border-white min-h-screen">
        
        {/* Header Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b-4 border-text-primary dark:border-white">
          <div className="md:col-span-1 flex justify-center py-6 border-b-4 md:border-b-0 md:border-r-4 border-text-primary dark:border-white">
             <button
                onClick={() => navigate(-1)}
                className="btn-ghost flex items-center justify-center writing-vertical-lr rotate-180 h-full w-full uppercase tracking-[0.3em]"
              >
                <ArrowLeft size={20} className="mb-4" />
                RETURN
              </button>
          </div>
          
          <div className="md:col-span-11 p-8 md:p-16 swiss-grid-pattern bg-muted dark:bg-[#111]">
            {post.category && (
              <span className="badge-terra text-sm mb-8 inline-block">{post.category.name}</span>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-sans font-black text-5xl md:text-[6rem] leading-[0.85] text-text-primary dark:text-white uppercase tracking-tighter mb-8 break-words"
            >
              {post.title}
            </motion.h1>

            <div className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t-4 border-text-primary dark:border-white">
               <Link to={`/profile/${post.author?.id}`} className="flex items-center gap-4 group">
                  {post.author?.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.username}
                      className="w-16 h-16 rounded-none border-4 border-text-primary dark:border-white object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-none bg-text-primary dark:bg-white border-4 border-text-primary dark:border-white flex items-center justify-center">
                      <User size={24} className="text-white dark:text-black" />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-xl uppercase tracking-widest text-text-primary dark:text-white group-hover:text-accent transition-colors">
                      {post.author?.username}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest mt-1 text-text-primary dark:text-gray-400">
                      <span className="flex items-center gap-1.5"><Calendar size={14} />{formatDate(post.created_at)}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} />{readTime(post.content)}M READ</span>
                    </div>
                  </div>
                </Link>
            </div>
          </div>
        </div>

        {/* Cover Image & Actions */}
        <div className="w-full border-b-4 border-text-primary dark:border-white h-[40vh] md:h-[60vh] overflow-hidden filter grayscale hover:grayscale-0 transition-all duration-500">
          <img
            src={post.cover_image || `${API_BASE_URL}/uploads/default_cover.jpg`}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Main Article */}
          <div className="flex-1 p-8 md:p-16 lg:border-r-4 border-text-primary dark:border-white">
            <motion.div
              id="article-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="prose-editorial mx-auto"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content.replace(/\n/g, '<br/>')) }}
            />
          </div>

          {/* Sidebar Actions & Meta */}
          <div className="w-full lg:w-96 flex-shrink-0 flex flex-col border-t-4 lg:border-t-0 border-text-primary dark:border-white">
            <div className="p-8 border-b-4 border-text-primary dark:border-white bg-accent text-white flex justify-between items-center">
              <h3 className="font-black text-3xl uppercase tracking-tighter">METRICS</h3>
              <span className="text-black font-black text-xl">05.</span>
            </div>
            
            <div className="p-8 border-b-4 border-text-primary dark:border-white swiss-diagonal bg-muted dark:bg-[#111]">
               <div className="grid grid-cols-2 gap-4">
                 <div className="border-4 border-text-primary dark:border-white bg-surface dark:bg-surface-dark p-6 flex flex-col items-center justify-center text-center group hover:bg-accent hover:border-accent hover:text-white transition-colors cursor-pointer" onClick={handleShare}>
                   <Share2 size={32} className="mb-4" />
                   <span className="font-bold uppercase tracking-widest text-sm">SHARE</span>
                 </div>
                 <div className="border-4 border-text-primary dark:border-white bg-surface dark:bg-surface-dark p-6 flex flex-col items-center justify-center text-center group hover:bg-text-primary hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer" onClick={scrollToComments}>
                   <MessageCircle size={32} className="mb-4" />
                   <span className="font-bold uppercase tracking-widest text-sm">{post.comments_count} COMMENTS</span>
                 </div>
                 <div className="col-span-2 border-4 border-text-primary dark:border-white bg-surface dark:bg-surface-dark p-6 group hover:bg-surface dark:hover:bg-surface-dark transition-colors flex items-center justify-center">
                    <LikeButton postId={post.id} initialCount={post.likes_count} className="!w-full !p-4 !justify-center" />
                 </div>
               </div>
            </div>

            {canEdit && (
              <div className="p-8 border-b-4 border-text-primary dark:border-white flex flex-col gap-4 bg-surface dark:bg-surface-dark">
                <Link to={`/edit-post/${post.id}`} className="btn-secondary text-center w-full">
                  EDIT POST
                </Link>
                <button
                  onClick={handleDelete}
                  className="btn-primary !bg-text-primary dark:!bg-white !text-white dark:!text-black !border-transparent hover:!bg-accent hover:!border-accent hover:!text-white w-full"
                >
                  DELETE POST
                </button>
              </div>
            )}

            <div className="flex-1 bg-surface dark:bg-surface-dark p-8">
               <div className="border-4 border-text-primary dark:border-white p-6 bg-muted dark:bg-[#111] flex flex-col items-center text-center">
                  {post.author?.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.username}
                      className="w-24 h-24 border-4 border-text-primary dark:border-white object-cover mb-4"
                    />
                  ) : (
                    <div className="w-24 h-24 border-4 border-text-primary dark:border-white bg-text-primary dark:bg-white flex items-center justify-center mb-4">
                      <User size={32} className="text-white dark:text-black" />
                    </div>
                  )}
                  <p className="text-xs font-bold uppercase tracking-widest mb-1">AUTHOR</p>
                  <Link to={`/profile/${post.author?.id}`} className="font-black text-2xl uppercase tracking-tighter hover:text-accent transition-colors">
                    {post.author?.username}
                  </Link>
                  {post.author?.bio && (
                    <p className="font-medium text-sm mt-4 text-text-primary dark:text-gray-300">
                      {post.author.bio}
                    </p>
                  )}
                  <Link to={`/profile/${post.author?.id}`} className="btn-secondary mt-6 w-full text-center">
                    VIEW PROFILE
                  </Link>
               </div>
            </div>
          </div>
        </div>

        {/* More from author & Comments */}
        <div className="border-t-4 border-text-primary dark:border-white flex flex-col xl:flex-row">
          {morePosts.length > 0 && (
            <div className="w-full xl:w-1/3 xl:border-r-4 border-text-primary dark:border-white border-b-4 xl:border-b-0">
               <div className="p-8 border-b-4 border-text-primary dark:border-white bg-text-primary text-white dark:bg-white dark:text-black flex justify-between items-center">
                  <h3 className="font-black text-2xl uppercase tracking-tighter">MORE FROM AUTHOR</h3>
                  <span className="font-black text-xl">06.</span>
               </div>
               <div className="divide-y-4 divide-text-primary dark:divide-white">
                 {morePosts.map((p) => (
                   <BlogCard key={p.id} post={p} />
                 ))}
               </div>
            </div>
          )}

          <div className="flex-1" id="comments-section">
             <div className="p-8 border-b-4 border-text-primary dark:border-white bg-accent text-white flex justify-between items-center">
                <h3 className="font-black text-3xl uppercase tracking-tighter">DISCUSSION</h3>
                <span className="text-black font-black text-xl">07.</span>
             </div>
             <div className="p-8">
               <CommentSection postId={post.id} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
