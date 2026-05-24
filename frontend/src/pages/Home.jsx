import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Flame, Sparkles, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useDebounce } from '../hooks/useDebounce';
import api from '../services/api';

const CATEGORIES_ICONS = ['💻', '🤖', '⚙️', '🌿', '📚', '🔬', '🎨', '💼'];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [trending, setTrending] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'latest';
  const page = parseInt(searchParams.get('page') || '1');
  const LIMIT = 9;

  // Local state for the search input to allow debouncing
  const [searchTerm, setSearchTerm] = useState(search);
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Sync debounced search to URL params
  useEffect(() => {
    if (debouncedSearch !== search) {
      setParam('search', debouncedSearch);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          skip: (page - 1) * LIMIT,
          limit: LIMIT,
          sort_by: sort,
          ...(search && { search }),
          ...(category && { category_id: category }),
        };

        const requests = [
          api.get('/posts', { params }),
          api.get('/categories'),
        ];

        // Fetch trending if we're on the default view
        if (!search && !category && page === 1) {
          requests.push(api.get('/posts', { params: { sort_by: 'popular', limit: 3 } }));
        }

        const [postsRes, catRes, trendingRes] = await Promise.all(requests);
        
        setPosts(postsRes.data.data.posts);
        setTotal(postsRes.data.data.total);
        setCategories(catRes.data);
        if (trendingRes) {
          setTrending(trendingRes.data.data.posts);
        }
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search, category, sort, page]);

  const setParam = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      if (key !== 'page') next.delete('page');
      return next;
    });
  };

  const totalPages = Math.ceil(total / LIMIT);
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      {!search && !category && page === 1 && (
        <section className="relative overflow-hidden bg-gradient-to-br from-accent-light via-bg to-terra-light dark:from-gray-900 dark:via-bg-dark dark:to-gray-800 py-20 px-6">
          <div className="max-w-content mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="badge-accent mb-4 inline-flex">
                <Sparkles size={12} />
                Premium Blogging Platform
              </span>
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-text-primary dark:text-white mb-6 leading-tight">
                Where great ideas <br />
                <span className="text-gradient">find their voice</span>
              </h1>
              <p className="text-lg text-text-secondary dark:text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
                Discover thoughtful writing from passionate creators. Read, write, and connect with a community that values authentic expression.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-6 py-3">
                  Start writing <ArrowRight size={16} />
                </Link>
                <button
                  onClick={() => document.getElementById('posts-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-secondary flex items-center gap-2 text-base px-6 py-3"
                >
                  <BookOpen size={16} /> Explore posts
                </button>
              </div>
            </motion.div>
          </div>
          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-terra/10 rounded-full blur-3xl pointer-events-none" />
        </section>
      )}

      <div className="max-w-content mx-auto px-6 py-12" id="posts-section">
        {/* Trending Section */}
        {!search && !category && page === 1 && trending.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={20} className="text-accent" />
              <h2 className="text-lg font-bold text-text-primary dark:text-white uppercase tracking-wide">Trending on Blogify</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trending.map((post, i) => (
                <div key={post.id} className="flex gap-4 items-start">
                  <span className="text-4xl font-bold text-border dark:text-gray-700">0{i + 1}</span>
                  <div className="flex-1">
                    <Link to={`/posts/${post.id}`}>
                      <h3 className="font-serif font-bold text-text-primary dark:text-white leading-snug hover:text-accent transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    <Link to={`/profile/${post.author?.id}`} className="text-xs text-text-secondary dark:text-gray-400 mt-2 hover:text-accent flex items-center gap-1.5">
                      {post.author?.avatar ? (
                        <img src={post.author.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-accent-light flex items-center justify-center">
                          <span className="text-[10px] text-accent font-bold">{post.author?.username?.[0]?.toUpperCase()}</span>
                        </div>
                      )}
                      {post.author?.username}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={18} className="text-terra" />
            <h2 className="text-sm font-semibold text-text-secondary dark:text-gray-400 uppercase tracking-wide">Browse by topic</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setParam('category', '')}
              className={`badge text-sm px-4 py-1.5 rounded-full border transition-all ${!category ? 'bg-accent text-white border-accent' : 'bg-surface text-text-secondary border-border hover:border-accent hover:text-accent dark:bg-surface-dark dark:border-border-dark dark:text-gray-400'}`}
            >
              All
            </button>
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => setParam('category', cat.id)}
                className={`badge text-sm px-4 py-1.5 rounded-full border transition-all ${category === String(cat.id) ? 'bg-accent text-white border-accent' : 'bg-surface text-text-secondary border-border hover:border-accent hover:text-accent dark:bg-surface-dark dark:border-border-dark dark:text-gray-400'}`}
              >
                {CATEGORIES_ICONS[i % CATEGORIES_ICONS.length]} {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input flex-1"
            id="search-input"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setParam('sort', 'latest')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-btn text-sm font-medium border transition-all ${sort === 'latest' ? 'bg-accent text-white border-accent' : 'btn-secondary'}`}
            >
              <BookOpen size={14} /> Latest
            </button>
            <button
              onClick={() => setParam('sort', 'popular')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-btn text-sm font-medium border transition-all ${sort === 'popular' ? 'bg-accent text-white border-accent' : 'btn-secondary'}`}
            >
              <TrendingUp size={14} /> Popular
            </button>
          </div>
        </div>

        {/* Posts grid */}
        {loading ? (
          <LoadingSkeleton type="card" count={6} />
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={40} className="text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary dark:text-gray-400">No posts found. Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && !search && !category && page === 1 && (
              <div className="mb-8 border-t border-border dark:border-border-dark pt-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} className="text-accent" />
                  <h2 className="text-sm font-semibold text-text-secondary dark:text-gray-400 uppercase tracking-wide">Featured</h2>
                </div>
                <BlogCard post={featured} featured />
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(search || category || page > 1 ? posts : rest).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setParam('page', page - 1)}
                  disabled={page <= 1}
                  className="btn-secondary disabled:opacity-40"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setParam('page', p)}
                    className={`w-9 h-9 rounded-btn text-sm font-medium ${p === page ? 'bg-accent text-white' : 'btn-secondary'}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setParam('page', page + 1)}
                  disabled={page >= totalPages}
                  className="btn-secondary disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
