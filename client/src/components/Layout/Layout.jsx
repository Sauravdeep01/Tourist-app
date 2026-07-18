import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50 selection:bg-saffron-200 selection:text-maroon-900">
      {/* Sticky Header */}
      <Navbar />
      
      {/* Page Content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer Gated */}
      <Footer />
      
      {/* Floating Action Button for WhatsApp */}
      <WhatsAppButton />
    </div>
  );
}
