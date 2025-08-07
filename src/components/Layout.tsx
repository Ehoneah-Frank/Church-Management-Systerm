import React from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  UserPlus, 
  Package,
  Home,
  Menu,
  X,
  LogOut,
  Shield,
  Settings
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
}

const Layout: React.FC<LayoutProps> = ({ children, isLoading, error }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, roles, signOut, isSuperAdmin, isAdmin } = useAuth();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Members', path: '/members', icon: Users },
    { name: 'Attendance', path: '/attendance', icon: Calendar },
    { name: 'Finances', path: '/finances', icon: DollarSign },
    { name: 'Communications', path: '/communications', icon: MessageSquare },
    { name: 'Visitors', path: '/visitors', icon: UserPlus },
    { name: 'Equipment', path: '/equipment', icon: Package },
  ];

  // Add User Management for Super Admin only
  if (isSuperAdmin) {
    navigation.push({ name: 'User Management', path: '/users', icon: Shield });
  }

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      console.log('Layout: Starting sign out process...');
      
      // Call the signOut function from AuthContext
      await signOut();
      
      // Additional cleanup
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear any cached data
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Force a complete page reload to ensure clean state
      window.location.replace('/');
      
      console.log('Layout: Sign out completed successfully');
    } catch (error) {
      console.error('Layout: Error during sign out:', error);
      // Even if there's an error, clear everything and redirect
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getRoleDisplayName = () => {
    if (isSuperAdmin) return 'Super Admin';
    if (isAdmin) return 'Admin';
    return 'User';
  };

  const getRoleColor = () => {
    if (isSuperAdmin) return 'bg-red-600';
    if (isAdmin) return 'bg-blue-600';
    return 'bg-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-900 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 bg-blue-800">
          <div>
            <h1 className="text-white text-lg font-bold">Sacred Action Church</h1>
            <p className="text-blue-200 text-xs">Buah Aya Praise Temple</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white md:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <IconComponent className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="flex items-center space-x-2 text-sm text-blue-500">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </div>
              ) : error ? (
                <div className="flex items-center space-x-2 text-sm text-red-500">
                  <span>⚠️ {error}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-sm text-green-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Connected to database</span>
                </div>
              )}
            </div>

            {/* User info and signout button - positioned on the far right */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 ${getRoleColor()} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="hidden md:block">
                  <span className="text-gray-900 font-medium text-sm block">
                    {user?.email || 'Admin'}
                  </span>
                  <span className="text-gray-500 text-xs block">
                    {getRoleDisplayName()}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleSignOut}
                disabled={isLoggingOut}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isLoggingOut 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
                title="Sign out"
              >
                {isLoggingOut ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                <span className="text-sm font-medium hidden md:block">
                  {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;