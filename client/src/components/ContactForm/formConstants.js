export const GROUP_SIZE_OPTIONS = [
  { val: 1, icon: 'User', label: { en: 'Solo', zh: '独自朝圣' }, subtitle: { en: 'Just me', zh: '一人成行' } },
  { val: 2, icon: 'Heart', label: { en: 'Couple', zh: '双人同行' }, subtitle: { en: '2 travelers', zh: '2人结伴' } },
  { val: 4, icon: 'Home', label: { en: 'Family', zh: '家庭出游' }, subtitle: { en: '3–5 travelers', zh: '3-5人' } },
  { val: 10, icon: 'Users', label: { en: 'Small Sangha', zh: '小型僧团' }, subtitle: { en: '6–15 travelers', zh: '6-15人' } },
  { val: 20, icon: 'UserPlus', label: { en: 'Large Group', zh: '大型团队' }, subtitle: { en: '16+ travelers', zh: '16人以上' } },
];

export const SEASON_OPTIONS = [
  { val: 'October 2026', icon: 'CalendarDays', subtitle: { en: 'Cool season begins', zh: '凉季伊始' } },
  { val: 'November 2026', icon: 'CalendarDays', subtitle: { en: 'Ideal pilgrimage weather', zh: '朝圣黄金季节' } },
  { val: 'December 2026', icon: 'CalendarDays', subtitle: { en: 'Winter festival season', zh: '冬季圣地庆典' } },
  { val: 'January 2027', icon: 'CalendarDays', subtitle: { en: 'Peak season', zh: '旺季出行' } },
  { val: 'February 2027', icon: 'CalendarDays', subtitle: { en: 'Pleasant & less crowded', zh: '气候宜人人潮少' } },
  { val: 'March 2027', icon: 'CalendarDays', subtitle: { en: 'Spring, before summer heat', zh: '春季，酷暑前' } },
];

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const WECHAT_RE = /^[A-Za-z0-9_-]{6,20}$/;
export const PHONE_RE = /^\d{10}$/;

export const STEPS = [
  { key: 'personal', label: { en: 'Personal Details', zh: '个人信息' }, icon: 'User' },
  { key: 'travel', label: { en: 'Travel Details', zh: '旅程详情' }, icon: 'Compass' },
  { key: 'review', label: { en: 'Review', zh: '确认提交' }, icon: 'CheckCircle2' },
];
