import React, { useContext, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, MessageCircle, UserPlus, Loader2 } from 'lucide-react';
import AuthLayout from '../components/Auth/AuthLayout';
import FormField from '../components/Auth/FormField';
import PasswordField from '../components/Auth/PasswordField';
import CountryCodeSelect from '../components/Auth/CountryCodeSelect';
import ErrorSummary from '../components/Auth/ErrorSummary';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { validateSignupForm, serverMessage, fromServerFieldErrors } from '../utils/authValidation';

const initialForm = {
  name: '',
  email: '',
  phoneCountryCode: '+86',
  phone: '',
  wechatId: '',
  password: '',
  confirmPassword: '',
};

export default function SignupPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const nextPath = searchParams.get('next');

  if (user) {
    const dest = nextPath || '/';
    return <Navigate to={dest} replace />;
  }

  const fieldError = (field) => {
    const found = errors.find((e) => e.field === field);
    return found ? found[lang] : undefined;
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const localErrors = validateSignupForm(form);
    if (localErrors.length) {
      setErrors(localErrors);
      return;
    }

    setErrors([]);
    setSubmitting(true);
    try {
      await api.post('/api/auth/signup', {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phoneCountryCode: form.phone ? form.phoneCountryCode : undefined,
        phone: form.phone || undefined,
        wechatId: form.wechatId || undefined,
      });

      // Seamless onboarding: the signup endpoint doesn't return a token, so
      // log the tourist straight in with the credentials they just chose.
      try {
        const { data } = await api.post('/api/auth/login', {
          email: form.email.trim(),
          password: form.password,
        });
        login(data.token, { name: data.name, email: data.email, role: data.role });
        navigate(nextPath || '/account', { replace: true });
      } catch (autoLoginErr) {
        navigate('/login', { replace: true, state: { signupSuccess: true } });
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setErrors(fromServerFieldErrors(data.errors));
      } else if (data?.error) {
        setErrors([{ field: err.response?.status === 409 ? 'email' : '_general', ...serverMessage(data.error) }]);
      } else {
        setErrors([{ field: '_general', en: 'Something went wrong. Please try again.', zh: '出现错误，请稍后再试。' }]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow={t('auth.signup.eyebrow')}
      heroTitle={lang === 'zh' ? '智慧、慈悲与觉悟之旅' : 'A Journey of Wisdom, Compassion, and Enlightenment'}
      heroSubtitle={
        lang === 'zh'
          ? '创建账户即可提交报价申请、保存您的资料，并随时查看每一次咨询的最新进度。'
          : 'Create an account to request quotes, save your details, and track every inquiry from first contact to booking.'
      }
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-neutral-100 shadow-lg shadow-maroon-900/5 p-7 sm:p-9">
        <ErrorSummary errors={errors} lang={lang} />

        <h1 className="text-2xl font-bold text-neutral-900 mb-1.5">{t('auth.signup.title')}</h1>
        <p className="text-sm text-neutral-500 mb-7">{t('auth.signup.subtitle')}</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormField
            id="name"
            label={t('auth.signup.name')}
            icon={User}
            autoComplete="name"
            placeholder={t('auth.signup.namePlaceholder')}
            value={form.name}
            onChange={handleChange('name')}
            error={fieldError('name')}
          />

          <FormField
            id="email"
            label={t('auth.signup.email')}
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder={t('auth.signup.emailPlaceholder')}
            value={form.email}
            onChange={handleChange('email')}
            error={fieldError('email')}
          />

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
              {t('auth.signup.phone')}
            </label>
            <div className="flex gap-2">
              <CountryCodeSelect
                value={form.phoneCountryCode}
                onChange={(code) => setForm((f) => ({ ...f, phoneCountryCode: code }))}
                error={fieldError('phoneCountryCode')}
                searchPlaceholder={t('auth.signup.countrySearchPlaceholder')}
              />
              <div className="relative flex-1">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-neutral-400" />
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder={t('auth.signup.phonePlaceholder')}
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                  className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 ${
                    fieldError('phone')
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                      : 'border-neutral-200 focus:border-maroon-400 focus:ring-maroon-100'
                  }`}
                />
              </div>
            </div>
            {fieldError('phone') && <p className="mt-1.5 text-xs text-red-600">{fieldError('phone')}</p>}
          </div>

          <FormField
            id="wechatId"
            label={t('auth.signup.wechat')}
            icon={MessageCircle}
            placeholder={t('auth.signup.wechatPlaceholder')}
            value={form.wechatId}
            onChange={handleChange('wechatId')}
            error={fieldError('wechatId')}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <PasswordField
              id="password"
              label={t('auth.signup.password')}
              placeholder={t('auth.signup.passwordPlaceholder')}
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange('password')}
              error={fieldError('password')}
              showLabel={t('auth.login.show')}
              hideLabel={t('auth.login.hide')}
            />
            <PasswordField
              id="confirmPassword"
              label={t('auth.signup.confirmPassword')}
              placeholder={t('auth.signup.confirmPasswordPlaceholder')}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={fieldError('confirmPassword')}
              showLabel={t('auth.login.show')}
              hideLabel={t('auth.login.hide')}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-maroon-700 hover:bg-maroon-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm py-3 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('auth.signup.submitting')}
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                {t('auth.signup.submit')}
              </>
            )}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-neutral-500">
          {t('auth.signup.haveAccount')}{' '}
          <Link
            to={nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : '/login'}
            className="font-semibold text-maroon-700 hover:text-maroon-800"
          >
            {t('auth.signup.loginLink')}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
