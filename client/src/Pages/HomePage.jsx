import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import TourCard from '../components/TourCard';
import { 
  Users, 
  Hotel, 
  UtensilsCrossed, 
  Bus, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Loader2,
  Compass
} from 'lucide-react';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch featured tours from the backend API
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/tours');
        // Backend returns active tours, featured first (per SRS 3.2)
        setTours(response.data);
      } catch (err) {
        console.error('Error fetching tours:', err);
        setError(i18n.language === 'zh' ? '加载路线失败，请稍后重试。' : 'Failed to load tours. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [i18n.language]);

  // Sacred Sites data with curated high-quality representational images
  const sacredSites = [
    { nameKey: 'sacredSites.bodhgaya', image: 'https://images.unsplash.com/photo-1545124445-53a55e756f4d?q=80&w=400&auto=format&fit=crop' },
    { nameKey: 'sacredSites.sarnath', image: 'https://images.unsplash.com/photo-1625316708582-7c38734be31d?q=80&w=400&auto=format&fit=crop' },
    { nameKey: 'sacredSites.lumbini', image: 'https://images.unsplash.com/photo-1596120206416-291885f81e3a?q=80&w=400&auto=format&fit=crop' },
    { nameKey: 'sacredSites.kushinagar', image: 'https://images.unsplash.com/photo-1608958416738-42289635fc9d?q=80&w=400&auto=format&fit=crop' },
    { nameKey: 'sacredSites.nalanda', image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=400&auto=format&fit=crop' },
    { nameKey: 'sacredSites.rajgir', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=400&auto=format&fit=crop' },
    { nameKey: 'sacredSites.shravasti', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=400&auto=format&fit=crop' },
    { nameKey: 'sacredSites.agra', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=400&auto=format&fit=crop' }
  ];

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-maroon-900 via-maroon-800 to-saffron-700 text-white py-24 sm:py-32">
        {/* Decorative background wheel */}
        <div className="absolute right-[-10%] top-[-10%] opacity-10 pointer-events-none animate-spin-slow">
          <svg className="w-[500px] h-[500px]" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line 
                key={deg}
                x1="50" 
                y1="50" 
                x2={50 + 30 * Math.sin((deg * Math.PI) / 180)} 
                y2={50 - 30 * Math.cos((deg * Math.PI) / 180)} 
                stroke="currentColor" 
                strokeWidth="2" 
              />
            ))}
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Dharma Wheel Icon Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-500/20 text-saffron-300 border border-saffron-500/30 text-xs font-semibold uppercase tracking-wider mb-6">
              <svg className="h-4 w-4 text-saffron-400 animate-spin-slow" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" />
                <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="6" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <line 
                    key={deg}
                    x1="50" 
                    y1="50" 
                    x2={50 + 30 * Math.sin((deg * Math.PI) / 180)} 
                    y2={50 - 30 * Math.cos((deg * Math.PI) / 180)} 
                    stroke="currentColor" 
                    strokeWidth="6" 
                  />
                ))}
              </svg>
              <span>{i18n.language === 'zh' ? '正觉朝圣之旅' : 'Noble Pilgrimage'}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight font-sans drop-shadow-md">
              {t('hero.title')}
            </h1>

            {/* Pitch */}
            <p className="text-lg sm:text-xl text-neutral-200 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
              {t('hero.pitch')}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/tours"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-saffron-500 hover:bg-saffron-600 text-neutral-950 font-bold rounded-xl transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer text-base"
              >
                {t('hero.exploreBtn')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              {user ? (
                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
                >
                  {t('hero.planBtn')}
                </Link>
              ) : (
                <Link
                  to="/login?next=/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
                >
                  {t('hero.planBtn')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED TOURS */}
      <section className="py-20 bg-[#faf9f6]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-4">
              {t('featured.title')}
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              {t('featured.subtitle')}
            </p>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 text-maroon-700 animate-spin mb-4" />
              <p className="text-sm text-neutral-500 font-medium">
                {i18n.language === 'zh' ? '正在为您加载路线...' : 'Loading pilgrimage tours...'}
              </p>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {/* Tour grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
              {tours.map((tour) => (
                <TourCard key={tour._id} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. WHY TRAVEL WITH US */}
      <section className="py-20 bg-white border-y border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-4">
              {t('whyUs.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1: Chinese Speaking Guide */}
            <div className="flex flex-col items-center text-center p-6 bg-stone-50/50 hover:bg-stone-50 rounded-2xl border border-neutral-100 hover-lift transition-all">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-maroon-50 text-maroon-700 mb-5 shadow-xs">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">{t('whyUs.guideTitle')}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{t('whyUs.guideDesc')}</p>
            </div>

            {/* Card 2: Quality Hotels */}
            <div className="flex flex-col items-center text-center p-6 bg-stone-50/50 hover:bg-stone-50 rounded-2xl border border-neutral-100 hover-lift transition-all">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-saffron-50 text-saffron-700 mb-5 shadow-xs">
                <Hotel className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">{t('whyUs.hotelTitle')}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{t('whyUs.hotelDesc')}</p>
            </div>

            {/* Card 3: All Meals Included */}
            <div className="flex flex-col items-center text-center p-6 bg-stone-50/50 hover:bg-stone-50 rounded-2xl border border-neutral-100 hover-lift transition-all">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-maroon-50 text-maroon-700 mb-5 shadow-xs">
                <UtensilsCrossed className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">{t('whyUs.mealTitle')}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{t('whyUs.mealDesc')}</p>
            </div>

            {/* Card 4: Comfortable Transport */}
            <div className="flex flex-col items-center text-center p-6 bg-stone-50/50 hover:bg-stone-50 rounded-2xl border border-neutral-100 hover-lift transition-all">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-saffron-50 text-saffron-700 mb-5 shadow-xs">
                <Bus className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">{t('whyUs.transportTitle')}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{t('whyUs.transportDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SACRED SITES STRIP */}
      <section className="py-20 bg-[#faf9f6]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-4">
              {t('sacredSites.title')}
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              {t('sacredSites.subtitle')}
            </p>
          </div>

          {/* 8 Site Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sacredSites.map((site, index) => (
              <div 
                key={index} 
                className="group relative h-48 rounded-2xl overflow-hidden shadow-xs hover-lift transition-all cursor-pointer"
              >
                {/* Background image */}
                <img 
                  src={site.image} 
                  alt={t(site.nameKey)} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                
                {/* Site label */}
                <div className="absolute bottom-4 left-4 right-4 flex items-start gap-1.5 text-white">
                  <MapPin className="h-4.5 w-4.5 text-saffron-400 shrink-0 mt-0.5" />
                  <span className="text-sm font-bold leading-tight group-hover:text-saffron-300 transition-colors">
                    {t(site.nameKey)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL-TO-ACTION BAND */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-maroon-800 to-maroon-950 p-8 sm:p-16 text-center text-white shadow-xl">
            {/* Background design */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ff9f00_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <Compass className="h-12 w-12 text-saffron-400 mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-white">
                {t('cta.title')}
              </h2>
              <p className="text-neutral-300 mb-8 leading-relaxed text-sm sm:text-base">
                {t('cta.desc')}
              </p>

              {/* Inquiry routing with gating (FE-9) */}
              {user ? (
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-saffron-500 hover:bg-saffron-600 text-neutral-950 font-bold rounded-xl transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer text-base"
                >
                  {t('cta.contactBtn')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <Link
                  to="/login?next=/contact"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-saffron-500 hover:bg-saffron-600 text-neutral-950 font-bold rounded-xl transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer text-base"
                >
                  {t('cta.contactBtn')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
