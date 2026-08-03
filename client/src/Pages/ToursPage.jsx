import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import TourCard from '../components/TourCard';
import ScrollReveal from '../components/Decor/ScrollReveal';
import Watermark from '../components/Decor/Watermark';
import { Compass, Loader2, Search, AlertCircle, Sparkles } from 'lucide-react';

export default function ToursPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch active tours from backend endpoint
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.get('/api/tours');
        const list = Array.isArray(data) ? data : data.tours || [];
        setTours(list);
      } catch (err) {
        console.error('Error fetching tours:', err);
        setError(
          lang === 'zh'
            ? '无法加载朝圣路线，请检查网络后再试。'
            : 'Failed to load pilgrimage packages. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [lang]);

  // Filter tours by search query
  const filteredTours = tours.filter((t) => {
    const term = searchQuery.toLowerCase();
    const titleEn = (t.title?.en || '').toLowerCase();
    const titleZh = (t.title?.zh || '').toLowerCase();
    const overviewEn = (t.overview?.en || '').toLowerCase();
    const overviewZh = (t.overview?.zh || '').toLowerCase();
    return (
      titleEn.includes(term) ||
      titleZh.includes(term) ||
      overviewEn.includes(term) ||
      overviewZh.includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-ivory text-heading py-24 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-212.5 h-100 bg-maroon-700/5 blur-[150px] rounded-full pointer-events-none" />
      <Watermark variant="dharma" size={440} className="top-24 -right-28 hidden lg:block" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Page Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-maroon-700/10 text-maroon-700 border border-maroon-700/20 text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="h-4 w-4 text-saffron-500 animate-spin-slow" />
            <span>{lang === 'zh' ? '正觉朝圣 · 线路指南' : 'HOLY PILGRIMAGE CIRCUITS'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-extrabold tracking-tight text-heading leading-tight">
            {lang === 'zh' ? (
              <>精选佛陀圣地 <span className="text-maroon-700">朝圣参学路线</span></>
            ) : (
              <>Explore Sacred <span className="text-maroon-700">Pilgrimage Journeys</span></>
            )}
          </h1>

          <p className="text-base sm:text-lg text-body leading-relaxed font-sans max-w-2xl mx-auto">
            {lang === 'zh'
              ? '专为华语朝圣团员打造的印度与尼泊尔佛教八大圣地巡礼路线，包含全套高标准清净膳宿、全程持牌中文导游与豪华空调巴士。'
              : 'Immerse yourself in our curated pilgrimage circuits covering the holy places of Lord Buddha across India & Nepal with certified Chinese-speaking guides.'}
          </p>

          {/* Interactive Search Bar */}
          <div className="relative max-w-md mx-auto pt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'zh' ? '搜索朝圣路线或城市...' : 'Search circuits or cities...'}
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white border border-card-border text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-maroon-700/30 shadow-md transition-all font-sans"
            />
          </div>
        </ScrollReveal>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-body space-y-3 font-sans">
            <Loader2 className="h-8 w-8 animate-spin text-saffron-500" />
            <p className="text-sm font-medium">
              {lang === 'zh' ? '正在加载朝圣路线信息...' : 'Fetching pilgrimage journeys...'}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm max-w-lg mx-auto flex items-center gap-3 shadow-md font-sans">
            <AlertCircle className="h-6 w-6 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* PILGRIMAGE JOURNEYS GRID */}
        {!loading && !error && (
          <div>
            {filteredTours.length === 0 ? (
              <div className="premium-card text-center py-16 p-8 max-w-md mx-auto font-sans">
                <Sparkles className="h-10 w-10 text-saffron-500 mx-auto mb-3" />
                <p className="text-sm text-body font-medium">
                  {lang === 'zh' ? '未找到符合条件的朝圣路线' : 'No pilgrimage journeys match your search.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {filteredTours.map((tour, idx) => (
                  <ScrollReveal key={tour._id || tour.slug} delay={(idx % 4) * 0.08} className="h-full">
                    <TourCard tour={tour} />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
