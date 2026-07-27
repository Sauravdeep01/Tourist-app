import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { CountrySelect, PhoneCodeSelect } from '../components/CountryDropdown';
import api from '../utils/api';
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Users,
  Compass,
  HelpCircle,
  ChevronDown,
  Search,
  MessageCircle,
  Building2,
  User,
  Globe,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function ContactPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { user } = useContext(AuthContext);

  // Inquiry Purpose State
  const [inquiryType, setInquiryType] = useState('full');

  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneCountryCode: '+86',
    phone: '',
    wechatId: '',
    country: 'China',
    tourId: '',
    groupSize: 2,
    travelDate: 'October 2026',
    message: ''
  });

  const [tours, setTours] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Office Tabs & FAQ Accordions
  const [activeOffice, setActiveOffice] = useState(0);
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  // Auto-fill user details if logged in
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  // Fetch tours for dropdown
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const { data } = await api.get('/api/tours');
        const list = Array.isArray(data) ? data : data.tours || [];
        setTours(list);
      } catch (err) {
        console.error('Error loading tours:', err);
      }
    };
    fetchTours();
  }, []);

  // Group size presets
  const groupPills = [
    { label: 'Solo (1)', val: 1 },
    { label: 'Couple (2)', val: 2 },
    { label: 'Family (3-5)', val: 4 },
    { label: 'Small Sangha (6-15)', val: 10 },
    { label: 'Large Group (16+)', val: 20 }
  ];

  // Travel season presets
  const seasonPills = [
    'October 2026',
    'November 2026',
    'December 2026',
    'January 2027',
    'February 2027',
    'March 2027'
  ];

  // Offices list
  const offices = [
    {
      city: { en: 'Bodh Gaya (Headquarters)', zh: '菩提伽耶 · 圣地总办事处' },
      address: {
        en: 'Main Temple Road, Near Mahabodhi Temple, Bodh Gaya, Bihar 804231, India',
        zh: '印度比哈尔邦菩提伽耶摩诃菩提寺主路 804231'
      },
      phone: '+91 9852551971',
      hours: { en: 'Open Daily: 7:00 AM – 9:00 PM (IST)', zh: '全天开放：07:00 – 21:00 (印度时间)' }
    },
    {
      city: { en: 'Varanasi / Sarnath Office', zh: '瓦拉纳西 / 鹿野苑办事处' },
      address: {
        en: 'Sarnath Pilgrimage Highway, Varanasi, Uttar Pradesh 221007, India',
        zh: '印度北方邦瓦拉纳西鹿野苑朝圣大道 221007'
      },
      phone: '+91 98765 43211',
      hours: { en: 'Open Daily: 8:00 AM – 8:00 PM (IST)', zh: '全天开放：08:00 – 20:00 (印度时间)' }
    },
    {
      city: { en: 'Kathmandu / Nepal Border Desk', zh: '加德满都 / 尼泊尔边境服务台' },
      address: {
        en: 'Boudha Stupa Circuit, Kathmandu 44600, Nepal',
        zh: '尼泊尔加德满都博达哈大佛塔朝圣区 44600'
      },
      phone: '+977 1 4567890',
      hours: { en: 'Mon – Sat: 9:00 AM – 6:00 PM (NPT)', zh: '周一至周六：09:00 – 18:00 (尼泊尔时间)' }
    }
  ];

  // FAQs Data
  const faqs = [
    {
      q: { en: 'Do I need an Indian & Nepalese visa before booking?', zh: '预订前需要提前办理印度和尼泊尔签证吗？' },
      a: {
        en: 'Our team provides full e-visa application guidance for India and handles land-border entry permits into Nepal.',
        zh: '我们的团队提供全程印度电子签证申请指导，并协助办理从印度陆路边境进入尼泊尔的通关证明。'
      }
    },
    {
      q: { en: 'Are pure vegetarian meals guaranteed at all hotels?', zh: '行程中的酒店餐饮能否保障纯正素食？' },
      a: {
        en: 'Yes, all our partner hotels provide strictly hygienic, pure vegetarian options tailored for Buddhist pilgrims.',
        zh: '是的，我们所有精选的星级朝圣酒店均提供干净卫生的纯素食餐饮，符合华语朝圣团员的饮食习惯。'
      }
    },
    {
      q: { en: 'Are tour guides fluent in Chinese?', zh: '随团导游是否全称使用中文讲解？' },
      a: {
        en: '100% of our lead pilgrimage guides are certified bilingual specialists fluent in Mandarin Chinese and English.',
        zh: '是的，我们所有带团导游均为精通中文与英语的持牌导游，深入讲解佛陀经文典故与圣地历史。'
      }
    },
    {
      q: { en: 'Can we request a private customized itinerary?', zh: '我们可以为寺院法师或私人自组团定制独立行程吗？' },
      a: {
        en: 'Absolutely! We specialize in private group customization, sacred temple chanting arrangements, and dedicated luxury transport.',
        zh: '完全可以！我们专门提供寺院法师团队、家庭或私人团体的专属朝圣行程定制，并安排专车与佛事活动协助。'
      }
    }
  ];

  const filteredFaqs = faqs.filter((f) => {
    const term = faqSearch.toLowerCase();
    return (
      f.q.en.toLowerCase().includes(term) ||
      f.q.zh.toLowerCase().includes(term) ||
      f.a.en.toLowerCase().includes(term) ||
      f.a.zh.toLowerCase().includes(term)
    );
  });

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!user) {
      setErrorMsg(
        lang === 'zh'
          ? '请先登录账户以提交报价咨询。'
          : 'Please log in to submit your quote inquiry.'
      );
      return;
    }

    if (!form.name.trim()) {
      setErrorMsg(lang === 'zh' ? '请输入您的姓名' : 'Please enter your name.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phoneCountryCode: form.phoneCountryCode,
        phone: form.phone,
        wechatId: form.wechatId,
        country: form.country,
        tourId: form.tourId || undefined,
        groupSize: Number(form.groupSize) || 1,
        travelDate: form.travelDate,
        message: `[Purpose: ${inquiryType.toUpperCase()}] ${form.message.trim()}`
      };

      await api.post('/api/inquiries', payload);

      setSuccessMsg(
        lang === 'zh'
          ? '您的朝圣方案与报价申请已成功提交！我们的高级朝圣顾问将在24小时内与您联系。'
          : 'Your pilgrimage quote request has been submitted successfully! Our senior planner will contact you within 24 hours.'
      );

      setForm((prev) => ({
        ...prev,
        message: ''
      }));
    } catch (err) {
      console.error('Inquiry submit error:', err);
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.error ||
        (lang === 'zh' ? '提交失败，请重试。' : 'Submission failed. Please try again.');
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-saffron-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-500/20 text-saffron-300 border border-saffron-500/30 text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="h-4 w-4 text-saffron-400 animate-spin-slow" />
            <span>{lang === 'zh' ? '朝圣咨询 · 专属行程服务' : 'PILGRIMAGE INQUIRY & BOOKING'}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-extrabold tracking-tight text-white leading-tight">
            {lang === 'zh' ? (
              <>开启圣地参学 · <span className="text-saffron-400">在线定制报价</span></>
            ) : (
              <>Plan Your Sacred Circuit · <span className="text-saffron-400">Request a Quote</span></>
            )}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-2xl mx-auto">
            {lang === 'zh'
              ? '请在下方填写您的联系方式与参学需求，我们的高级朝圣顾问将在24小时内向您提供精确报价与文档。'
              : 'Fill in your pilgrimage details below to receive a personalized itinerary and quote from our senior planners.'}
          </p>
        </div>

        {/* 🌟 BEAUTIFUL SINGLE-PAGE INQUIRY FORM LAYOUT (ALL FIELDS VISIBLE AT ONCE) 🌟 */}
        <div className="bg-[#161f30] p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl space-y-8">
          <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-saffron-400" />
                <span>{lang === 'zh' ? '朝圣参学方案与报价申请表' : 'Pilgrimage Circuit Quote Form'}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {lang === 'zh'
                  ? '所有字段均可在一页直接填写，无需多次跳转。'
                  : 'All fields are clearly visible below — fill in your preferences to receive a custom proposal.'}
              </p>
            </div>
          </div>

          {/* Success / Error Alerts */}
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-sm flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-950/80 border border-red-800 text-red-300 text-sm flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. SELECT INQUIRY PURPOSE */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-saffron-400">
                {lang === 'zh' ? '1. 朝圣模式与类型' : '1. Pilgrimage Mode & Purpose'}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setInquiryType('full')}
                  className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    inquiryType === 'full'
                      ? 'bg-saffron-500 text-neutral-950 border-saffron-400 shadow-md font-extrabold'
                      : 'bg-[#192235] text-slate-300 border-slate-700 hover:border-saffron-400/40'
                  }`}
                >
                  🕉️ {lang === 'zh' ? '八大圣地全景参学' : '8 Sacred Circuit'}
                </button>

                <button
                  type="button"
                  onClick={() => setInquiryType('private')}
                  className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    inquiryType === 'private'
                      ? 'bg-saffron-500 text-neutral-950 border-saffron-400 shadow-md font-extrabold'
                      : 'bg-[#192235] text-slate-300 border-slate-700 hover:border-saffron-400/40'
                  }`}
                >
                  🏛️ {lang === 'zh' ? '寺院 / 僧团定制' : 'Private / Sangha Group'}
                </button>

                <button
                  type="button"
                  onClick={() => setInquiryType('visa')}
                  className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    inquiryType === 'visa'
                      ? 'bg-saffron-500 text-neutral-950 border-saffron-400 shadow-md font-extrabold'
                      : 'bg-[#192235] text-slate-300 border-slate-700 hover:border-saffron-400/40'
                  }`}
                >
                  🛂 {lang === 'zh' ? '签证与陆路通关' : 'Visa & Border Care'}
                </button>

                <button
                  type="button"
                  onClick={() => setInquiryType('general')}
                  className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    inquiryType === 'general'
                      ? 'bg-saffron-500 text-neutral-950 border-saffron-400 shadow-md font-extrabold'
                      : 'bg-[#192235] text-slate-300 border-slate-700 hover:border-saffron-400/40'
                  }`}
                >
                  💬 {lang === 'zh' ? '通用问题咨询' : 'General Questions'}
                </button>
              </div>
            </div>

            {/* 2. TRAVELER CONTACT INFORMATION GRID */}
            <div className="space-y-4 border-t border-slate-800/80 pt-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-saffron-400">
                {lang === 'zh' ? '2. 团员联系信息' : '2. Traveler Contact Information'}
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {lang === 'zh' ? '全名 / 姓名' : 'Full Name'} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Lin Ming"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-[#192235] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-saffron-400 transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {lang === 'zh' ? '电子邮箱' : 'Email Address'} *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. name@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-[#192235] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-saffron-400 transition-all"
                    />
                  </div>
                </div>

                {/* Phone & Real Flag Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {lang === 'zh' ? '联系电话' : 'Phone Number'}
                  </label>
                  <div className="flex gap-2">
                    <PhoneCodeSelect
                      value={form.phoneCountryCode}
                      onChange={(val) => setForm({ ...form, phoneCountryCode: val })}
                    />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="10-digit number"
                      className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#192235] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-saffron-400 transition-all"
                    />
                  </div>
                </div>

                {/* WeChat ID */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {lang === 'zh' ? '微信号 (WeChat ID)' : 'WeChat ID'}
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      value={form.wechatId}
                      onChange={(e) => setForm({ ...form, wechatId: e.target.value })}
                      placeholder="e.g. wx_pilgrim88"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-[#192235] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-saffron-400 transition-all"
                    />
                  </div>
                </div>

                {/* Country Select with Real Flags */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {lang === 'zh' ? '居住国家 / 地区' : 'Country / Region'}
                  </label>
                  <CountrySelect
                    value={form.country}
                    onChange={(val) => setForm({ ...form, country: val })}
                  />
                </div>

                {/* Intended Tour Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {lang === 'zh' ? '选择意向朝圣路线' : 'Select Intended Tour'}
                  </label>
                  <select
                    value={form.tourId}
                    onChange={(e) => setForm({ ...form, tourId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#192235] text-sm text-white focus:outline-none focus:ring-2 focus:ring-saffron-400 transition-all cursor-pointer"
                  >
                    <option value="">{lang === 'zh' ? '通用行程咨询 (由顾问规划)' : 'General Custom Circuit'}</option>
                    {tours.map((t) => (
                      <option key={t._id} value={t._id} className="bg-[#192235] text-white">
                        {t.title?.[lang] || t.title?.en || t.title?.zh || 'Pilgrimage Circuit'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. GROUP SIZE & TRAVEL SEASON OPTIONS */}
            <div className="space-y-4 border-t border-slate-800/80 pt-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-saffron-400">
                {lang === 'zh' ? '3. 参团人数与预计季节' : '3. Group Size & Travel Season'}
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Group Size Pills */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    {lang === 'zh' ? '参团人数选项' : 'Group Size Pills'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {groupPills.map((pill) => (
                      <button
                        key={pill.label}
                        type="button"
                        onClick={() => setForm({ ...form, groupSize: pill.val })}
                        className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          Number(form.groupSize) === pill.val
                            ? 'bg-saffron-500 text-neutral-950 shadow-md font-extrabold'
                            : 'bg-[#192235] text-slate-300 border border-slate-700 hover:border-saffron-400/40'
                        }`}
                      >
                        👥 {pill.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Season Pills */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    {lang === 'zh' ? '预计出发月份' : 'Travel Month Pills'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {seasonPills.map((season) => (
                      <button
                        key={season}
                        type="button"
                        onClick={() => setForm({ ...form, travelDate: season })}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          form.travelDate === season
                            ? 'bg-saffron-500 text-neutral-950 shadow-md font-extrabold'
                            : 'bg-[#192235] text-slate-300 border border-slate-700 hover:border-saffron-400/40'
                        }`}
                      >
                        📅 {season}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. SPECIAL REQUEST & ONE-CLICK SUBMIT BUTTON */}
            <div className="space-y-4 border-t border-slate-800/80 pt-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-saffron-400">
                {lang === 'zh' ? '4. 留言与特别需求' : '4. Special Requests & Notes'}
              </label>

              <textarea
                rows="4"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={
                  lang === 'zh'
                    ? '请注明您的餐饮偏好、单房差需求、法师随行或开证要求...'
                    : 'Please specify rooming preferences, vegetarian dining needs, or chanting schedules...'
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#192235] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-saffron-400 transition-all"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center space-x-2 bg-saffron-500 hover:bg-saffron-600 active:scale-95 text-neutral-950 font-bold text-sm sm:text-base px-8 py-4 rounded-xl transition-all shadow-xl disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{lang === 'zh' ? '正在提交朝圣方案申请...' : 'Submitting Request...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>{lang === 'zh' ? '提交朝圣方案与报价申请' : 'Submit Pilgrimage Quote Request'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Interactive Office Location Tabs */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              {lang === 'zh' ? '圣地接待办公室与服务台' : 'Pilgrimage Headquarters & Desks'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {lang === 'zh'
                ? '我们在印度菩提伽耶、鹿野苑与尼泊尔加德满都均设有专属接待团队。'
                : 'Local teams stationed in Bodh Gaya, Varanasi/Sarnath, and Nepal border points.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {offices.map((office, idx) => (
              <div
                key={idx}
                onClick={() => setActiveOffice(idx)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                  activeOffice === idx
                    ? 'bg-[#192235] border-saffron-400 shadow-xl scale-102'
                    : 'bg-[#161f30] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-saffron-500/10 text-saffron-400 flex items-center justify-center border border-saffron-500/20">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-serif font-bold text-white">
                    {office.city[lang] || office.city.en}
                  </h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  📍 {office.address[lang] || office.address.en}
                </p>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <p className="font-mono text-saffron-300">📞 {office.phone}</p>
                  <p>🕒 {office.hours[lang] || office.hours.en}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive FAQ Search Accordion */}
        <div className="bg-[#161f30] p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {lang === 'zh' ? '常见朝圣问题解答' : 'Frequently Asked Questions'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'zh' ? '输入关键词实时搜索签证、饮食与行程解答' : 'Type to search answers on visa, dining, or guide arrangements'}
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={lang === 'zh' ? '搜索问题...' : 'Search FAQs...'}
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#192235] border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-saffron-400"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                {lang === 'zh' ? '未找到相关解答，请直接提交上面表单联系我们！' : 'No matching questions found — feel free to submit the form above!'}
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-[#192235] rounded-2xl border border-slate-800 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-serif font-bold text-sm text-white hover:text-saffron-400 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-saffron-400 shrink-0" />
                      <span>{faq.q[lang] || faq.q.en}</span>
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        openFaq === idx ? 'rotate-180 text-saffron-400' : ''
                      }`}
                    />
                  </button>

                  {openFaq === idx && (
                    <div className="px-6 pb-4 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans border-t border-slate-800/50">
                      {faq.a[lang] || faq.a.en}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
