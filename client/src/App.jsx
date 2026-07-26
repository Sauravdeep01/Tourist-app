import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import ForgotPasswordPage from './Pages/ForgotPasswordPage';
import ResetPasswordPage from './Pages/ResetPasswordPage';
import AdminDashboardPage from './Pages/AdminDashboardPage';
import OwnerDashboardPage from './Pages/OwnerDashboardPage';
import GalleryPage from './Pages/GalleryPage';
import DestinationsPage from './Pages/DestinationsPage';
import DestinationDetailPage from './Pages/DestinationDetailPage';
import './i18n'; // Import i18n resources configuration

// Simple placeholder page component to prevent router crashes when navigating
const PlaceholderPage = ({ title }) => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-[#faf9f6]">
    <div className="text-center p-8 bg-white rounded-2xl border border-neutral-100 shadow-xs max-w-md w-full">
      <h2 className="text-2xl font-bold text-neutral-800 mb-2">{title}</h2>
      <p className="text-sm text-neutral-500 mb-4">
        This page is a placeholder and will be built in the next development sub-parts.
      </p>
      <a
        href="/"
        className="inline-flex items-center justify-center bg-maroon-700 hover:bg-maroon-800 text-white font-medium text-xs px-4 py-2 rounded-md transition-colors"
      >
        Return to Home
      </a>
    </div>
  </div>
);

// Standard site chrome (Navbar + Footer + WhatsApp button) for every public page.
const SiteLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Full-bleed auth pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Technical Admin Control Panel */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

          {/* Owner Portal Control Panel */}
          <Route path="/owner" element={<OwnerDashboardPage />} />
          <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />

          {/* Public routes keeping standard Navbar/Footer chrome */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<HomePage />} />

            {/* Tour & Public Routes */}
            <Route path="/tours" element={<PlaceholderPage title="Tour Listing (路线列表)" />} />
            <Route path="/tours/:slug" element={<PlaceholderPage title="Tour Detail (路线详情)" />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/about" element={<PlaceholderPage title="About Us (关于我们)" />} />
            <Route path="/contact" element={<PlaceholderPage title="Contact & Booking (联系与报价)" />} />

            {/* Authenticated User Profile */}
            <Route path="/account" element={<PlaceholderPage title="Tourist Profile & Inquiries (个人中心)" />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
