import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import BlogDetail from './pages/BlogDetail';
import CreatePost from './pages/CreatePost';
import Dashboard from './pages/Dashboard';
import EditPost from './pages/EditPost';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Bookmarks from './pages/Bookmarks';
import { AdminRoute, ProtectedRoute } from './routes/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-bg dark:bg-bg-dark">
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/posts/:id" element={<BlogDetail />} />
              <Route path="/profile/:id" element={<Profile />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/edit-post/:id" element={<EditPost />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
              </Route>

              {/* Admin routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center min-h-96 text-center px-6">
                  <p className="text-6xl mb-4">🔍</p>
                  <h1 className="text-2xl font-bold text-text-primary dark:text-white mb-2">Page not found</h1>
                  <p className="text-text-secondary dark:text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn-primary">Go home</a>
                </div>
              } />
            </Routes>
          </main>

          <Footer />
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#fff',
              color: '#1E293B',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(15,23,42,0.10)',
              fontSize: '14px',
              fontFamily: 'Inter, system-ui, sans-serif',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
