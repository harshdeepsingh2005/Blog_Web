import { motion } from 'framer-motion';
import { BookOpen, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.username) newErrors.username = 'Username is required';
    else if (form.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
    
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (form.password !== form.confirm) newErrors.confirm = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((errs) => ({ ...errs, [e.target.name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validate()) return;
    
    const result = await register(form.username, form.email, form.password);
    if (result.success) {
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } else {
      setError(Array.isArray(result.error) ? result.error.map(e => e.msg).join(', ') : result.error);
    }
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-serif font-bold text-2xl text-text-primary dark:text-white">
            <BookOpen size={26} className="text-accent" />
            Blogify
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-text-primary dark:text-white">Create your account</h1>
          <p className="text-text-secondary dark:text-gray-400 mt-1 text-sm">Join the community of creators</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-btn text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" id="register-form">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text-primary dark:text-white mb-1.5">Username</label>
              <input id="username" name="username" type="text" maxLength={50}
                value={form.username} onChange={handleChange} placeholder="yourname" className={`input ${errors.username ? 'border-red-500 focus:ring-red-500' : ''}`} />
              {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary dark:text-white mb-1.5">Email</label>
              <input id="email" name="email" type="email"
                value={form.email} onChange={handleChange} placeholder="you@example.com" className={`input ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary dark:text-white mb-1.5">Password</label>
              <input id="password" name="password" type="password"
                value={form.password} onChange={handleChange} placeholder="Min 6 characters" className={`input ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`} />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-text-primary dark:text-white mb-1.5">Confirm password</label>
              <input id="confirm" name="confirm" type="password"
                value={form.confirm} onChange={handleChange} placeholder="Repeat your password" className={`input ${errors.confirm ? 'border-red-500 focus:ring-red-500' : ''}`} />
              {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3" id="register-submit">
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              Create account
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
