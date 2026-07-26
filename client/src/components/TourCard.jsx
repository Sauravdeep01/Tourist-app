import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { L } from '../utils/lang';
import { Calendar, ArrowRight, Star } from 'lucide-react';

export default function TourCard({ tour }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // Render prices according to C-7 / FE-7 rules
  const hasPrice = tour.priceFrom !== null && tour.priceFrom !== undefined;
  
  // Format price string: e.g. "From US$ 1,285" or "US$ 1,285 起" or "Price on request" / "价格面议"
  const priceLabel = hasPrice
    ? (lang === 'zh' ? `US$ ${tour.priceFrom} ${t('featured.priceFrom')}` : `${t('featured.priceFrom')} US$ ${tour.priceFrom}`)
    : t('featured.priceOnRequest');

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-white shadow-xs border border-neutral-100 hover-lift glass-card transition-all duration-300">
      {/* Cover Image with Badge overlay */}
      <div className="relative h-56 overflow-hidden bg-neutral-200">
        {tour.coverImage ? (
          <img
            src={tour.coverImage}
            alt={L(tour.title, lang)}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-maroon-900 to-saffron-700 flex items-center justify-center text-white">
            <span className="font-serif text-lg tracking-wider">APPL Travel</span>
          </div>
        )}
        
        {/* Most Popular Badge (for featured = true tours like the 11-day package) */}
        {tour.featured && (
          <span className="absolute top-4 left-4 bg-saffron-500 text-neutral-950 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 animate-pulse">
            <Star className="h-3.5 w-3.5 fill-current text-neutral-950" />
            {t('featured.mostPopular')}
          </span>
        )}

        {/* Days & Nights Duration Badge */}
        <span className="absolute bottom-4 right-4 bg-neutral-950/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 text-saffron-400" />
          {tour.days} {t('featured.days')} / {tour.nights} {t('featured.nights')}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          {/* Tour Title */}
          <h3 className="text-xl font-bold text-neutral-900 mb-1 line-clamp-1">
            {L(tour.title, lang)}
          </h3>
          
          {/* Subtitle / Route line */}
          <p className="text-sm font-semibold text-maroon-700 mb-3 line-clamp-1">
            {L(tour.subtitle, lang)}
          </p>

          {/* Overview text */}
          <p className="text-sm text-neutral-600 mb-4 line-clamp-3 leading-relaxed">
            {L(tour.overview, lang)}
          </p>
        </div>

        {/* Bottom Section: Pricing Details & CTA Button */}
        <div>
          <div className="h-px bg-neutral-100 my-4" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                {lang === 'zh' ? '起步价格' : 'Starting Price'}
              </p>
              <p className="text-lg font-bold text-saffron-600">
                {priceLabel}
              </p>
            </div>

            <Link
              to={`/tours/${tour.slug}`}
              className="inline-flex items-center justify-center gap-1.5 bg-maroon-700 hover:bg-maroon-800 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors shadow-xs group"
            >
              {t('featured.viewDetails')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* C-7 Mandatory Disclaimer line for all prices */}
          <p className="mt-3 text-[10px] text-neutral-400 leading-tight">
            * {t('featured.disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
}
