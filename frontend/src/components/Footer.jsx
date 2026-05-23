import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-bg dark:bg-bg-dark dark:border-border-dark mt-auto">
      <div className="max-w-content mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 font-serif font-bold text-lg text-text-primary dark:text-white">
            <BookOpen size={20} className="text-accent" />
            <span>Blogify</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-text-secondary dark:text-gray-400">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <Link to="/login" className="hover:text-accent transition-colors">Sign in</Link>
            <Link to="/register" className="hover:text-accent transition-colors">Register</Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-text-muted dark:text-gray-500">
            &copy; {new Date().getFullYear()} Blogify. Built with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
