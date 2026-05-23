import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import RichTextEditor from '../components/RichTextEditor';
import ImageUploader from '../components/ImageUploader';

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
      toast.error('TITLE AND CONTENT REQUIRED');
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
      toast.success('POST PUBLISHED');
      navigate(`/posts/${data.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'FAILED TO PUBLISH');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark swiss-noise">
      <div className="max-w-content mx-auto border-x-4 border-text-primary dark:border-white min-h-screen">
        <div className="border-b-4 border-text-primary dark:border-white p-8 md:p-16 bg-muted dark:bg-[#111]">
          <h1 className="font-sans text-5xl md:text-7xl font-black text-text-primary dark:text-white uppercase tracking-tighter mb-4">WRITE POST</h1>
          <p className="text-xl font-bold uppercase tracking-widest text-text-secondary dark:text-gray-400">PUBLISH YOUR IDEAS TO THE SYSTEM.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col" id="create-post-form">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y-4 md:divide-y-0 md:divide-x-4 divide-text-primary dark:divide-white border-b-4 border-text-primary dark:border-white">
            <div className="p-8 md:p-16">
              <label htmlFor="title" className="block font-bold uppercase tracking-widest text-text-primary dark:text-white mb-4 text-xl">01. TITLE</label>
              <input
                id="title" name="title" type="text" required
                value={form.title} onChange={handleChange}
                placeholder="ENTER TITLE..."
                className="input text-2xl font-black uppercase tracking-tighter"
              />
            </div>

            <div className="p-8 md:p-16">
              <label htmlFor="excerpt" className="block font-bold uppercase tracking-widest text-text-primary dark:text-white mb-4 text-xl">02. EXCERPT</label>
              <input
                id="excerpt" name="excerpt" type="text"
                value={form.excerpt} onChange={handleChange}
                placeholder="SHORT SUMMARY..."
                className="input text-lg font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y-4 md:divide-y-0 md:divide-x-4 divide-text-primary dark:divide-white border-b-4 border-text-primary dark:border-white">
            <div className="p-8 md:p-16 bg-muted dark:bg-[#111]">
              <label htmlFor="category_id" className="block font-bold uppercase tracking-widest text-text-primary dark:text-white mb-4 text-xl">03. CATEGORY</label>
              <select id="category_id" name="category_id" value={form.category_id} onChange={handleChange} className="input font-bold uppercase tracking-widest">
                <option value="">SELECT A CATEGORY</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="p-8 md:p-16 bg-surface dark:bg-surface-dark">
              <label htmlFor="cover_image" className="block font-bold uppercase tracking-widest text-text-primary dark:text-white mb-4 text-xl">04. COVER IMAGE</label>
              <ImageUploader
                value={form.cover_image}
                onChange={(url) => setForm(f => ({ ...f, cover_image: url }))}
                label="UPLOAD COVER"
              />
            </div>
          </div>

          <div className="p-8 md:p-16 border-b-4 border-text-primary dark:border-white">
            <label htmlFor="content" className="block font-bold uppercase tracking-widest text-text-primary dark:text-white mb-6 text-xl">05. CONTENT</label>
            <RichTextEditor
              value={form.content}
              onChange={(html) => setForm(f => ({ ...f, content: html }))}
            />
          </div>

          <div className="flex flex-col sm:flex-row border-b-4 border-text-primary dark:border-white bg-surface dark:bg-surface-dark">
            <button type="button" onClick={() => navigate(-1)} className="flex-1 p-8 text-center font-black text-2xl uppercase tracking-tighter hover:bg-text-primary hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors border-b-4 sm:border-b-0 sm:border-r-4 border-text-primary dark:border-white">
              CANCEL
            </button>
            <button type="submit" disabled={loading} className="flex-1 p-8 flex justify-center items-center gap-4 text-center font-black text-2xl uppercase tracking-tighter bg-accent text-white hover:bg-white hover:text-accent transition-colors" id="publish-btn">
              {loading ? <Loader2 size={24} className="animate-spin" /> : null}
              PUBLISH POST
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
