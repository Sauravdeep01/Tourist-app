import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Search, RefreshCw, User, Calendar, Tag } from 'lucide-react';
import api from '../../utils/api';

// Admin audit logs history component
export default function AuditLogsTab() {
  const { t } = useTranslation();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Fetch audit logs from backend API
  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/audit-logs');
      setLogs(data.logs || data || []);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  // Filter logs by search term
  const filteredLogs = logs.filter((log) => {
    const actor = (log.actorEmail || log.actorId?.email || '').toLowerCase();
    const action = (log.action || '').toLowerCase();
    const target = (log.targetType || '').toLowerCase();
    const q = search.toLowerCase();
    return actor.includes(q) || action.includes(q) || target.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Top search & refresh bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search logs by actor, action, or target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-maroon-500"
          />
        </div>

        <button
          onClick={fetchAuditLogs}
          disabled={loading}
          className="flex items-center space-x-2 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-maroon-700' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Target Type</th>
                <th className="py-3.5 px-4">Target ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-800 font-mono text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-neutral-400">
                    Loading audit trail...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-neutral-400 font-sans text-xs">
                    No system audit logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-4 text-neutral-500 font-sans text-xs">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-neutral-900 font-sans">
                      {log.actorEmail || log.actorId?.email || 'System'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-maroon-50 text-maroon-800 font-semibold px-2 py-0.5 rounded border border-maroon-100">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-700">{log.targetType || 'N/A'}</td>
                    <td className="py-3 px-4 text-neutral-400">{log.targetId || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
