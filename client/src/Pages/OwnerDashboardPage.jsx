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
import GalleryTab from '../components/Admin/GalleryTab';
import FeedbackTab from '../components/Admin/FeedbackTab';
import api from '../utils/api';

// Dedicated Owner Portal control page
export default function OwnerDashboardPage() {
  const { t } = useTranslation();
  const { user, logout, loading: authLoading } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Owner data state
  const [stats, setStats] = useState(null);
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  // Fetch owner dashboard data
  const fetchOwnerData = async () => {
    setLoading(true);
    try {
      // Fetch owner scoped analytics
      const analyticsRes = await api.get('/api/analytics').catch(() => null);
      if (analyticsRes?.data) setStats(analyticsRes.data);

      // Fetch owner managed tours
      const toursRes = await api.get('/api/tours/manage').catch(() => null);
      if (toursRes?.data?.tours) setTours(toursRes.data.tours);
      else if (Array.isArray(toursRes?.data)) setTours(toursRes.data);

      // Fetch sacred destinations
      const destsRes = await api.get('/api/destinations').catch(() => null);
      if (destsRes?.data) setDestinations(destsRes.data);

      // Fetch assigned inquiries
      const inqRes = await api.get('/api/inquiries').catch(() => null);
      if (inqRes?.data?.inquiries) setInquiries(inqRes.data.inquiries);
      else if (Array.isArray(inqRes?.data)) setInquiries(inqRes.data);
    } catch (err) {
      console.error('Owner data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'owner' || user.role === 'admin')) {
      fetchOwnerData();
    }
  }, [user]);

  // Auth Guard for Owner role
  if (authLoading) {
    return <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white text-xs">Loading session...</div>;
  }
  if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
    return <Navigate to="/login" replace />;
  }

  // Active tab title
  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview':
        return t('dashboard.overview');
      case 'tours':
        return t('dashboard.tours');
      case 'destinations':
        return t('dashboard.destinations');
      case 'gallery':
        return 'Manage Gallery';
      case 'inquiries':
        return t('dashboard.inquiries');
      case 'feedback':
        return t('dashboard.feedback');
      default:
        return 'Owner Portal';
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8f7f4] font-sans">
      {/* Navigation Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        logout={logout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <AdminHeader
          title={getTabTitle()}
          onRefresh={fetchOwnerData}
          loading={loading}
        />

        {/* Active Tab View */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {activeTab === 'overview' && (
            <OverviewTab
              stats={stats}
              inquiries={inquiries}
              tours={tours}
              destinations={destinations}
              owners={[]}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'tours' && (
            <ToursTab
              tours={tours}
              reloadData={fetchOwnerData}
              user={user}
            />
          )}

          {activeTab === 'destinations' && (
            <DestinationsTab
              destinations={destinations}
              reloadData={fetchOwnerData}
              user={user}
            />
          )}

          {activeTab === 'gallery' && (
            <GalleryTab user={user} />
          )}

          {activeTab === 'inquiries' && (
            <InquiriesTab
              inquiries={inquiries}
              reloadData={fetchOwnerData}
              owners={[]}
              user={user}
            />
          )}

          {activeTab === 'feedback' && (
            <FeedbackTab />
          )}
        </main>
      </div>
    </div>
  );
}
