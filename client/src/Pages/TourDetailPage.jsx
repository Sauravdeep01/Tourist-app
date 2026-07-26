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
      <div className="min-h-screen bg-[#0b0f17] flex flex-col items-center justify-center text-slate-400 space-y-3 font-sans">
        <Loader2 className="h-8 w-8 animate-spin text-saffron-400" />
        <p className="text-sm font-medium">
          {lang === 'zh' ? '正在加载朝圣路线详细行程...' : 'Loading tour details...'}
        </p>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-[70vh] bg-[#0b0f17] flex flex-col items-center justify-center p-6 text-center text-white font-sans">
        <div className="bg-[#161f30] p-8 rounded-3xl border border-slate-800 shadow-2xl max-w-md w-full space-y-4">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
          <h2 className="text-2xl font-serif font-bold">
            {lang === 'zh' ? '路线未找到' : 'Package Not Found'}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            {error || (lang === 'zh' ? '抱歉，无法找到您请求的朝圣路线。' : 'Sorry, the requested tour package could not be found.')}
          </p>
          <Link
            to="/tours"
            className="inline-flex items-center justify-center w-full bg-saffron-500 hover:bg-saffron-600 text-neutral-950 font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer"
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
    <div className="min-h-screen bg-[#0b0f17] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-saffron-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Breadcrumb Back Link */}
        <div>
          <Link
            to="/tours"
            className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-saffron-400 transition-colors"
          >
            ← {lang === 'zh' ? '返回所有朝圣路线' : 'Back to All Pilgrimage Circuits'}
          </Link>
        </div>

        {/* 1. HERO COVER BANNER */}
        <div className="relative rounded-3xl overflow-hidden bg-[#161f30] border border-slate-800 shadow-2xl">
          <div className="relative h-80 sm:h-[420px] overflow-hidden bg-slate-900">
            {tour.coverImage ? (
              <img
                src={tour.coverImage}
                alt={L(tour.title, lang)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-maroon-900 to-slate-900 flex items-center justify-center">
                <span className="font-serif text-2xl text-saffron-400">APPL Travel</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-black/50 to-transparent" />

            {/* Badges Overlay */}
            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
              {tour.featured && (
                <span className="bg-saffron-500 text-neutral-950 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-current text-neutral-950" />
                  {lang === 'zh' ? '热推朝圣路线' : 'Featured Journey'}
                </span>
              )}
              <span className="bg-slate-950/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-saffron-400" />
                {tour.days} {lang === 'zh' ? '天' : 'Days'} / {tour.nights} {lang === 'zh' ? '晚' : 'Nights'}
              </span>
            </div>

            {/* Title & Price Header on Hero */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white leading-tight drop-shadow-md">
                  {L(tour.title, lang)}
                </h1>
                <p className="text-base sm:text-lg font-semibold text-saffron-400">
                  {L(tour.subtitle, lang)}
                </p>
              </div>

              <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-right shrink-0">
                <p className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                  {lang === 'zh' ? '起步团费' : 'Starting Rate'}
                </p>
                <p className="text-2xl font-extrabold text-saffron-400 font-serif">
                  {priceLabel}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. QUICK STATS & CITY STAYS BAR */}
        <div className="bg-[#161f30] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-saffron-400" />
              <h3 className="text-base font-serif font-bold text-white">
                {lang === 'zh' ? '圣地巡礼城市路线' : 'Sacred City Circuit'}
              </h3>
            </div>
          </div>

          {/* City Stays Pills */}
          <div className="flex flex-wrap gap-2">
            {tour.cityStays && tour.cityStays.map((stay, idx) => (
              <span
                key={idx}
                className="bg-[#192235] text-slate-200 border border-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <MapPin className="h-3.5 w-3.5 text-saffron-400" />
                <span>{L(stay.city, lang)}:</span>
                <span className="text-saffron-400 font-bold">{stay.nights} {lang === 'zh' ? '晚' : 'Nights'}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 3. OVERVIEW SECTION */}
        <div className="bg-[#161f30] p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <Compass className="h-5 w-5 text-saffron-400" />
            <span>{lang === 'zh' ? '行程概要与参学亮点' : 'Circuit Overview & Highlights'}</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            {L(tour.overview, lang)}
          </p>
        </div>

        {/* 4. DAY-BY-DAY VERTICAL ALTERNATING TIMELINE */}
        <div className="bg-[#161f30] p-6 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl space-y-10">
          <div className="border-b border-slate-800 pb-6 text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white flex items-center justify-center gap-2">
              <Calendar className="h-6 w-6 text-saffron-400" />
              <span>{lang === 'zh' ? '逐日神圣朝圣行程画卷' : 'Sacred Pilgrimage Timeline'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {lang === 'zh'
                ? '沿着佛陀示现的圣迹时光轴，探索每日参学安排与城市路线。'
                : 'Follow the chronological pilgrimage timeline across holy destinations.'}
            </p>
          </div>

          {/* Vertical Timeline Container */}
          <div className="relative max-w-5xl mx-auto py-4">
            {/* Center Glowing Line (Desktop) & Left Line (Mobile) */}
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-saffron-500 via-amber-400 to-saffron-600 rounded-full shadow-[0_0_12px_rgba(255,159,0,0.5)]" />

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
                      <div className="bg-[#192235] p-6 sm:p-8 rounded-3xl border border-saffron-500/30 hover:border-saffron-400 shadow-2xl transition-all duration-300 space-y-4">
                        {/* Day & City Badges */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                          <span className="bg-saffron-500 text-neutral-950 px-3.5 py-1 rounded-xl font-extrabold text-xs tracking-wider uppercase shadow-md">
                            DAY {dayItem.day < 10 ? `0${dayItem.day}` : dayItem.day}
                          </span>
                          {dayItem.accommodationCity && (
                            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-saffron-400" />
                              <span>{L(dayItem.accommodationCity, lang)}</span>
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                          {L(dayItem.title, lang)}
                        </h3>

                        {/* Meals if available */}
                        {dayItem.meals && (
                          <div className="flex items-center gap-2 text-xs text-saffron-300 font-medium bg-[#161f30] px-3 py-1.5 rounded-xl border border-slate-800 w-fit">
                            <Utensils className="h-3.5 w-3.5 text-saffron-400 shrink-0" />
                            <span>{L(dayItem.meals, lang)}</span>
                          </div>
                        )}

                        {/* Activities List */}
                        <div className="space-y-2.5 pt-1 text-xs sm:text-sm">
                          {dayItem.activities && dayItem.activities.map((act, aIdx) => (
                            <div key={aIdx} className="flex items-start space-x-2.5">
                              <div className="h-2 w-2 rounded-full bg-saffron-400 mt-2 shrink-0 shadow-sm" />
                              <div className="leading-relaxed text-slate-300">
                                {act.category && (
                                  <span className="font-bold text-saffron-400 mr-1.5">
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

                    {/* Timeline Interactive Blinking Node Dot */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-6 flex items-center justify-center shrink-0 z-20">
                      {/* Animated Blinking Outer Ring */}
                      <span className="absolute h-9 w-9 rounded-full bg-saffron-400/50 animate-ping pointer-events-none" />
                      
                      {/* Inner Round Node */}
                      <div className="h-7 w-7 rounded-full bg-saffron-500 border-4 border-[#0b0f17] shadow-[0_0_15px_rgba(255,159,0,0.9)] flex items-center justify-center shrink-0 relative z-10">
                        <div className="h-2 w-2 rounded-full bg-neutral-950 animate-pulse" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5. INCLUSIONS & EXCLUSIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inclusions */}
          <div className="bg-[#161f30] p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xl font-serif font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>{lang === 'zh' ? '费用包含 (Inclusions)' : 'What Is Included'}</span>
            </h3>

            <div className="space-y-3">
              {tour.includes && tour.includes.map((inc, idx) => (
                <div key={idx} className="bg-[#192235] p-3.5 rounded-2xl border border-slate-800 text-xs">
                  <p className="font-bold text-white mb-0.5">{L(inc.item, lang)}</p>
                  <p className="text-slate-300 leading-relaxed">{L(inc.details, lang)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusions */}
          <div className="bg-[#161f30] p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xl font-serif font-bold text-red-400 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              <span>{lang === 'zh' ? '费用不含 (Exclusions)' : 'What Is Excluded'}</span>
            </h3>

            <div className="space-y-3">
              {tour.excludes && tour.excludes.map((exc, idx) => (
                <div key={idx} className="bg-[#192235] p-3.5 rounded-2xl border border-slate-800 text-xs">
                  <p className="font-bold text-white mb-0.5">{L(exc.item, lang)}</p>
                  <p className="text-slate-300 leading-relaxed">{L(exc.details, lang)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. BOTTOM BOOKING CTA CARD */}
        <div className="bg-gradient-to-br from-[#161f30] to-[#0d1320] p-8 sm:p-12 rounded-3xl border border-saffron-500/40 shadow-2xl text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white">
              {lang === 'zh' ? '预订此朝圣路线 · 获取精确报价' : 'Ready to Book This Pilgrimage Journey?'}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {lang === 'zh'
                ? '立即提交报价咨询，我们的高级朝圣顾问将根据您的出发日期与团员人数为您提供精确方案。'
                : 'Submit your inquiry now for a personalized itinerary and guaranteed quote response within 24 hours.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={`/contact?tourId=${tour._id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-saffron-500 hover:bg-saffron-600 active:scale-95 text-neutral-950 font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-xl cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>{lang === 'zh' ? '提交本路线报价申请' : 'Request Quote for This Circuit'}</span>
            </Link>

            <Link
              to="/tours"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#192235] hover:bg-slate-800 text-white font-bold text-sm px-8 py-3.5 rounded-xl border border-slate-700 transition-all shadow-md cursor-pointer"
            >
              <span>{lang === 'zh' ? '查看其他路线' : 'Explore Other Circuits'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
