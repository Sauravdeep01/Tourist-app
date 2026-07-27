import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, Search, UserCheck, UserX, KeyRound, Check, X } from 'lucide-react';
import api from '../../utils/api';

// Admin owner account management component
export default function OwnersTab({ owners, reloadData }) {
  const { t } = useTranslation();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New owner account form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Reset password modal state
  const [passwordModalUser, setPasswordModalUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  // Submit create owner form
  const handleCreateOwner = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/api/owners', formData);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '' });
      reloadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create owner account');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle active/deactivated status
  const handleToggleStatus = async (owner) => {
    try {
      await api.patch(`/api/owners/${owner._id}/status`, {
        active: !owner.active,
      });
      reloadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to change status');
    }
  };

  // Reset password for owner
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!passwordModalUser) return;
    setSubmitting(true);

    try {
      await api.patch(`/api/owners/${passwordModalUser._id}/password`, {
        password: newPassword,
      });
      setPasswordModalUser(null);
      setNewPassword('');
      alert('Password updated successfully');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete owner account
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this owner account?')) return;
    try {
      await api.delete(`/api/owners/${id}`);
      reloadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete owner account');
    }
  };

  // Filter owners list
  const filteredOwners = owners.filter(
    (o) =>
      o.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder={t('dashboard.actions.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>{t('dashboard.actions.createOwner')}</span>
        </button>
      </div>

      {/* Owners Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3.5 px-4">Name &amp; Role</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Created</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-800">
              {filteredOwners.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-neutral-400">
                    No staff/owner accounts found.
                  </td>
                </tr>
              ) : (
                filteredOwners.map((owner) => (
                  <tr key={owner._id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                          {owner.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900">{owner.name}</p>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase">
                            {owner.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-neutral-700">{owner.email}</td>
                    <td className="py-3.5 px-4">
                      {owner.active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          <UserCheck className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">
                          <UserX className="h-3 w-3" /> Deactivated
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500">
                      {new Date(owner.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleStatus(owner)}
                          className="px-2 py-1 rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-[11px]"
                          title="Toggle Status"
                        >
                          {owner.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => setPasswordModalUser(owner)}
                          className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-emerald-700 transition-colors"
                          title="Reset Password"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(owner._id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete Account"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Owner */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-neutral-900 text-base">Add Owner Account</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:bg-neutral-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOwner} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="e.g. Tour Operator Name"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="operator@bodhipathtours.com"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="At least 8 chars with letters & numbers"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-semibold hover:bg-emerald-800 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reset Password */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-neutral-900 text-base">Reset Owner Password</h3>
              <button
                onClick={() => setPasswordModalUser(null)}
                className="p-1 rounded-lg text-neutral-400 hover:bg-neutral-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <p className="text-neutral-500">
                Setting new password for <strong>{passwordModalUser.email}</strong>.
              </p>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-semibold hover:bg-emerald-800 disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
