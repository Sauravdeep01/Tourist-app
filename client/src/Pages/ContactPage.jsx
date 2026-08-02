import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { CONTACT_DETAILS } from '../utils/constants';
import api from '../utils/api';
import {
  Compass,
  Mail,
  Phone,
  MessageCircle,
  AlertCircle,
  Send,
  Loader2,
  Search,
  HelpCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Stepper from '../components/ContactForm/Stepper';
import StepPersonal from '../components/ContactForm/StepPersonal';
import StepTravel from '../components/ContactForm/StepTravel';
import StepReview from '../components/ContactForm/StepReview';
import SuccessScreen from '../components/ContactForm/SuccessScreen';
import { EMAIL_RE, WECHAT_RE, PHONE_RE, STEPS } from '../components/ContactForm/formConstants';

// Fields that belong to each step — used to scope validation + "touch on
// attempted advance" so errors only surface for the fields the user can
// currently see.
const STEP_FIELDS = [
  ['name', 'email', 'phone', 'country', 'wechatId'],
  ['tourId', 'groupSize', 'travelDate'],
  [],
];

const stepVariants = {
  enter: (dir) => ({ opacity: 0, x: dir >= 0 ? 32 : -32 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir >= 0 ? -32 : 32 }),
};

// Decorative floating particles — purely visual, hidden on small screens.
const PARTICLES = [
  { top: '12%', left: '8%', size: 6, duration: 7 },
  { top: '22%', left: '88%', size: 4, duration: 9 },
  { top: '68%', left: '5%', size: 5, duration: 8 },
  { top: '80%', left: '92%', size: 4, duration: 6.5 },
  { top: '45%', left: '95%', size: 3, duration: 10 },
  { top: '5%', left: '45%', size: 4, duration: 7.5 },
];

function validateAll(form, lang) {
  const errors = {};

  if (!form.name || !form.name.trim()) {
    errors.name = lang === 'zh' ? '请输入您的姓名' : 'Name is required';
  } else if (form.name.trim().length > 20) {
    errors.name = lang === 'zh' ? '姓名不能超过20个字符' : 'Name must be 20 characters or fewer';
  }

  if (!form.email || !form.email.trim()) {
    errors.email = lang === 'zh' ? '请输入您的电子邮箱' : 'Email is required';
  } else if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = lang === 'zh' ? '请输入有效的电子邮箱地址' : 'Please enter a valid email address';
  }

  if (!form.phone || !form.phone.trim()) {
    errors.phone = lang === 'zh' ? '请输入您的电话号码' : 'Phone number is required';
  } else if (!PHONE_RE.test(form.phone.trim())) {
    errors.phone = lang === 'zh' ? '电话号码必须为10位数字' : 'Phone number must be exactly 10 digits';
  }

  if (!form.country || !form.country.trim()) {
    errors.country = lang === 'zh' ? '请选择居住国家/地区' : 'Country is required';
  }

  if (form.wechatId && form.wechatId.trim() && !WECHAT_RE.test(form.wechatId.trim())) {
    errors.wechatId = lang === 'zh' ? '微信号长度须为6-20个字符' : 'WeChat ID must be 6–20 characters';
  }

  if (!form.travelDate || !form.travelDate.trim()) {
    errors.travelDate = lang === 'zh' ? '请选择出发月份' : 'Travel month is required';
  }

  return errors;
}

