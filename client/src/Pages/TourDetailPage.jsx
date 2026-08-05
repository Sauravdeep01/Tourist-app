import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { L } from '../utils/lang';
import api from '../utils/api';
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Loader2,
  AlertCircle,
  ArrowRight,
  Utensils,
  Hotel,
  ShieldCheck,
  Star,
  Send,
  Compass
} from 'lucide-react';

export default function TourDetailPage() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDay, setOpenDay] = useState(0); // Open Day 1 by default

  // Fetch single tour by slug from backend
  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.get(`/api/tours/${slug}`);
        setTour(data);
      } catch (err) {
        console.error('Error fetching tour detail:', err);
        setError(
          lang === 'zh'
            ? '未找到该朝圣路线详情，请检查链接后再试。'
            : 'Pilgrimage package not found.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [slug, lang]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center text-body space-y-3 font-sans">
        <Loader2 className="h-8 w-8 animate-spin text-saffron-500" />
        <p className="text-sm font-medium">
          {lang === 'zh' ? '正在加载朝圣路线详细行程...' : 'Loading tour details...'}
        </p>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-[70vh] bg-ivory flex flex-col items-center justify-center p-6 text-center text-heading font-sans">
        <div className="bg-white p-8 rounded-3xl border border-card-border shadow-xl max-w-md w-full space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-2xl font-serif font-bold text-heading">
            {lang === 'zh' ? '路线未找到' : 'Package Not Found'}
          </h2>
          <p className="text-xs text-body leading-relaxed font-sans">
            {error || (lang === 'zh' ? '抱歉，无法找到您请求的朝圣路线。' : 'Sorry, the requested tour package could not be found.')}
          </p>
          <Link
            to="/tours"
            className="inline-flex items-center justify-center w-full bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs px-6 py-3 rounded-2xl border border-[#9F2845] transition-all shadow-md cursor-pointer"
          >
            {lang === 'zh' ? '返回所有朝圣路线' : 'Return to All Tours'}
          </Link>
        </div>
      </div>
    );
  }

  const hasPrice = tour.priceFrom !== null && tour.priceFrom !== undefined;
  const priceLabel = hasPrice
    ? (lang === 'zh' ? `US$ ${tour.priceFrom} 起` : `From US$ ${tour.priceFrom}`)
    : (lang === 'zh' ? '价格面议' : 'Price on request');

  return (
    <div className="min-h-screen bg-ivory text-heading py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-212.5 h-100 bg-maroon-700/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Breadcrumb Back Link */}
        <div>
          <Link
            to="/tours"
            className="inline-flex items-center text-xs font-bold text-body hover:text-maroon-700 transition-colors"
          >
            ← {lang === 'zh' ? '返回所有朝圣路线' : 'Back to All Pilgrimage Circuits'}
          </Link>
        </div>

        {/* 1. HERO COVER BANNER */}
        <div className="relative rounded-3xl overflow-hidden bg-white border border-card-border shadow-xl">
          <div className="relative h-80 sm:h-105 overflow-hidden bg-beige">
            {tour.coverImage ? (
              <img
                src={tour.coverImage}
                alt={L(tour.title, lang)}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-maroon-700 to-saffron-500 flex items-center justify-center">
                <span className="font-serif text-2xl text-white">Bodhipath Travels</span>
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

            {/* Badges Overlay */}
            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
              {tour.featured && (
                <span className="bg-maroon-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-current text-saffron-500" />
                  {lang === 'zh' ? '热推朝圣路线' : 'Featured Journey'}
                </span>
              )}
              <span className="bg-white/90 backdrop-blur-md text-heading text-xs font-semibold px-3 py-1.5 rounded-full border border-card-border flex items-center gap-1.5 shadow-xs">
                <Calendar className="h-3.5 w-3.5 text-saffron-500" />
                {tour.days} {lang === 'zh' ? '天' : 'Days'} / {tour.nights} {lang === 'zh' ? '晚' : 'Nights'}
              </span>
            </div>

            {/* Title & Price Header on Hero */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white leading-tight drop-shadow-md">
                  {L(tour.title, lang)}
                </h1>
                <p className="text-base sm:text-lg font-semibold text-saffron-500">
                  {L(tour.subtitle, lang)}
                </p>
              </div>

              <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-right shrink-0">
                <p className="text-[11px] text-beige uppercase tracking-wider font-semibold">
                  {lang === 'zh' ? '起步团费' : 'Starting Rate'}
                </p>
                <p className="text-2xl font-extrabold text-saffron-500 font-serif">
                  {priceLabel}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. QUICK STATS & CITY STAYS BAR */}
        <div className="bg-white p-6 rounded-3xl border border-card-border shadow-md space-y-4 font-sans">
          <div className="border-b border-card-border pb-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-saffron-500" />
              <h3 className="text-base font-serif font-bold text-heading">
                {lang === 'zh' ? '圣地巡礼城市路线' : 'Sacred City Circuit'}
              </h3>
            </div>
          </div>

          {/* City Stays Pills */}
          <div className="flex flex-wrap gap-2">
            {tour.cityStays && tour.cityStays.map((stay, idx) => (
              <span
                key={idx}
                className="bg-beige text-heading border border-card-border px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <MapPin className="h-3.5 w-3.5 text-saffron-500" />
                <span>{L(stay.city, lang)}:</span>
                <span className="text-maroon-700 font-bold">{stay.nights} {lang === 'zh' ? '晚' : 'Nights'}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 3. OVERVIEW SECTION */}
        <div className="bg-white p-8 rounded-3xl border border-card-border shadow-md space-y-4 font-sans">
          <h2 className="text-2xl font-serif font-bold text-heading flex items-center gap-2">
            <Compass className="h-5 w-5 text-saffron-500" />
            <span>{lang === 'zh' ? '行程概要与参学亮点' : 'Circuit Overview & Highlights'}</span>
          </h2>
          <p className="text-sm sm:text-base text-body leading-relaxed font-sans">
            {L(tour.overview, lang)}
          </p>
        </div>

        {/* 4. DAY-BY-DAY VERTICAL ALTERNATING TIMELINE */}
        <div className="bg-white p-6 sm:p-12 rounded-3xl border border-card-border shadow-lg space-y-10 font-sans">
          <div className="border-b border-card-border pb-6 text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-heading flex items-center justify-center gap-2">
              <Calendar className="h-6 w-6 text-saffron-500" />
              <span>{lang === 'zh' ? '逐日神圣朝圣行程画卷' : 'Sacred Pilgrimage Timeline'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-body">
              {lang === 'zh'
                ? '沿着佛陀示现的圣迹时光轴，探索每日参学安排与城市路线。'
                : 'Follow the chronological pilgrimage timeline across holy destinations.'}
            </p>
          </div>

          {/* Vertical Timeline Container */}
          <div className="relative max-w-5xl mx-auto py-4">
            {/* Center Glowing Line (Desktop) & Left Line (Mobile) */}
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-1 bg-linear-to-b from-maroon-700 via-saffron-500 to-maroon-700 rounded-full shadow-xs" />

            <div className="space-y-12 relative z-10">
              {tour.itinerary && tour.itinerary.map((dayItem, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div
                    key={idx}
                    className={`relative flex flex-col md:flex-row items-center ${
                      isEven ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Left/Right Card Container */}
                    <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                      <div className="bg-ivory p-6 sm:p-8 rounded-3xl border border-card-border hover:border-maroon-700/40 shadow-md transition-all duration-300 space-y-4">
                        {/* Day & City Badges */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-card-border pb-3">
                          <span className="bg-maroon-700 text-white px-3.5 py-1 rounded-xl font-extrabold text-xs tracking-wider uppercase shadow-xs">
                            DAY {dayItem.day < 10 ? `0${dayItem.day}` : dayItem.day}
                          </span>
                          {dayItem.accommodationCity && (
                            <span className="text-xs font-semibold text-body flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-saffron-500" />
                              <span>{L(dayItem.accommodationCity, lang)}</span>
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-serif font-bold text-heading">
                          {L(dayItem.title, lang)}
                        </h3>

                        {/* Meals if available */}
                        {dayItem.meals && (
                          <div className="flex items-center gap-2 text-xs text-maroon-700 font-semibold bg-white px-3 py-1.5 rounded-xl border border-card-border w-fit shadow-xs">
                            <Utensils className="h-3.5 w-3.5 text-saffron-500 shrink-0" />
                            <span>{L(dayItem.meals, lang)}</span>
                          </div>
                        )}

                        {/* Activities List */}
                        <div className="space-y-2.5 pt-1 text-xs sm:text-sm">
                          {dayItem.activities && dayItem.activities.map((act, aIdx) => (
                            <div key={aIdx} className="flex items-start space-x-2.5">
                              <div className="h-2 w-2 rounded-full bg-saffron-500 mt-2 shrink-0 shadow-xs" />
                              <div className="leading-relaxed text-body">
                                {act.category && (
                                  <span className="font-bold text-maroon-700 mr-1.5">
                                    [{L(act.category, lang)}]
                                  </span>
                                )}
                                <span>{L(act.description, lang)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Timeline Interactive Node Dot */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-6 flex items-center justify-center shrink-0 z-20">
                      <span className="absolute h-9 w-9 rounded-full bg-maroon-700/20 animate-ping pointer-events-none" />
                      <div className="h-7 w-7 rounded-full bg-maroon-700 border-4 border-white shadow-md flex items-center justify-center shrink-0 relative z-10">
                        <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5. INCLUSIONS & EXCLUSIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
          {/* Inclusions */}
          <div className="bg-white p-8 rounded-3xl border border-card-border shadow-md space-y-4">
            <h3 className="text-xl font-serif font-bold text-jade-500 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>{lang === 'zh' ? '费用包含 (Inclusions)' : 'What Is Included'}</span>
            </h3>

            <div className="space-y-3">
              {tour.includes && tour.includes.map((inc, idx) => (
                <div key={idx} className="bg-[#F9F7F2] p-3.5 rounded-2xl border border-card-border text-xs">
                  <p className="font-bold text-heading mb-0.5">{L(inc.item, lang)}</p>
                  <p className="text-body leading-relaxed">{L(inc.details, lang)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusions */}
          <div className="bg-white p-8 rounded-3xl border border-card-border shadow-md space-y-4">
            <h3 className="text-xl font-serif font-bold text-red-600 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              <span>{lang === 'zh' ? '费用不含 (Exclusions)' : 'What Is Excluded'}</span>
            </h3>

            <div className="space-y-3">
              {tour.excludes && tour.excludes.map((exc, idx) => (
                <div key={idx} className="bg-[#F9F7F2] p-3.5 rounded-2xl border border-card-border text-xs">
                  <p className="font-bold text-heading mb-0.5">{L(exc.item, lang)}</p>
                  <p className="text-body leading-relaxed">{L(exc.details, lang)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. BOTTOM BOOKING CTA CARD */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-card-border shadow-xl text-center space-y-6 font-sans">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-heading">
              {lang === 'zh' ? '预订此朝圣路线 · 获取精确报价' : 'Ready to Book This Pilgrimage Journey?'}
            </h2>
            <p className="text-sm text-body leading-relaxed font-sans">
              {lang === 'zh'
                ? '立即提交报价咨询，我们的高级朝圣顾问将根据您的出发日期与团员人数为您提供精确方案。'
                : 'Submit your inquiry now for a personalized itinerary and guaranteed quote response within 24 hours.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={`/contact?tourId=${tour._id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-maroon-700 hover:bg-maroon-800 active:scale-95 text-white font-bold text-sm px-8 py-3.5 rounded-2xl border border-[#9F2845] transition-all shadow-md cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>{lang === 'zh' ? '提交本路线报价申请' : 'Request Quote for This Circuit'}</span>
            </Link>

            <Link
              to="/tours"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-beige hover:bg-card-border text-heading font-bold text-sm px-8 py-3.5 rounded-2xl border border-card-border transition-all shadow-xs cursor-pointer"
            >
              <span>{lang === 'zh' ? '查看其他路线' : 'Explore Other Circuits'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
