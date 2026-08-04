import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, ChevronRight, Navigation, X } from 'lucide-react';
import api from '../utils/api';

// Interactive search bar with embedded Explore button matching user reference design
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

  // Filter destinations by name or country
  const filtered = destinations.filter((item) => {
    if (!query.trim()) return false;
    const q = query.toLowerCase().trim();
    const nameEn = (item.name?.en || '').toLowerCase();
    const nameZh = (item.name?.zh || '').toLowerCase();
    const placeEn = (item.stateCountry?.en || '').toLowerCase();
    const placeZh = (item.stateCountry?.zh || '').toLowerCase();

    return nameEn.includes(q) || nameZh.includes(q) || placeEn.includes(q) || placeZh.includes(q);
  });

  // Handle explore button click or enter key submit
  const handleExplore = () => {
    if (selectedIndex >= 0 && filtered[selectedIndex]) {
      navigate(`/destinations/${filtered[selectedIndex].slug}`);
    } else {
      navigate('/destinations');
    }
    setIsOpen(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleExplore();
      return;
    }

    if (!isOpen || filtered.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
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
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto mt-12 sm:mt-14 font-sans">
      {/* Search Input Box with embedded Explore button */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl border border-card-border p-2 sm:p-2.5 flex items-center shadow-lg transition-all focus-within:ring-2 focus-within:ring-maroon-700/30">
        <Search className="h-5 w-5 text-saffron-500 ml-3 shrink-0" />
        
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
              ? '搜索圣地目的地、朝圣路线或参学体验...'
              : 'Search destinations, yatras, or experiences...'
          }
          className="w-full bg-transparent pl-3 pr-4 py-2 text-sm sm:text-base text-heading placeholder:text-muted font-medium focus:outline-none"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="p-1.5 text-muted hover:text-heading rounded-full mr-2 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Embedded Explore Button */}
        <button
          onClick={handleExplore}
          className="bg-maroon-700 hover:bg-maroon-800 active:scale-95 text-white font-bold px-6 py-2.5 sm:py-3 rounded-xl border border-[#9F2845] transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer text-sm sm:text-base"
        >
          <span>{lang === 'zh' ? '探索' : 'Explore'}</span>
          <Navigation className="h-4 w-4 rotate-45 fill-current text-white" />
        </button>
      </div>

      {/* Instant Dropdown Menu */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-card-border overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          {filtered.length > 0 ? (
            <div className="max-h-72 overflow-y-auto divide-y divide-card-border text-left" data-lenis-prevent>
              {filtered.map((item, index) => (
                <div
                  key={item._id}
                  onClick={() => {
                    navigate(`/destinations/${item.slug}`);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className={`p-3.5 flex items-center space-x-3 cursor-pointer transition-colors ${
                    index === selectedIndex ? 'bg-maroon-700/10 text-maroon-700' : 'hover:bg-beige text-heading'
                  }`}
                >
                  <img
                    src={
                      item.coverImage ||
                      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=200&q=80'
                    }
                    alt=""
                    className="h-12 w-16 object-cover rounded-lg shrink-0 border border-card-border"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-heading text-xs sm:text-sm truncate">
                      {item.name?.en} {item.name?.zh && `· ${item.name.zh}`}
                    </h4>
                    <p className="text-[11px] text-body truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-saffron-500" />
                      <span>{item.stateCountry?.[lang] || item.stateCountry?.en}</span>
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-body space-y-2">
              <p>{lang === 'zh' ? '未找到相关圣地' : 'No destination found'}</p>
              <Link
                to="/destinations"
                onClick={() => setIsOpen(false)}
                className="inline-block text-maroon-700 font-bold hover:underline"
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
