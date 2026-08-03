import React from 'react';
import { User, Mail, MessageSquare } from 'lucide-react';
import { CountrySelect, PhoneCodeSelect } from '../CountryDropdown';
import FloatingInput from './FloatingInput';
import SectionHeader from './SectionHeader';

export default function StepPersonal({ form, setForm, errors, touched, markTouched, lang }) {
  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div>
      <SectionHeader
        icon={User}
        title={lang === 'zh' ? '个人信息' : 'Personal Details'}
        description={lang === 'zh' ? '请告诉我们一些关于您的信息。' : 'Tell us a little about yourself.'}
      />

      <div className="space-y-5">
        <FloatingInput
          icon={User}
          name="name"
          label={lang === 'zh' ? '全名 / 姓名' : 'Full Name'}
          required
          value={form.name}
          onChange={set('name')}
          onBlur={() => markTouched('name')}
          error={errors.name}
          touched={touched.name}
          autoComplete="name"
        />

        <FloatingInput
          icon={Mail}
          name="email"
          type="email"
          label={lang === 'zh' ? '电子邮箱' : 'Email Address'}
          required
          value={form.email}
          onChange={set('email')}
          onBlur={() => markTouched('email')}
          error={errors.email}
          touched={touched.email}
          autoComplete="email"
        />

        <div>
          <p className="text-[11px] font-semibold text-[#4B4B4B] mb-1.5 pl-1">
            {lang === 'zh' ? '联系电话' : 'Phone Number'} <span className="text-saffron-500">*</span>
          </p>
          <div className="flex gap-2">
            <PhoneCodeSelect value={form.phoneCountryCode} onChange={(val) => setForm((prev) => ({ ...prev, phoneCountryCode: val }))} />
            <div className="flex-1">
              <FloatingInput
                name="phone"
                type="tel"
                inputMode="numeric"
                label={lang === 'zh' ? '10位数字' : '10-digit number'}
                required
                value={form.phone}
                onChange={set('phone')}
                onBlur={() => markTouched('phone')}
                error={errors.phone}
                touched={touched.phone}
                autoComplete="tel-national"
                maxLength={10}
              />
            </div>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-[#4B4B4B] mb-1.5 pl-1">
            {lang === 'zh' ? '居住国家 / 地区' : 'Country / Region'} <span className="text-saffron-500">*</span>
          </p>
          <CountrySelect
            id="country"
            value={form.country}
            onChange={(val) => {
              setForm((prev) => ({ ...prev, country: val }));
              markTouched('country');
            }}
            error={errors.country}
            touched={touched.country}
          />
          {touched.country && errors.country && (
            <p id="country-error" role="alert" className="text-[11px] text-[#D14343] pl-1 mt-1 font-sans">
              {errors.country}
            </p>
          )}
        </div>

        <FloatingInput
          icon={MessageSquare}
          name="wechatId"
          label={lang === 'zh' ? '微信号（选填）' : 'WeChat ID (Optional)'}
          value={form.wechatId}
          onChange={set('wechatId')}
          onBlur={() => markTouched('wechatId')}
          error={errors.wechatId}
          touched={touched.wechatId}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
