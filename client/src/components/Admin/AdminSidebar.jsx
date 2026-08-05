import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  User,
  Users,
  Compass,
  MapPin,
  Image as ImageIcon,
  Lock,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  Star,
} from 'lucide-react';

// Sidebar component for Technical Admin Dashboard
export default function AdminSidebar({
  activeTab,
  onSelectTab,
  user,
  logout,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const { t } = useTranslation();

  // Navigation menu items definition
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'profile', label: 'Profile', icon: User, path: '/admin/profile' },
    { id: 'owners', label: 'Owners', icon: Users, path: '/admin/owners' },
    { id: 'tours', label: 'Tours', icon: Compass, path: '/admin/tours' },
    { id: 'destinations', label: 'Destinations', icon: MapPin, path: '/admin/destinations' },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon, path: '/admin/gallery' },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare, path: '/admin/inquiries' },
    { id: 'feedback', label: 'Feedback', icon: Star, path: '/admin/feedback' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const handleNavClick = (itemId) => {
    onSelectTab?.(itemId);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`bg-maroon-950 text-neutral-200 transition-all duration-300 flex flex-col justify-between border-r border-maroon-900/60 shadow-2xl z-50 fixed md:static inset-y-0 left-0 ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top: Logo & Title */}
          <div className="h-20 flex items-center justify-between px-4 border-b border-maroon-900/60 shrink-0">
            {!collapsed && (
              <div className="flex items-center space-x-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-saffron-500/20 border border-saffron-400/40 flex items-center justify-center text-saffron-400 font-bold font-serif text-lg shrink-0 shadow-sm">
                  B
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-sm tracking-wide text-white font-serif truncate">
                    Bodhipath Tour
                  </h2>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-saffron-400 bg-saffron-950/80 px-2 py-0.5 rounded-full border border-saffron-500/30">
                    Admin Panel
                  </span>
                </div>
              </div>
            )}

            {collapsed && (
              <div className="mx-auto h-10 w-10 rounded-xl bg-saffron-500/20 border border-saffron-400/40 flex items-center justify-center text-saffron-400 font-bold font-serif text-lg">
                B
              </div>
            )}

            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-1.5 rounded-lg bg-maroon-900/60 hover:bg-maroon-800 text-neutral-300 transition-colors shrink-0"
              title="Toggle Sidebar"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* User Info Card (Compact) */}
          <div className="p-3 border-b border-maroon-900/40 shrink-0">
            <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-maroon-900/40 border border-maroon-800/40">
              <div className="h-9 w-9 rounded-xl bg-saffron-500/20 border border-saffron-400/30 flex items-center justify-center text-saffron-300 font-bold font-serif text-xs shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{user?.name || 'Technical Admin'}</p>
                  <p className="text-[10px] font-medium text-saffron-400/80 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="h-3 w-3" /> Technical Admin
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Middle Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 group cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'bg-linear-to-r from-saffron-500 to-saffron-600 text-white font-bold shadow-md shadow-saffron-600/30'
                      : 'text-neutral-300 hover:bg-maroon-900/60 hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {/* Active Left Indicator Bar */}
                    {isActive && (
                      <span className="w-1.5 h-5 rounded-r-full bg-white shrink-0 -ml-3 mr-1.5 shadow-sm" />
                    )}

                    <Icon
                      className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                        isActive
                          ? 'text-white scale-110'
                          : 'text-saffron-400/80 group-hover:scale-110 group-hover:text-saffron-300'
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Bottom: Logout button (Red outline) */}
          <div className="p-3 border-t border-maroon-900/60 shrink-0">
            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl border border-red-500/40 text-red-300 hover:bg-red-500/10 hover:border-red-500 hover:text-red-200 transition-all text-xs font-bold cursor-pointer"
              title={collapsed ? t('navbar.logout') : undefined}
            >
              <LogOut className="h-4 w-4 shrink-0 text-red-400" />
              {!collapsed && <span>{t('navbar.logout')}</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
