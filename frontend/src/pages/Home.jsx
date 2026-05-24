import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Flame, Sparkles, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useDebounce } from '../hooks/useDebounce';
import api from '../services/api';

const CATEGORIES_ICONS = ['01.', '02.', '03.', '04.', '05.', '06.', '07.', '08.'];

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

  const [searchTerm, setSearchTerm] = useState(search);
  const debouncedSearch = useDebounce(searchTerm, 500);

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
    <div className="min-h-screen bg-bg dark:bg-bg-dark swiss-noise">
      {/* Hero */}
      {!search && !category && page === 1 && (
        <section className="border-b-4 border-text-primary dark:border-white swiss-grid-pattern bg-muted dark:bg-[#111]">
          <div className="max-w-content mx-auto flex flex-col md:flex-row min-h-[70vh]">
            <div className="flex-1 border-r-4 border-text-primary dark:border-white p-8 md:p-16 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-16 h-1 bg-accent"></span>
                  <span className="font-bold text-accent tracking-widest uppercase text-sm">01. SYSTEM</span>
                </div>
                <h1 className="font-sans font-black text-6xl md:text-[8rem] leading-[0.85] text-text-primary dark:text-white uppercase tracking-tighter mb-8 break-words">
                  OBJECTIVE<br/>
                  <span className="text-accent">COMMUNICATION</span><br/>
                  SYSTEM.
                </h1>
                <p className="text-xl md:text-2xl font-medium text-text-primary dark:text-white max-w-xl mb-12 leading-snug">
                  WHERE GREAT IDEAS FIND THEIR VOICE. DISCOVER THOUGHTFUL WRITING FROM PASSIONATE CREATORS.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/register" className="btn-primary">
                    START WRITING <ArrowRight className="inline ml-2" size={20} />
                  </Link>
                  <button
                    onClick={() => document.getElementById('posts-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="btn-secondary"
                  >
                    EXPLORE <BookOpen className="inline ml-2" size={20} />
                  </button>
                </div>
              </motion.div>
            </div>
            
            <div className="md:w-[35%] relative hidden md:block">
              {/* Geometric Composition */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="w-full h-1/3 border-4 border-text-primary dark:border-white swiss-dots bg-surface dark:bg-surface-dark mb-4 group hover:bg-accent transition-colors duration-150"></div>
                <div className="flex gap-4 h-1/3 mb-4">
                  <div className="w-1/2 h-full bg-text-primary dark:bg-white rounded-full flex items-center justify-center group">
                    <div className="w-1/2 h-1/2 bg-bg dark:bg-bg-dark rounded-full group-hover:scale-0 transition-transform duration-300"></div>
                  </div>
                  <div className="w-1/2 h-full border-4 border-text-primary dark:border-white swiss-diagonal bg-accent"></div>
                </div>
                <div className="w-full h-1/3 bg-text-primary dark:bg-white flex items-end justify-end p-4">
                  <span className="text-white dark:text-black font-black text-6xl tracking-tighter">1950.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-content mx-auto" id="posts-section">
        {/* Trending Section */}
        {!search && !category && page === 1 && trending.length > 0 && (
          <section className="border-b-4 border-text-primary dark:border-white bg-surface dark:bg-surface-dark">
            <div className="border-b-4 border-text-primary dark:border-white p-6 md:p-8 flex items-center gap-4 bg-muted dark:bg-[#111]">
              <span className="font-black text-accent text-xl">02.</span>
              <h2 className="text-2xl md:text-3xl font-black text-text-primary dark:text-white uppercase tracking-tighter">TRENDING NOW</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-text-primary dark:divide-white">
              {trending.map((post, i) => (
                <div key={post.id} className="p-8 group hover:bg-text-primary hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-150 cursor-pointer">
                  <span className="text-6xl font-black text-text-primary/20 dark:text-white/20 group-hover:text-accent transition-colors mb-4 block">0{i + 1}</span>
                  <Link to={`/posts/${post.id}`}>
                    <h3 className="font-sans font-black text-2xl uppercase tracking-tighter leading-none mb-6">
                      {post.title}
                    </h3>
                  </Link>
                  <Link to={`/profile/${post.author?.id}`} className="text-sm font-bold uppercase tracking-widest flex items-center gap-3">
                    {post.author?.avatar ? (
                      <img src={post.author.avatar} alt="" className="w-8 h-8 rounded-none border-2 border-current object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-none border-2 border-current flex items-center justify-center">
                        <span className="text-lg">{post.author?.username?.[0]?.toUpperCase()}</span>
                      </div>
                    )}
                    {post.author?.username}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col md:flex-row">
          {/* Main Content Area */}
          <div className="flex-1 md:border-r-4 border-text-primary dark:border-white">
            
            {/* Toolbar (Search & Sort) */}
            <div className="border-b-4 border-text-primary dark:border-white p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-muted dark:bg-[#111]">
              <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                <span className="font-black text-accent text-xl">03.</span>
                <input
                  type="text"
                  placeholder="SEARCH ARTICLES..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input w-full max-w-md bg-transparent border-b-4 border-text-primary dark:border-white px-0 py-2 text-xl font-bold uppercase tracking-widest focus:border-accent"
                  id="search-input"
                />
              </div>
              <div className="flex gap-4 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => setParam('sort', 'latest')}
                  className={`px-6 py-3 font-bold uppercase tracking-widest border-2 ${sort === 'latest' ? 'bg-text-primary text-white border-text-primary dark:bg-white dark:text-black dark:border-white' : 'border-text-primary text-text-primary dark:border-white dark:text-white'}`}
                >
                  LATEST
                </button>
                <button
                  onClick={() => setParam('sort', 'popular')}
                  className={`px-6 py-3 font-bold uppercase tracking-widest border-2 ${sort === 'popular' ? 'bg-text-primary text-white border-text-primary dark:bg-white dark:text-black dark:border-white' : 'border-text-primary text-text-primary dark:border-white dark:text-white'}`}
                >
                  POPULAR
                </button>
              </div>
            </div>

            {/* Posts grid */}
            {loading ? (
              <div className="p-8">
                <LoadingSkeleton type="card" count={4} />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center p-24 bg-surface dark:bg-surface-dark border-b-4 border-text-primary dark:border-white">
                <h2 className="text-4xl font-black uppercase tracking-tighter">NO RESULTS</h2>
              </div>
            ) : (
              <div className="divide-y-4 divide-text-primary dark:border-white">
                {/* Featured post */}
                {featured && !search && !category && page === 1 && (
                  <div className="border-b-4 border-text-primary dark:border-white">
                    <div className="p-4 bg-accent text-white font-bold tracking-widest uppercase border-b-4 border-text-primary dark:border-white">
                      FEATURED ARTICLE
                    </div>
                    <BlogCard post={featured} featured />
                  </div>
                )}

                {/* Standard Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2">
                  {(search || category || page > 1 ? posts : rest).map((post, idx) => (
                    <div key={post.id} className={idx % 2 === 0 ? "xl:border-r-4 border-text-primary dark:border-white" : ""}>
                      <BlogCard post={post} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-8 flex justify-center items-center gap-4 bg-surface dark:bg-surface-dark">
                    <button
                      onClick={() => setParam('page', page - 1)}
                      disabled={page <= 1}
                      className="btn-secondary disabled:opacity-40"
                    >
                      PREV
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setParam('page', p)}
                        className={`w-12 h-12 flex items-center justify-center font-bold text-lg border-2 border-text-primary dark:border-white ${p === page ? 'bg-text-primary text-white dark:bg-white dark:text-black' : 'hover:bg-accent hover:border-accent hover:text-white'}`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setParam('page', page + 1)}
                      disabled={page >= totalPages}
                      className="btn-secondary disabled:opacity-40"
                    >
                      NEXT
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full md:w-80 flex-shrink-0 bg-surface dark:bg-surface-dark border-b-4 md:border-b-0 border-text-primary dark:border-white">
            <div className="p-8 border-b-4 border-text-primary dark:border-white bg-accent text-white">
              <span className="font-black text-black text-xl mb-2 block">04.</span>
              <h2 className="text-3xl font-black uppercase tracking-tighter">INDEX</h2>
            </div>
            <div className="p-8 swiss-dots h-full min-h-[500px]">
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setParam('category', '')}
                  className={`text-left font-bold uppercase tracking-widest text-xl p-4 border-2 border-text-primary dark:border-white transition-colors ${!category ? 'bg-text-primary text-white dark:bg-white dark:text-black' : 'bg-surface dark:bg-surface-dark hover:bg-accent hover:border-accent hover:text-white'}`}
                >
                  00. ALL
                </button>
                {categories.map((cat, i) => (
                  <button
                    key={cat.id}
                    onClick={() => setParam('category', cat.id)}
                    className={`text-left font-bold uppercase tracking-widest text-xl p-4 border-2 border-text-primary dark:border-white transition-colors ${category === String(cat.id) ? 'bg-text-primary text-white dark:bg-white dark:text-black' : 'bg-surface dark:bg-surface-dark hover:bg-accent hover:border-accent hover:text-white'}`}
                  >
                    {CATEGORIES_ICONS[i % CATEGORIES_ICONS.length]} {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
