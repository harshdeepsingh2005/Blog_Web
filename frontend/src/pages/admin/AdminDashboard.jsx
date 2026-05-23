import { motion } from 'framer-motion';
import { FileText, Loader2, MessageCircle, Shield, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

function StatCard({ icon: Icon, value, label, color }) {
  return (
    <div className="card p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-card flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-3xl font-bold text-text-primary dark:text-white">{value ?? '—'}</p>
        <p className="text-sm text-text-secondary dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data.data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-content mx-auto px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-3">
        <Shield size={24} className="text-accent" />
        <div>
          <h1 className="text-2xl font-bold text-text-primary dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-text-secondary dark:text-gray-400">Platform overview and moderation</p>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-accent" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard icon={Users} value={stats?.total_users} label="Total Users" color="bg-accent" />
            <StatCard icon={FileText} value={stats?.total_posts} label="Total Posts" color="bg-emerald-500" />
            <StatCard icon={MessageCircle} value={stats?.total_comments} label="Total Comments" color="bg-purple-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/admin/users" className="card p-6 flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-card bg-accent-light flex items-center justify-center">
                <Users size={20} className="text-accent" />
              </div>
              <div>
                <h2 className="font-semibold text-text-primary dark:text-white group-hover:text-accent transition-colors">User Management</h2>
                <p className="text-sm text-text-secondary dark:text-gray-400">View and remove users</p>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
