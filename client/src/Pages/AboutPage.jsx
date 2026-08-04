import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Compass,
  Users,
  Hotel,
  Bus,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Heart
} from 'lucide-react';
import ScrollReveal from '../components/Decor/ScrollReveal';
import Watermark from '../components/Decor/Watermark';
import { OrnamentDivider } from '../components/Decor/SectionDivider';

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
      // Same Cloudinary cover image as the Lumbini card on the Destinations page.
      image: 'https://res.cloudinary.com/dzb5izmbr/image/upload/v1785186701/1_vmnimn.webp'
    },
    {
      title: { en: '2. Bodh Gaya — Supreme Enlightenment', zh: '2. 菩提伽耶 · 佛陀成道处' },
      location: { en: 'Bihar, India', zh: '印度比哈尔邦' },
      description: {
        en: 'Under the sacred Bodhi Tree, Prince Siddhartha attained supreme enlightenment and became the Buddha.',
        zh: '悉达多太子于圣菩提树下禅定开悟，成就无上正等正觉，此地建有金刚宝座与摩诃菩提寺。'
      },
      // Same Cloudinary cover image as the Bodh Gaya card on the Destinations page.
      image: 'https://res.cloudinary.com/dzb5izmbr/image/upload/v1785185923/istockphoto-530927704-612x612_xieosw.jpg'
    },
    {
      title: { en: '3. Sarnath — Turning the Dharma Wheel', zh: '3. 鹿野苑 · 初转法轮处' },
      location: { en: 'Varanasi, India', zh: '印度瓦拉纳西' },
      description: {
        en: 'The Deer Park where the Buddha delivered his first sermon on the Four Noble Truths to the 5 disciples.',
        zh: '佛陀于鹿野苑向五比丘宣讲“四圣谛”与“八正道”，三宝于此具足，佛法之轮从此开转。'
      },
      // Same Cloudinary cover image as the Sarnath card on the Destinations page.
      image: 'https://res.cloudinary.com/dzb5izmbr/image/upload/v1785185748/sarnath-varanasi-1-attr-hero_nhomd2.jpg'
    },
    {
      title: { en: '4. Kushinagar — Mahaparinirvana', zh: '4. 拘尸那伽 · 佛陀涅槃地' },
      location: { en: 'Uttar Pradesh, India', zh: '印度北方邦' },
      description: {
        en: 'Where the Buddha entered final Mahaparinirvana between two Sal trees at the age of 80.',
        zh: '佛陀八十岁时于娑罗双树间示寂入灭，建有大涅槃寺与卧佛像，为朝圣必到圣地。'
      },
      // Same Cloudinary cover image as the Kushinagar card on the Destinations page.
      image: 'https://res.cloudinary.com/dzb5izmbr/image/upload/v1785186633/About-Kushinagar-1_dt1xj5.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-ivory text-heading font-sans">
      <div className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Starry Particles */}
        <div className="absolute inset-0 bg-[radial-gradient(#7A1F35_1px,transparent_1px)] bg-size-[36px_36px] opacity-5 pointer-events-none" />

        {/* Ambient Radial Lighting Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-87.5 bg-maroon-700/5 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          {/* Page Hero Header */}
          <ScrollReveal className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-maroon-700/10 text-maroon-700 border border-maroon-700/20 text-xs font-semibold uppercase tracking-wider mb-2">
              <Compass className="h-4 w-4 text-saffron-500 animate-spin-slow" />
              <span>{lang === 'zh' ? '正觉朝圣 · 品牌故事' : 'ABOUT BODHIPATH TOURS'}</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-serif font-extrabold tracking-tight text-heading leading-tight">
              {lang === 'zh' ? (
                <>追寻佛陀足迹 · <span className="text-maroon-700">传递正信智慧</span></>
              ) : (
                <>Walk in the Footsteps of <span className="text-maroon-700">the Buddha</span></>
              )}
            </h1>
            <p className="text-base sm:text-lg text-body leading-relaxed font-sans max-w-2xl mx-auto">
              {lang === 'zh'
                ? 'Bodhipath Tour & Travels 专注于印尼中尼佛教八大圣地专业朝圣巡礼。我们以恭敬之心，为全球华语朝圣者提供全程专业中文导游、品质星级住宿与无忧尊享服务。'
                : 'Bodhipath Tour & Travels is a premier pilgrimage agency operating holy Buddhist circuits across India and Nepal. Guided by reverence and comfort, we serve global pilgrims with dedicated Chinese-speaking specialists.'}
            </p>
          </ScrollReveal>

          {/* Impact Statistics Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-sans">
            <ScrollReveal delay={0} className="premium-card p-8 text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-serif font-extrabold text-maroon-700">12+</div>
              <p className="text-xs text-body font-medium">
                {lang === 'zh' ? '年朝圣组织经验' : 'Years of Pilgrimage Excellence'}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.08} className="premium-card p-8 text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-serif font-extrabold text-maroon-700">15,000+</div>
              <p className="text-xs text-body font-medium">
                {lang === 'zh' ? '接待华语朝圣团员' : 'International Pilgrims Served'}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.16} className="premium-card p-8 text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-serif font-extrabold text-maroon-700">100%</div>
              <p className="text-xs text-body font-medium">
                {lang === 'zh' ? '专业中文持牌导游' : 'Certified Chinese Tour Leaders'}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.24} className="premium-card p-8 text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-serif font-extrabold text-maroon-700">13</div>
              <p className="text-xs text-body font-medium">
                {lang === 'zh' ? '中尼圣地深度覆盖' : 'Sacred Sites Covered'}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Excellence — full-bleed alternate band */}
      <section className="relative overflow-hidden py-24 sm:py-28 bg-beige border-y border-card-border">
        <Watermark variant="dharma" size={420} className="-top-16 -right-20 hidden lg:block" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-sans relative">
          <ScrollReveal className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-heading">
              {lang === 'zh' ? '四大品质保障' : 'Our Pilgrimage Pillars of Excellence'}
            </h2>
            <p className="text-xs sm:text-sm text-body">
              {lang === 'zh'
                ? '用心呵护每一位朝圣者的虔诚之旅，确保参学身心安稳。'
                : 'Dedicated to your comfort, spiritual peace, and seamless travel logistics.'}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <ScrollReveal delay={0} className="premium-card p-8 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-maroon-700/10 text-maroon-700 flex items-center justify-center border border-maroon-700/20">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-heading">
                {lang === 'zh' ? '专业中文导游' : 'Dedicated Chinese Guides'}
              </h3>
              <p className="text-xs text-body leading-relaxed font-sans">
                {lang === 'zh'
                  ? '资深华语导游随团解说经文典故与佛陀出世本怀，沟通无障碍。'
                  : 'Bilingual specialists fluent in Chinese and English with deep knowledge of Buddhist lore.'}
              </p>
            </ScrollReveal>

            {/* Pillar 2 */}
            <ScrollReveal delay={0.08} className="premium-card p-8 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-maroon-700/10 text-maroon-700 flex items-center justify-center border border-maroon-700/20">
                <Hotel className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-heading">
                {lang === 'zh' ? '品质星级酒店' : '5-Star Pilgrimage Hotels'}
              </h3>
              <p className="text-xs text-body leading-relaxed font-sans">
                {lang === 'zh'
                  ? '精选当地高标准清净酒店，提供纯正素食餐饮与舒适休养环境。'
                  : 'Curated 5-star & boutique accommodations ensuring hygienic dining and serene rest.'}
              </p>
            </ScrollReveal>

            {/* Pillar 3 */}
            <ScrollReveal delay={0.16} className="premium-card p-8 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-maroon-700/10 text-maroon-700 flex items-center justify-center border border-maroon-700/20">
                <Bus className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-heading font-serif">
                {lang === 'zh' ? '舒适空调专车' : 'Comfortable VIP Transport'}
              </h3>
              <p className="text-xs text-body leading-relaxed font-sans">
                {lang === 'zh'
                  ? '豪华大型大巴专车接送，长途拉车依然轻松平顺，安全保障。'
                  : 'Private air-conditioned luxury coaches designed for comfortable highway travel across India and Nepal.'}
              </p>
            </ScrollReveal>

            {/* Pillar 4 */}
            <ScrollReveal delay={0.24} className="premium-card p-8 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-maroon-700/10 text-maroon-700 flex items-center justify-center border border-maroon-700/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-heading">
                {lang === 'zh' ? '通关与签证协助' : 'Border & Visa Assistance'}
              </h3>
              <p className="text-xs text-body leading-relaxed font-sans">
                {lang === 'zh'
                  ? '协助办理印尼电子签证与陆路边境通关手续，朝圣全程无后顾之忧。'
                  : 'End-to-end visa application guidance, land-border crossing support, and temple entrance permits.'}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
        {/* Interactive Sacred Life Events Timeline */}
        <ScrollReveal className="premium-card p-8 sm:p-12 space-y-8 font-sans">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-heading">
              {lang === 'zh' ? '佛陀四大圣迹巡礼' : 'The Four Great Sacred Life Events'}
            </h2>
            <p className="text-xs sm:text-sm text-body">
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
                    ? 'bg-maroon-700 text-white border-[#9F2845] shadow-md'
                    : 'bg-beige text-heading border-card-border hover:border-maroon-700/40'
                }`}
              >
                <p className="truncate">{event.title[lang] || event.title.en}</p>
                <p className={`text-[11px] font-normal truncate mt-1 ${activeStep === index ? 'text-white/80' : 'text-muted'}`}>
                  📍 {event.location[lang] || event.location.en}
                </p>
              </button>
            ))}
          </div>

          {/* Active Step Content Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-ivory p-6 sm:p-8 rounded-2xl border border-card-border">
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md bg-ivory">
              <img
                src={sacredEvents[activeStep].image}
                alt=""
                className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-saffron-500 shrink-0" />
                <span>{sacredEvents[activeStep].location[lang] || sacredEvents[activeStep].location.en}</span>
              </div>
            </div>

            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-maroon-700/10 text-maroon-700 border border-maroon-700/20 text-xs font-bold uppercase tracking-wider">
                SACRED MILESTONE #{activeStep + 1}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-heading">
                {sacredEvents[activeStep].title[lang] || sacredEvents[activeStep].title.en}
              </h3>
              <p className="text-sm text-body leading-relaxed font-sans">
                {sacredEvents[activeStep].description[lang] || sacredEvents[activeStep].description.en}
              </p>
              <Link
                to="/destinations"
                className="inline-flex items-center space-x-2 text-maroon-700 font-bold text-xs hover:underline pt-2 cursor-pointer"
              >
                <span>{lang === 'zh' ? '在圣地指南中查看详细导览 →' : 'Explore in Destinations Guide →'}</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
        </div>
      </div>

      {/* Call to Action Band — full-bleed special CTA section */}
      <section className="relative overflow-hidden py-24 sm:py-32 bg-white">
        <Watermark variant="temple" size={420} className="-bottom-16 -left-16 hidden lg:block" />
        <Watermark variant="lotus" size={340} className="-top-12 -right-12 hidden lg:block" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal className="premium-card p-8 sm:p-14 text-center text-heading space-y-6 font-sans">
            <OrnamentDivider variant="lotus" className="mb-2" />
            <Heart className="h-12 w-12 text-maroon-700 fill-maroon-700 mx-auto animate-pulse" />
            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-heading">
                {lang === 'zh' ? '开启您的神圣朝圣之旅' : 'Begin Your Sacred Pilgrimage Journey'}
              </h2>
              <p className="text-sm sm:text-base text-body leading-relaxed font-sans">
                {lang === 'zh'
                  ? '联系我们的专业朝圣顾问，定制属于您的印度与尼泊尔佛陀圣迹参学行程。'
                  : 'Talk with our pilgrimage specialists to customize your personal journey across India & Nepal.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/tours"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-maroon-700 hover:bg-maroon-800 active:scale-95 text-white font-bold text-sm px-8 py-3.5 rounded-2xl border border-[#9F2845] transition-all shadow-md cursor-pointer"
              >
                <Compass className="h-4 w-4" />
                <span>{lang === 'zh' ? '探索朝圣路线' : 'Explore Tour Packages'}</span>
              </Link>

              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-ivory active:scale-95 text-maroon-700 font-bold text-sm px-8 py-3.5 rounded-2xl border border-saffron-500 transition-all shadow-xs cursor-pointer"
              >
                <span>{lang === 'zh' ? '获取专属报价与咨询' : 'Request a Quote & Inquiry'}</span>
                <ArrowRight className="h-4 w-4 text-maroon-700" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
