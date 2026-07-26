import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';
import api from '../../utils/api';

// Simplified Gallery Image Upload & Management tab
export default function GalleryTab() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Fetch all gallery photos
  const fetchGallery = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/gallery/manage');
      setGalleryItems(data || []);
    } catch (err) {
      console.error('Failed to load gallery items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Submit image upload form
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    setSubmitting(true);

    try {
      await api.post('/api/gallery', {
        imageUrl: imageUrl.trim(),
        imageTitle: 'Gallery Photo',
        destinationName: 'General',
        active: true,
      });
      setIsModalOpen(false);
      setImageUrl('');
      fetchGallery();
    } catch (err) {
      alert(err.response?.data?.errors?.[0]?.message || err.response?.data?.error || 'Failed to upload photo');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete photo from gallery
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await api.delete(`/api/gallery/${id}`);
      fetchGallery();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete photo');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-neutral-900">Gallery Image Management</h2>
          <p className="text-xs text-neutral-500">Upload or remove photos displayed on the public gallery.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-maroon-700 hover:bg-maroon-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Gallery Image Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-neutral-400">Loading gallery images...</div>
      ) : galleryItems.length === 0 ? (
        <div className="py-12 text-center text-xs text-neutral-400 bg-white rounded-2xl border border-neutral-200/80 p-8">
          No gallery images uploaded yet. Click "Upload Image" to add photos!
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {galleryItems.map((item) => (
            <div
              key={item._id}
              className="group relative bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden h-44 flex flex-col justify-between"
            >
              <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg"
                  title="Delete Photo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-neutral-900 text-base">Upload Image</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:bg-neutral-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-maroon-500 outline-none"
                  placeholder="Paste image URL (https://...)"
                />
              </div>

              {imageUrl && (
                <div className="h-36 rounded-xl border border-neutral-200 overflow-hidden bg-neutral-100 flex items-center justify-center">
                  <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}

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
                  {submitting ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
