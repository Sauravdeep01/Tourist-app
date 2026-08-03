import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Loader2 } from 'lucide-react';
import api from '../utils/api';
import ScrollReveal from '../components/Decor/ScrollReveal';
import Watermark from '../components/Decor/Watermark';

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
    <div className="min-h-screen bg-ivory text-heading py-24 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Starry Particles */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[32px_32px] opacity-5 pointer-events-none" />

      {/* Ambient Lighting Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-75 bg-maroon-700/5 blur-[130px] rounded-full pointer-events-none" />
      <Watermark variant="mountain" size={460} className="bottom-0 -left-24 hidden lg:block" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Page Hero Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-maroon-700">
            EXPLORE
          </p>
          <h1 className="text-4xl sm:text-6xl font-serif font-extrabold tracking-tight text-heading">
            All <span className="text-maroon-700">Destinations</span>
          </h1>
          <p className="text-sm sm:text-base text-body leading-relaxed font-sans max-w-xl mx-auto">
            {lang === 'zh'
              ? '踏上佛教八大圣地朝圣之旅，亲临佛陀成道、说法与涅槃的神圣遗迹。'
              : 'Embark on a sacred journey across holy sites where Lord Buddha lived, taught, and attained enlightenment.'}
          </p>
        </ScrollReveal>

        {/* Large Centered Search Bar Box */}
        <div className="max-w-3xl mx-auto font-sans">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
            <input
              type="text"
              placeholder={
                lang === 'zh' ? '搜索圣地目的地... (如: 菩提伽耶 / Gaya)' : 'Search destinations...'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-5 py-4 rounded-2xl border border-card-border bg-white text-sm sm:text-base text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-maroon-700/30 shadow-md transition-all font-sans"
            />
          </div>
        </div>

        {/* Destination Grid */}
        <div className="pt-4">
          {loading ? (
            <div className="py-24 flex items-center justify-center text-body space-x-2 text-xs font-sans">
              <Loader2 className="h-6 w-6 animate-spin text-saffron-500" />
              <span>Loading destinations...</span>
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="premium-card py-24 text-center text-body text-sm p-8 font-sans">
              {lang === 'zh' ? '未找到符合条件的朝圣圣地' : 'No destinations match your search.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 font-sans">
              {filteredDestinations.map((dest, idx) => (
                <ScrollReveal key={dest._id} delay={(idx % 3) * 0.08}>
                  <Link
                    to={`/destinations/${dest.slug}`}
                    className="premium-card group overflow-hidden flex flex-col justify-between cursor-pointer h-full"
                  >
                    <div>
                      {/* Cover Image */}
                      <div className="relative h-60 overflow-hidden bg-beige">
                        <img
                          src={
                            dest.coverImage ||
                            'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
                          }
                          alt={dest.name?.en}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>

                      {/* Card Body: Destination Name + Short Paragraph */}
                      <div className="p-8 space-y-2.5">
                        {/* Destination Name */}
                        <h3 className="font-serif font-extrabold text-heading text-2xl group-hover:text-maroon-700 transition-colors">
                          {dest.name?.[lang] || dest.name?.en}
                        </h3>

                        {/* Short Paragraph */}
                        <p className="text-body text-xs sm:text-sm line-clamp-2 leading-relaxed font-sans">
                          {dest.famousFor?.[lang] || dest.significance?.[lang] || dest.famousFor?.en}
                        </p>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
