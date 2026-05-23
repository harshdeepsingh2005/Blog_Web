import { motion } from 'framer-motion';
import { Clock, Heart, MessageCircle, User } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <motion.article
      className={`card overflow-hidden group ${featured ? 'md:flex gap-0' : ''}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      {/* Cover image */}
      {post.cover_image && (
        <Link to={`/posts/${post.id}`} className={`block overflow-hidden ${featured ? 'md:w-2/5 flex-shrink-0' : ''}`}>
          <img
            src={post.cover_image}
            alt={post.title}
            className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${featured ? 'h-full min-h-[220px]' : 'h-48'}`}
          />
        </Link>
      )}

      <div className="p-6 flex flex-col gap-3">
        {/* Category badge */}
        {post.category && (
          <span className="badge-terra text-xs">{post.category.name}</span>
        )}

        {/* Title */}
        <Link to={`/posts/${post.id}`}>
          <h2 className={`font-serif font-bold text-text-primary dark:text-white leading-snug group-hover:text-accent transition-colors ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}>
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-text-secondary dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 mt-auto">
          {/* Author */}
          <Link to={`/profile/${post.author?.id}`} className="flex items-center gap-2 group/author">
            {post.author?.avatar ? (
              <img src={post.author.avatar} alt={post.author.username} className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0">
                <User size={13} className="text-accent" />
              </div>
            )}
            <span className="text-xs font-medium text-text-secondary group-hover/author:text-accent transition-colors dark:text-gray-400">
              {post.author?.username}
            </span>
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-text-muted dark:text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {readTime(post.content)}m
            </span>
            <span className="flex items-center gap-1">
              <Heart size={12} />
              {post.likes_count || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={12} />
              {post.comments_count || 0}
            </span>
          </div>
        </div>

        {/* Date */}
        <p className="text-xs text-text-muted dark:text-gray-600">{formatDate(post.created_at)}</p>
      </div>
    </motion.article>
  );
}
