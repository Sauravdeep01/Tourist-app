import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Compass,
  MapPin,
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

// Executive metrics and platform summary tab
export default function OverviewTab({ stats, inquiries, tours, destinations, owners, setActiveTab }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // Stat summary cards definition
  const statCards = [
    {
      title: t('dashboard.stats.totalTours'),
      value: stats?.toursCount ?? tours.length,
      icon: Compass,
      color: 'from-maroon-700 to-maroon-900',
      textColor: 'text-maroon-700',
      bgLight: 'bg-maroon-50',
      actionTab: 'tours',
    },
    {
      title: t('dashboard.stats.totalDestinations'),
      value: stats?.destinationsCount ?? destinations.length,
      icon: MapPin,
      color: 'from-saffron-500 to-saffron-700',
      textColor: 'text-saffron-600',
      bgLight: 'bg-saffron-50',
      actionTab: 'destinations',
    },
    {
      title: t('dashboard.stats.totalInquiries'),
      value: stats?.inquiriesCount ?? inquiries.length,
      icon: MessageSquare,
      color: 'from-amber-600 to-amber-800',
      textColor: 'text-amber-600',
      bgLight: 'bg-amber-50',
      actionTab: 'inquiries',
    },
    {
      title: t('dashboard.stats.totalOwners'),
      value: stats?.ownersCount ?? owners.length,
      icon: Users,
      color: 'from-emerald-600 to-emerald-800',
      textColor: 'text-emerald-600',
      bgLight: 'bg-emerald-50',
      actionTab: 'owners',
    },
  ];

  // Calculate inquiry status breakdown
  const newInquiries = inquiries.filter((i) => i.status === 'new').length;
  const processingInquiries = inquiries.filter((i) => i.status === 'processing').length;
  const confirmedInquiries = inquiries.filter((i) => i.status === 'confirmed').length;

  return (
    <div className="space-y-6">
      {/* Top metrics summary grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => setActiveTab(card.actionTab)}
              className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl ${card.bgLight} ${card.textColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                  {card.value}
                </span>
                <span className="text-xs text-neutral-400 group-hover:text-maroon-700 flex items-center gap-0.5 font-medium transition-colors">
                  View <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main dashboard content section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Inquiries */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-neutral-900 text-base">
                {lang === 'zh' ? '最新咨询动态' : 'Recent Inquiries'}
              </h3>
              <p className="text-xs text-neutral-500">
                {lang === 'zh' ? '朝圣者的最新报价申请' : 'Latest tourist quote requests'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('inquiries')}
              className="text-xs font-medium text-maroon-700 hover:text-maroon-800 transition-colors"
            >
              {lang === 'zh' ? '查看全部' : 'View All'} →
            </button>
          </div>

          {/* Inquiries list */}
          {inquiries.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 text-sm">
              {lang === 'zh' ? '暂无新咨询记录' : 'No recent inquiries found.'}
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.slice(0, 5).map((inquiry) => (
                <div
                  key={inquiry._id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="h-9 w-9 rounded-full bg-maroon-100 text-maroon-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {inquiry.touristName?.[0]?.toUpperCase() || 'T'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {inquiry.touristName}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {inquiry.touristEmail} • {inquiry.pax || 1} pax
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        inquiry.status === 'new'
                          ? 'bg-amber-100 text-amber-700'
                          : inquiry.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {t(`dashboard.status.${inquiry.status}`)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Platform Status & Highlights */}
        <div className="space-y-6">
          {/* Inquiry Pipeline Breakdown */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs">
            <h3 className="font-bold text-neutral-900 text-base mb-4">
              {lang === 'zh' ? '咨询处理状态' : 'Inquiry Pipeline'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                <div className="flex items-center space-x-2 text-xs font-semibold text-amber-900">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span>{t('dashboard.status.new')}</span>
                </div>
                <span className="font-bold text-sm text-amber-800">{newInquiries}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                <div className="flex items-center space-x-2 text-xs font-semibold text-blue-900">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span>{t('dashboard.status.processing')}</span>
                </div>
                <span className="font-bold text-sm text-blue-800">{processingInquiries}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>{t('dashboard.status.confirmed')}</span>
                </div>
                <span className="font-bold text-sm text-emerald-800">{confirmedInquiries}</span>
              </div>
            </div>
          </div>

          {/* System Info Banner */}
          <div className="bg-gradient-to-br from-maroon-900 to-saffron-900 text-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center space-x-2 text-saffron-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Bodhipath Platform</span>
            </div>
            <h4 className="font-bold text-sm text-white mb-1">
              {lang === 'zh' ? '朝圣路线与报价控制中心' : 'Pilgrimage Operations active'}
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              {lang === 'zh'
                ? '支持全程中文导游、五星大巴与印度/尼泊尔多圣地报价。'
                : 'Managing Chinese-guided pilgrimage tours across India & Nepal sacred sites.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
