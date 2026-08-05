import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RefreshCw,
  Home,
  Search,
  Bell,
  Menu,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Dynamic Greeting Helper
function getGreeting(lang) {
  const hour = new Date().getHours();
  if (hour < 12) {
    return lang === 'zh' ? '早上好' : 'Good Morning';
  }
  if (hour < 17) {
    return lang === 'zh' ? '下午好' : 'Good Afternoon';
  }
  return lang === 'zh' ? '晚上好' : 'Good Evening';
}

export default function AdminHeader({
  title,
  onRefresh,
  loading,
  user,
  onToggleSidebar,
  searchQuery,
  setSearchQuery,
}) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const greeting = getGreeting(lang);
  const adminName = user?.name || 'Technical Admin';

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-card-border/80 px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs sticky top-0 z-30 font-sans">
      {/* Left side greeting & title */}
      <div className="flex items-center space-x-3">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-xl border border-card-border bg-ivory text-heading hover:bg-beige transition-colors cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg sm:text-xl font-bold text-heading font-serif tracking-tight">
              {greeting}, {adminName} 👋
            </h1>
          </div>
          <p className="text-xs text-body font-sans mt-0.5">
            {title ? title : 'Manage your travel website from one place.'}
          </p>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
        {/* Search Bar */}
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery?.(e.target.value)}
            placeholder={lang === 'zh' ? '搜索系统内容...' : 'Search dashboard...'}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-card-border bg-ivory text-xs text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-maroon-700/30 transition-all font-sans"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {/* Notification Button with Badge */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl border border-card-border bg-white text-muted hover:text-maroon-700 hover:border-maroon-700/30 transition-all cursor-pointer relative shadow-xs"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-saffron-500 ring-2 ring-white animate-pulse" />
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-card-border shadow-xl p-4 z-50 text-xs font-sans animate-fade-up-in">
                <div className="flex items-center justify-between border-b border-card-border pb-2 mb-3">
                  <span className="font-bold text-heading">System Notifications</span>
                  <span className="text-[10px] bg-saffron-500/10 text-saffron-600 px-2 py-0.5 rounded-full font-semibold">
                    Live
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-ivory border border-card-border/60">
                    <p className="font-semibold text-heading text-xs">All Systems Operational</p>
                    <p className="text-[11px] text-muted mt-0.5">Tours, Destinations & Inquiries synced cleanly.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Refresh Data Button */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="p-2 rounded-xl border border-card-border bg-white text-muted hover:text-maroon-700 hover:border-maroon-700/30 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-saffron-600' : ''}`} />
            </button>
          )}

          {/* View Public Site Link */}
          <Link
            to="/"
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-card-border bg-beige text-maroon-700 text-xs font-bold hover:bg-card-border transition-all shadow-xs"
          >
            <Home className="h-3.5 w-3.5" />
            <span>{lang === 'zh' ? '前台首页' : 'Main Site'}</span>
          </Link>

          {/* Admin Avatar */}
          <div className="flex items-center space-x-2 pl-2 border-l border-card-border">
            <div className="h-8 w-8 rounded-xl bg-maroon-700 border border-[#9F2845] flex items-center justify-center text-white font-bold font-serif text-xs shadow-xs shrink-0">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-heading leading-tight truncate max-w-28">{adminName}</p>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-saffron-600">
                <ShieldCheck className="h-3 w-3" /> Technical Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
