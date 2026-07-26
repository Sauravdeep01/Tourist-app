import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { KeyRound, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import AuthLayout from '../components/Auth/AuthLayout';
import PasswordField from '../components/Auth/PasswordField';
import ErrorSummary from '../components/Auth/ErrorSummary';
import api from '../utils/api';
import { validateResetPasswordForm, fromServerFieldErrors } from '../utils/authValidation';

export default function ResetPasswordPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  // 'form' | 'success' | 'invalid'
  const [stage, setStage] = useState(token ? 'form' : 'invalid');

  const fieldError = (field) => {
    const found = errors.find((e) => e.field === field);
    return found ? found[lang] : undefined;
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const localErrors = validateResetPasswordForm(form);
    if (localErrors.length) {
      setErrors(localErrors);
      return;
    }

    setErrors([]);
    setSubmitting(true);
    try {
      await api.post('/api/auth/reset-password', { token, newPassword: form.newPassword });
      setStage('success');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setErrors(fromServerFieldErrors(data.errors));
      } else if (data?.error) {
        // An expired/invalid token is not worth letting them retry against — show the dead-end state
        setStage('invalid');
      } else {
        setErrors([{ field: '_general', en: 'Something went wrong. Please try again.', zh: '出现错误，请稍后再试。' }]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow={t('auth.reset.eyebrow')}
      heroTitle={lang === 'zh' ? '智慧、慈悲与觉悟之旅' : 'A Journey of Wisdom, Compassion, and Enlightenment'}
      heroSubtitle={
        lang === 'zh'
          ? '设置一个新密码，即可继续您的朝圣旅程规划。'
          : 'Set a new password and pick up right where you left off.'
      }
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-neutral-100 shadow-lg shadow-maroon-900/5 p-7 sm:p-9">
        {stage === 'form' && (
          <>
            <ErrorSummary errors={errors} lang={lang} />

            <h1 className="text-2xl font-bold text-neutral-900 mb-1.5">{t('auth.reset.title')}</h1>
            <p className="text-sm text-neutral-500 mb-7">{t('auth.reset.subtitle')}</p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <PasswordField
                id="newPassword"
                label={t('auth.reset.newPassword')}
                placeholder={t('auth.reset.newPasswordPlaceholder')}
                autoComplete="new-password"
                value={form.newPassword}
                onChange={handleChange('newPassword')}
                error={fieldError('newPassword')}
                showLabel={t('auth.login.show')}
                hideLabel={t('auth.login.hide')}
              />
              <PasswordField
                id="confirmPassword"
                label={t('auth.reset.confirmPassword')}
                placeholder={t('auth.reset.confirmPasswordPlaceholder')}
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                error={fieldError('confirmPassword')}
                showLabel={t('auth.login.show')}
                hideLabel={t('auth.login.hide')}
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-maroon-700 hover:bg-maroon-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm py-3 rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('auth.reset.submitting')}
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    {t('auth.reset.submit')}
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {stage === 'success' && (
          <div className="text-center py-2">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">{t('auth.reset.successTitle')}</h1>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6">{t('auth.reset.successMessage')}</p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-maroon-700 hover:bg-maroon-800 text-white font-medium text-sm px-6 py-3 rounded-xl transition-colors shadow-xs"
            >
              {t('auth.reset.goToLogin')}
            </Link>
          </div>
        )}

        {stage === 'invalid' && (
          <div className="text-center py-2">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500">
              <XCircle className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">{t('auth.reset.invalidTitle')}</h1>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6">{t('auth.reset.invalidMessage')}</p>
            <Link
              to="/forgot-password"
              className="inline-flex items-center justify-center gap-2 bg-maroon-700 hover:bg-maroon-800 text-white font-medium text-sm px-6 py-3 rounded-xl transition-colors shadow-xs"
            >
              {t('auth.reset.requestNew')}
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
