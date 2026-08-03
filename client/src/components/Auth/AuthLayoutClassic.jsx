import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, MapPin, Compass, Users } from 'lucide-react';

function DharmaWheel({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" />
      <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="5" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="50"
          y1="50"
          x2={50 + 30 * Math.sin((deg * Math.PI) / 180)}
          y2={50 - 30 * Math.cos((deg * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="5"
        />
      ))}
    </svg>
  );
}

export default function AuthLayoutClassic({ eyebrow, heroTitle, heroSubtitle, children }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const toggleLanguage = () => {
    const nextLang = lang === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('lng', nextLang);
  };

  const stats = [
    { icon: MapPin, label: t('auth.statDestinations') },
    { icon: Compass, label: t('auth.statRoutes') },
    { icon: Users, label: t('auth.statGuides') },
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#faf9f6]">
      {/* Hero / brand panel — hidden on small screens to keep the form the focus */}
      <div className="hidden lg:flex relative overflow-hidden bg-linear-to-br from-maroon-950 via-maroon-800 to-saffron-700 text-white flex-col justify-between p-12 xl:p-16">
        {/* Decorative oversized wheel + mandala rings */}
        <DharmaWheel className="absolute -right-24 -top-24 h-112 w-md text-white/5 animate-[spin_90s_linear_infinite]" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -left-16 bottom-16 h-64 w-64 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute right-1/3 top-1/3 h-48 w-48 rounded-full border border-saffron-200/10" />

        {/* Brand lockup */}
        <Link to="/" className="relative z-10 flex items-center gap-2.5 group w-fit">
          <DharmaWheel className="h-9 w-9 text-saffron-300 transition-transform duration-700 group-hover:rotate-180" />
          <span className="font-serif text-xl tracking-wide">Bodhipath Tour &amp; Travels</span>
        </Link>

        {/* Hero copy */}
        <div className="relative z-10 max-w-md">
          <p className="text-saffron-300 text-xs font-semibold uppercase tracking-[0.2em] mb-4">{eyebrow}</p>
          <h1 className="font-serif text-4xl xl:text-[2.75rem] leading-tight mb-4">{heroTitle}</h1>
          <p className="text-white/70 text-sm leading-relaxed">{heroSubtitle}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            {stats.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm px-3.5 py-2 text-xs font-medium"
              >
                <Icon className="h-3.5 w-3.5 text-saffron-300" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <p className="relative z-10 text-sm italic font-serif text-white/60">
          "{t('footer.tagline')}"
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col min-h-screen px-6 py-8 sm:px-10 sm:py-10">
        {/* Top bar: mobile brand lockup + language toggle */}
        <div className="flex items-center justify-between mb-8 lg:mb-12">
          <Link to="/" className="flex items-center gap-2 lg:hidden group">
            <DharmaWheel className="h-7 w-7 text-saffron-500 transition-transform duration-700 group-hover:rotate-180" />
            <span className="font-semibold text-base tracking-wide bg-linear-to-r from-maroon-700 to-saffron-600 bg-clip-text text-transparent">
              Bodhipath Tour &amp; Travels
            </span>
          </Link>
          <Link to="/" className="hidden lg:block text-xs font-medium text-neutral-400 hover:text-maroon-700 transition-colors">
            ← {lang === 'zh' ? '返回首页' : 'Back to Home'}
          </Link>

          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-sm font-medium transition-all cursor-pointer"
          >
            <Globe className="h-4 w-4 text-neutral-500" />
            <span>{lang === 'zh' ? 'EN' : '中文'}</span>
          </button>
        </div>

        {/* Centered card */}
        <div className="grow flex items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
