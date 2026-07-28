import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Eye, EyeOff, Trash2, MessageSquareReply, X, Star } from 'lucide-react';
import api from '../../utils/api';
import StarRating from '../StarRating';

// Customer Feedback moderation tab — reply, hide/show, and delete testimonials (Owner or Admin)
export default function FeedbackTab() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('all'); // all | visible | hidden

  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (visibilityFilter === 'hidden') params.hidden = 'true';
      if (visibilityFilter === 'visible') params.hidden = 'false';
      const { data } = await api.get('/api/feedback/admin', { params });
      setFeedbacks(data || []);
    } catch (err) {
      console.error('Failed to load feedback:', err);
    } finally {
      setLoading(false);
    }
  }, [visibilityFilter]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const openManage = (fb) => {
    setSelected(fb);
    setReplyText(fb.reply?.text || '');
    setIsModalOpen(true);
  };

  const handleToggleVisibility = async (fb) => {
    try {
      await api.patch(`/api/feedback/${fb._id}/visibility`, { hidden: !fb.hidden });
      fetchFeedback();
      if (selected?._id === fb._id) setSelected({ ...selected, hidden: !fb.hidden });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update visibility');
    }
  };

  const handleDelete = async (fb) => {
    if (!window.confirm('Permanently delete this feedback entry? This cannot be undone.')) return;
    try {
      await api.delete(`/api/feedback/${fb._id}`);
      setIsModalOpen(false);
      fetchFeedback();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete feedback');
    }
  };

  const handleSaveReply = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const { data } = await api.post(`/api/feedback/${selected._id}/reply`, { text: replyText.trim() });
      // The reply endpoint returns the feedback doc with an unpopulated user
      // reference — keep the tourist name/email already shown in the modal.
      setSelected({ ...data, user: selected.user });
      fetchFeedback();
    } catch (err) {
      alert(err.response?.data?.errors?.[0]?.message || err.response?.data?.error || 'Failed to save reply');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReply = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const { data } = await api.delete(`/api/feedback/${selected._id}/reply`);
      setSelected({ ...data, user: selected.user });
      setReplyText('');
      fetchFeedback();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to remove reply');
    } finally {
      setSaving(false);
    }
  };

  const filteredFeedback = feedbacks.filter((fb) => {
    const term = search.toLowerCase();
    return (
      (fb.user?.name || '').toLowerCase().includes(term) ||
      (fb.user?.email || '').toLowerCase().includes(term) ||
      (fb.comment || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Controls & filters bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900">Customer Feedback</h2>
          <p className="text-xs text-neutral-500">Reply to reviews and control what appears on the public feedback page.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search name, email, comment…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-neutral-400" />
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="py-2 px-3 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-700 font-medium focus:outline-none"
            >
              <option value="all">All Feedback</option>
              <option value="visible">Visible Only</option>
              <option value="hidden">Hidden Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedback data table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3.5 px-4">Tourist</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Comment</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-neutral-400">
                    Loading feedback...
                  </td>
                </tr>
              ) : filteredFeedback.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-neutral-400">
                    No feedback found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredFeedback.map((fb) => (
                  <tr key={fb._id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-neutral-900">{fb.user?.name || 'Unknown'}</p>
                        <p className="text-[11px] text-neutral-400">{fb.user?.email}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-neutral-800">{fb.rating}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-neutral-700 line-clamp-2">{fb.comment}</p>
                      {fb.reply?.text && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1">
                          <MessageSquareReply className="h-2.5 w-2.5" /> Replied
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 font-mono text-[11px]">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          fb.hidden ? 'bg-neutral-200 text-neutral-600' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {fb.hidden ? 'Hidden' : 'Visible'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openManage(fb)}
                          className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium text-xs transition-colors"
                        >
                          Manage
                        </button>
                        <button
                          onClick={() => handleToggleVisibility(fb)}
                          title={fb.hidden ? 'Show on public page' : 'Hide from public page'}
                          className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors"
                        >
                          {fb.hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDelete(fb)}
                          title="Delete permanently"
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
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

      {/* Manage Feedback Modal */}
      {isModalOpen && selected && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-bold text-neutral-900 text-base">Feedback Details</h3>
                <p className="text-xs text-neutral-400">ID: {selected._id}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:bg-neutral-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Reviewer info summary */}
            <div className="bg-neutral-50 rounded-xl p-4 space-y-2 text-xs border border-neutral-100">
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">Tourist Name:</span>
                <span className="font-bold text-neutral-900">{selected.user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">Email:</span>
                <span className="font-medium text-neutral-800">{selected.user?.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-medium">Rating:</span>
                <StarRating value={selected.rating} size="sm" variant="light" />
              </div>
              <div className="pt-2 border-t border-neutral-200/60">
                <span className="text-neutral-500 font-medium block mb-1">Comment:</span>
                <p className="text-neutral-700 italic bg-white p-2 rounded border border-neutral-200 whitespace-pre-line">
                  "{selected.comment}"
                </p>
              </div>
            </div>

            {/* Reply Controls */}
            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-neutral-700">Owner / Admin Reply</label>
              <textarea
                rows="3"
                maxLength={1000}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="Write a public reply to this feedback..."
              />
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">{replyText.length}/1000</span>
                {selected.reply?.text && (
                  <button
                    type="button"
                    onClick={handleDeleteReply}
                    disabled={saving}
                    className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                  >
                    Remove reply
                  </button>
                )}
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-neutral-100 text-xs">
              <button
                type="button"
                onClick={() => handleToggleVisibility(selected)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 font-medium"
              >
                {selected.hidden ? 'Show on public page' : 'Hide from public page'}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(selected)}
                className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-medium"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={handleSaveReply}
                disabled={saving || !replyText.trim()}
                className="px-5 py-2 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Reply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
