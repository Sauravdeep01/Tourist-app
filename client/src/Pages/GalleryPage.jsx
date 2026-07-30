import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Maximize2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../utils/api';

// Deterministic mosaic pattern: occasional tall / wide cells for a Pinterest-style rhythm
// without depending on each image's (unknown, remote) intrinsic dimensions.
function getMosaicSpan(index) {
  const cycle = index % 12;
  if (cycle === 3 || cycle === 9) return 'row-span-2';
  if (cycle === 6) return 'row-span-2 sm:col-span-2';
  return '';
}

// Pure image gallery page
export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedMap, setLoadedMap] = useState({});
  const [activeIndex, setActiveIndex] = useState(null);
  const touchStartX = useRef(null);

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

  const total = galleryItems.length;
  const activePhoto = activeIndex !== null ? galleryItems[activeIndex] : null;

  const closeLightbox = useCallback(() => setActiveIndex(null), []);
  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === null ? i : (i - 1 + total) % total));
  }, [total]);
  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? i : (i + 1) % total));
  }, [total]);

  // Keyboard navigation (Escape / Arrow keys) while the lightbox is open
  useEffect(() => {
    if (activeIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, closeLightbox, goPrev, goNext]);

  // Lock body scroll while the lightbox is open
  useEffect(() => {
    if (activeIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, [activeIndex]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  return (
    <div className="min-h-screen bg-slate-900 py-16 px-4 sm:px-6 lg:px-8 animate-page-fade-in">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-white tracking-tight">
            Journey Highlights
          </h1>
          <div className="h-1 w-14 bg-saffron-500 mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Every journey tells a story. Here are some unforgettable moments captured during our tours.
          </p>
        </div>

        {/* Mosaic / Pinterest-style Image Grid */}
        {loading ? (
          <div className="py-24 flex items-center justify-center text-slate-400 space-x-2 text-xs">
            <Loader2 className="h-5 w-5 animate-spin text-saffron-500" />
            <span>Loading photos...</span>
          </div>
        ) : total === 0 ? (
          <div className="py-24 text-center text-slate-400 text-sm">
            No gallery photos uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[140px] sm:auto-rows-[180px] lg:auto-rows-[200px] gap-4 sm:gap-5 [grid-auto-flow:dense]">
            {galleryItems.map((photo, idx) => {
              const isLoaded = !!loadedMap[photo._id];
              return (
                <div
                  key={photo._id}
                  onClick={() => setActiveIndex(idx)}
                  style={{ animationDelay: `${(idx % 12) * 70}ms` }}
                  className={`animate-fade-up-in group relative bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-black/30 ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 cursor-pointer ${getMosaicSpan(idx)}`}
                >
                  {/* Skeleton placeholder shown until the image finishes loading */}
                  {!isLoaded && (
                    <div className="absolute inset-0 bg-slate-700 animate-pulse" />
                  )}
                  <img
                    src={photo.imageUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setLoadedMap((prev) => ({ ...prev, [photo._id]: true }))}
                    className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/30 text-xs font-medium tracking-wide translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <Maximize2 className="h-3.5 w-3.5" />
                      View Photo
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-modal-backdrop"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 sm:top-6 z-20 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 text-white text-xs font-medium tracking-wide">
            {activeIndex + 1} / {total}
          </div>

          {/* Previous arrow */}
          {total > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-2 sm:left-6 z-20 p-2.5 sm:p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all hover:scale-105 cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
            </button>
          )}

          {/* Next arrow */}
          {total > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-2 sm:right-6 z-20 p-2.5 sm:p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all hover:scale-105 cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
            </button>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center"
          >
            <img
              key={activeIndex}
              src={activePhoto.imageUrl}
              alt=""
              className="animate-modal-image max-h-[85vh] w-auto object-contain rounded-2xl select-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