export default function ContactPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { user } = useContext(AuthContext);

  // Wizard state
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const stepHeadingRef = useRef(null);

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
    message: '',
  });

  const [tours, setTours] = useState([]);

  // FAQ Accordion
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const errors = useMemo(() => validateAll(form, lang), [form, lang]);

  // Auto-fill user details if logged in
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  // Fetch tours for the "Intended Tour" cards
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

  // Move focus to the new step's heading for keyboard/screen-reader users
  useEffect(() => {
    stepHeadingRef.current?.focus();
  }, [currentStep]);

  const markTouched = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  const focusAndScrollToError = (fieldNames) => {
    if (!fieldNames || fieldNames.length === 0) return;
    setTimeout(() => {
      for (const fieldName of fieldNames) {
        const el = document.getElementById(fieldName);
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          break;
        }
      }
    }, 50);
  };

  const goNext = () => {
    const fields = STEP_FIELDS[currentStep];
    const invalidFields = fields.filter((f) => errors[f]);
    if (invalidFields.length > 0) {
      setTouched((prev) => {
        const next = { ...prev };
        fields.forEach((f) => {
          next[f] = true;
        });
        return next;
      });
      focusAndScrollToError(invalidFields);
      return;
    }
    setDirection(1);
    setCurrentStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const goBack = () => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  const jumpToStep = (idx) => {
    if (idx > currentStep) {
      for (let s = 0; s < idx; s++) {
        const fields = STEP_FIELDS[s];
        const invalidFields = fields.filter((f) => errors[f]);
        if (invalidFields.length > 0) {
          setTouched((prev) => {
            const next = { ...prev };
            fields.forEach((f) => {
              next[f] = true;
            });
            return next;
          });
          setDirection(s > currentStep ? 1 : -1);
          setCurrentStep(s);
          focusAndScrollToError(invalidFields);
          return;
        }
      }
    }
    setDirection(idx > currentStep ? 1 : -1);
    setCurrentStep(idx);
  };

  const handleFinalSubmit = async () => {
    setErrorMsg('');

    if (!user) {
      setErrorMsg(
        lang === 'zh' ? '请先登录账户以提交报价咨询。' : 'Please log in to submit your quote inquiry.'
      );
      return;
    }

    const allErrors = validateAll(form, lang);
    const errorKeys = Object.keys(allErrors);
    if (errorKeys.length > 0) {
      setTouched({ name: true, email: true, phone: true, country: true, wechatId: true, travelDate: true });
      const firstErrorStep = STEP_FIELDS.findIndex((fields) => fields.some((f) => allErrors[f]));
      const targetStep = firstErrorStep >= 0 ? firstErrorStep : 0;
      setDirection(-1);
      setCurrentStep(targetStep);
      focusAndScrollToError(errorKeys);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phoneCountryCode: form.phoneCountryCode,
        phone: form.phone.trim(),
        wechatId: form.wechatId.trim(),
        country: form.country,
        tourId: form.tourId || undefined,
        groupSize: Number(form.groupSize) || 1,
        travelDate: form.travelDate,
        message: form.message.trim(),
      };

      await api.post('/api/inquiries', payload);
      setSubmitted(true);
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

  // FAQs Data
  const faqs = [
    {
      q: { en: 'Do I need an Indian & Nepalese visa before booking?', zh: '预订前需要提前办理印度和尼泊尔签证吗？' },
      a: {
        en: 'Our team provides full e-visa application guidance for India and handles land-border entry permits into Nepal.',
        zh: '我们的团队提供全程印度电子签证申请指导，并协助办理从印度陆路边境进入尼泊尔的通关证明。',
      },
    },
    {
      q: { en: 'Are pure vegetarian meals guaranteed at all hotels?', zh: '行程中的酒店餐饮能否保障纯正素食？' },
      a: {
        en: 'Yes, all our partner hotels provide strictly hygienic, pure vegetarian options tailored for Buddhist pilgrims.',
        zh: '是的，我们所有精选的星级朝圣酒店均提供干净卫生的纯素食餐饮，符合华语朝圣团员的饮食习惯。',
      },
    },
    {
      q: { en: 'Are tour guides fluent in Chinese?', zh: '随团导游是否全称使用中文讲解？' },
      a: {
        en: '100% of our lead pilgrimage guides are certified bilingual specialists fluent in Mandarin Chinese and English.',
        zh: '是的，我们所有带团导游均为精通中文与英语的持牌导游，深入讲解佛陀经文典故与圣地历史。',
      },
    },
    {
      q: { en: 'Can we request a private customized itinerary?', zh: '我们可以为寺院法师或私人自组团定制独立行程吗？' },
      a: {
        en: 'Absolutely! We specialize in private group customization, sacred temple chanting arrangements, and dedicated luxury transport.',
        zh: '完全可以！我们专门提供寺院法师团队、家庭或私人团体的专属朝圣行程定制，并安排专车与佛事活动协助。',
      },
    },
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

  const stepProps = { form, setForm, errors, touched, markTouched, lang };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Dharma dot pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ff9f00_1px,transparent_1px)] bg-size-[36px_36px] opacity-7 pointer-events-none" />

      {/* Blurred ambient orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-212.5 h-100 bg-saffron-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -left-32 w-120 h-120 bg-maroon-600/15 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-105 h-105 bg-saffron-600/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Floating particles */}
      <div className="hidden sm:block">
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-saffron-400/40 pointer-events-none"
            style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
            animate={{ y: [0, -16, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Page Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto space-y-4 mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-500/20 text-saffron-300 border border-saffron-500/30 text-xs font-semibold uppercase tracking-wider">
            <Compass className="h-4 w-4 text-saffron-400 animate-spin-slow" />
            <span>{lang === 'zh' ? '朝圣咨询 · 专属行程服务' : 'PILGRIMAGE INQUIRY & BOOKING'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-extrabold tracking-tight text-white leading-tight">
            {lang === 'zh' ? (
              <>
                开启圣地参学 · <span className="text-saffron-400">在线定制报价</span>
              </>
            ) : (
              <>
                Plan Your Sacred Circuit · <span className="text-saffron-400">Request a Quote</span>
              </>
            )}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
            {lang === 'zh'
              ? '只需几个简单步骤，我们的高级朝圣顾问将在24小时内向您提供精确报价。'
              : 'A few simple steps and our senior planners will send you a personalized quote within 24 hours.'}
          </p>
        </motion.div>

        {/* Multi-step Inquiry Wizard — narrow, portrait-style, glassmorphism card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto"
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 sm:p-10">
            {!submitted && (
              <div className="mb-8">
                <Stepper steps={STEPS} currentIndex={currentStep} lang={lang} onStepClick={jumpToStep} />
              </div>
            )}

            <AnimatePresence mode="wait">
              {errorMsg && !submitted && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-2xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2.5">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait" custom={direction}>
              {submitted ? (
                <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <SuccessScreen lang={lang} />
                </motion.div>
              ) : (
                <motion.div
                  key={currentStep}
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="focus:outline-none"
                >
                  {currentStep === 0 && <StepPersonal {...stepProps} />}
                  {currentStep === 1 && <StepTravel form={form} setForm={setForm} tours={tours} lang={lang} />}
                  {currentStep === 2 && (
                    <>
                      <StepReview form={form} tours={tours} lang={lang} onEdit={jumpToStep} />
                      {!user && (
                        <p className="mt-4 text-[11px] text-slate-400 text-center">
                          {lang === 'zh' ? '提交前需要登录账户。' : "You'll need to be logged in to submit."}
                        </p>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {!submitted && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
                <button
                  type="button"
                  onClick={goBack}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer ${
                    currentStep === 0 ? 'invisible' : ''
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {lang === 'zh' ? '上一步' : 'Back'}
                </button>

                {currentStep < STEPS.length - 1 ? (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={goNext}
                    className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-neutral-950 text-xs font-bold shadow-lg transition-colors cursor-pointer"
                  >
                    {lang === 'zh' ? '下一步' : 'Continue'}
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    whileHover={{ scale: submitting || Object.keys(errors).length > 0 ? 1 : 1.03 }}
                    whileTap={{ scale: submitting || Object.keys(errors).length > 0 ? 1 : 0.97 }}
                    onClick={handleFinalSubmit}
                    disabled={submitting || Object.keys(errors).length > 0}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-neutral-950 text-xs font-bold shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {lang === 'zh' ? '正在提交...' : 'Submitting...'}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {lang === 'zh' ? '提交申请' : 'Submit Request'}
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* CTA band — alternative contact methods */}
        <div className="max-w-2xl mx-auto mt-10">
          <div className="rounded-3xl border border-slate-800 bg-white/3 backdrop-blur-md p-6 sm:p-8 text-center">
            <h3 className="text-base sm:text-lg font-serif font-bold text-white mb-1">
              {lang === 'zh' ? '需要协助规划您的朝圣之旅吗？' : 'Need help planning your pilgrimage?'}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              {lang === 'zh' ? '我们的顾问随时为您解答。' : 'Our specialists are ready to help — reach out directly.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/${CONTACT_DETAILS.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600/15 border border-emerald-600/30 text-emerald-300 text-xs font-bold hover:bg-emerald-600/25 transition-colors cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" />
                {lang === 'zh' ? 'WhatsApp 咨询' : 'WhatsApp Us'}
              </a>
              <a
                href={`mailto:${CONTACT_DETAILS.email}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-slate-700 text-slate-200 text-xs font-bold hover:border-saffron-400/50 transition-colors cursor-pointer"
              >
                <Mail className="h-4 w-4" />
                {lang === 'zh' ? '邮件联系' : 'Email Us'}
              </a>
              <a
                href={`tel:${CONTACT_DETAILS.phone.replace(/\s+/g, '')}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-slate-700 text-slate-200 text-xs font-bold hover:border-saffron-400/50 transition-colors cursor-pointer"
              >
                <Phone className="h-4 w-4" />
                {lang === 'zh' ? '电话咨询' : 'Call Us'}
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Search Accordion */}
        <div className="max-w-4xl mx-auto mt-10 bg-[#161f30] p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
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
                <div key={idx} className="bg-[#192235] rounded-2xl border border-slate-800 overflow-hidden shadow-sm transition-all">
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
