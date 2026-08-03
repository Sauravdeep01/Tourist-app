import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CONTACT_DETAILS } from '../../utils/constants';
import { L } from '../../utils/lang';
import { Phone, Mail, MessageSquare, Compass, Heart } from 'lucide-react';

export default function Footer() {
  const { t, i18n } = useTranslation();

  return (
    <footer className="bg-[#1F1A17] text-[#C9C2B8] border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Brand Info */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-4">
              <svg
                className="h-6 w-6 text-saffron-500"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" />
                <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="6" />
                <circle cx="50" cy="50" r="4" fill="currentColor" />
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
              <span className="font-serif font-bold text-lg tracking-wide text-white">Bodhipath Tour & Travels</span>
            </div>
            <p className="text-sm italic font-serif text-[#C9C2B8] mb-4">
              "{t('footer.tagline')}"
            </p>
            <p className="text-xs text-[#9C948A] leading-relaxed">
              {L(CONTACT_DETAILS.address, i18n.language)}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-saffron-500 font-serif text-sm font-bold tracking-wider uppercase mb-4">
              {i18n.language === 'zh' ? '快速链接' : 'Quick Links'}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-saffron-500 transition-colors flex items-center gap-1.5 text-[#C9C2B8]">
                  <Compass className="h-4 w-4 text-saffron-500" /> {t('navbar.home')}
                </Link>
              </li>
              <li>
                <Link to="/tours" className="hover:text-saffron-500 transition-colors flex items-center gap-1.5 text-[#C9C2B8]">
                  <Compass className="h-4 w-4 text-saffron-500" /> {t('navbar.tours')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-saffron-500 transition-colors flex items-center gap-1.5 text-[#C9C2B8]">
                  <Compass className="h-4 w-4 text-saffron-500" /> {t('navbar.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-saffron-500 transition-colors flex items-center gap-1.5 text-[#C9C2B8]">
                  <Compass className="h-4 w-4 text-saffron-500" /> {t('navbar.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Access */}
          <div>
            <h3 className="text-saffron-500 font-serif text-sm font-bold tracking-wider uppercase mb-4">
              {t('navbar.contact')}
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-[#C9C2B8]">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-saffron-500 shrink-0" />
                <span>{t('footer.phone')}: <a href={`tel:${CONTACT_DETAILS.phone.replace(/\s+/g, '')}`} className="hover:underline hover:text-saffron-500">{CONTACT_DETAILS.phone}</a></span>
              </li>
              <li className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-saffron-500 shrink-0" />
                <span>{t('footer.whatsapp')}: <a href={`https://wa.me/${CONTACT_DETAILS.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-saffron-500">{CONTACT_DETAILS.whatsappDisplay}</a></span>
              </li>
              <li className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-saffron-500 shrink-0" />
                <span>{t('footer.wechat')}: <span className="font-mono text-white font-medium">{CONTACT_DETAILS.wechatId}</span></span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-saffron-500 shrink-0" />
                <span>{t('footer.email')}: <a href={`mailto:${CONTACT_DETAILS.email}`} className="hover:underline hover:text-saffron-500">{CONTACT_DETAILS.email}</a></span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9C948A]">
          <p>{t('footer.copyright')}</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            {i18n.language === 'zh' ? '心怀敬意，追寻佛迹' : 'With reverence and devotion'} <Heart className="h-3 w-3 text-saffron-500 fill-saffron-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
