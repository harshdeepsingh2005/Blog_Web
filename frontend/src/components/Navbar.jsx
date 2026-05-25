import { AnimatePresence, motion } from 'framer-motion';
import { Bell, BookOpen, LogOut, Menu, Moon, PenLine, Sun, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../hooks/useDarkMode';
import NotificationsDropdown from './NotificationsDropdown';

export default function Navbar() {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const { isDark, toggle } = useDarkMode();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-bold uppercase tracking-widest transition-colors duration-150 ${
      isActive ? 'text-accent border-b-2 border-accent' : 'text-text-primary hover:text-accent dark:text-white dark:hover:text-accent'
    }`;

  return (
    <nav className="navbar">
      <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 font-sans font-black tracking-tighter text-2xl text-text-primary dark:text-white uppercase">
          <div className="bg-text-primary dark:bg-white text-white dark:text-black p-1">
            <BookOpen size={24} />
          </div>
          <span>BLOGIFY</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={navLinkClass} end>Home</NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
          )}
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggle}
            className="btn-ghost p-2 rounded-full"
            aria-label="Toggle dark mode"
            id="dark-mode-toggle"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/create-post" className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4">
                <PenLine size={15} />
                WRITE
              </Link>
              <NotificationsDropdown />
              <Link
                to={`/profile/${user?.id}`}
                className="flex items-center gap-2 btn-ghost px-3 py-2 text-sm border-l-2 border-r-2"
                id="profile-link"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-none object-cover border-2 border-black dark:border-white" />
                ) : (
                  <div className="w-8 h-8 rounded-none bg-text-primary dark:bg-white flex items-center justify-center border-2 border-black dark:border-white">
                    <User size={16} className="text-white dark:text-black" />
                  </div>
                )}
                <span className="font-bold uppercase tracking-wider">{user?.username}</span>
              </Link>
              <button onClick={handleLogout} className="btn-ghost p-2" aria-label="Logout" id="logout-btn">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-xs">SIGN IN</Link>
              <Link to="/register" className="btn-primary text-xs py-2 px-4">GET STARTED</Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden btn-ghost p-2 rounded-full"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-bg dark:bg-bg-dark dark:border-border-dark"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              <NavLink to="/" className={navLinkClass} end onClick={() => setMobileOpen(false)}>Home</NavLink>
              {isAuthenticated && (
                <>
                  <NavLink to="/create-post" className={navLinkClass} onClick={() => setMobileOpen(false)}>Write</NavLink>
                  <NavLink to={`/profile/${user?.id}`} className={navLinkClass} onClick={() => setMobileOpen(false)}>Profile</NavLink>
                  {isAdmin && <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileOpen(false)}>Admin</NavLink>}
                  <button onClick={handleLogout} className="text-left text-sm text-red-500 font-medium">Logout</button>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <NavLink to="/login" className={navLinkClass} onClick={() => setMobileOpen(false)}>Sign in</NavLink>
                  <NavLink to="/register" className="btn-primary text-sm text-center" onClick={() => setMobileOpen(false)}>Get started</NavLink>
                </>
              )}
              <button onClick={toggle} className="flex items-center gap-2 text-sm text-text-secondary">
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                {isDark ? 'Light mode' : 'Dark mode'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
