import { motion } from 'framer-motion';
import { Calendar, Loader2, PenLine, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
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
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  if (loadingProfile) {
    return (
      <div className="max-w-content mx-auto px-6 py-12">
        <LoadingSkeleton type="profile" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary dark:text-gray-400">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 mb-10 text-center md:text-left md:flex items-center gap-8"
      >
        {/* Avatar */}
        <div className="flex-shrink-0 flex justify-center md:justify-start mb-6 md:mb-0">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.username} className="w-24 h-24 rounded-full object-cover border-4 border-accent-light" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-accent-light flex items-center justify-center">
              <User size={36} className="text-accent" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          {editing ? (
            <form onSubmit={handleSave} className="space-y-3 text-left" id="profile-form">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Username</label>
                <input name="username" value={form.username} onChange={handleChange} className="input text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Bio</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={2} className="input text-sm resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Avatar URL</label>
                <input name="avatar" value={form.avatar} onChange={handleChange} className="input text-sm" placeholder="https://..." />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="btn-primary text-sm flex items-center gap-1.5">
                  {saving ? <Loader2 size={13} className="animate-spin" /> : null} Save
                </button>
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary text-sm">Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-text-primary dark:text-white mb-1">{profile.username}</h1>
              {profile.bio && <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed mb-3">{profile.bio}</p>}
              <div className="flex items-center gap-4 text-xs text-text-muted dark:text-gray-500 justify-center md:justify-start">
                <span className="flex items-center gap-1"><Calendar size={12} />Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><PenLine size={12} />{posts.length} posts</span>
              </div>
              {isOwnProfile && (
                <button onClick={() => setEditing(true)} className="btn-secondary text-sm mt-4" id="edit-profile-btn">
                  Edit profile
                </button>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* User posts */}
      <h2 className="text-lg font-semibold text-text-primary dark:text-white mb-5">
        {isOwnProfile ? 'Your posts' : `Posts by ${profile.username}`}
      </h2>
      {loadingPosts ? (
        <LoadingSkeleton type="card" count={3} />
      ) : posts.length === 0 ? (
        <div className="card p-12 text-center flex flex-col items-center justify-center min-h-[250px] border-dashed border-2 bg-transparent">
          <div className="w-16 h-16 rounded-full bg-accent-light flex items-center justify-center mb-4">
            <PenLine size={28} className="text-accent" />
          </div>
          <h3 className="text-lg font-bold text-text-primary dark:text-white mb-2">No posts yet</h3>
          <p className="text-text-secondary dark:text-gray-400 max-w-sm">
            {isOwnProfile ? "You haven't published anything yet." : `${profile.username} hasn't published anything yet.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => <BlogCard key={p.id} post={p} />)}
        </div>
      )}
    </div>
  );
}
