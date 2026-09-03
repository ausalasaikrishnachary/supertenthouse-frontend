
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.jpeg';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/oursolution', label: 'Solutions' },
  { path: '/projectpage', label: 'Projects' },
  { path: '/whyus', label: 'Why Us' },
  { path: '/blogcomingsoon', label: 'Blog' },
  { path: '/careerscomingsoon', label: 'Careers' },
  { path: '/contact', label: 'Contact Us' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const location = useLocation();

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  // Auto close menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl bg-white/70 dark:bg-black/50 shadow-lg border-b border-white/20'
          : 'bg-transparent'
      }`}
    >
      {/* Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500" />

      <div className="container mx-auto flex items-center justify-between h-20 px-4 lg:px-8">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="MV Branding"
            className="h-20 w-auto object-contain drop-shadow-[0_5px_10px_rgba(0,0,0,0.2)]"
          />
        </Link>

        {/* DESKTOP NAV (ONLY DESKTOP) */}
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map(item => {
            const isActive =
              item.path === '/projectpage'
                ? location.pathname.startsWith('/projectpage') ||
                  location.pathname.startsWith('/viewdetailspage')
                : location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 -z-10 blur-sm opacity-80" />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          
          {/* DARK MODE */}
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* CTA BUTTON */}
          <Link to="/contact">
            <Button className="hidden sm:inline-flex bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 text-white border-0 shadow-lg hover:scale-105 transition">
              Get Consultation
            </Button>
          </Link>

          {/* MENU BUTTON (Mobile + iPad ONLY) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* MOBILE + iPAD DRAWER */}
      <div
        className={`lg:hidden fixed top-20 right-0 h-[85vh] w-[70%] sm:w-1/2 transition-all duration-300 z-50 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        } bg-white/95 dark:bg-black/90 backdrop-blur-xl shadow-2xl border-l border-gray-200 overflow-y-auto`}
      >
        <nav className="flex flex-col p-4 gap-2">
          {navItems.map(item => {
            const isActive =
              item.path === '/projectpage'
                ? location.pathname.startsWith('/projectpage') ||
                  location.pathname.startsWith('/viewdetailspage')
                : location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-lg font-medium transition ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}