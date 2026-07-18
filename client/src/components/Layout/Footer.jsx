import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import { CONTACT_DETAILS } from '../../utils/constants';
import { L } from '../../utils/lang';
import { Phone, Mail, MessageSquare, Compass, Shield, Heart } from 'lucide-react';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);

  return (
    <footer className="bg-neutral-900 text-neutral-400 border-t border-neutral-800">
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
              <span className="font-semibold text-lg tracking-wide text-saffron-500">APPL Travel</span>
            </div>
            <p className="text-sm italic font-serif mb-4">
              "{t('footer.tagline')}"
            </p>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {L(CONTACT_DETAILS.address, i18n.language)}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              {i18n.language === 'zh' ? '快速链接' : 'Quick Links'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-saffron-500 transition-colors flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-neutral-500" /> {t('navbar.home')}
                </Link>
              </li>
              <li>
                <Link to="/tours" className="hover:text-saffron-500 transition-colors flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-neutral-500" /> {t('navbar.tours')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-saffron-500 transition-colors flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-neutral-500" /> {t('navbar.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-saffron-500 transition-colors flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-neutral-500" /> {t('navbar.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Access */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              {t('navbar.contact')}
            </h3>
            {user ? (
              <ul className="space-y-3 text-sm">
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-saffron-500 shrink-0" />
                  <span>{t('footer.phone')}: <a href={`tel:${CONTACT_DETAILS.phone}`} className="hover:underline hover:text-white">{CONTACT_DETAILS.phone}</a></span>
                </li>
                <li className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-saffron-500 shrink-0" />
                  <span>{t('footer.whatsapp')}: <a href={`https://wa.me/${CONTACT_DETAILS.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white">{CONTACT_DETAILS.phone}</a></span>
                </li>
                <li className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-saffron-500 shrink-0" />
                  <span>{t('footer.wechat')}: <span className="font-mono text-white">{CONTACT_DETAILS.wechatId}</span></span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-saffron-500 shrink-0" />
                  <span>{t('footer.email')}: <a href={`mailto:${CONTACT_DETAILS.email}`} className="hover:underline hover:text-white">{CONTACT_DETAILS.email}</a></span>
                </li>
              </ul>
            ) : (
              <div className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700/50 text-sm">
                <Shield className="h-5 w-5 text-saffron-500 mb-2" />
                <p className="mb-3 text-xs leading-relaxed">
                  {i18n.language === 'zh' ? '为了保障安全及防止垃圾信息，我们的联系电话、微信及 WhatsApp 仅对注册用户开放。' : 'To maintain security and prevent spam, our direct contact channels (Phone, WeChat, WhatsApp) are visible only to registered accounts.'}
                </p>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-saffron-600 hover:bg-saffron-700 text-neutral-900 font-medium text-xs rounded-md transition-colors"
                >
                  {t('cta.signupPrompt')}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-8 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500">
          <p>{t('footer.copyright')}</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            {i18n.language === 'zh' ? '心怀敬意，追寻佛迹' : 'With reverence and devotion'} <Heart className="h-3 w-3 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
