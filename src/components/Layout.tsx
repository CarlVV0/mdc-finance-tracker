
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart2,
  Calendar,
  FileText,
  Home,
  Lock,
  LogOut,
  Settings,
  User
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Add Expense', path: '/expenses/add', icon: Calendar },
    { name: 'Expense Reports', path: '/expenses/reports', icon: BarChart2 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E90FF] via-[#9B51E0] to-[#E23B84]">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">MDC-Cast-Budget Tracker</h1>
            <span className="bg-white/20 text-white text-xs font-bold py-1 px-2 rounded backdrop-blur-lg">
              {isAdmin() ? 'ADMIN' : 'USER'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm hidden sm:inline-block">
              {currentUser?.name || currentUser?.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="bg-white/10 backdrop-blur-lg w-64 shadow-md hidden md:block border-r border-white/20">
          <nav className="p-4 flex flex-col h-full">
            <div className="flex-1">
              {/* Logo Images */}
              <div className="flex justify-center space-x-6 mb-8">
                <img src="/lovable-uploads/e73439e3-24a6-4ca0-97ab-73947d532fc3.png" alt="MDC Logo" className="w-24 h-24 object-contain" />
                <img src="/lovable-uploads/e73439e3-24a6-4ca0-97ab-73947d532fc3.png" alt="Cast Budget Logo" className="w-24 h-24 object-contain" />
              </div>
              
              <div className="mb-6">
                <p className="text-xs font-semibold text-white/70 uppercase mb-2">
                  Main Menu
                </p>
                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-3 py-2 rounded-md text-sm ${
                          location.pathname === item.path
                            ? 'bg-white/20 text-white'
                            : 'text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-white/20 pt-4">
              <div className="flex items-center px-4 py-2">
                <div className="bg-white/20 rounded-full h-8 w-8 flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {currentUser?.name || currentUser?.email || 'User'}
                  </p>
                  <p className="text-xs text-white/70 truncate">
                    {isAdmin() ? 'Administrator' : 'Regular User'}
                  </p>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Mobile Navigation */}
        <div className="md:hidden bg-white/10 backdrop-blur-lg shadow-md fixed bottom-0 left-0 right-0 z-10 border-t border-white/20">
          <div className="flex justify-around">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`p-3 flex flex-col items-center text-xs ${
                  location.pathname === item.path
                    ? 'text-white'
                    : 'text-white/70'
                }`}
              >
                <item.icon className="h-5 w-5 mb-1" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
