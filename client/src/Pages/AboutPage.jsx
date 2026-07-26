import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Compass,
  Users,
  Hotel,
  UtensilsCrossed,
  Bus,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Heart,
  Globe2,
  Award,
  BookOpen
} from 'lucide-react';

export default function AboutPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [activeStep, setActiveStep] = useState(0);

  // The 4 Great Sacred Life Events & Sites
  const sacredEvents = [
    {
      title: { en: '1. Lumbini — Sacred Birthplace', zh: '1. 蓝毗尼 · 佛陀诞生地' },
      location: { en: 'Rupandehi, Nepal', zh: '尼泊尔鲁潘德希' },
      description: {
        en: 'Where Queen Mayadevi gave birth to Prince Siddhartha Gautama under the Sal trees in 623 BCE.',
        zh: '公元前623年，摩耶夫人于沙罗双树下诞下悉达多太子之地，立有阿育王石柱。'
      },
      image: 'https://images.unsplash.com/photo-1596120206416-291885f81e3a?q=80&w=1000&auto=format&fit=crop'
    },
    {
      title: { en: '2. Bodh Gaya — Supreme Enlightenment', zh: '2. 菩提伽耶 · 佛陀成道处' },
      location: { en: 'Bihar, India', zh: '印度比哈尔邦' },
      description: {
        en: 'Under the sacred Bodhi Tree, Prince Siddhartha attained supreme enlightenment and became the Buddha.',
        zh: '悉达多太子于圣菩提树下禅定开悟，成就无上正等正觉，此地建有金刚宝座与摩诃菩提寺。'
      },
      image: 'https://images.unsplash.com/photo-1545124445-53a55e756f4d?q=80&w=1000&auto=format&fit=crop'
    },
    {
      title: { en: '3. Sarnath — Turning the Dharma Wheel', zh: '3. 鹿野苑 · 初转法轮处' },
      location: { en: 'Varanasi, India', zh: '印度瓦拉纳西' },
      description: {
        en: 'The Deer Park where the Buddha delivered his first sermon on the Four Noble Truths to the 5 disciples.',
        zh: '佛陀于鹿野苑向五比丘宣讲“四圣谛”与“八正道”，三宝于此具足，佛法之轮从此开转。'
      },
      image: 'https://images.unsplash.com/photo-1625316708582-7c38734be31d?q=80&w=1000&auto=format&fit=crop'
    },
    {
      title: { en: '4. Kushinagar — Mahaparinirvana', zh: '4. 拘尸那伽 · 佛陀涅槃地' },
      location: { en: 'Uttar Pradesh, India', zh: '印度北方邦' },
      description: {
        en: 'Where the Buddha entered final Mahaparinirvana between two Sal trees at the age of 80.',
        zh: '佛陀八十岁时于娑罗双树间示寂入灭，建有大涅槃寺与卧佛像，为朝圣必到圣地。'
      },
      image: 'https://images.unsplash.com/photo-1608958416738-42289635fc9d?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Starry Particles */}
      <div className="absolute inset-0 bg-[radial-gradient(#ff9f00_1px,transparent_1px)] [background-size:36px_36px] opacity-10 pointer-events-none" />

      {/* Ambient Radial Lighting Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-saffron-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-500/20 text-saffron-300 border border-saffron-500/30 text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="h-4 w-4 text-saffron-400 animate-spin-slow" />
            <span>{lang === 'zh' ? '正觉朝圣 · 品牌故事' : 'ABOUT BODHIPATH TOURS'}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-extrabold tracking-tight text-white leading-tight">
            {lang === 'zh' ? (
              <>追寻佛陀足迹 · <span className="text-saffron-400">传递正信智慧</span></>
            ) : (
              <>Walk in the Footsteps of <span className="text-saffron-400">the Buddha</span></>
            )}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-2xl mx-auto">
            {lang === 'zh'
              ? 'Bodhipath Tour & Travels 专注于印尼中尼佛教八大圣地专业朝圣巡礼。我们以恭敬之心，为全球华语朝圣者提供全程专业中文导游、品质星级住宿与无忧尊享服务。'
              : 'Bodhipath Tour & Travels is a premier pilgrimage agency operating holy Buddhist circuits across India and Nepal. Guided by reverence and comfort, we serve global pilgrims with dedicated Chinese-speaking specialists.'}
          </p>
        </div>

        {/* Impact Statistics Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-[#161f30] p-6 rounded-3xl border border-slate-800 text-center space-y-1 shadow-xl hover:border-saffron-400/50 transition-all">
            <div className="text-3xl sm:text-4xl font-serif font-extrabold text-saffron-400">12+</div>
            <p className="text-xs text-slate-300 font-medium">
              {lang === 'zh' ? '年朝圣组织经验' : 'Years of Pilgrimage Excellence'}
            </p>
          </div>

          <div className="bg-[#161f30] p-6 rounded-3xl border border-slate-800 text-center space-y-1 shadow-xl hover:border-saffron-400/50 transition-all">
            <div className="text-3xl sm:text-4xl font-serif font-extrabold text-saffron-400">15,000+</div>
            <p className="text-xs text-slate-300 font-medium">
              {lang === 'zh' ? '接待华语朝圣团员' : 'International Pilgrims Served'}
            </p>
          </div>

          <div className="bg-[#161f30] p-6 rounded-3xl border border-slate-800 text-center space-y-1 shadow-xl hover:border-saffron-400/50 transition-all">
            <div className="text-3xl sm:text-4xl font-serif font-extrabold text-saffron-400">100%</div>
            <p className="text-xs text-slate-300 font-medium">
              {lang === 'zh' ? '专业中文持牌导游' : 'Certified Chinese Tour Leaders'}
            </p>
          </div>

          <div className="bg-[#161f30] p-6 rounded-3xl border border-slate-800 text-center space-y-1 shadow-xl hover:border-saffron-400/50 transition-all">
            <div className="text-3xl sm:text-4xl font-serif font-extrabold text-saffron-400">13</div>
            <p className="text-xs text-slate-300 font-medium">
              {lang === 'zh' ? '中尼圣地深度覆盖' : 'Sacred Sites Covered'}
            </p>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              {lang === 'zh' ? '四大品质保障' : 'Our Pilgrimage Pillars of Excellence'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {lang === 'zh'
                ? '用心呵护每一位朝圣者的虔诚之旅，确保参学身心安稳。'
                : 'Dedicated to your comfort, spiritual peace, and seamless travel logistics.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="bg-[#161f30] p-6 rounded-3xl border border-slate-800 space-y-3 hover:border-saffron-400/50 transition-all shadow-xl">
              <div className="h-12 w-12 rounded-2xl bg-saffron-500/10 text-saffron-400 flex items-center justify-center border border-saffron-500/20">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white">
                {lang === 'zh' ? '专业中文导游' : 'Dedicated Chinese Guides'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {lang === 'zh'
                  ? '资深华语导游随团解说经文典故与佛陀出世本怀，沟通无障碍。'
                  : 'Bilingual specialists fluent in Chinese and English with deep knowledge of Buddhist lore.'}
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#161f30] p-6 rounded-3xl border border-slate-800 space-y-3 hover:border-saffron-400/50 transition-all shadow-xl">
              <div className="h-12 w-12 rounded-2xl bg-saffron-500/10 text-saffron-400 flex items-center justify-center border border-saffron-500/20">
                <Hotel className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white">
                {lang === 'zh' ? '品质星级酒店' : '5-Star Pilgrimage Hotels'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {lang === 'zh'
                  ? '精选当地高标准清净酒店，提供纯正素食餐饮与舒适休养环境。'
                  : 'Curated 5-star & boutique accommodations ensuring hygienic dining and serene rest.'}
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#161f30] p-6 rounded-3xl border border-slate-800 space-y-3 hover:border-saffron-400/50 transition-all shadow-xl">
              <div className="h-12 w-12 rounded-2xl bg-saffron-500/10 text-saffron-400 flex items-center justify-center border border-saffron-500/20">
                <Bus className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-serif">
                {lang === 'zh' ? '舒适空调专车' : 'Comfortable VIP Transport'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {lang === 'zh'
                  ? '豪华大型大巴专车接送，长途拉车依然轻松平顺，安全保障。'
                  : 'Private air-conditioned luxury coaches designed for comfortable highway travel across India and Nepal.'}
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-[#161f30] p-6 rounded-3xl border border-slate-800 space-y-3 hover:border-saffron-400/50 transition-all shadow-xl">
              <div className="h-12 w-12 rounded-2xl bg-saffron-500/10 text-saffron-400 flex items-center justify-center border border-saffron-500/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white">
                {lang === 'zh' ? '通关与签证协助' : 'Border & Visa Assistance'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {lang === 'zh'
                  ? '协助办理印尼电子签证与陆路边境通关手续，朝圣全程无后顾之忧。'
                  : 'End-to-end visa application guidance, land-border crossing support, and temple entrance permits.'}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Sacred Life Events Timeline */}
        <div className="bg-[#161f30] p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              {lang === 'zh' ? '佛陀四大圣迹巡礼' : 'The Four Great Sacred Life Events'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {lang === 'zh'
                ? '点击切换探索佛陀诞生、成道、初转法轮与涅槃的四大核心圣地。'
                : 'Interactive journey across the 4 primary pilgrimage milestones of Shakyamuni Buddha.'}
            </p>
          </div>

          {/* Step Selector Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {sacredEvents.map((event, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                  activeStep === index
                    ? 'bg-saffron-500 text-neutral-950 border-saffron-400 shadow-lg'
                    : 'bg-[#192235] text-slate-300 border-slate-700 hover:border-saffron-400/40'
                }`}
              >
                <p className="truncate">{event.title[lang] || event.title.en}</p>
                <p className={`text-[11px] font-normal truncate mt-1 ${activeStep === index ? 'text-neutral-900' : 'text-slate-400'}`}>
                  📍 {event.location[lang] || event.location.en}
                </p>
              </button>
            ))}
          </div>

          {/* Active Step Content Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#192235] p-6 sm:p-8 rounded-2xl border border-slate-800">
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-xl bg-slate-900">
              <img
                src={sacredEvents[activeStep].image}
                alt=""
                className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-saffron-400 shrink-0" />
                <span>{sacredEvents[activeStep].location[lang] || sacredEvents[activeStep].location.en}</span>
              </div>
            </div>

            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-saffron-500/20 text-saffron-400 border border-saffron-500/30 text-xs font-bold uppercase tracking-wider">
                SACRED MILESTONE #{activeStep + 1}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {sacredEvents[activeStep].title[lang] || sacredEvents[activeStep].title.en}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {sacredEvents[activeStep].description[lang] || sacredEvents[activeStep].description.en}
              </p>
              <Link
                to="/destinations"
                className="inline-flex items-center space-x-2 text-saffron-400 font-bold text-xs hover:underline pt-2 cursor-pointer"
              >
                <span>{lang === 'zh' ? '在圣地指南中查看详细导览 →' : 'Explore in Destinations Guide →'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Call to Action Band */}
        <div className="rounded-3xl bg-gradient-to-br from-[#161f30] to-[#0d1320] p-8 sm:p-14 text-center text-white shadow-2xl border border-slate-800 space-y-6">
          <Heart className="h-12 w-12 text-saffron-400 mx-auto animate-pulse" />
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white">
              {lang === 'zh' ? '开启您的神圣朝圣之旅' : 'Begin Your Sacred Pilgrimage Journey'}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              {lang === 'zh'
                ? '联系我们的专业朝圣顾问，定制属于您的印度与尼泊尔佛陀圣迹参学行程。'
                : 'Talk with our pilgrimage specialists to customize your personal journey across India & Nepal.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/tours"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-saffron-500 hover:bg-saffron-600 active:scale-95 text-neutral-950 font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-lg cursor-pointer"
            >
              <Compass className="h-4 w-4" />
              <span>{lang === 'zh' ? '探索朝圣路线' : 'Explore Tour Packages'}</span>
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#192235] hover:bg-slate-800 active:scale-95 text-white font-bold text-sm px-8 py-3.5 rounded-xl border border-slate-700 transition-all shadow-md cursor-pointer"
            >
              <span>{lang === 'zh' ? '获取专属报价与咨询' : 'Request a Quote & Inquiry'}</span>
              <ArrowRight className="h-4 w-4 text-saffron-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
