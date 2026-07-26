import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Send, Loader2, MailCheck, ArrowLeft } from 'lucide-react';
import AuthLayout from '../components/Auth/AuthLayout';
import FormField from '../components/Auth/FormField';
import ErrorSummary from '../components/Auth/ErrorSummary';
import api from '../utils/api';
import { validateForgotPasswordForm, fromServerFieldErrors } from '../utils/authValidation';

export default function ForgotPasswordPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const fieldError = (field) => {
    const found = errors.find((e) => e.field === field);
    return found ? found[lang] : undefined;
  };

  const submitRequest = async () => {
    setErrors([]);
    setSubmitting(true);
    try {
      await api.post('/api/auth/forgot-password', { email: email.trim() });
      setSent(true);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setErrors(fromServerFieldErrors(data.errors));
      } else {
        // Backend always responds 200 for this endpoint by design — a network
        // failure is the only realistic error path here.
        setErrors([{ field: '_general', en: 'Something went wrong. Please try again.', zh: '出现错误，请稍后再试。' }]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const localErrors = validateForgotPasswordForm({ email });
    if (localErrors.length) {
      setErrors(localErrors);
      return;
    }
    submitRequest();
  };

  return (
    <AuthLayout
      eyebrow={t('auth.forgot.eyebrow')}
      heroTitle={lang === 'zh' ? '心怀敬意，追寻佛迹' : 'Every Path Home Begins With a Single Step'}
      heroSubtitle={
        lang === 'zh'
          ? '别担心，这种事时常发生。请输入您的邮箱，我们会帮您找回账户。'
          : "It happens to the best of us. Enter your email and we'll help you get back to planning your journey."
      }
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-neutral-100 shadow-lg shadow-maroon-900/5 p-7 sm:p-9">
        {!sent ? (
          <>
            <ErrorSummary errors={errors} lang={lang} />

            <h1 className="text-2xl font-bold text-neutral-900 mb-1.5">{t('auth.forgot.title')}</h1>
            <p className="text-sm text-neutral-500 mb-7">{t('auth.forgot.subtitle')}</p>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <FormField
                id="email"
                label={t('auth.forgot.email')}
                icon={Mail}
                type="email"
                autoComplete="email"
                placeholder={t('auth.forgot.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldError('email')}
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-maroon-700 hover:bg-maroon-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm py-3 rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('auth.forgot.submitting')}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t('auth.forgot.submit')}
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-2">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-saffron-100 text-saffron-600">
              <MailCheck className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">{t('auth.forgot.sentTitle')}</h1>
            <p className="text-sm text-neutral-500 leading-relaxed">
              {t('auth.forgot.sentMessage', { email })}
            </p>
            <p className="mt-4 text-xs text-neutral-400">
              {t('auth.forgot.sentHint')}{' '}
              <button
                type="button"
                onClick={submitRequest}
                className="font-semibold text-maroon-700 hover:text-maroon-800 cursor-pointer"
              >
                {t('auth.forgot.resend')}
              </button>
            </p>
          </div>
        )}

        <Link
          to="/login"
          className="mt-7 flex items-center justify-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-maroon-700 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t('auth.forgot.backToLogin')}
        </Link>
      </div>
    </AuthLayout>
  );
}
