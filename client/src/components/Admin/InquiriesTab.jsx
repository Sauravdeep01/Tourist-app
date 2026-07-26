import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, MessageSquare, User, Calendar, Mail, Phone, Clock, CheckCircle2, X } from 'lucide-react';
import api from '../../utils/api';

// Manage tourist quote inquiries component
export default function InquiriesTab({ inquiries, reloadData, owners, user }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [assignedOwnerId, setAssignedOwnerId] = useState('');

  // Open modal to manage an inquiry
  const handleOpenDetail = (inquiry) => {
    setSelectedInquiry(inquiry);
    setNewStatus(inquiry.status);
    setAdminNotes(inquiry.notes || '');
    setAssignedOwnerId(inquiry.assignedTo?._id || inquiry.assignedTo || '');
    setIsModalOpen(true);
  };

  // Save inquiry status & notes update
  const handleSaveUpdate = async () => {
    if (!selectedInquiry) return;
    setUpdating(true);

    try {
      // Update status & notes
      await api.patch(`/api/inquiries/${selectedInquiry._id}`, {
        status: newStatus,
        notes: adminNotes,
      });

      // Assign inquiry if admin
      if (user?.role === 'admin' && assignedOwnerId && assignedOwnerId !== selectedInquiry.assignedTo) {
        await api.patch(`/api/inquiries/${selectedInquiry._id}/assign`, {
          ownerId: assignedOwnerId,
        });
      }

      setIsModalOpen(false);
      reloadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update inquiry');
    } finally {
      setUpdating(false);
    }
  };

  // Filter inquiry list by search and status
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchSearch =
      (inquiry.touristName || '').toLowerCase().includes(search.toLowerCase()) ||
      (inquiry.touristEmail || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Controls & filters bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder={t('dashboard.actions.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Status filter dropdown */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-neutral-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-700 font-medium focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">{t('dashboard.status.new')}</option>
            <option value="processing">{t('dashboard.status.processing')}</option>
            <option value="quoted">{t('dashboard.status.quoted')}</option>
            <option value="confirmed">{t('dashboard.status.confirmed')}</option>
            <option value="cancelled">{t('dashboard.status.cancelled')}</option>
          </select>
        </div>
      </div>

      {/* Inquiries data table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3.5 px-4">Tourist Name</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Pax</th>
                <th className="py-3.5 px-4">Travel Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-800">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-neutral-400">
                    No inquiries found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry._id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-neutral-900">{inquiry.touristName}</p>
                        <p className="text-[11px] text-neutral-400 font-mono">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <p className="text-neutral-700 font-medium">{inquiry.touristEmail}</p>
                        {inquiry.phone && (
                          <p className="text-[11px] text-neutral-500">
                            {inquiry.phoneCountryCode} {inquiry.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-neutral-800">
                      {inquiry.pax || 1}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 font-medium">
                      {inquiry.travelDate ? new Date(inquiry.travelDate).toLocaleDateString() : 'Flexible'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          inquiry.status === 'new'
                            ? 'bg-amber-100 text-amber-800'
                            : inquiry.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inquiry.status === 'quoted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {t(`dashboard.status.${inquiry.status}`)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(inquiry)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium text-xs transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail & Status Update Modal */}
      {isModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-bold text-neutral-900 text-base">Inquiry Details</h3>
                <p className="text-xs text-neutral-400">ID: {selectedInquiry._id}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:bg-neutral-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Tourist info summary */}
            <div className="bg-neutral-50 rounded-xl p-4 space-y-2 text-xs border border-neutral-100">
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">Tourist Name:</span>
                <span className="font-bold text-neutral-900">{selectedInquiry.touristName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">Email:</span>
                <span className="font-medium text-neutral-800">{selectedInquiry.touristEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">Phone / WeChat:</span>
                <span className="font-medium text-neutral-800">
                  {selectedInquiry.phone || 'N/A'} / {selectedInquiry.wechatId || 'N/A'}
                </span>
              </div>
              {selectedInquiry.specialRequests && (
                <div className="pt-2 border-t border-neutral-200/60">
                  <span className="text-neutral-500 font-medium block mb-1">Special Requests:</span>
                  <p className="text-neutral-700 italic bg-white p-2 rounded border border-neutral-200">
                    "{selectedInquiry.specialRequests}"
                  </p>
                </div>
              )}
            </div>

            {/* Update Controls */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-amber-500 outline-none font-medium"
                >
                  <option value="new">{t('dashboard.status.new')}</option>
                  <option value="processing">{t('dashboard.status.processing')}</option>
                  <option value="quoted">{t('dashboard.status.quoted')}</option>
                  <option value="confirmed">{t('dashboard.status.confirmed')}</option>
                  <option value="cancelled">{t('dashboard.status.cancelled')}</option>
                </select>
              </div>

              {/* Staff Assignment (Admin only) */}
              {user?.role === 'admin' && (
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Assign to Owner</label>
                  <select
                    value={assignedOwnerId}
                    onChange={(e) => setAssignedOwnerId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-amber-500 outline-none font-medium"
                  >
                    <option value="">Unassigned (Admin Default)</option>
                    {owners.map((owner) => (
                      <option key={owner._id} value={owner._id}>
                        {owner.name} ({owner.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Internal Notes</label>
                <textarea
                  rows="3"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="Notes on quotes, group preferences..."
                />
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-100 text-xs">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveUpdate}
                disabled={updating}
                className="px-5 py-2 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 disabled:opacity-50"
              >
                {updating ? 'Saving...' : 'Save Updates'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
