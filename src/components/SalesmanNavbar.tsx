// components/SalesmanNavbar.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Package, 
  LogOut, 
  User,
  LayoutDashboard,
  ShoppingBag,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import logo from '@/assets/STH PNG.png';
import SalesmanNotificationBell from './SalesmanNotificationBell';

interface SalesmanNavbarProps {
  userName?: string;
}

const SalesmanNavbar: React.FC<SalesmanNavbarProps> = ({ userName }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/salesman/dashboard', icon: LayoutDashboard },
    { name: 'Orders', path: '/salesman/orders', icon: ShoppingBag },
  ];

  return (
    <nav className="bg-[#0c2d67] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-1.5 rounded-lg shadow-lg shadow-black/20 backdrop-blur-sm">
              <img 
                src={logo} 
                alt="Logo" 
                className="h-8 w-8 object-contain drop-shadow-lg filter brightness-0 invert" 
              />
            </div>
            <span className="text-xl font-bold drop-shadow-lg">Salesman Panel</span>
          </div>

          <SalesmanNotificationBell />
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shadow-lg">
                  <User size={16} className="text-white" />
                </div>
                <span className="text-sm hidden lg:inline">{userName || 'Salesman'}</span>
                <ChevronDown size={16} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-2 border">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{userName || 'Salesman'}</p>
                    <p className="text-xs text-gray-500">Salesman</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors w-full text-left text-red-600"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0c2d67] border-t border-white/10 py-4 px-4">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="border-t border-white/10 my-2"></div>
            <div className="px-4 py-2">
              <p className="text-sm font-medium text-white/80">{userName || 'Salesman'}</p>
              <p className="text-xs text-white/50">Salesman</p>
            </div>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors w-full text-left text-red-300"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default SalesmanNavbar;
