import { isValidCountryCode } from './countryCodes';

/**
 * Client-side mirrors of the backend's auth validation rules (server/middlewares
 * /validators/authValidators.js, §6.6) so the UI can give instant, bilingual
 * feedback before ever hitting the network (FE-3). The backend re-validates
 * everything — this is convenience, not the source of truth.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WECHAT_RE = /^[A-Za-z0-9_-]{6,20}$/;
const PHONE_RE = /^\d{10}$/;

const fieldError = (field, en, zh) => ({ field, en, zh });

export function validateLoginForm({ email, password }) {
  const errors = [];
  if (!email || !EMAIL_RE.test(email.trim())) {
    errors.push(fieldError('email', 'Please enter a valid email address', '请输入有效的电子邮箱地址'));
  }
  if (!password) {
    errors.push(fieldError('password', 'Password is required', '请输入密码'));
  }
  return errors;
}

export function validateSignupForm({ name, email, password, confirmPassword, phone, phoneCountryCode, wechatId }) {
  const errors = [];
  const trimmedName = (name || '').trim();

  if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 20) {
    errors.push(fieldError('name', 'Name must be between 2 and 20 characters', '姓名长度须为 2 到 20 个字符'));
  }

  if (!email || !EMAIL_RE.test(email.trim())) {
    errors.push(fieldError('email', 'Please enter a valid email address', '请输入有效的电子邮箱地址'));
  }

  if (!password) {
    errors.push(fieldError('password', 'Password is required', '请输入密码'));
  } else if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    errors.push(
      fieldError('password', 'Password must be at least 8 characters with a letter and a number', '密码至少需要 8 个字符，并包含字母和数字')
    );
  }

  if (confirmPassword !== password) {
    errors.push(fieldError('confirmPassword', 'Passwords do not match', '两次输入的密码不一致'));
  }

  if (phone) {
    if (!PHONE_RE.test(phone)) {
      errors.push(fieldError('phone', 'Phone number must be exactly 10 digits', '电话号码必须为 10 位数字'));
    }
    if (!phoneCountryCode || !isValidCountryCode(phoneCountryCode)) {
      errors.push(fieldError('phoneCountryCode', 'Please select a country code', '请选择国家/地区代码'));
    }
  }

  if (wechatId && !WECHAT_RE.test(wechatId)) {
    errors.push(fieldError('wechatId', 'WeChat ID must be 6–20 characters', '微信号须为 6 到 20 个字符'));
  }

  return errors;
}

export function validateForgotPasswordForm({ email }) {
  const errors = [];
  if (!email || !EMAIL_RE.test(email.trim())) {
    errors.push(fieldError('email', 'Please enter a valid email address', '请输入有效的电子邮箱地址'));
  }
  return errors;
}

export function validateResetPasswordForm({ newPassword, confirmPassword }) {
  const errors = [];
  if (!newPassword) {
    errors.push(fieldError('newPassword', 'Password is required', '请输入新密码'));
  } else if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
    errors.push(
      fieldError('newPassword', 'Password must be at least 8 characters with a letter and a number', '密码至少需要 8 个字符，并包含字母和数字')
    );
  }
  if (confirmPassword !== newPassword) {
    errors.push(fieldError('confirmPassword', 'Passwords do not match', '两次输入的密码不一致'));
  }
  return errors;
}

// The backend only ever speaks English (server/middlewares/validators). This
// lookup gives known messages a Chinese counterpart so the error UI stays
// bilingual even for server-originated errors; unknown messages fall back
// to the raw English string rather than showing nothing.
const SERVER_MESSAGE_ZH = {
  'Please enter a valid email address': '请输入有效的电子邮箱地址',
  'This email is already registered — try logging in.': '该邮箱已被注册，请直接登录。',
  'An account with this email already exists': '该邮箱已被注册',
  'Invalid email or password': '邮箱或密码不正确',
  'Password is required': '请输入密码',
  'Password must be at least 8 characters with a letter and a number': '密码至少需要 8 个字符，并包含字母和数字',
  'Name must be between 2 and 20 characters': '姓名长度须为 2 到 20 个字符',
  'Phone number must be exactly 10 digits': '电话号码必须为 10 位数字',
  'Please select a country code': '请选择国家/地区代码',
  'WeChat ID must be 6–20 characters': '微信号须为 6 到 20 个字符',
  'Reset token is required': '缺少重置令牌',
  'This reset link is invalid or has expired. Please request a new one.': '此重置链接无效或已过期，请重新申请。',
  'Account has been deactivated': '该账户已被停用',
  'Server error occurred': '服务器发生错误，请稍后再试',
};

// Normalizes a server error message into the {en, zh} shape used everywhere else.
export function serverMessage(message) {
  return { en: message, zh: SERVER_MESSAGE_ZH[message] || message };
}

// Normalizes the backend's { errors: [{ field, message }] } shape into the
// same { field, en, zh } shape produced by the validators above.
export function fromServerFieldErrors(serverErrors) {
  return (serverErrors || []).map((e) => ({
    field: e.field,
    en: e.message,
    zh: SERVER_MESSAGE_ZH[e.message] || e.message,
  }));
}
