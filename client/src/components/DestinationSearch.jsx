import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, ChevronRight, X } from 'lucide-react';
import api from '../utils/api';

// Interactive live destination search bar with instant dropdown
export default function DestinationSearch() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState([]);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef(null);

  // Fetch active destinations catalog
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data } = await api.get('/api/destinations');
        setDestinations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load search destinations:', err);
      }
    };
    fetchDestinations();
  }, []);

  // Filter destinations by name or country in both languages
  const filtered = destinations.filter((item) => {
    if (!query.trim()) return false;
    const q = query.toLowerCase().trim();
    const nameEn = (item.name?.en || '').toLowerCase();
    const nameZh = (item.name?.zh || '').toLowerCase();
    const placeEn = (item.stateCountry?.en || '').toLowerCase();
    const placeZh = (item.stateCountry?.zh || '').toLowerCase();

    return nameEn.includes(q) || nameZh.includes(q) || placeEn.includes(q) || placeZh.includes(q);
  });

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || filtered.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      navigate(`/destinations/${filtered[selectedIndex].slug}`);
      setIsOpen(false);
      setQuery('');
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto mt-8">
      {/* Search Input Box */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={
            lang === 'zh'
              ? '搜索圣地目的地... (如: 菩提伽耶 / Gaya)'
              : 'Search a destination... (e.g. Bodh Gaya / Sarnath)'
          }
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white/95 text-neutral-900 placeholder:text-neutral-500 font-medium text-sm sm:text-base border border-white/40 shadow-xl focus:outline-none focus:ring-2 focus:ring-saffron-500 transition-all"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 rounded-full"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Instant Dropdown Menu */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          {filtered.length > 0 ? (
            <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 text-left">
              {filtered.map((item, index) => (
                <div
                  key={item._id}
                  onClick={() => {
                    navigate(`/destinations/${item.slug}`);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className={`p-3 flex items-center space-x-3 cursor-pointer transition-colors ${
                    index === selectedIndex ? 'bg-saffron-50' : 'hover:bg-neutral-50'
                  }`}
                >
                  <img
                    src={
                      item.coverImage ||
                      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=200&q=80'
                    }
                    alt=""
                    className="h-12 w-16 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-neutral-900 text-xs sm:text-sm truncate">
                      {item.name?.en} {item.name?.zh && `· ${item.name.zh}`}
                    </h4>
                    <p className="text-[11px] text-neutral-500 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-saffron-600" />
                      <span>{item.stateCountry?.[lang] || item.stateCountry?.en}</span>
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-neutral-500 space-y-2">
              <p>{lang === 'zh' ? '未找到相关圣地' : 'No destination found'}</p>
              <Link
                to="/destinations"
                onClick={() => setIsOpen(false)}
                className="inline-block text-saffron-700 font-bold hover:underline"
              >
                {lang === 'zh' ? '浏览全部圣地 →' : 'Browse All Destinations →'}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
