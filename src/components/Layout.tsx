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
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
  onResetData?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange, onResetData, isLoading, error }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', id: 'dashboard', icon: Home },
    { name: 'Members', id: 'members', icon: Users },
    { name: 'Attendance', id: 'attendance', icon: Calendar },
    { name: 'Finances', id: 'finances', icon: DollarSign },
    { name: 'Communications', id: 'communications', icon: MessageSquare },
    { name: 'Visitors', id: 'visitors', icon: UserPlus },
    { name: 'Equipment', id: 'equipment', icon: Package },
  ];

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
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg mb-2 transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <IconComponent className="h-5 w-5 mr-3" />
                {item.name}
              </button>
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
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <span className="text-gray-900 font-medium">Admin</span>
              </div>
              {onResetData && (
                <button
                  onClick={onResetData}
                  className="text-xs text-red-600 hover:text-red-800 px-2 py-1 border border-red-200 rounded hover:bg-red-50"
                  title="Clear all data"
                >
                  Clear Data
                </button>
              )}
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