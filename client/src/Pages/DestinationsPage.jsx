import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Loader2 } from 'lucide-react';
import api from '../utils/api';

// Public destinations page with minimal UI/UX grid layout
export default function DestinationsPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Fetch active destinations sorted by journey order
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data } = await api.get('/api/destinations');
        setDestinations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load destinations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Filter destinations by search query
  const filteredDestinations = destinations.filter((dest) => {
    const nameMatch =
      dest.name?.en?.toLowerCase().includes(search.toLowerCase()) ||
      dest.name?.zh?.toLowerCase().includes(search.toLowerCase());
    const regionMatch =
      dest.stateCountry?.en?.toLowerCase().includes(search.toLowerCase()) ||
      dest.stateCountry?.zh?.toLowerCase().includes(search.toLowerCase());

    return nameMatch || regionMatch;
  });

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Starry Particles */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      {/* Ambient Lighting Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-amber-400">
            EXPLORE
          </p>
          <h1 className="text-4xl sm:text-6xl font-serif font-extrabold tracking-tight text-white">
            All <span className="text-amber-400">Destinations</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-xl mx-auto">
            {lang === 'zh'
              ? '踏上佛教八大圣地朝圣之旅，亲临佛陀成道、说法与涅槃的神圣遗迹。'
              : 'Embark on a sacred journey across holy sites where Lord Buddha lived, taught, and attained enlightenment.'}
          </p>
        </div>

        {/* Large Centered Search Bar Box */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder={
                lang === 'zh' ? '搜索圣地目的地... (如: 菩提伽耶 / Gaya)' : 'Search destinations...'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-800 bg-[#161f30]/90 text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-2xl transition-all"
            />
          </div>
        </div>

        {/* Minimal UI/UX Destination Grid */}
        <div className="pt-4">
          {loading ? (
            <div className="py-24 flex items-center justify-center text-slate-400 space-x-2 text-xs">
              <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
              <span>Loading destinations...</span>
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="py-24 text-center text-slate-400 text-sm bg-[#161f30]/60 rounded-3xl border border-slate-800 p-8">
              {lang === 'zh' ? '未找到符合条件的朝圣圣地' : 'No destinations match your search.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDestinations.map((dest) => (
                <Link
                  key={dest._id}
                  to={`/destinations/${dest.slug}`}
                  className="group bg-[#161f30] rounded-3xl overflow-hidden border border-slate-800/80 hover:border-amber-400/50 shadow-xl hover:shadow-2xl hover:shadow-amber-400/10 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Cover Image */}
                    <div className="relative h-60 overflow-hidden bg-slate-900">
                      <img
                        src={
                          dest.coverImage ||
                          'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
                        }
                        alt={dest.name?.en}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Gradient fade into card body */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#161f30] via-transparent to-black/20" />
                    </div>

                    {/* Card Body: Destination Name + Short Paragraph */}
                    <div className="p-6 space-y-2.5">
                      {/* Destination Name */}
                      <h3 className="font-serif font-extrabold text-white text-2xl group-hover:text-amber-400 transition-colors">
                        {dest.name?.[lang] || dest.name?.en}
                      </h3>

                      {/* Short Paragraph */}
                      <p className="text-slate-300/90 text-xs sm:text-sm line-clamp-2 leading-relaxed font-sans">
                        {dest.famousFor?.[lang] || dest.significance?.[lang] || dest.famousFor?.en}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
