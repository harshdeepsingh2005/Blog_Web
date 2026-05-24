import { motion } from 'framer-motion';
import { BookOpen, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'EMAIL IS REQUIRED';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'EMAIL IS INVALID';
    
    if (!form.password) newErrors.password = 'PASSWORD IS REQUIRED';
    
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
    
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success('WELCOME BACK');
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg dark:bg-bg-dark flex items-center justify-center p-4 swiss-noise">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg border-4 border-text-primary dark:border-white bg-surface dark:bg-surface-dark shadow-[16px_16px_0px_0px_var(--tw-shadow-color)] shadow-accent"
      >
        <div className="border-b-4 border-text-primary dark:border-white p-8 bg-muted dark:bg-[#111] flex flex-col items-center">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 bg-text-primary text-white dark:bg-white dark:text-black mb-6">
            <BookOpen size={32} />
          </Link>
          <h1 className="text-4xl font-black text-text-primary dark:text-white uppercase tracking-tighter">AUTHENTICATE</h1>
          <p className="text-text-secondary dark:text-gray-400 mt-2 font-bold uppercase tracking-widest text-sm">SYSTEM ACCESS REQUIRED</p>
        </div>

        <div className="p-8 md:p-12">
          {error && (
            <div className="mb-8 p-4 bg-accent text-white font-bold uppercase tracking-widest text-sm border-4 border-text-primary dark:border-white text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8" id="login-form">
            <div>
              <label htmlFor="email" className="block text-sm font-bold uppercase tracking-widest text-text-primary dark:text-white mb-2">01. EMAIL</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="USER@DOMAIN.COM"
                className={`input text-lg font-bold uppercase ${errors.email ? 'border-accent text-accent' : ''}`}
              />
              {errors.email && <p className="mt-2 text-xs font-bold uppercase tracking-widest text-accent">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold uppercase tracking-widest text-text-primary dark:text-white mb-2">02. PASSWORD</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`input text-lg font-bold ${errors.password ? 'border-accent text-accent' : ''}`}
              />
              {errors.password && <p className="mt-2 text-xs font-bold uppercase tracking-widest text-accent">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4"
              id="login-submit"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : null}
              GRANT ACCESS
            </button>
          </form>

          <p className="text-center text-sm font-bold uppercase tracking-widest text-text-secondary dark:text-gray-400 mt-8">
            NO ACCOUNT?{' '}
            <Link to="/register" className="text-text-primary dark:text-white hover:text-accent transition-colors border-b-2 border-current">CREATE ONE</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
