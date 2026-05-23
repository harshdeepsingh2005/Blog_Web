import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', content: '', excerpt: '', cover_image: '', category_id: '',
  });

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        category_id: form.category_id ? parseInt(form.category_id) : null,
        excerpt: form.excerpt || form.content.slice(0, 150),
      };
      const { data } = await api.post('/posts', payload);
      toast.success('Post published!');
      navigate(`/posts/${data.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-reading mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-3xl font-bold text-text-primary dark:text-white mb-2">Write a new post</h1>
        <p className="text-text-secondary dark:text-gray-400 text-sm mb-8">Share your ideas with the world</p>

        <form onSubmit={handleSubmit} className="space-y-6" id="create-post-form">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-primary dark:text-white mb-1.5">Title *</label>
            <input
              id="title" name="title" type="text" required
              value={form.title} onChange={handleChange}
              placeholder="Your post title..."
              className="input text-lg font-semibold"
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-text-primary dark:text-white mb-1.5">Excerpt <span className="text-text-muted">(optional)</span></label>
            <input
              id="excerpt" name="excerpt" type="text"
              value={form.excerpt} onChange={handleChange}
              placeholder="A short summary shown in listings..."
              className="input"
            />
          </div>

          <div>
            <label htmlFor="cover_image" className="block text-sm font-medium text-text-primary dark:text-white mb-1.5">Cover image URL <span className="text-text-muted">(optional)</span></label>
            <input
              id="cover_image" name="cover_image" type="url"
              value={form.cover_image} onChange={handleChange}
              placeholder="https://..."
              className="input"
            />
            {form.cover_image && (
              <img src={form.cover_image} alt="Cover preview" className="mt-2 rounded-card h-40 w-full object-cover" />
            )}
          </div>

          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-text-primary dark:text-white mb-1.5">Category</label>
            <select id="category_id" name="category_id" value={form.category_id} onChange={handleChange} className="input">
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-text-primary dark:text-white mb-1.5">Content *</label>
            <textarea
              id="content" name="content" required
              value={form.content} onChange={handleChange}
              placeholder="Write your story..."
              rows={18}
              className="input resize-y font-sans text-base leading-relaxed"
            />
            <p className="text-xs text-text-muted mt-1">{form.content.split(' ').filter(Boolean).length} words</p>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-border dark:border-border-dark">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2" id="publish-btn">
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Publish post
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
