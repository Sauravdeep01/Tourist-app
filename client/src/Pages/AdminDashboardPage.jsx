import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminHeader from '../components/Admin/AdminHeader';
import OverviewTab from '../components/Admin/OverviewTab';
import ToursTab from '../components/Admin/ToursTab';
import DestinationsTab from '../components/Admin/DestinationsTab';
import InquiriesTab from '../components/Admin/InquiriesTab';
import OwnersTab from '../components/Admin/OwnersTab';
import SettingsTab from '../components/Admin/SettingsTab';
import GalleryTab from '../components/Admin/GalleryTab';
import FeedbackTab from '../components/Admin/FeedbackTab';
import ProfilePage from './ProfilePage';
import api from '../utils/api';

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const { user, logout, loading: authLoading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Derive active tab from URL path (e.g. /admin/tours -> 'tours')
  const getTabFromPath = (pathname) => {
    const path = pathname.replace(/^\/admin\/?/, '').trim();
    if (!path || path === 'dashboard' || path === 'overview') return 'overview';
    if (path === 'profile') return 'profile';
    if (path === 'owners') return 'owners';
    if (path === 'tours') return 'tours';
    if (path === 'destinations') return 'destinations';
    if (path === 'gallery') return 'gallery';
    if (path === 'settings') return 'settings';
    if (path === 'inquiries') return 'inquiries';
    if (path === 'feedback') return 'feedback';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Keep active tab synced with browser URL
  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setMobileOpen(false);
    const targetPath = tabId === 'overview' ? '/admin/dashboard' : `/admin/${tabId}`;
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  };

  // Platform dataset state
  const [stats, setStats] = useState(null);
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [owners, setOwners] = useState([]);

  // Fetch dashboard dataset
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const analyticsRes = await api.get('/api/analytics').catch(() => null);
      if (analyticsRes?.data) setStats(analyticsRes.data);

      const toursRes = await api.get('/api/tours/manage').catch(() => null);
      if (toursRes?.data?.tours) setTours(toursRes.data.tours);
      else if (Array.isArray(toursRes?.data)) setTours(toursRes.data);

      const destsRes = await api.get('/api/destinations').catch(() => null);
      if (destsRes?.data) setDestinations(destsRes.data);

      const inqRes = await api.get('/api/inquiries').catch(() => null);
      if (inqRes?.data?.inquiries) setInquiries(inqRes.data.inquiries);
      else if (Array.isArray(inqRes?.data)) setInquiries(inqRes.data);

      if (user?.role === 'admin') {
        const ownersRes = await api.get('/api/owners').catch(() => null);
        if (ownersRes?.data) setOwners(ownersRes.data);
      }
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'owner')) {
      fetchDashboardData();
    }
  }, [user]);

  // Guard redirects
  if (authLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center text-heading font-sans text-xs">
        Loading admin session...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role === 'owner') {
    return <Navigate to="/owner/dashboard" replace />;
  }
  if (user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // Helper title
  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Manage your travel website from one place.';
      case 'profile':
        return 'Admin Account & Profile Settings';
      case 'tours':
        return t('dashboard.tours');
      case 'destinations':
        return t('dashboard.destinations');
      case 'gallery':
        return 'Website Gallery Management';
      case 'inquiries':
        return t('dashboard.inquiries');
      case 'feedback':
        return t('dashboard.feedback');
      case 'owners':
        return t('dashboard.owners');
      case 'settings':
        return t('dashboard.settings');
      default:
        return 'Technical Admin Panel';
    }
  };

  return (
    <div className="h-screen flex bg-[#EFE8D9] font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        user={user}
        logout={logout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header Bar */}
        <AdminHeader
          title={getTabTitle()}
          onRefresh={fetchDashboardData}
          loading={loading}
          user={user}
          onToggleSidebar={() => setMobileOpen(!mobileOpen)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8" data-lenis-prevent>
          {activeTab === 'overview' && (
            <OverviewTab
              stats={stats}
              inquiries={inquiries}
              tours={tours}
              destinations={destinations}
              owners={owners}
              onSelectTab={handleSelectTab}
            />
          )}

          {activeTab === 'profile' && <ProfilePage />}

          {activeTab === 'tours' && (
            <ToursTab
              tours={tours}
              reloadData={fetchDashboardData}
              user={user}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'destinations' && (
            <DestinationsTab
              destinations={destinations}
              reloadData={fetchDashboardData}
              user={user}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'gallery' && <GalleryTab user={user} />}

          {activeTab === 'inquiries' && (
            <InquiriesTab
              inquiries={inquiries}
              reloadData={fetchDashboardData}
              owners={owners}
              user={user}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'feedback' && <FeedbackTab />}

          {activeTab === 'owners' && user.role === 'admin' && (
            <OwnersTab owners={owners} reloadData={fetchDashboardData} />
          )}

          {activeTab === 'settings' && user.role === 'admin' && (
            <SettingsTab />
          )}
        </main>
      </div>
    </div>
  );
}

