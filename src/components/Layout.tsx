
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-budget-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">MDC-Cast-Budget Tracker</h1>
            <span className="bg-white text-budget-primary text-xs font-bold py-1 px-2 rounded">
              {isAdmin() ? 'ADMIN' : 'USER'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm hidden sm:inline-block">
              {currentUser?.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-budget-primary/20"
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
        <aside className="bg-white w-64 shadow-md hidden md:block">
          <nav className="p-4 flex flex-col h-full">
            <div className="flex-1">
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                  Main Menu
                </p>
                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-3 py-2 rounded-md text-sm ${
                          location.pathname === item.path
                            ? 'bg-budget-primary text-white'
                            : 'text-gray-700 hover:bg-gray-100'
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

            <div className="border-t pt-4">
              <div className="flex items-center px-4 py-2">
                <div className="bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentUser?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {isAdmin() ? 'Administrator' : 'Regular User'}
                  </p>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Mobile Navigation */}
        <div className="md:hidden bg-white shadow-md fixed bottom-0 left-0 right-0 z-10">
          <div className="flex justify-around">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`p-3 flex flex-col items-center text-xs ${
                  location.pathname === item.path
                    ? 'text-budget-primary'
                    : 'text-gray-500'
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
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
