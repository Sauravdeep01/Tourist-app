import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminHeader from '../components/Admin/AdminHeader';
import OverviewTab from '../components/Admin/OverviewTab';
import ToursTab from '../components/Admin/ToursTab';
import DestinationsTab from '../components/Admin/DestinationsTab';
import InquiriesTab from '../components/Admin/InquiriesTab';
import OwnersTab from '../components/Admin/OwnersTab';
import AuditLogsTab from '../components/Admin/AuditLogsTab';
import SettingsTab from '../components/Admin/SettingsTab';
import GalleryTab from '../components/Admin/GalleryTab';
import FeedbackTab from '../components/Admin/FeedbackTab';
import api from '../utils/api';

// Admin & Owner Control Panel page
export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const { user, logout, loading: authLoading } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Platform data state
  const [stats, setStats] = useState(null);
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [owners, setOwners] = useState([]);

  // Fetch initial dashboard dataset
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch analytics summary
      const analyticsRes = await api.get('/api/analytics').catch(() => null);
      if (analyticsRes?.data) setStats(analyticsRes.data);

      // Fetch manage tours list
      const toursRes = await api.get('/api/tours/manage').catch(() => null);
      if (toursRes?.data?.tours) setTours(toursRes.data.tours);
      else if (Array.isArray(toursRes?.data)) setTours(toursRes.data);

      // Fetch destinations
      const destsRes = await api.get('/api/destinations').catch(() => null);
      if (destsRes?.data) setDestinations(destsRes.data);

      // Fetch inquiries
      const inqRes = await api.get('/api/inquiries').catch(() => null);
      if (inqRes?.data?.inquiries) setInquiries(inqRes.data.inquiries);
      else if (Array.isArray(inqRes?.data)) setInquiries(inqRes.data);

      // Fetch owners if admin
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

  // Auth Protection Guard: redirect unauthenticated users or non-admins
  if (authLoading) {
    return <div className="min-h-screen bg-[#EFE8D9] flex items-center justify-center text-[#1E1E1E] font-sans text-xs">Loading session...</div>;
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

  // Active tab title helper
  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview':
        return t('dashboard.overview');
      case 'tours':
        return t('dashboard.tours');
      case 'destinations':
        return t('dashboard.destinations');
      case 'inquiries':
        return t('dashboard.inquiries');
      case 'feedback':
        return t('dashboard.feedback');
      case 'owners':
        return t('dashboard.owners');
      case 'auditLogs':
        return t('dashboard.auditLogs');
      case 'settings':
        return t('dashboard.settings');
      default:
        return t('dashboard.title');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#EFE8D9] font-sans">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        logout={logout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <AdminHeader
          title={getTabTitle()}
          onRefresh={fetchDashboardData}
          loading={loading}
        />

        {/* Tab Content Viewport */}
        {/* data-lenis-prevent: this panel scrolls independently of the
            window (the shell around it is overflow-hidden), so the global
            Lenis instance must not hijack wheel events here. */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8" data-lenis-prevent>
          {activeTab === 'overview' && (
            <OverviewTab
              stats={stats}
              inquiries={inquiries}
              tours={tours}
              destinations={destinations}
              owners={owners}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'tours' && (
            <ToursTab
              tours={tours}
              reloadData={fetchDashboardData}
              user={user}
            />
          )}

          {activeTab === 'destinations' && (
            <DestinationsTab
              destinations={destinations}
              reloadData={fetchDashboardData}
              user={user}
            />
          )}

          {activeTab === 'gallery' && (
            <GalleryTab user={user} />
          )}

          {activeTab === 'inquiries' && (
            <InquiriesTab
              inquiries={inquiries}
              reloadData={fetchDashboardData}
              owners={owners}
              user={user}
            />
          )}

          {activeTab === 'feedback' && (
            <FeedbackTab />
          )}

          {activeTab === 'owners' && user.role === 'admin' && (
            <OwnersTab
              owners={owners}
              reloadData={fetchDashboardData}
            />
          )}

          {activeTab === 'auditLogs' && user.role === 'admin' && (
            <AuditLogsTab />
          )}

          {activeTab === 'settings' && user.role === 'admin' && (
            <SettingsTab />
          )}
        </main>
      </div>
    </div>
  );
}
