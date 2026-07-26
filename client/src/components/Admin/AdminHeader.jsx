import React from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

// Header bar for admin dashboard
export default function AdminHeader({ title, onRefresh, loading }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <header className="h-16 bg-white border-b border-neutral-200/80 px-6 flex items-center justify-between shadow-xs sticky top-0 z-30">
      {/* Active Tab Title */}
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-bold text-neutral-800 tracking-tight">{title}</h1>
      </div>

      {/* Header controls */}
      <div className="flex items-center space-x-3">
        {/* Refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-saffron-600' : ''}`} />
          </button>
        )}

        {/* Back to public site */}
        <Link
          to="/"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 text-xs font-medium hover:bg-neutral-100 transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          <span>{lang === 'zh' ? '查看前台' : 'View Main Site'}</span>
        </Link>
      </div>
    </header>
  );
}
