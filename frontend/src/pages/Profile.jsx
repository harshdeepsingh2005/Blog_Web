import { motion } from 'framer-motion';
import { Calendar, Loader2, PenLine, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ImageUploader from '../components/ImageUploader';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser, updateLocalUser } = useAuth();
  const isOwnProfile = String(currentUser?.id) === String(id);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ username: '', bio: '', avatar: '' });

  useEffect(() => {
    setLoadingProfile(true);
    setLoadingPosts(true);
    api.get(`/users/${id}`)
      .then(({ data }) => {
        setProfile(data);
        setForm({ username: data.username, bio: data.bio || '', avatar: data.avatar || '' });
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));

    api.get(`/users/${id}/posts`)
      .then(({ data }) => setPosts(data.data))
      .catch(() => setPosts([]))
      .finally(() => setLoadingPosts(false));
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put(`/users/${id}`, form);
      setProfile(data);
      if (isOwnProfile) updateLocalUser(data);
      setEditing(false);
      toast.success('PROFILE UPDATED');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'UPDATE FAILED');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  if (loadingProfile) {
    return (
      <div className="max-w-content mx-auto px-6 py-24">
        <LoadingSkeleton type="profile" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-40 swiss-noise bg-bg dark:bg-bg-dark min-h-screen">
        <h1 className="text-8xl font-black uppercase tracking-tighter mb-4 text-text-primary dark:text-white">NOT FOUND</h1>
        <p className="font-bold uppercase tracking-widest text-text-secondary dark:text-gray-400">USER DOES NOT EXIST.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark swiss-noise">
      <div className="max-w-content mx-auto border-x-4 border-text-primary dark:border-white min-h-screen">
        {/* Profile header */}
        <div className="border-b-4 border-text-primary dark:border-white grid grid-cols-1 md:grid-cols-12 bg-muted dark:bg-[#111]">
          {/* Avatar Area */}
          <div className="md:col-span-4 border-b-4 md:border-b-0 md:border-r-4 border-text-primary dark:border-white p-8 md:p-16 flex items-center justify-center bg-surface dark:bg-surface-dark swiss-grid-pattern">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.username} className="w-48 h-48 rounded-none object-cover border-8 border-text-primary dark:border-white shadow-[16px_16px_0px_0px_var(--tw-shadow-color)] shadow-accent" />
            ) : (
              <div className="w-48 h-48 rounded-none bg-text-primary dark:bg-white flex items-center justify-center border-8 border-text-primary dark:border-white shadow-[16px_16px_0px_0px_var(--tw-shadow-color)] shadow-accent">
                <User size={64} className="text-white dark:text-black" />
              </div>
            )}
          </div>

          {/* Info Area */}
          <div className="md:col-span-8 p-8 md:p-16 flex flex-col justify-center">
            {editing ? (
              <form onSubmit={handleSave} className="space-y-6 text-left" id="profile-form">
                <div>
                  <label className="block font-bold uppercase tracking-widest text-text-primary dark:text-white mb-2">USERNAME</label>
                  <input name="username" value={form.username} onChange={handleChange} className="input text-2xl font-black uppercase tracking-tighter" />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-widest text-text-primary dark:text-white mb-2">BIO</label>
                  <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} className="input text-lg font-bold resize-none" />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-widest text-text-primary dark:text-white mb-2">AVATAR</label>
                  <ImageUploader
                    value={form.avatar}
                    onChange={(url) => setForm(f => ({ ...f, avatar: url }))}
                    label="UPLOAD AVATAR"
                  />
                </div>
                <div className="flex gap-4 pt-4 border-t-4 border-text-primary dark:border-white">
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : null} SAVE PROFILE
                  </button>
                  <button type="button" onClick={() => setEditing(false)} className="btn-secondary">CANCEL</button>
                </div>
              </form>
            ) : (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <span className="font-bold uppercase tracking-widest text-accent mb-4 block text-lg">01. USER PROFILE</span>
                <h1 className="text-5xl md:text-7xl font-black text-text-primary dark:text-white uppercase tracking-tighter mb-6 leading-none break-words">{profile.username}</h1>
                {profile.bio && <p className="text-lg font-bold uppercase tracking-widest text-text-secondary dark:text-gray-300 leading-relaxed mb-8 max-w-xl">{profile.bio}</p>}
                
                <div className="flex flex-wrap items-center gap-8 text-sm font-bold uppercase tracking-widest text-text-primary dark:text-gray-400">
                  <span className="flex items-center gap-2"><Calendar size={18} />JOINED {new Date(profile.created_at).toLocaleDateString()}</span>
                  <span className="flex items-center gap-2"><PenLine size={18} />{posts.length} POSTS</span>
                </div>
                
                {isOwnProfile && (
                  <button onClick={() => setEditing(true)} className="btn-secondary mt-12 block w-full md:w-auto text-center" id="edit-profile-btn">
                    EDIT PROFILE
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* User posts */}
        <div className="border-b-4 border-text-primary dark:border-white flex flex-col md:flex-row bg-accent text-white">
           <div className="p-8 md:p-12 md:border-r-4 border-text-primary dark:border-white flex-1">
             <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
                {isOwnProfile ? 'YOUR POSTS' : `POSTS BY ${profile.username}`}
             </h2>
           </div>
           <div className="p-8 md:p-12 flex items-center justify-center">
             <span className="font-black text-3xl text-black">02.</span>
           </div>
        </div>
        
        {loadingPosts ? (
          <div className="p-8">
            <LoadingSkeleton type="card" count={3} />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-24 text-center border-b-4 border-text-primary dark:border-white bg-surface dark:bg-surface-dark swiss-diagonal">
            <div className="w-24 h-24 rounded-none bg-text-primary dark:bg-white flex items-center justify-center mx-auto mb-8 border-4 border-text-primary dark:border-white">
              <PenLine size={48} className="text-white dark:text-black" />
            </div>
            <h3 className="text-4xl font-black text-text-primary dark:text-white uppercase tracking-tighter mb-4">NO POSTS YET</h3>
            <p className="font-bold uppercase tracking-widest text-text-secondary dark:text-gray-400">
              {isOwnProfile ? "YOU HAVEN'T PUBLISHED ANYTHING YET." : `${profile.username} HASN'T PUBLISHED ANYTHING YET.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y-4 md:divide-y-0 md:divide-x-4 divide-text-primary dark:divide-white">
            {posts.map((p, idx) => (
               <div key={p.id} className={(Math.floor(idx / 2) > 0) ? "md:border-t-4 border-text-primary dark:border-white" : ""}>
                 <BlogCard post={p} />
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
