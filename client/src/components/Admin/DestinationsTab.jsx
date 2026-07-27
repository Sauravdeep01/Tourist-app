import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, Search, MapPin, Check, X } from 'lucide-react';
import api from '../../utils/api';

// Manage sacred destinations component
export default function DestinationsTab({ destinations, reloadData, user }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [search, setSearch] = useState('');
  const [editingDest, setEditingDest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Initial form state
  const emptyForm = {
    nameEn: '',
    slug: '',
    state: 'Bihar',
    country: 'India',
    summaryEn: '',
    coverImage: '',
    active: true,
  };

  const [formData, setFormData] = useState(emptyForm);

  // Open modal to create a new destination
  const handleOpenCreate = () => {
    setEditingDest(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  // Open modal to edit a destination
  const handleOpenEdit = (dest) => {
    setEditingDest(dest);
    setFormData({
      nameEn: dest.name?.en || '',
      slug: dest.slug || '',
      state: dest.state || 'Bihar',
      country: dest.country || 'India',
      summaryEn: dest.summary?.en || '',
      coverImage: dest.coverImage || '',
      active: dest.active ?? true,
    });
    setIsModalOpen(true);
  };

  // Submit form for creation or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: { en: formData.nameEn, zh: '' },
      slug: formData.slug || formData.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      state: formData.state,
      country: formData.country,
      summary: { en: formData.summaryEn, zh: '' },
      coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa',
      active: formData.active,
    };

    try {
      if (editingDest) {
        await api.put(`/api/destinations/${editingDest._id}`, payload);
      } else {
        await api.post('/api/destinations', payload);
      }
      setIsModalOpen(false);
      reloadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save destination');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete destination
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try {
      await api.delete(`/api/destinations/${id}`);
      reloadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete destination');
    }
  };

  // Filter destination list by search
  const filteredDestinations = destinations.filter((dest) => {
    const name = (dest.name?.[lang] || dest.name?.en || '').toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder={t('dashboard.actions.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-maroon-500"
          />
        </div>

        {/* Add destination button (Admin only) */}
        {user?.role === 'admin' && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center space-x-2 bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>{t('dashboard.actions.createDestination')}</span>
          </button>
        )}
      </div>

      {/* Destination cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDestinations.length === 0 ? (
          <div className="col-span-full py-12 text-center text-neutral-400 text-xs">
            No destinations found.
          </div>
        ) : (
          filteredDestinations.map((dest) => (
            <div
              key={dest._id}
              className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-36 bg-neutral-100 overflow-hidden">
                  <img
                    src={dest.coverImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa'}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    {dest.active ? (
                      <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                        Active
                      </span>
                    ) : (
                      <span className="bg-neutral-800/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                        Hidden
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-neutral-900 text-sm">
                      {dest.name?.[lang] || dest.name?.en}
                    </h4>
                    <span className="text-[11px] font-medium text-neutral-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-saffron-500" /> {dest.state}, {dest.country}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-2">
                    {dest.summary?.[lang] || dest.summary?.en || 'Sacred pilgrimage site'}
                  </p>
                </div>
              </div>

              <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400">/{dest.slug}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEdit(dest)}
                    className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-200 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => handleDelete(dest._id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal dialog for destination */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-neutral-900 text-base">
                {editingDest ? 'Edit Destination' : 'Add Sacred Destination'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:bg-neutral-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Name (English)</label>
                <input
                  type="text"
                  required
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-saffron-500 outline-none"
                  placeholder="e.g. Bodh Gaya"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-saffron-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-saffron-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-saffron-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Summary (English)</label>
                <textarea
                  rows="2"
                  value={formData.summaryEn}
                  onChange={(e) => setFormData({ ...formData, summaryEn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-saffron-500 outline-none"
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
                  className="px-5 py-2 rounded-xl bg-saffron-600 text-white font-semibold hover:bg-saffron-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
