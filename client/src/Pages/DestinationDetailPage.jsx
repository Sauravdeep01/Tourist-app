import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  ArrowLeft,
  Star,
  Sun,
  Calendar,
  Clock,
  Plane,
  CheckCircle2,
  Loader2,
  Sparkles,
  MessageCircle,
  Send
} from 'lucide-react';
import api from '../utils/api';
import ScrollReveal from '../components/Decor/ScrollReveal';
import Watermark from '../components/Decor/Watermark';

// Public destination detail page matching SRS specifications
export default function DestinationDetailPage() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch single destination by slug
  useEffect(() => {
    const fetchDestinationDetail = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/destinations/${slug}`);
        setDestination(data);
      } catch (err) {
        console.error('Failed to load destination detail:', err);
        setError('Destination not found');
      } finally {
        setLoading(false);
      }
    };
    fetchDestinationDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-ivory flex items-center justify-center text-body space-x-2 text-xs font-sans">
        <Loader2 className="h-5 w-5 animate-spin text-saffron-500" />
        <span>Loading sacred site details...</span>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-[70vh] bg-ivory flex flex-col items-center justify-center p-8 text-center space-y-4 font-sans text-heading">
        <h2 className="text-xl font-bold font-serif text-heading">Destination Not Found</h2>
        <Link
          to="/destinations"
          className="inline-flex items-center space-x-2 bg-maroon-700 text-white text-xs font-semibold px-4 py-2 rounded-2xl border border-[#9F2845]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Destinations</span>
        </Link>
      </div>
    );
  }

  const coverPhoto =
    destination.coverImage ||
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80';

  return (
    <div className="min-h-screen bg-ivory text-heading pb-16 font-sans">
      {/* 1. Hero Banner */}
      <div className="relative w-full h-[65vh] min-h-120 max-h-162.5 bg-black overflow-hidden">
        <img
          src={coverPhoto}
          alt={destination.name?.en}
          className="w-full h-full object-cover brightness-90 opacity-95 transition-transform duration-700 hover:scale-105"
        />

        {/* Crisp dark vignette overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/50" />

        {/* Back navigation button */}
        <div className="absolute top-24 left-4 sm:left-8 z-20">
          <Link
            to="/destinations"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-heading bg-white/90 hover:bg-white backdrop-blur-md px-4 py-2 rounded-full border border-card-border transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-maroon-700" />
            <span>{lang === 'zh' ? '返回所有圣地' : 'Back to Destinations'}</span>
          </Link>
        </div>

        {/* Hero title, rating, and location overlay */}
        <div className="absolute bottom-8 left-0 right-0 z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 bg-maroon-700 text-white font-bold px-3 py-1 rounded-full shadow-md">
              <MapPin className="h-3.5 w-3.5" />
              {destination.stateCountry?.[lang] || destination.stateCountry?.en}
            </span>

            {destination.rating > 0 && (
              <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md text-heading px-3 py-1 rounded-full border border-card-border font-bold shadow-md">
                <Star className="h-3.5 w-3.5 fill-saffron-500 text-saffron-500" />
                {destination.rating.toFixed(1)} / 5.0
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight drop-shadow-md">
            {destination.name?.[lang] || destination.name?.en}
          </h1>

          {destination.famousFor?.[lang] && (
            <p className="text-sm sm:text-lg text-saffron-500 font-medium flex items-center gap-1.5 drop-shadow-xs">
              <Sparkles className="h-4 w-4 text-saffron-500 shrink-0" />
              <span>{destination.famousFor[lang]}</span>
            </p>
          )}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">
        <Watermark variant="lotus" size={380} className="top-0 -right-24 hidden lg:block" />
        {/* 2. Quick Facts Strip */}
        <ScrollReveal className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {destination.rating > 0 && (
            <div className="premium-card p-4 space-y-1">
              <div className="flex items-center space-x-1 text-maroon-700 text-[11px] font-semibold uppercase">
                <Star className="h-3.5 w-3.5 fill-saffron-500 text-saffron-500" />
                <span>{lang === 'zh' ? '评分' : 'Rating'}</span>
              </div>
              <p className="text-xs text-heading font-bold">{destination.rating.toFixed(1)} / 5.0</p>
            </div>
          )}

          {destination.bestSeason?.[lang] && (
            <div className="premium-card p-4 space-y-1">
              <div className="flex items-center space-x-1 text-maroon-700 text-[11px] font-semibold uppercase">
                <Calendar className="h-3.5 w-3.5 text-saffron-500" />
                <span>{lang === 'zh' ? '最佳季节' : 'Best Season'}</span>
              </div>
              <p className="text-xs text-heading font-bold">{destination.bestSeason[lang]}</p>
            </div>
          )}

          {destination.visitDuration?.[lang] && (
            <div className="premium-card p-4 space-y-1">
              <div className="flex items-center space-x-1 text-maroon-700 text-[11px] font-semibold uppercase">
                <Clock className="h-3.5 w-3.5 text-saffron-500" />
                <span>{lang === 'zh' ? '建议行程' : 'Typical Visit'}</span>
              </div>
              <p className="text-xs text-heading font-bold">{destination.visitDuration[lang]}</p>
            </div>
          )}

          {destination.temperature?.winter?.[lang] && (
            <div className="premium-card p-4 space-y-1">
              <div className="flex items-center space-x-1 text-maroon-700 text-[11px] font-semibold uppercase">
                <Sun className="h-3.5 w-3.5 text-saffron-500" />
                <span>{lang === 'zh' ? '冬季气候' : 'Winter Climate'}</span>
              </div>
              <p className="text-xs text-heading font-bold">{destination.temperature.winter[lang]}</p>
            </div>
          )}

          {destination.nearestAirport?.[lang] && (
            <div className="premium-card p-4 space-y-1">
              <div className="flex items-center space-x-1 text-maroon-700 text-[11px] font-semibold uppercase">
                <Plane className="h-3.5 w-3.5 text-saffron-500" />
                <span>{lang === 'zh' ? '最近机场' : 'Airport'}</span>
              </div>
              <p className="text-xs text-heading font-bold">{destination.nearestAirport[lang]}</p>
            </div>
          )}

          {destination.significance?.[lang] && (
            <div className="premium-card p-4 space-y-1">
              <div className="flex items-center space-x-1 text-maroon-700 text-[11px] font-semibold uppercase">
                <Sparkles className="h-3.5 w-3.5 text-saffron-500" />
                <span>{lang === 'zh' ? '圣地功德' : 'Significance'}</span>
              </div>
              <p className="text-xs text-heading font-bold truncate">{destination.significance[lang]}</p>
            </div>
          )}
        </ScrollReveal>

        {/* 3 & 4. Long Description & Highlights List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Historical & Spiritual Significance Card */}
            {destination.significance?.[lang] && (
              <div className="premium-card p-8 space-y-3">
                <h3 className="text-lg font-serif font-bold text-heading border-b border-card-border pb-3 flex items-center gap-2">
                  <span>{lang === 'zh' ? '圣地历史功德与神圣意义' : 'Historical & Spiritual Significance'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-body leading-relaxed font-sans">
                  {destination.significance[lang]}
                </p>
              </div>
            )}

            {/* Detailed Story & Monuments Overview */}
            {destination.description?.[lang] && (
              <div className="premium-card p-8 space-y-3">
                <h3 className="text-lg font-serif font-bold text-heading border-b border-card-border pb-3">
                  {lang === 'zh' ? '圣地详细导览' : 'Sacred Site Overview'}
                </h3>
                <p className="text-xs sm:text-sm text-body leading-relaxed whitespace-pre-line font-sans">
                  {destination.description[lang]}
                </p>
              </div>
            )}
          </div>

          {/* Highlights Sidebar */}
          <div className="space-y-6">
            {Array.isArray(destination.highlights) && destination.highlights.length > 0 && (
              <div className="premium-card p-8 space-y-4 font-sans">
                <h3 className="text-base font-serif font-bold text-heading border-b border-card-border pb-2">
                  {lang === 'zh' ? '参学亮点' : 'Sacred Highlights'}
                </h3>
                <ul className="space-y-3 text-xs text-body">
                  {destination.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-saffron-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{item[lang] || item.en}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 6. Tours visiting this destination */}
        {Array.isArray(destination.relatedTours) && destination.relatedTours.length > 0 && (
          <div className="space-y-4 font-sans">
            <h3 className="text-xl font-serif font-bold text-heading">
              {lang === 'zh' ? '包含此圣地的朝圣路线' : 'Tours Visiting This Destination'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {destination.relatedTours.map((tour) => (
                <Link
                  key={tour._id}
                  to={`/tours/${tour.slug}`}
                  className="premium-card p-6 flex items-center justify-between group"
                >
                  <div>
                    <h4 className="font-bold text-heading text-sm group-hover:text-maroon-700 transition-colors">
                      {tour.title?.[lang] || tour.title?.en || tour.title}
                    </h4>
                    <p className="text-xs text-body mt-0.5">Explore full daily itinerary & package details</p>
                  </div>
                  <span className="text-xs font-semibold text-maroon-700 group-hover:translate-x-1 transition-transform">
                    View Tour →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 7. Call-To-Action Band */}
        <div className="premium-card bg-white text-heading p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 font-sans">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-maroon-700">
              {lang === 'zh' ? '亲自踏上这片圣土' : 'Walk Here Yourself'}
            </h3>
            <p className="text-xs sm:text-sm text-body max-w-xl">
              {lang === 'zh'
                ? '立即提交朝圣意向，或直接通过微信与WhatsApp与我们联系，定制您的专属印度尼泊尔朝圣之旅。'
                : 'Request a customized quote or talk directly with our pilgrimage travel specialist on WhatsApp.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs px-6 py-3.5 rounded-2xl border border-[#9F2845] shadow-md transition-all cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>{lang === 'zh' ? '获取报价与预订' : 'Request a Quote'}</span>
            </Link>

            <a
              href="https://wa.me/911204135777"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-jade-500 hover:bg-jade-600 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
