import React, { useContext, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, LogIn, Loader2, CheckCircle2 } from 'lucide-react';
import AuthLayoutClassic from '../components/Auth/AuthLayoutClassic';
import FormFieldClassic from '../components/Auth/FormFieldClassic';
import PasswordFieldClassic from '../components/Auth/PasswordFieldClassic';
import ErrorSummary from '../components/Auth/ErrorSummary';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { validateLoginForm, serverMessage, fromServerFieldErrors } from '../utils/authValidation';

// NOTE: LoginPage intentionally keeps the site's original dark
// maroon/saffron gradient aesthetic via AuthLayoutClassic/FormFieldClassic/
// PasswordFieldClassic. It does not use the shared light-theme components —
// do not migrate it to the global theme system.
export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const nextPath = searchParams.get('next');
  const signupSuccess = location.state?.signupSuccess;

  // Already authenticated? Redirect to home page.
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
    const localErrors = validateLoginForm(form);
    if (localErrors.length) {
      setErrors(localErrors);
      return;
    }

    setErrors([]);
    setSubmitting(true);
    try {
      const { data } = await api.post('/api/auth/login', {
        email: form.email.trim(),
        password: form.password,
      });
      login(data.token, { name: data.name, email: data.email, role: data.role });
      const dest = nextPath || '/';
      navigate(dest, { replace: true });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setErrors(fromServerFieldErrors(data.errors));
      } else if (data?.error) {
        setErrors([{ field: '_general', ...serverMessage(data.error) }]);
      } else {
        setErrors([{ field: '_general', en: 'Something went wrong. Please try again.', zh: '出现错误，请稍后再试。' }]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayoutClassic
      eyebrow={t('auth.login.eyebrow')}
      heroTitle={lang === 'zh' ? '追寻佛陀的足迹' : 'Walk in the Footsteps of the Buddha'}
      heroSubtitle={
        lang === 'zh'
          ? '登录您的账户，继续规划您的圣地朝圣之旅——查看专属报价、追踪咨询进度。'
          : 'Sign back in to continue planning your pilgrimage — track quotes, inquiries, and every sacred stop along the way.'
      }
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-neutral-100 shadow-lg shadow-maroon-900/5 p-7 sm:p-9">
        {signupSuccess && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {lang === 'zh' ? '账户创建成功，请登录。' : 'Account created successfully — please log in.'}
          </div>
        )}

        <ErrorSummary errors={errors} lang={lang} />

        <h1 className="text-2xl font-bold text-neutral-900 mb-1.5">{t('auth.login.title')}</h1>
        <p className="text-sm text-neutral-500 mb-7">{t('auth.login.subtitle')}</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormFieldClassic
            id="email"
            label={t('auth.login.email')}
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder={t('auth.login.emailPlaceholder')}
            value={form.email}
            onChange={handleChange('email')}
            error={fieldError('email')}
          />

          <div>
            <PasswordFieldClassic
              id="password"
              label={t('auth.login.password')}
              placeholder={t('auth.login.passwordPlaceholder')}
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange('password')}
              error={fieldError('password')}
              showLabel={t('auth.login.show')}
              hideLabel={t('auth.login.hide')}
            />
            <div className="flex justify-end mt-2">
              <Link to="/forgot-password" className="text-xs font-medium text-maroon-700 hover:text-maroon-800">
                {t('auth.login.forgot')}
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-maroon-700 hover:bg-maroon-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm py-3 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('auth.login.submitting')}
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                {t('auth.login.submit')}
              </>
            )}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-neutral-500">
          {t('auth.login.noAccount')}{' '}
          <Link
            to={nextPath ? `/signup?next=${encodeURIComponent(nextPath)}` : '/signup'}
            className="font-semibold text-maroon-700 hover:text-maroon-800"
          >
            {t('auth.login.signupLink')}
          </Link>
        </p>
      </div>
    </AuthLayoutClassic>
  );
}
