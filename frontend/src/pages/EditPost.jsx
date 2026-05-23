import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function EditPost() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', cover_image: '', category_id: '' });

  useEffect(() => {
    Promise.all([api.get(`/posts/${id}`), api.get('/categories')])
      .then(([postRes, catRes]) => {
        const p = postRes.data;
        setForm({
          title: p.title || '',
          content: p.content || '',
          excerpt: p.excerpt || '',
          cover_image: p.cover_image || '',
          category_id: p.category_id ? String(p.category_id) : '',
        });
        setCategories(catRes.data);
      })
      .catch(() => { toast.error('Post not found'); navigate('/dashboard'); })
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        category_id: form.category_id ? parseInt(form.category_id) : null,
      };
      const { data } = await api.put(`/posts/${id}`, payload);
      toast.success('Post updated!');
      navigate(`/posts/${data.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" size={28} /></div>;

  return (
    <div className="max-w-reading mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl font-bold text-text-primary dark:text-white mb-8">Edit post</h1>
      <form onSubmit={handleSubmit} className="space-y-6" id="edit-post-form">
        <div>
          <label htmlFor="edit-title" className="block text-sm font-medium text-text-primary dark:text-white mb-1.5">Title *</label>
          <input id="edit-title" name="title" type="text" required value={form.title} onChange={handleChange} className="input text-lg font-semibold" />
        </div>
        <div>
          <label htmlFor="edit-excerpt" className="block text-sm font-medium text-text-primary dark:text-white mb-1.5">Excerpt</label>
          <input id="edit-excerpt" name="excerpt" type="text" value={form.excerpt} onChange={handleChange} className="input" />
        </div>
        <div>
          <label htmlFor="edit-cover" className="block text-sm font-medium text-text-primary dark:text-white mb-1.5">Cover image URL</label>
          <input id="edit-cover" name="cover_image" type="url" value={form.cover_image} onChange={handleChange} className="input" />
          {form.cover_image && (
            <img src={form.cover_image} alt="Cover preview" className="mt-2 rounded-card h-40 w-full object-cover" />
          )}
        </div>
        <div>
          <label htmlFor="edit-category" className="block text-sm font-medium text-text-primary dark:text-white mb-1.5">Category</label>
          <select id="edit-category" name="category_id" value={form.category_id} onChange={handleChange} className="input">
            <option value="">Select a category</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="edit-content" className="block text-sm font-medium text-text-primary dark:text-white mb-1.5">Content *</label>
          <textarea id="edit-content" name="content" required value={form.content} onChange={handleChange} rows={18} className="input resize-y" />
        </div>
        <div className="flex gap-3 justify-end pt-4 border-t border-border dark:border-border-dark">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2" id="update-btn">
            {loading ? <Loader2 size={16} className="animate-spin" /> : null} Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
