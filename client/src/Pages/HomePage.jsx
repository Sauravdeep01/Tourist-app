import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import TourCard from '../components/TourCard';
import DestinationSearch from '../components/DestinationSearch';
import FeedbackSection from '../components/FeedbackSection';
import { 
  Users, 
  Hotel, 
  UtensilsCrossed, 
  Bus, 
  MapPin, 
  ArrowRight, 
  Loader2,
  Compass
} from 'lucide-react';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Dynamic Cloudinary images for the homepage hero background slideshow
  const heroSlides = [
    {
      image: 'https://res.cloudinary.com/dzb5izmbr/image/upload/v1785073805/bodhipath_homepage/fkd5wvjzkc60riw9ep5n.jpg'
    },
    {
      image: 'https://res.cloudinary.com/dzb5izmbr/image/upload/v1785073806/bodhipath_homepage/dgflnzl2jtalykwy5bml.jpg'
    },
    {
      image: 'https://res.cloudinary.com/dzb5izmbr/image/upload/v1785180317/bodhipath_homepage/iux0yylfugxgpitkn3l2.jpg'
    },
    {
      image: 'https://res.cloudinary.com/dzb5izmbr/image/upload/v1785180099/bodhipath_homepage/drdbhqgqrjs8ptwk701q.jpg'
    },
    {
      image: 'https://res.cloudinary.com/dzb5izmbr/image/upload/v1785183708/636bac4c9c7e80680e077f24jpeg_kjlbew.jpg'
    }
  ];

  // Auto cross-fade slides smoothly every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Fetch featured tours from backend
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/tours');
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

  // Sacred Sites data
  const sacredSites = [
    { slug: 'bodh-gaya', nameKey: 'sacredSites.bodhgaya', image: 'https://images.unsplash.com/photo-1545124445-53a55e756f4d?q=80&w=400&auto=format&fit=crop' },
    { slug: 'sarnath', nameKey: 'sacredSites.sarnath', image: 'https://images.unsplash.com/photo-1625316708582-7c38734be31d?q=80&w=400&auto=format&fit=crop' },
    { slug: 'lumbini', nameKey: 'sacredSites.lumbini', image: 'https://images.unsplash.com/photo-1596120206416-291885f81e3a?q=80&w=400&auto=format&fit=crop' },
    { slug: 'kushinagar', nameKey: 'sacredSites.kushinagar', image: 'https://images.unsplash.com/photo-1608958416738-42289635fc9d?q=80&w=400&auto=format&fit=crop' },
    { slug: 'nalanda', nameKey: 'sacredSites.nalanda', image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=400&auto=format&fit=crop' },
    { slug: 'rajgir', nameKey: 'sacredSites.rajgir', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=400&auto=format&fit=crop' },
    { slug: 'shravasti', nameKey: 'sacredSites.shravasti', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=400&auto=format&fit=crop' },
    { slug: 'agra', nameKey: 'sacredSites.agra', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=400&auto=format&fit=crop' }
  ];

  return (
    <div className="flex flex-col">
      {/* 1. DYNAMIC HERO SECTION WITH DESTINATION BACKGROUND SLIDESHOW */}
      <section className="relative overflow-hidden bg-[#0b0f17] text-white min-h-[620px] lg:min-h-[720px] flex items-center justify-center py-20 sm:py-28">
        {/* Dynamic Background Slideshow */}
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-2000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 scale-105' : 'opacity-0 scale-100 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt=""
              className="w-full h-full object-cover brightness-75"
            />
            {/* Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-black/45 to-black/50" />
          </div>
        ))}

        {/* Hero Content Overlay */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center max-w-3xl mx-auto">
            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-serif font-extrabold tracking-tight text-white mb-6 leading-tight drop-shadow-lg">
              {t('hero.title')}
            </h1>

            {/* Pitch */}
            <p className="text-base sm:text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-md">
              {t('hero.pitch')}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/tours"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-saffron-500 hover:bg-saffron-600 text-neutral-950 font-bold rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer text-base"
              >
                {t('hero.exploreBtn')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              {user ? (
                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
                >
                  {t('hero.planBtn')}
                </Link>
              ) : (
                <Link
                  to="/login?next=/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
                >
                  {t('hero.planBtn')}
                </Link>
              )}
            </div>

            {/* Hero Live Destination Search Box */}
            <DestinationSearch />
          </div>
        </div>
      </section>

      {/* 2. FEATURED TOURS */}
      <section className="py-20 bg-[#0b0f17] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              {t('featured.title')}
            </h2>
            <p className="text-slate-400 leading-relaxed font-sans">
              {t('featured.subtitle')}
            </p>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 text-saffron-400 animate-spin mb-4" />
              <p className="text-sm text-slate-400 font-medium">
                {i18n.language === 'zh' ? '正在为您加载路线...' : 'Loading pilgrimage tours...'}
              </p>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="bg-red-950/80 text-red-300 border border-red-800 rounded-xl p-6 text-center max-w-md mx-auto">
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
      <section className="py-20 bg-[#131b2e] border-y border-slate-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              {t('whyUs.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1: Chinese Speaking Guide */}
            <div className="flex flex-col items-center text-center p-6 bg-[#161f30] rounded-2xl border border-slate-800 hover:border-saffron-400/50 transition-all">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-saffron-500/10 text-saffron-400 mb-5 border border-saffron-500/20">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('whyUs.guideTitle')}</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-sans">{t('whyUs.guideDesc')}</p>
            </div>

            {/* Card 2: Quality Hotels */}
            <div className="flex flex-col items-center text-center p-6 bg-[#161f30] rounded-2xl border border-slate-800 hover:border-saffron-400/50 transition-all">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-saffron-500/10 text-saffron-400 mb-5 border border-saffron-500/20">
                <Hotel className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('whyUs.hotelTitle')}</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-sans">{t('whyUs.hotelDesc')}</p>
            </div>

            {/* Card 3: All Meals Included */}
            <div className="flex flex-col items-center text-center p-6 bg-[#161f30] rounded-2xl border border-slate-800 hover:border-saffron-400/50 transition-all">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-saffron-500/10 text-saffron-400 mb-5 border border-saffron-500/20">
                <UtensilsCrossed className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('whyUs.mealTitle')}</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-sans">{t('whyUs.mealDesc')}</p>
            </div>

            {/* Card 4: Comfortable Transport */}
            <div className="flex flex-col items-center text-center p-6 bg-[#161f30] rounded-2xl border border-slate-800 hover:border-saffron-400/50 transition-all">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-saffron-500/10 text-saffron-400 mb-5 border border-saffron-500/20">
                <Bus className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('whyUs.transportTitle')}</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-sans">{t('whyUs.transportDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SACRED SITES STRIP */}
      <section className="py-20 bg-[#0b0f17] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              {t('sacredSites.title')}
            </h2>
            <p className="text-slate-400 leading-relaxed font-sans">
              {t('sacredSites.subtitle')}
            </p>
          </div>

          {/* 8 Site Grid - Increased card size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sacredSites.map((site) => (
              <Link 
                key={site.slug} 
                to={`/destinations/${site.slug}`}
                className="group relative h-64 sm:h-72 rounded-3xl overflow-hidden shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer block border border-slate-800 hover:border-saffron-400/50"
              >
                {/* Background image */}
                <img 
                  src={site.image} 
                  alt={t(site.nameKey)} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                {/* Site label */}
                <div className="absolute bottom-5 left-5 right-5 flex items-start gap-2 text-white">
                  <MapPin className="h-5 w-5 text-saffron-400 shrink-0 mt-0.5" />
                  <span className="text-base sm:text-lg font-serif font-bold leading-tight group-hover:text-saffron-300 transition-colors">
                    {t(site.nameKey)}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Destinations CTA Button */}
          <div className="mt-12 text-center">
            <Link
              to="/destinations"
              className="inline-flex items-center justify-center space-x-2 bg-saffron-500 hover:bg-saffron-600 active:scale-95 text-neutral-950 font-bold text-base px-8 py-4 rounded-2xl transition-all shadow-xl hover:scale-105 cursor-pointer"
            >
              <span>{i18n.language === 'zh' ? '查看所有朝圣目的地' : 'View All Destinations'}</span>
              <ArrowRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. PILGRIM TESTIMONIALS / FEEDBACK */}
      <FeedbackSection />

      {/* 6. CALL-TO-ACTION BAND */}
      <section className="py-16 sm:py-24 bg-[#0b0f17]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#161f30] to-[#0d1320] p-8 sm:p-16 text-center text-white shadow-2xl border border-slate-800">
            {/* Background design */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ff9f00_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <Compass className="h-12 w-12 text-saffron-400 mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-white">
                {t('cta.title')}
              </h2>
              <p className="text-slate-300 mb-8 leading-relaxed text-sm sm:text-base font-sans">
                {t('cta.desc')}
              </p>

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
