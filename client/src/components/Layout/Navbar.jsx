import React, { useState, useContext, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import { Menu, X, Globe, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Track scroll position so the bar can pick up a very subtle dark tint
  // for readability, while staying full-width with no blur/glass/shadow.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('lng', nextLang);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navItems = [
    { name: t('navbar.home'), path: '/' },
    { name: t('navbar.tours'), path: '/tours' },
    { name: t('navbar.destinations'), path: '/destinations' },
    { name: t('navbar.gallery'), path: '/gallery' },
    { name: t('navbar.about'), path: '/about' },
    { name: t('navbar.contact'), path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 w-full transition-colors duration-350 ease-in-out ${
        scrolled ? 'bg-[rgba(10,15,25,0.75)]' : 'bg-transparent'
      }`}
    >
      <div className="relative mx-auto max-w-8xl px-4 sm:px-6 lg:px-20">
        <div className="flex h-17 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group shrink-0">
            {/* Dharma Wheel SVG logo */}
            <svg
              className="h-8 w-8 text-saffron-500 transition-transform duration-700 ease-out group-hover:rotate-180"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" />
              <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="6" />
              <circle cx="50" cy="50" r="4" fill="currentColor" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <line
                  key={deg}
                  x1="50"
                  y1="50"
                  x2={50 + 30 * Math.sin((deg * Math.PI) / 180)}
                  y2={50 - 30 * Math.cos((deg * Math.PI) / 180)}
                  stroke="currentColor"
                  strokeWidth="6"
                />
              ))}
            </svg>
            <span className="font-semibold text-lg sm:text-xl tracking-wide text-white">
              Bodhipath Tour & Travels
            </span>
          </Link>

          {/* Desktop Nav Links — true-centered regardless of logo/button width */}
          <nav className="hidden md:flex items-center gap-9 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative pb-1 text-[15px] font-medium tracking-wide transition-colors duration-300 ${
                    isActive
                      ? 'text-saffron-400 after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-saffron-400'
                      : 'text-white hover:text-saffron-400'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Controls (Language & Auth) */}
          <div className="hidden md:flex items-center space-x-3 shrink-0">
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer border border-white/30 bg-transparent hover:border-saffron-400 text-white hover:text-saffron-300"
            >
              <Globe className="h-4 w-4" />
              <span>{i18n.language === 'zh' ? 'EN' : '中文'}</span>
            </button>

            {/* User Auth Info */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={
                    user.role === 'user'
                      ? '/account'
                      : user.role === 'owner'
                      ? '/owner/dashboard'
                      : '/admin/dashboard'
                  }
                  className="flex items-center space-x-1.5 rounded-full border border-white/40 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:border-saffron-400 hover:text-saffron-300"
                >
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center rounded-full border border-white/30 p-2 text-white/80 transition-all duration-300 hover:border-red-400 hover:text-red-400 cursor-pointer"
                  title={t('navbar.logout')}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-white hover:text-saffron-400 transition-colors duration-300"
                >
                  {t('navbar.login')}
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold text-white rounded-full border border-white/40 px-4 py-2 transition-all duration-300 hover:border-saffron-400 hover:text-saffron-300"
                >
                  {t('navbar.signup')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer border border-white/30 bg-transparent text-white"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{i18n.language === 'zh' ? 'EN' : '中文'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full focus:outline-none cursor-pointer text-white border border-white/30"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu — solid for legibility since it overlays page content */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0b0f17] text-white animate-in slide-in-from-top duration-200">
          <div className="space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2 px-3 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'text-saffron-400'
                      : 'text-slate-200 hover:text-saffron-400'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            <div className="h-px my-2 bg-white/10" />

            {user ? (
              <div className="space-y-1 py-1">
                <div className="px-3 py-1.5 flex items-center space-x-2 text-sm text-slate-400">
                  <User className="h-4 w-4" />
                  <span>
                    {user.name} ({user.role})
                  </span>
                </div>
                <Link
                  to={
                    user.role === 'user'
                      ? '/account'
                      : user.role === 'owner'
                      ? '/owner/dashboard'
                      : '/admin/dashboard'
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
                >
                  {t('navbar.myAccount')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center space-x-2 py-2 px-3 rounded-lg text-base font-medium text-red-400 hover:bg-red-950/40 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('navbar.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2 pb-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center items-center py-2 rounded-lg text-base font-medium border border-slate-700 text-white hover:bg-slate-800"
                >
                  {t('navbar.login')}
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center items-center py-2 rounded-lg text-base font-bold bg-saffron-500 text-neutral-950 hover:bg-saffron-600 shadow-xs"
                >
                  {t('navbar.signup')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
