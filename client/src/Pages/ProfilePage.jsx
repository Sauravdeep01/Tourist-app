import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { COUNTRY_CODES, ALL_COUNTRIES } from '../utils/countryCodes';
import { CountrySelect, PhoneCodeSelect } from '../components/CountryDropdown';
import api from '../utils/api';
import {
  User,
  Mail,
  Phone,
  Lock,
  Globe,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Save,
  KeyRound
} from 'lucide-react';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { user, login: updateAuthUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Profile Form States
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phoneCountryCode: '+86',
    phone: '',
    wechatId: '',
    country: 'China',
    role: 'user'
  });

  // Password Change States
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Feedback States
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Fetch logged in user profile details
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoadingProfile(false);
        return;
      }
      try {
        setLoadingProfile(true);
        const { data } = await api.get('/api/auth/me');
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          phoneCountryCode: data.phoneCountryCode || '+86',
          phone: data.phone || '',
          wechatId: data.wechatId || '',
          country: data.country || 'China',
          role: data.role || 'user'
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setProfileError(
          lang === 'zh' ? '加载个人资料失败' : 'Failed to load profile details.'
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user, lang]);

  // Handle Profile Form Submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!profileData.name.trim()) {
      setProfileError(lang === 'zh' ? '请输入您的姓名' : 'Please enter your name.');
      return;
    }

    if (profileData.phone && !/^\d{10}$/.test(profileData.phone)) {
      setProfileError(
        lang === 'zh' ? '手机号码必须为10位数字' : 'Phone number must be exactly 10 digits.'
      );
      return;
    }

    try {
      setSavingProfile(true);
      const { data } = await api.put('/api/auth/me', {
        name: profileData.name,
        phoneCountryCode: profileData.phoneCountryCode,
        phone: profileData.phone,
        wechatId: profileData.wechatId,
        country: profileData.country
      });

      setProfileSuccess(
        lang === 'zh' ? '个人资料已成功更新！' : 'Profile updated successfully!'
      );

      // Update stored user context if name changed
      if (user && data.name) {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          updateAuthUser({
            token: storedToken,
            name: data.name,
            email: data.email,
            role: data.role
          });
        }
      }
    } catch (err) {
      console.error('Profile update error:', err);
      const errMsg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.error ||
        (lang === 'zh' ? '更新失败，请重试。' : 'Failed to update profile.');
      setProfileError(errMsg);
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Password Change Submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword) {
      setPasswordError(
        lang === 'zh' ? '请输入旧密码' : 'Please enter your current password.'
      );
      return;
    }

    if (!newPassword) {
      setPasswordError(
        lang === 'zh' ? '请输入新密码' : 'Please enter a new password.'
      );
      return;
    }

    if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setPasswordError(
        lang === 'zh'
          ? '新密码必须至少包含8个字符，包含至少一个字母和数字'
          : 'New password must be at least 8 characters with a letter and a number.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        lang === 'zh' ? '两次输入的密码不一致' : 'Confirm password does not match new password.'
      );
      return;
    }

    try {
      setSavingPassword(true);
      const { data } = await api.patch('/api/auth/password', {
        currentPassword,
        newPassword
      });

      setPasswordSuccess(
        data.message || (lang === 'zh' ? '密码已成功修改！' : 'Password changed successfully!')
      );

      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Password change error:', err);
      const errMsg =
        err.response?.data?.error ||
        (lang === 'zh' ? '密码修改失败，请检查旧密码。' : 'Failed to change password. Please check your current password.');
      setPasswordError(errMsg);
    } finally {
      setSavingPassword(false);
    }
  };

  if (!user && !loadingProfile) {
    return (
      <div className="min-h-[70vh] bg-ivory flex flex-col items-center justify-center p-6 text-center text-heading font-sans">
        <div className="bg-white p-8 rounded-3xl border border-card-border shadow-xl max-w-md w-full space-y-4">
          <User className="h-12 w-12 text-maroon-700 mx-auto" />
          <h2 className="text-2xl font-serif font-bold text-heading">
            {lang === 'zh' ? '需要登录' : 'Authentication Required'}
          </h2>
          <p className="text-sm text-body leading-relaxed font-sans">
            {lang === 'zh'
              ? '请登录以管理您的个人资料和朝圣账户。'
              : 'Please log in to manage your profile and pilgrimage account.'}
          </p>
          <Link
            to="/login?next=/profile"
            className="inline-flex items-center justify-center w-full bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-sm px-6 py-3.5 rounded-2xl border border-[#9F2845] transition-all shadow-md cursor-pointer"
          >
            {lang === 'zh' ? '立即登录' : 'Log In Now'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory text-heading py-20 px-4 sm:px-6 lg:px-8 relative font-sans">
      {/* Background Subtle Starry Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#7A1F35_1px,transparent_1px)] bg-size-[32px_32px] opacity-5 pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-card-border shadow-md">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-2xl bg-maroon-700 border border-[#9F2845] flex items-center justify-center text-white font-bold font-serif text-2xl shadow-md">
              {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-heading">
                {profileData.name || user?.name || (lang === 'zh' ? '用户资料' : 'User Profile')}
              </h1>
              <p className="text-xs sm:text-sm text-body flex items-center gap-1.5 mt-0.5">
                <Mail className="h-3.5 w-3.5 text-saffron-500" />
                <span>{profileData.email || user?.email}</span>
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-maroon-700/10 text-maroon-700 border border-maroon-700/20 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-maroon-700" />
            <span>{profileData.role === 'admin' ? 'ADMIN' : profileData.role === 'owner' ? 'OWNER' : 'TOURIST'}</span>
          </div>
        </div>

        {loadingProfile ? (
          <div className="py-20 flex items-center justify-center text-body space-x-2 text-xs font-sans">
            <Loader2 className="h-6 w-6 animate-spin text-saffron-500" />
            <span>Loading user account details...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
            {/* 1. Manage Profile Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-card-border shadow-md space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 border-b border-card-border pb-4 mb-6">
                  <User className="h-5 w-5 text-saffron-500" />
                  <h2 className="text-lg font-serif font-bold text-heading">
                    {lang === 'zh' ? '管理个人信息' : 'Manage Personal Information'}
                  </h2>
                </div>

                {profileSuccess && (
                  <div className="mb-4 p-3.5 rounded-2xl bg-jade-500/10 border border-jade-500/30 text-jade-500 text-xs flex items-center gap-2 font-sans">
                    <CheckCircle2 className="h-4 w-4 text-jade-500 shrink-0" />
                    <span>{profileSuccess}</span>
                  </div>
                )}

                {profileError && (
                  <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-sans">
                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                    <span>{profileError}</span>
                  </div>
                )}

                <form id="profile-form" onSubmit={handleProfileSubmit} className="space-y-4 font-sans">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-body mb-1.5">
                      {lang === 'zh' ? '全名 / 姓名' : 'Full Name'} *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <input
                        type="text"
                        required
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        placeholder="e.g. Lin Ming"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-card-border bg-ivory text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-maroon-700/30 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Readonly Email Address */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-body mb-1.5">
                      {lang === 'zh' ? '电子邮箱地址' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <input
                        type="email"
                        disabled
                        value={profileData.email}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-card-border bg-beige text-sm text-muted cursor-not-allowed font-sans"
                      />
                    </div>
                    <p className="text-[11px] text-muted mt-1 font-sans">
                      {lang === 'zh' ? '登录邮箱无法直接修改' : 'Email address is linked to account login.'}
                    </p>
                  </div>

                  {/* Phone Country Code & Number */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-body mb-1.5">
                      {lang === 'zh' ? '联系电话' : 'Phone Number'}
                    </label>
                    <div className="flex gap-2">
                      <PhoneCodeSelect
                        value={profileData.phoneCountryCode}
                        onChange={(val) => setProfileData({ ...profileData, phoneCountryCode: val })}
                      />

                      <div className="relative flex-1">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          placeholder="10-digit number"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-card-border bg-ivory text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-maroon-700/30 transition-all font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  {/* WeChat ID */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-body mb-1.5">
                      {lang === 'zh' ? '微信号 (WeChat ID)' : 'WeChat ID'}
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <input
                        type="text"
                        value={profileData.wechatId}
                        onChange={(e) => setProfileData({ ...profileData, wechatId: e.target.value })}
                        placeholder="e.g. wx_pilgrim88"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-card-border bg-ivory text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-maroon-700/30 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Country Select Dropdown */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-body mb-1.5">
                      {lang === 'zh' ? '居住国家 / 地区' : 'Country / Region'}
                    </label>
                    <CountrySelect
                      value={profileData.country}
                      onChange={(val) => setProfileData({ ...profileData, country: val })}
                    />
                  </div>
                </form>
              </div>

              <div className="pt-6 border-t border-card-border">
                <button
                  type="submit"
                  form="profile-form"
                  disabled={savingProfile}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-maroon-700 hover:bg-maroon-800 active:scale-95 text-white font-bold text-sm px-6 py-3.5 rounded-2xl border border-[#9F2845] transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{lang === 'zh' ? '正在保存...' : 'Saving Changes...'}</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>{lang === 'zh' ? '保存资料修改' : 'Save Profile Changes'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 2. Security & Password Change Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-card-border shadow-md space-y-6 flex flex-col justify-between font-sans">
              <div>
                <div className="flex items-center space-x-2 border-b border-card-border pb-4 mb-6">
                  <KeyRound className="h-5 w-5 text-saffron-500" />
                  <h2 className="text-lg font-serif font-bold text-heading">
                    {lang === 'zh' ? '修改账户密码' : 'Change Password'}
                  </h2>
                </div>

                {passwordSuccess && (
                  <div className="mb-4 p-3.5 rounded-2xl bg-jade-500/10 border border-jade-500/30 text-jade-500 text-xs flex items-center gap-2 font-sans">
                    <CheckCircle2 className="h-4 w-4 text-jade-500 shrink-0" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                {passwordError && (
                  <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-sans">
                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <form id="password-form" onSubmit={handlePasswordSubmit} className="space-y-4 font-sans">
                  {/* Old / Current Password */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-body mb-1.5">
                      {lang === 'zh' ? '旧密码 (当前密码)' : 'Current (Old) Password'} *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        }
                        placeholder={lang === 'zh' ? '请输入您现有的旧密码' : 'Enter your old password'}
                        className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-card-border bg-ivory text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-maroon-700/30 transition-all font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-maroon-700"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-body mb-1.5">
                      {lang === 'zh' ? '新密码' : 'New Password'} *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        placeholder={lang === 'zh' ? '至少8位包含字母与数字' : 'Min 8 chars with letter & number'}
                        className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-card-border bg-ivory text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-maroon-700/30 transition-all font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-maroon-700"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-body mb-1.5">
                      {lang === 'zh' ? '确认新密码' : 'Confirm New Password'} *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        placeholder={lang === 'zh' ? '再次输入您的新密码' : 'Re-enter your new password'}
                        className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-card-border bg-ivory text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-maroon-700/30 transition-all font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-maroon-700"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="pt-6 border-t border-card-border">
                <button
                  type="submit"
                  form="password-form"
                  disabled={savingPassword}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-beige hover:bg-card-border active:scale-95 text-maroon-700 font-bold text-sm px-6 py-3.5 rounded-2xl border border-card-border transition-all shadow-xs disabled:opacity-50 cursor-pointer font-sans"
                >
                  {savingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{lang === 'zh' ? '正在修改密码...' : 'Updating Password...'}</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-4 w-4" />
                      <span>{lang === 'zh' ? '确认修改密码' : 'Update Password'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
