import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import TourCard from '../components/TourCard';
import DestinationSearch from '../components/DestinationSearch';
import FeedbackSection from '../components/FeedbackSection';
import ScrollReveal from '../components/Decor/ScrollReveal';
import { WaveDivider, OrnamentDivider } from '../components/Decor/SectionDivider';
import Watermark from '../components/Decor/Watermark';
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


const FEATURED_DESTINATION_SLUGS = [
  'bodh-gaya',
  'sarnath',
  'lumbini',
  'kushinagar',
  'nalanda',
  'rajgir',
  'shravasti',
  'agra',
];

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sacredSites, setSacredSites] = useState([]);
  const [sacredSitesLoading, setSacredSitesLoading] = useState(true);

  // Cloudinary images for the homepage hero background slideshow
  const heroSlides = [
    {
      image: 'https://res.cloudinary.com/dzb5izmbr/image/upload/v1785779505/sarnath-varanasi-1-attr-hero_cj1isp.jpg'
    },
    {
      image: 'https://res.cloudinary.com/dzb5izmbr/image/upload/v1785180317/bodhipath_homepage/iux0yylfugxgpitkn3l2.jpg'
    },
    {
      image: 'https://res.cloudinary.com/dzb5izmbr/image/upload/v1785180099/bodhipath_homepage/drdbhqgqrjs8ptwk701q.jpg'
    },
    {
      image: 'https://res.cloudinary.com/dzb5izmbr/image/upload/v1785073805/bodhipath_homepage/fkd5wvjzkc60riw9ep5n.jpg'
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

 
  useEffect(() => {
    const fetchSacredSites = async () => {
      try {
        setSacredSitesLoading(true);
        const { data } = await api.get('/api/destinations');
        const bySlug = new Map((Array.isArray(data) ? data : []).map((dest) => [dest.slug, dest]));
        setSacredSites(
          FEATURED_DESTINATION_SLUGS.map((slug) => bySlug.get(slug)).filter(Boolean)
        );
      } catch (err) {
        console.error('Error fetching sacred sites:', err);
      } finally {
        setSacredSitesLoading(false);
      }
    };

    fetchSacredSites();
  }, []);

  return (
    <div className="flex flex-col font-sans bg-ivory">
      {/* 1. DYNAMIC HERO SECTION WITH DESTINATION BACKGROUND SLIDESHOW */}
      <section className="relative overflow-hidden bg-heading text-white min-h-155 lg:min-h-180 flex items-center justify-center py-20 sm:py-28">
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
              className="w-full h-full object-cover"
            />
            {/* Subtle dark overlay for text contrast — no white fade */}
            <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/25 to-black/20" />
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
            <p className="text-base sm:text-xl text-beige mb-10 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-md">
              {t('hero.pitch')}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/tours"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-maroon-700 hover:bg-maroon-800 text-white font-bold rounded-2xl border border-[#9F2845] transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer text-base"
              >
                {t('hero.exploreBtn')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              {user ? (
                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-2xl border border-white/30 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
                >
                  {t('hero.planBtn')}
                </Link>
              ) : (
                <Link
                  to="/login?next=/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-2xl border border-white/30 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
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

      <WaveDivider fill="#F8F5EE" />

      {/* 2. FEATURED TOURS / TOUR PACKAGES */}
      <section className="relative overflow-hidden py-24 sm:py-28 bg-ivory text-heading">
        <Watermark variant="dharma" size={460} className="-top-16 -right-24 hidden lg:block" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-heading mb-4">
              {t('featured.title')}
            </h2>
            <p className="text-body leading-relaxed font-sans">
              {t('featured.subtitle')}
            </p>
          </ScrollReveal>

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 text-saffron-500 animate-spin mb-4" />
              <p className="text-sm text-body font-medium">
                {i18n.language === 'zh' ? '正在为您加载路线...' : 'Loading pilgrimage tours...'}
              </p>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-2xl p-6 text-center max-w-md mx-auto">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {/* Tour grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
              {tours.map((tour, idx) => (
                <ScrollReveal key={tour._id} delay={idx * 0.08} className="h-full">
                  <TourCard tour={tour} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="relative overflow-hidden py-24 sm:py-28 bg-beige border-y border-card-border text-heading">
        <Watermark variant="lotus" size={380} className="-bottom-20 -left-20 hidden lg:block" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-6">
            <OrnamentDivider variant="lotus" className="mb-6" />
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-heading">
              {t('whyUs.title')}
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
            {/* Card 1: Chinese Speaking Guide */}
            <ScrollReveal delay={0} className="premium-card flex flex-col items-center text-center p-8">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-maroon-700/10 text-maroon-700 mb-5 border border-maroon-700/20">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold font-serif text-heading mb-2">{t('whyUs.guideTitle')}</h3>
              <p className="text-xs sm:text-sm text-body leading-relaxed font-sans">{t('whyUs.guideDesc')}</p>
            </ScrollReveal>

            {/* Card 2: Quality Hotels */}
            <ScrollReveal delay={0.08} className="premium-card flex flex-col items-center text-center p-8">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-maroon-700/10 text-maroon-700 mb-5 border border-maroon-700/20">
                <Hotel className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold font-serif text-heading mb-2">{t('whyUs.hotelTitle')}</h3>
              <p className="text-xs sm:text-sm text-body leading-relaxed font-sans">{t('whyUs.hotelDesc')}</p>
            </ScrollReveal>

            {/* Card 3: All Meals Included */}
            <ScrollReveal delay={0.16} className="premium-card flex flex-col items-center text-center p-8">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-maroon-700/10 text-maroon-700 mb-5 border border-maroon-700/20">
                <UtensilsCrossed className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold font-serif text-heading mb-2">{t('whyUs.mealTitle')}</h3>
              <p className="text-xs sm:text-sm text-body leading-relaxed font-sans">{t('whyUs.mealDesc')}</p>
            </ScrollReveal>

            {/* Card 4: Comfortable Transport */}
            <ScrollReveal delay={0.24} className="premium-card flex flex-col items-center text-center p-8">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-maroon-700/10 text-maroon-700 mb-5 border border-maroon-700/20">
                <Bus className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold font-serif text-heading mb-2">{t('whyUs.transportTitle')}</h3>
              <p className="text-xs sm:text-sm text-body leading-relaxed font-sans">{t('whyUs.transportDesc')}</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. POPULAR DESTINATIONS (SACRED SITES STRIP) */}
      <section className="relative overflow-hidden py-24 sm:py-28 bg-white text-heading">
        <Watermark variant="mountain" size={520} className="-bottom-24 right-0 hidden lg:block" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-heading mb-4">
              {t('sacredSites.title')}
            </h2>
            <p className="text-body leading-relaxed font-sans">
              {t('sacredSites.subtitle')}
            </p>
          </ScrollReveal>

          {/* 8 Site Grid */}
          {sacredSitesLoading ? (
            <div className="flex items-center justify-center py-12 text-body space-x-2 text-xs">
              <Loader2 className="h-5 w-5 animate-spin text-saffron-500" />
              <span>{i18n.language === 'zh' ? '正在加载圣地...' : 'Loading sacred sites...'}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {sacredSites.map((dest, idx) => {
                const displayName = dest.name?.[lang] || dest.name?.en;
                return (
                  <ScrollReveal key={dest._id || dest.slug} delay={(idx % 4) * 0.08}>
                    <Link
                      to={`/destinations/${dest.slug}`}
                      className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-md hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 cursor-pointer block border border-card-border hover:border-maroon-700/40"
                    >
                      {/* Background image */}
                      <img
                        src={dest.coverImage}
                        alt={displayName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                      {/* Site label */}
                      <div className="absolute bottom-5 left-5 right-5 flex items-start gap-2 text-white">
                        <MapPin className="h-5 w-5 text-saffron-500 shrink-0 mt-0.5" />
                        <span className="text-base sm:text-lg font-serif font-bold leading-tight group-hover:text-saffron-500 transition-colors">
                          {displayName}
                        </span>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          )}

          {/* View All Destinations CTA Button */}
          <div className="mt-12 text-center">
            <Link
              to="/destinations"
              className="inline-flex items-center justify-center space-x-2 bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-base px-8 py-4 rounded-2xl border border-[#9F2845] transition-all shadow-xl hover:scale-105 cursor-pointer"
            >
              <span>{i18n.language === 'zh' ? '查看所有朝圣目的地' : 'View All Destinations'}</span>
              <ArrowRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. PILGRIM TESTIMONIALS / FEEDBACK */}
      <FeedbackSection />

      {/* 6. CONTACT CTA BAND */}
      <section className="relative overflow-hidden py-24 sm:py-32 bg-white">
        <Watermark variant="temple" size={420} className="-bottom-16 -left-16 hidden lg:block" />
        <Watermark variant="lotus" size={340} className="-top-12 -right-12 hidden lg:block" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal className="premium-card overflow-hidden p-8 sm:p-16 text-center text-heading">
            <OrnamentDivider variant="dharma" className="mb-6" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <Compass className="h-12 w-12 text-saffron-500 mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mb-4 text-heading">
                {t('cta.title')}
              </h2>
              <p className="text-body mb-8 leading-relaxed text-sm sm:text-base font-sans">
                {t('cta.desc')}
              </p>

              {user ? (
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-maroon-700 hover:bg-maroon-800 text-white font-bold rounded-2xl border border-[#9F2845] transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer text-base"
                >
                  {t('cta.contactBtn')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <Link
                  to="/login?next=/contact"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-maroon-700 hover:bg-maroon-800 text-white font-bold rounded-2xl border border-[#9F2845] transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer text-base"
                >
                  {t('cta.contactBtn')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
