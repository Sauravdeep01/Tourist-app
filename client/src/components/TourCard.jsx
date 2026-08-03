import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { L } from '../utils/lang';
import { Calendar, ArrowRight, Star } from 'lucide-react';

export default function TourCard({ tour }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const hasPrice = tour.priceFrom !== null && tour.priceFrom !== undefined;
  
  const priceLabel = hasPrice
    ? (lang === 'zh' ? `US$ ${tour.priceFrom} ${t('featured.priceFrom')}` : `${t('featured.priceFrom')} US$ ${tour.priceFrom}`)
    : t('featured.priceOnRequest');

  return (
    <div className="premium-card h-full flex flex-col overflow-hidden text-heading font-sans">
      {/* Cover Image with Badge overlay */}
      <div className="relative h-56 overflow-hidden bg-beige">
        {tour.coverImage ? (
          <img
            src={tour.coverImage}
            alt={L(tour.title, lang)}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-maroon-700 to-saffron-500 flex items-center justify-center text-white">
            <span className="font-serif text-lg tracking-wider font-bold">Bodhipath Travels</span>
          </div>
        )}
        
        {/* Most Popular Badge */}
        {tour.featured && (
          <span className="absolute top-4 left-4 bg-maroon-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-current text-saffron-500" />
            {t('featured.mostPopular')}
          </span>
        )}

        {/* Days & Nights Duration Badge */}
        <span className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs text-heading text-xs font-semibold px-2.5 py-1 rounded-xl flex items-center gap-1 border border-card-border shadow-xs">
          <Calendar className="h-3.5 w-3.5 text-saffron-500" />
          {tour.days} {t('featured.days')} / {tour.nights} {t('featured.nights')}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="p-8 grow flex flex-col">
        <div>
          {/* Tour Title */}
          <h3 className="text-xl font-serif font-bold text-heading mb-1 line-clamp-1">
            {L(tour.title, lang)}
          </h3>

          {/* Subtitle / Route line */}
          <p className="text-xs font-semibold text-maroon-700 mb-3 line-clamp-1">
            {L(tour.subtitle, lang)}
          </p>

          {/* Overview text */}
          <p className="text-xs sm:text-sm text-body mb-4 line-clamp-3 leading-relaxed font-sans">
            {L(tour.overview, lang)}
          </p>
        </div>

        {/* Bottom Section: Pricing Details & CTA Button — pinned to the card's
            bottom edge via mt-auto so price/CTA always align across cards of
            uneven content length in the same row. */}
        <div className="mt-auto">
          <div className="h-px bg-card-border my-4" />
          
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] text-muted uppercase tracking-wider font-semibold">
                {lang === 'zh' ? '起步价格' : 'Starting Price'}
              </p>
              <p className="text-base sm:text-lg font-bold text-maroon-700">
                {priceLabel}
              </p>
            </div>

            <Link
              to={`/tours/${tour.slug}`}
              className="inline-flex items-center justify-center gap-1.5 bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs px-4 py-2.5 rounded-2xl border border-[#9F2845] shadow-md transition-all group cursor-pointer"
            >
              {t('featured.viewDetails')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Disclaimer line */}
          <p className="mt-3 text-[10px] text-muted leading-tight">
            * {t('featured.disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
}
