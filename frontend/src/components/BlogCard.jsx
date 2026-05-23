import { motion } from 'framer-motion';
import { Clock, Heart, MessageCircle, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookmarkButton from './BookmarkButton';
import { API_BASE_URL } from '../services/api';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function readTime(content) {
  const words = content?.split(' ').length || 0;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogCard({ post, featured = false }) {
  return (
    <article
      className={`card group cursor-pointer ${featured ? 'md:flex gap-0' : 'flex flex-col'}`}
    >
      {/* Cover image */}
      <Link to={`/posts/${post.id}`} className={`block border-b-4 border-text-primary dark:border-white ${featured ? 'md:w-2/5 md:border-b-0 md:border-r-4 flex-shrink-0' : ''}`}>
        <img
          src={post.cover_image || `${API_BASE_URL}/uploads/default_cover.jpg`}
          alt={post.title}
          className={`w-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-150 ${featured ? 'h-full min-h-[300px]' : 'h-56'}`}
        />
      </Link>

      <div className="p-6 flex flex-col gap-3">
        {/* Category badge */}
        {post.category && (
          <span className="badge-terra text-xs self-start mb-2">{post.category.name}</span>
        )}

        {/* Title */}
        <div className="flex items-start justify-between gap-4">
          <Link to={`/posts/${post.id}`} className="flex-1 group-hover:text-white dark:group-hover:text-black">
            <h2 className={`font-sans font-black uppercase tracking-tighter text-text-primary dark:text-white leading-none transition-colors duration-150 ${featured ? 'text-4xl md:text-5xl' : 'text-3xl'}`}>
              {post.title}
            </h2>
          </Link>
          <BookmarkButton postId={post.id} className="border-2 border-text-primary dark:border-white group-hover:border-white dark:group-hover:border-black rounded-none" />
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-text-primary dark:text-gray-300 text-sm leading-relaxed mt-2 font-medium">
            {post.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pt-6 mt-auto gap-4">
          {/* Author */}
          <Link to={`/profile/${post.author?.id}`} className="flex items-center gap-3">
            {post.author?.avatar ? (
              <img src={post.author.avatar} alt={post.author.username} className="w-10 h-10 rounded-none border-2 border-text-primary dark:border-white object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-none bg-text-primary dark:bg-white flex items-center justify-center flex-shrink-0 border-2 border-text-primary dark:border-white">
                <User size={16} className="text-white dark:text-black" />
              </div>
            )}
            <div>
              <span className="block text-xs font-bold uppercase tracking-widest text-text-primary dark:text-white">
                {post.author?.username}
              </span>
              <p className="text-xs font-medium uppercase tracking-widest text-text-primary dark:text-gray-400 mt-0.5">{formatDate(post.created_at)}</p>
            </div>
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-text-primary dark:text-white">
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {readTime(post.content)}M
            </span>
            <span className="flex items-center gap-1.5">
              <Heart size={14} />
              {post.likes_count || 0}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle size={14} />
              {post.comments_count || 0}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
