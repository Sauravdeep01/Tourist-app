import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import HomePage from './Pages/HomePage';
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

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Main Home Page */}
            <Route path="/" element={<HomePage />} />
            
            {/* Tour & Public Routes */}
            <Route path="/tours" element={<PlaceholderPage title="Tour Listing (路线列表)" />} />
            <Route path="/tours/:slug" element={<PlaceholderPage title="Tour Detail (路线详情)" />} />
            <Route path="/about" element={<PlaceholderPage title="About Us (关于我们)" />} />
            <Route path="/contact" element={<PlaceholderPage title="Contact & Booking (联系与报价)" />} />
            
            {/* Authentication & User Profiles */}
            <Route path="/login" element={<PlaceholderPage title="Login (账户登录)" />} />
            <Route path="/signup" element={<PlaceholderPage title="Tourist Signup (游客注册)" />} />
            <Route path="/account" element={<PlaceholderPage title="Tourist Profile & Inquiries (个人中心)" />} />
            <Route path="/admin" element={<PlaceholderPage title="Staff Login (员工通道)" />} />
            <Route path="/admin/dashboard" element={<PlaceholderPage title="Staff Control Panel (管理后台)" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
