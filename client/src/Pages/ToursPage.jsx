import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import TourCard from '../components/TourCard';
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
    <div className="min-h-screen bg-[#0b0f17] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-saffron-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-500/20 text-saffron-300 border border-saffron-500/30 text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="h-4 w-4 text-saffron-400 animate-spin-slow" />
            <span>{lang === 'zh' ? '正觉朝圣 · 线路指南' : 'HOLY PILGRIMAGE CIRCUITS'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-extrabold tracking-tight text-white leading-tight">
            {lang === 'zh' ? (
              <>精选佛陀圣地 <span className="text-saffron-400">朝圣参学路线</span></>
            ) : (
              <>Explore Sacred <span className="text-saffron-400">Pilgrimage Journeys</span></>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-2xl mx-auto">
            {lang === 'zh'
              ? '专为华语朝圣团员打造的印度与尼泊尔佛教八大圣地巡礼路线，包含全套高标准清净膳宿、全程持牌中文导游与豪华空调巴士。'
              : 'Immerse yourself in our curated pilgrimage circuits covering the holy places of Lord Buddha across India & Nepal with certified Chinese-speaking guides.'}
          </p>

          {/* Interactive Search Bar */}
          <div className="relative max-w-md mx-auto pt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'zh' ? '搜索朝圣路线或城市...' : 'Search circuits or cities...'}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#161f30] border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-saffron-400 shadow-xl transition-all"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-saffron-400" />
            <p className="text-sm font-medium">
              {lang === 'zh' ? '正在加载朝圣路线信息...' : 'Fetching pilgrimage journeys...'}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-3xl bg-red-950/80 border border-red-800 text-red-300 text-sm max-w-lg mx-auto flex items-center gap-3 shadow-2xl">
            <AlertCircle className="h-6 w-6 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 2 PILGRIMAGE JOURNEYS GRID */}
        {!loading && !error && (
          <div>
            {filteredTours.length === 0 ? (
              <div className="text-center py-16 bg-[#161f30] rounded-3xl border border-slate-800 p-8 max-w-md mx-auto">
                <Sparkles className="h-10 w-10 text-saffron-400 mx-auto mb-3" />
                <p className="text-sm text-slate-300 font-medium">
                  {lang === 'zh' ? '未找到符合条件的朝圣路线' : 'No pilgrimage journeys match your search.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {filteredTours.map((tour) => (
                  <TourCard key={tour._id || tour.slug} tour={tour} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
