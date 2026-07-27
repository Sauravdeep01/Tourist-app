import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Phone, MessageSquare, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import api from '../../utils/api';

// Site contact settings manager component
export default function SettingsTab() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    phone: '',
    whatsapp: '',
    wechatId: '',
    email: '',
    addressEn: '',
    addressZh: '',
  });

  // Fetch current site settings
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/settings');
      setFormData({
        phone: data.phone || '',
        whatsapp: data.whatsapp || '',
        wechatId: data.wechatId || '',
        email: data.email || '',
        addressEn: data.address?.en || '',
        addressZh: data.address?.zh || '',
      });
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Save settings form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSavedSuccess(false);

    try {
      await api.put('/api/settings', {
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        wechatId: formData.wechatId,
        email: formData.email,
        address: {
          en: formData.addressEn,
          zh: formData.addressZh,
        },
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-neutral-400">Loading site settings...</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Success Notification */}
      {savedSuccess && (
        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Site contact settings saved successfully!</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs space-y-6 text-xs">
        <div className="border-b border-neutral-100 pb-4">
          <h3 className="font-bold text-neutral-900 text-base">Global Site Contact Information</h3>
          <p className="text-neutral-500 mt-1">
            Update phone, WhatsApp, WeChat, and agency office address displayed on the public footer &amp; contact pages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-neutral-400" /> Phone Number
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-maroon-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1 flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-emerald-600" /> WhatsApp Number
            </label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-maroon-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1 flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-emerald-600" /> WeChat ID
            </label>
            <input
              type="text"
              value={formData.wechatId}
              onChange={(e) => setFormData({ ...formData, wechatId: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-maroon-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-neutral-400" /> Official Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-maroon-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-saffron-600" /> Office Address (English)
            </label>
            <textarea
              rows="2"
              value={formData.addressEn}
              onChange={(e) => setFormData({ ...formData, addressEn: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-maroon-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-saffron-600" /> Office Address (Chinese / 中文)
            </label>
            <textarea
              rows="2"
              value={formData.addressZh}
              onChange={(e) => setFormData({ ...formData, addressZh: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-maroon-500 outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center space-x-2 bg-maroon-700 hover:bg-maroon-800 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-xs disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{submitting ? 'Saving...' : t('dashboard.actions.saveSettings')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
