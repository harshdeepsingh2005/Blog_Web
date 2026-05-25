import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await api.get('/notifications/unread-count');
      setUnreadCount(data.data.count);
    } catch (err) {}
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data);
    } catch (err) {}
  };

  const toggleDropdown = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (nextOpen) {
      fetchNotifications();
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(nots => nots.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {}
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(nots => nots.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {}
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="btn-ghost p-2 relative" 
        aria-label="Notifications"
      >
        <Bell size={20} className="text-text-primary dark:text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-accent border-2 border-bg dark:border-bg-dark"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-surface dark:bg-surface-dark rounded-none border-4 border-text-primary dark:border-white z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b-4 border-text-primary dark:border-white bg-muted dark:bg-[#111]">
            <h3 className="font-bold text-sm uppercase tracking-widest text-text-primary dark:text-white">NOTIFICATIONS</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-accent hover:text-accent-hover transition-colors font-medium flex items-center gap-1"
              >
                <Check size={12} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[320px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center font-bold text-xs uppercase tracking-widest text-text-secondary dark:text-gray-400">
                NO NOTIFICATIONS
              </div>
            ) : (
              <div className="divide-y-2 divide-text-primary dark:divide-white">
                {notifications.map(n => (
                  <div 
                    key={n.id} 
                    className={`p-4 flex gap-3 hover:bg-text-primary group hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer ${!n.is_read ? 'bg-accent text-white dark:bg-accent dark:text-white' : ''}`}
                    onClick={() => !n.is_read && markAsRead(n.id)}
                  >
                    {n.actor?.avatar ? (
                      <img src={n.actor.avatar} alt="Avatar" className="w-10 h-10 rounded-none border-2 border-text-primary dark:border-white object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-none bg-text-primary dark:bg-white flex items-center justify-center flex-shrink-0 border-2 border-text-primary dark:border-white">
                        <Bell size={16} className="text-white dark:text-black" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold leading-snug ${!n.is_read ? 'text-white' : 'text-text-primary dark:text-white group-hover:text-white dark:group-hover:text-black'}`}>
                        {n.message}
                      </p>
                      <p className={`text-xs uppercase tracking-widest mt-1 font-bold ${!n.is_read ? 'text-white/80' : 'text-text-muted group-hover:text-white/80 dark:group-hover:text-black/80'}`}>
                        {new Date(n.created_at).toLocaleDateString()}
                      </p>
                      {n.post_id && (
                        <Link 
                          to={`/posts/${n.post_id}`} 
                          className={`text-xs font-black uppercase tracking-widest mt-2 inline-block border-b-2 ${!n.is_read ? 'text-white border-white' : 'text-accent border-accent group-hover:text-white group-hover:border-white dark:group-hover:text-black dark:group-hover:border-black'}`}
                          onClick={() => setIsOpen(false)}
                        >
                          VIEW POST
                        </Link>
                      )}
                    </div>
                    {!n.is_read && (
                      <div className="w-3 h-3 bg-white flex-shrink-0 mt-1" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
