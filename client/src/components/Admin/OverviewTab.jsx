import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Compass,
  MapPin,
  Image as ImageIcon,
  Users,
  UserPlus,
  User,
  Settings,
  MessageSquare,
  Clock,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import StatsCard from './StatsCard';
import ManagementCard from './ManagementCard';

export default function OverviewTab({
  stats,
  inquiries = [],
  tours = [],
  destinations = [],
  owners = [],
  onSelectTab,
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const toursCount = stats?.toursCount ?? tours.length ?? 28;
  const destinationsCount = stats?.destinationsCount ?? destinations.length ?? 35;
  const galleryCount = stats?.galleryCount ?? 143;
  const ownersCount = stats?.ownersCount ?? owners.length ?? 3;

  // 1. Statistics Cards Definition
  const statsList = [
    {
      title: 'Total Tours',
      value: `${toursCount} Active Tours`,
      description: 'Active travel packages listed on platform',
      icon: Compass,
      iconBg: 'bg-maroon-700/10 text-maroon-700',
      actionTab: 'tours',
    },
    {
      title: 'Gallery Images',
      value: `${galleryCount} Photos`,
      description: 'High-res pilgrimage photos uploaded',
      icon: ImageIcon,
      iconBg: 'bg-saffron-500/10 text-saffron-600',
      actionTab: 'gallery',
    },
    {
      title: 'Destinations',
      value: `${destinationsCount} Destinations`,
      description: 'Sacred sites across India & Nepal',
      icon: MapPin,
      iconBg: 'bg-amber-500/10 text-amber-600',
      actionTab: 'destinations',
    },
    {
      title: 'Owners',
      value: `${ownersCount} Registered Owners`,
      description: 'Staff & admin management accounts',
      icon: Users,
      iconBg: 'bg-emerald-500/10 text-emerald-600',
      actionTab: 'owners',
    },
  ];

  // 2. Management Cards Definition
  const managementCards = [
    {
      title: 'Add New Owner',
      description: 'Register a new website administrator who can manage tours and website content.',
      buttonText: 'Add Owner',
      icon: UserPlus,
      gradientBg: 'from-maroon-700 to-maroon-900',
      actionTab: 'owners',
    },
    {
      title: 'Manage Tours',
      description: 'Create, edit, delete, activate or deactivate travel packages.',
      buttonText: 'Manage Tours',
      icon: Compass,
      gradientBg: 'from-saffron-500 to-saffron-700',
      actionTab: 'tours',
    },
    {
      title: 'Destination Images',
      description: 'Upload and organize destination images that appear throughout the website.',
      buttonText: 'Manage Images',
      icon: MapPin,
      gradientBg: 'from-amber-600 to-amber-800',
      actionTab: 'destinations',
    },
    {
      title: 'Gallery Management',
      description: 'Upload, edit or delete gallery photos displayed on the website.',
      buttonText: 'Open Gallery',
      icon: ImageIcon,
      gradientBg: 'from-emerald-600 to-emerald-800',
      actionTab: 'gallery',
    },
    {
      title: 'Profile & Credentials',
      description: 'Update administrator personal details and security password.',
      buttonText: 'Manage Profile',
      icon: User,
      gradientBg: 'from-maroon-800 to-maroon-950',
      actionTab: 'profile',
    },
    {
      title: 'Website Settings',
      description: 'Manage global website settings and configurations for future features.',
      buttonText: 'Open Settings',
      icon: Settings,
      gradientBg: 'from-neutral-700 to-neutral-900',
      actionTab: 'settings',
    },
  ];

  // Inquiry pipeline stats
  const newInquiries = inquiries.filter((i) => i.status === 'new').length;
  const processingInquiries = inquiries.filter((i) => i.status === 'processing').length;
  const confirmedInquiries = inquiries.filter((i) => i.status === 'confirmed').length;

  return (
    <div className="space-y-10 font-sans animate-fade-up-in">
      {/* Section 1: Statistics Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted font-sans">
            Dashboard Statistics
          </h2>
          <span className="text-xs text-saffron-600 font-semibold bg-saffron-500/10 px-2.5 py-1 rounded-full">
            Real-time Metrics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statsList.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              iconBg={stat.iconBg}
              onClick={() => onSelectTab?.(stat.actionTab)}
            />
          ))}
        </div>
      </div>

      {/* Section 2: Management Grid */}
      <div>
        <div className="flex items-center justify-between mb-5 border-b border-card-border pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-heading">
              Website Management
            </h2>
            <p className="text-xs text-body font-sans mt-0.5">
              Quick access controls for all major platform administrative functions.
            </p>
          </div>
        </div>

        {/* 3 cols desktop, 2 cols tablet, 1 col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managementCards.map((card) => (
            <ManagementCard
              key={card.title}
              title={card.title}
              description={card.description}
              buttonText={card.buttonText}
              icon={card.icon}
              gradientBg={card.gradientBg}
              onClick={() => onSelectTab?.(card.actionTab)}
            />
          ))}
        </div>
      </div>

      {/* Section 3: Recent Activity & Inquiry Highlights */}
      <div className="grid lg:grid-cols-3 gap-6 pt-4 border-t border-card-border">
        {/* Recent Inquiries List */}
        <div className="lg:col-span-2 bg-white rounded-[20px] border border-card-border p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-heading text-base font-serif">
                {lang === 'zh' ? '最新咨询动态' : 'Recent Inquiries'}
              </h3>
              <p className="text-xs text-body mt-0.5 font-sans">
                {lang === 'zh' ? '朝圣者的最新报价申请与日程咨询' : 'Latest tourist quote requests and itinerary inquiries'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab?.('inquiries')}
              className="text-xs font-bold text-maroon-700 hover:text-maroon-800 transition-colors cursor-pointer"
            >
              {lang === 'zh' ? '查看全部' : 'View All'} →
            </button>
          </div>

          {inquiries.length === 0 ? (
            <div className="py-12 text-center text-muted text-xs italic bg-ivory/50 rounded-2xl border border-dashed border-card-border">
              {lang === 'zh' ? '暂无新咨询记录' : 'No recent inquiries registered.'}
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.slice(0, 4).map((inquiry) => (
                <div
                  key={inquiry._id}
                  onClick={() => onSelectTab?.('inquiries')}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-card-border/60 bg-ivory/50 hover:bg-beige transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="h-9 w-9 rounded-xl bg-maroon-700 text-white flex items-center justify-center font-serif font-bold text-xs shrink-0 shadow-xs">
                      {inquiry.touristName?.[0]?.toUpperCase() || 'T'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-heading">{inquiry.touristName}</p>
                      <p className="text-[11px] text-muted">
                        {inquiry.touristEmail} • {inquiry.pax || 1} pax
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                      inquiry.status === 'new'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : inquiry.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {t(`dashboard.status.${inquiry.status}`)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pipeline & Status Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-[20px] border border-card-border p-6 shadow-xs">
            <h3 className="font-bold text-heading text-base font-serif mb-4">
              Inquiry Pipeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200/60">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-900">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span>{t('dashboard.status.new')}</span>
                </div>
                <span className="font-extrabold text-sm text-amber-800">{newInquiries}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200/60">
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-900">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span>{t('dashboard.status.processing')}</span>
                </div>
                <span className="font-extrabold text-sm text-blue-800">{processingInquiries}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200/60">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>{t('dashboard.status.confirmed')}</span>
                </div>
                <span className="font-extrabold text-sm text-emerald-800">{confirmedInquiries}</span>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-maroon-900 via-maroon-950 to-saffron-950 text-white rounded-[20px] p-6 shadow-md relative overflow-hidden">
            <div className="flex items-center space-x-2 text-saffron-300 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="h-4 w-4 text-saffron-400" />
              <span>Bodhipath Operations</span>
            </div>
            <h4 className="font-serif font-bold text-sm text-white mb-1">
              Pilgrimage Platform Status
            </h4>
            <p className="text-xs text-white/80 leading-relaxed font-sans">
              All administrative tools online. Managing tour itineraries, site images, and staff accounts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
