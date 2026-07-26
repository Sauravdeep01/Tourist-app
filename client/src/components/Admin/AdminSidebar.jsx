import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Compass,
  MapPin,
  MessageSquare,
  Users,
  ShieldAlert,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

// Sidebar component for dashboard navigation
export default function AdminSidebar({
  activeTab,
  setActiveTab,
  user,
  logout,
  collapsed,
  setCollapsed
}) {
  const { t } = useTranslation();

  // Navigation menu items definition
  const menuItems = [
    { id: 'overview', label: t('dashboard.overview'), icon: LayoutDashboard, role: 'all' },
    { id: 'tours', label: t('dashboard.tours'), icon: Compass, role: 'all' },
    { id: 'destinations', label: t('dashboard.destinations'), icon: MapPin, role: 'all' },
    { id: 'inquiries', label: t('dashboard.inquiries'), icon: MessageSquare, role: 'all' },
    { id: 'owners', label: t('dashboard.owners'), icon: Users, role: 'admin' },
    { id: 'auditLogs', label: t('dashboard.auditLogs'), icon: ShieldAlert, role: 'admin' },
    { id: 'settings', label: t('dashboard.settings'), icon: Settings, role: 'admin' },
  ];

  // Filter items according to current user role
  const visibleItems = menuItems.filter(
    (item) => item.role === 'all' || (item.role === 'admin' && user?.role === 'admin')
  );

  return (
    <aside
      className={`bg-maroon-950 text-neutral-200 transition-all duration-300 flex flex-col justify-between border-r border-maroon-900 shadow-xl ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Sidebar Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-maroon-900/60">
          {!collapsed && (
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-lg bg-saffron-500/20 border border-saffron-400/30 flex items-center justify-center text-saffron-400 font-bold text-sm">
                B
              </div>
              <span className="font-semibold text-sm tracking-wide text-white">
                Bodhipath Control
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-maroon-900/50 hover:bg-maroon-800 text-neutral-300 transition-colors mx-auto"
            title="Toggle Sidebar"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* User Info Card */}
        <div className="p-3">
          <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-maroon-900/40 border border-maroon-800/40">
            <div className="h-9 w-9 rounded-full bg-saffron-600/30 border border-saffron-500/40 flex items-center justify-center text-saffron-300 font-semibold shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {user?.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-saffron-400 bg-saffron-950/60 px-1.5 py-0.5 rounded border border-saffron-500/30">
                      <ShieldCheck className="h-3 w-3" /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      <UserCheck className="h-3 w-3" /> Owner
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation list */}
        <nav className="px-3 space-y-1 mt-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-saffron-600 text-white font-semibold shadow-md shadow-saffron-600/20'
                    : 'text-neutral-300 hover:bg-maroon-900/60 hover:text-white'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-saffron-400/80'}`} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="p-3 border-t border-maroon-900/60">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-red-300 hover:bg-red-950/50 hover:text-red-200 transition-colors"
          title={collapsed ? t('navbar.logout') : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0 text-red-400" />
          {!collapsed && <span>{t('navbar.logout')}</span>}
        </button>
      </div>
    </aside>
  );
}
