import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Trash2, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api.get('/admin/users')
      .then(({ data }) => setUsers(data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (userId, username) => {
    if (!window.confirm(`Remove user "${username}"? This will also delete their posts.`)) return;
    setDeleting(userId);
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success(`User "${username}" removed`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to remove user');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="max-w-content mx-auto px-6 py-10">
      <div className="mb-8 flex items-center gap-4">
        <Link to="/admin" className="btn-ghost p-2 rounded-full"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary dark:text-white">User Management</h1>
          <p className="text-sm text-text-secondary dark:text-gray-400">{users.length} registered users</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <LoadingSkeleton type="table-row" count={5} />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border dark:border-border-dark">
                <th className="text-left px-6 py-3 text-text-secondary dark:text-gray-400 font-medium">User</th>
                <th className="text-left px-6 py-3 text-text-secondary dark:text-gray-400 font-medium hidden md:table-cell">Email</th>
                <th className="text-left px-6 py-3 text-text-secondary dark:text-gray-400 font-medium hidden sm:table-cell">Joined</th>
                <th className="text-left px-6 py-3 text-text-secondary dark:text-gray-400 font-medium">Role</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/50 dark:border-border-dark/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link to={`/profile/${u.id}`} className="flex items-center gap-3 group">
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.username} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center">
                          <User size={13} className="text-accent" />
                        </div>
                      )}
                      <span className="font-medium text-text-primary dark:text-white group-hover:text-accent">{u.username}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-text-secondary dark:text-gray-400 hidden md:table-cell">{u.email}</td>
                  <td className="px-6 py-4 text-text-muted dark:text-gray-500 hidden sm:table-cell">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${u.is_admin ? 'badge-accent' : 'bg-gray-100 text-text-secondary dark:bg-gray-700 dark:text-gray-400'}`}>
                      {u.is_admin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!u.is_admin && (
                      <button
                        onClick={() => handleDelete(u.id, u.username)}
                        disabled={deleting === u.id}
                        className="p-2 rounded text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        aria-label={`Delete user ${u.username}`}
                      >
                        {deleting === u.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
