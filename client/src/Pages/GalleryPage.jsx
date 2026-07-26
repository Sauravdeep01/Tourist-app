import React, { useState, useEffect } from 'react';
import { X, Maximize2, Loader2 } from 'lucide-react';
import api from '../utils/api';

// Pure image gallery page
export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(null);

  // Fetch public gallery photos
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await api.get('/api/gallery');
        if (Array.isArray(data) && data.length > 0) {
          setGalleryItems(data);
        } else {
          // Fallback sample photos if database is empty
          setGalleryItems([
            { _id: '1', imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80' },
            { _id: '2', imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80' },
            { _id: '3', imageUrl: 'https://images.unsplash.com/photo-1609949279531-cf48d64bed89?auto=format&fit=crop&w=1200&q=80' },
            { _id: '4', imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80' },
            { _id: '5', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80' },
            { _id: '6', imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80' },
          ]);
        }
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-neutral-900 tracking-tight">
            Gallery
          </h1>
          <div className="h-1 w-12 bg-maroon-700 mx-auto rounded-full" />
        </div>

        {/* Pure Image Grid */}
        {loading ? (
          <div className="py-20 flex items-center justify-center text-neutral-400 space-x-2 text-xs">
            <Loader2 className="h-5 w-5 animate-spin text-maroon-700" />
            <span>Loading photos...</span>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="py-20 text-center text-neutral-400 text-sm">
            No gallery photos uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryItems.map((photo) => (
              <div
                key={photo._id}
                onClick={() => setActivePhoto(photo)}
                className="group relative bg-neutral-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer h-64 sm:h-72"
              >
                <img
                  src={photo.imageUrl}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                    <Maximize2 className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[90vh] bg-black rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center"
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={activePhoto.imageUrl}
              alt=""
              className="max-h-[85vh] w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
