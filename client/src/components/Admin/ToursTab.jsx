import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, Search, Compass, Check, X, Eye } from 'lucide-react';
import api from '../../utils/api';

// Manage tour packages component
export default function ToursTab({ tours, reloadData, user }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [search, setSearch] = useState('');
  const [editingTour, setEditingTour] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Initial form values
  const emptyForm = {
    titleEn: '',
    titleZh: '',
    slug: '',
    days: 10,
    nights: 9,
    summaryEn: '',
    summaryZh: '',
    priceOnRequest: true,
    startingPriceUsd: 1500,
    active: true,
    featured: false,
    primaryImage: '',
  };

  const [formData, setFormData] = useState(emptyForm);

  // Open modal for creating a new tour
  const handleOpenCreate = () => {
    setEditingTour(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing tour
  const handleOpenEdit = (tour) => {
    setEditingTour(tour);
    setFormData({
      titleEn: tour.title?.en || '',
      titleZh: tour.title?.zh || '',
      slug: tour.slug || '',
      days: tour.duration?.days || 10,
      nights: tour.duration?.nights || 9,
      summaryEn: tour.summary?.en || '',
      summaryZh: tour.summary?.zh || '',
      priceOnRequest: tour.priceOnRequest ?? true,
      startingPriceUsd: tour.startingPriceUsd || 1500,
      active: tour.active ?? true,
      featured: tour.featured ?? false,
      primaryImage: tour.primaryImage || '',
    });
    setIsModalOpen(true);
  };

  // Submit tour form to create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: { en: formData.titleEn, zh: formData.titleZh },
      slug: formData.slug || formData.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      duration: { days: Number(formData.days), nights: Number(formData.nights) },
      summary: { en: formData.summaryEn, zh: formData.summaryZh },
      priceOnRequest: formData.priceOnRequest,
      startingPriceUsd: Number(formData.startingPriceUsd),
      active: formData.active,
      featured: formData.featured,
      primaryImage: formData.primaryImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa',
    };

    try {
      if (editingTour) {
        await api.put(`/api/tours/${editingTour._id}`, payload);
      } else {
        await api.post('/api/tours', payload);
      }
      setIsModalOpen(false);
      reloadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save tour package');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete tour action
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tour package?')) return;
    try {
      await api.delete(`/api/tours/${id}`);
      reloadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete tour');
    }
  };

  // Filter tours list by search input
  const filteredTours = tours.filter((tour) => {
    const title = (tour.title?.[lang] || tour.title?.en || '').toLowerCase();
    return title.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search filter */}
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

        {/* Add tour button */}
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center space-x-2 bg-maroon-700 hover:bg-maroon-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>{t('dashboard.actions.createTour')}</span>
        </button>
      </div>

      {/* Tour table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3.5 px-4">Tour Package</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Pricing</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-800">
              {filteredTours.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-neutral-400">
                    No tour packages found.
                  </td>
                </tr>
              ) : (
                filteredTours.map((tour) => (
                  <tr key={tour._id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={tour.primaryImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa'}
                          alt=""
                          className="h-10 w-12 rounded-lg object-cover bg-neutral-100"
                        />
                        <div>
                          <p className="font-bold text-neutral-900">
                            {tour.title?.[lang] || tour.title?.en}
                          </p>
                          <p className="text-[11px] text-neutral-400 font-mono">{tour.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-neutral-600">
                      {tour.duration?.days}D / {tour.duration?.nights}N
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      {tour.priceOnRequest ? (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold text-[11px]">
                          Price on Request
                        </span>
                      ) : (
                        <span className="text-neutral-900 font-bold">${tour.startingPriceUsd}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {tour.active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          <Check className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEdit(tour)}
                          className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-maroon-700 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tour._id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
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

      {/* Tour create/edit modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-neutral-900 text-base">
                {editingTour ? 'Edit Tour Package' : 'Create Tour Package'}
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
                <label className="block font-semibold text-neutral-700 mb-1">Title (English)</label>
                <input
                  type="text"
                  required
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-maroon-500 outline-none"
                  placeholder="e.g. Footsteps of Buddha - 10 Days Pilgrimage"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Title (Chinese / 中文)</label>
                <input
                  type="text"
                  required
                  value={formData.titleZh}
                  onChange={(e) => setFormData({ ...formData, titleZh: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-maroon-500 outline-none"
                  placeholder="例：佛陀成道八大圣迹朝圣10日游"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Days</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-maroon-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Nights</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.nights}
                    onChange={(e) => setFormData({ ...formData, nights: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-maroon-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Summary (English)</label>
                <textarea
                  rows="2"
                  value={formData.summaryEn}
                  onChange={(e) => setFormData({ ...formData, summaryEn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-maroon-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Summary (Chinese / 中文)</label>
                <textarea
                  rows="2"
                  value={formData.summaryZh}
                  onChange={(e) => setFormData({ ...formData, summaryZh: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-maroon-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.primaryImage}
                  onChange={(e) => setFormData({ ...formData, primaryImage: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-maroon-500 outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 font-medium text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded text-maroon-700 focus:ring-maroon-500 h-4 w-4"
                  />
                  <span>Active / Published</span>
                </label>
                <label className="flex items-center space-x-2 font-medium text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.priceOnRequest}
                    onChange={(e) => setFormData({ ...formData, priceOnRequest: e.target.checked })}
                    className="rounded text-maroon-700 focus:ring-maroon-500 h-4 w-4"
                  />
                  <span>Price on Request</span>
                </label>
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
                  className="px-5 py-2 rounded-xl bg-maroon-700 text-white font-semibold hover:bg-maroon-800 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Tour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
