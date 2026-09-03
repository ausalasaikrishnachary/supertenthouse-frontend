import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.jpeg';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/admin/productstable', label: 'Products' },
  { path: '/admin/packages', label: 'Packages' }, // Added Packages
];

export default function AdminNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 🔐 Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl shadow-lg border-b border-white/30'
          : 'shadow-md'
      }`}
      style={{
        background: scrolled
          ? 'linear-gradient(to right, #FECDD3, #FEF08A, #BFDBFE)'
          : 'linear-gradient(to right, #FFF1F2, #FEFCE8, #EFF6FF)',
      }}
    >
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500" />

      <div className="container mx-auto flex items-center justify-between h-20 px-4 lg:px-8">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="MV Branding"
            className="h-16 w-auto object-contain drop-shadow-md"
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-3">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                location.pathname === item.path
                  ? 'text-white'
                  : 'text-gray-800 hover:text-black'
              }`}
            >
              {location.pathname === item.path && (
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 -z-10 blur-sm opacity-80" />
              )}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* DESKTOP LOGOUT */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? 'max-h-96 backdrop-blur-xl' : 'max-h-0'
        }`}
        style={{
          background: 'linear-gradient(to right, #FFF1F2, #FEFCE8, #EFF6FF)',
        }}
      >
        <nav className="flex flex-col p-4 gap-2">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-3 rounded-lg font-medium transition ${
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 text-white'
                  : 'text-gray-800 hover:bg-black/10'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* MOBILE LOGOUT */}
          <Button
            onClick={handleLogout}
            className="mt-2 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
}