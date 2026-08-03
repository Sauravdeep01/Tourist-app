import React, { useState, useContext, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import { Menu, X, Globe, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();


  const scrolled = scrollY > 50;

  const isHeroPage = location.pathname === '/' || location.pathname.startsWith('/destinations/');
  const overHero = isHeroPage && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

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
      className={`fixed top-0 inset-x-0 z-50 w-full transition-all duration-300 ease-in-out ${
        scrolled
          ? 'bg-ivory/65 backdrop-blur-[14px] border-b border-card-border shadow-[0_4px_24px_rgba(31,31,31,0.06)]'
          : 'bg-transparent border-b border-transparent shadow-none'
      }`}
    >
      <div className="relative mx-auto max-w-8xl px-4 sm:px-6 lg:px-20">
        <div className="flex h-17 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
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
            <span
              className={`font-serif font-bold text-lg sm:text-xl tracking-wide transition-colors duration-500 ${
                overHero ? 'text-white drop-shadow-md' : 'text-heading'
              }`}
            >
              Bodhipath Tour & Travels
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-9 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative pb-1 text-[15px] font-semibold tracking-wide transition-colors duration-300 ${
                    isActive
                      ? overHero
                        ? 'text-white after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:bg-white after:rounded-full'
                        : 'text-maroon-700 after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:bg-maroon-700 after:rounded-full'
                      : overHero
                      ? 'text-white/90 hover:text-white'
                      : 'text-heading hover:text-maroon-700'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Controls (Language & Auth) */}
          <div className="hidden md:flex items-center space-x-3 shrink-0 font-sans">
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer border border-card-border bg-white hover:border-maroon-700 text-heading shadow-xs"
            >
              <Globe className="h-3.5 w-3.5 text-saffron-500" />
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
                  className="flex items-center space-x-1.5 rounded-full border border-card-border bg-white px-4 py-1.5 text-xs font-semibold text-heading transition-all duration-300 hover:border-maroon-700 hover:text-maroon-700 shadow-xs"
                >
                  <User className="h-3.5 w-3.5 text-saffron-500" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center rounded-full border border-card-border bg-white p-2 text-body transition-all duration-300 hover:border-red-400 hover:text-red-600 cursor-pointer shadow-xs"
                  title={t('navbar.logout')}
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`text-xs font-semibold transition-colors duration-300 px-2 ${
                    overHero ? 'text-white/90 hover:text-white' : 'text-body hover:text-maroon-700'
                  }`}
                >
                  {t('navbar.login')}
                </Link>
                <Link
                  to="/signup"
                  className="text-xs font-semibold text-white rounded-full bg-maroon-700 hover:bg-maroon-800 border border-[#9F2845] px-4 py-2 transition-all duration-300 shadow-md hover:shadow-maroon-700/20"
                >
                  {t('navbar.signup')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2 font-sans">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer border border-card-border bg-white text-heading"
            >
              <Globe className="h-3.5 w-3.5 text-saffron-500" />
              <span>{i18n.language === 'zh' ? 'EN' : '中文'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full focus:outline-none cursor-pointer text-heading border border-card-border bg-white"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ivory text-heading border-b border-card-border animate-in slide-in-from-top duration-200 shadow-xl font-sans">
          <div className="space-y-1 px-4 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2.5 px-3 rounded-xl text-base font-semibold transition-colors ${
                    isActive
                      ? 'text-maroon-700 bg-beige'
                      : 'text-body hover:text-maroon-700'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            <div className="h-px my-3 bg-card-border" />

            {user ? (
              <div className="space-y-1 py-1">
                <div className="px-3 py-1.5 flex items-center space-x-2 text-sm text-body">
                  <User className="h-4 w-4 text-saffron-500" />
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
                  className="block py-2.5 px-3 rounded-xl text-base font-medium text-heading hover:bg-beige"
                >
                  {t('navbar.myAccount')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center space-x-2 py-2.5 px-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 cursor-pointer"
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
                  className="flex justify-center items-center py-2.5 rounded-xl text-sm font-semibold border border-card-border bg-white text-heading hover:bg-beige"
                >
                  {t('navbar.login')}
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center items-center py-2.5 rounded-xl text-sm font-bold bg-maroon-700 text-white hover:bg-maroon-800 shadow-md"
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
