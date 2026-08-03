import React from 'react';
import { CheckCircle2, Pencil } from 'lucide-react';
import SectionHeader from './SectionHeader';

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-xs font-sans">
      <span className="text-body shrink-0">{label}</span>
      <span className="text-heading font-semibold text-right wrap-break-word">{value}</span>
    </div>
  );
}

function SummaryCard({ title, onEdit, editLabel, children }) {
  return (
    <div className="rounded-2xl border border-card-border bg-white p-4 sm:p-5 font-sans">
      <div className="flex items-center justify-between border-b border-card-border pb-2.5 mb-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-maroon-700">{title}</h4>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-[11px] font-semibold text-body hover:text-maroon-700 transition-colors cursor-pointer"
        >
          <Pencil className="h-3 w-3" />
          {editLabel}
        </button>
      </div>
      <div className="divide-y divide-card-border">{children}</div>
    </div>
  );
}

export default function StepReview({ form, tours, lang, onEdit }) {
  const dash = lang === 'zh' ? '未填写' : 'Not specified';
  const selectedTour = tours.find((t) => t._id === form.tourId);
  const tourTitle = selectedTour
    ? selectedTour.title?.[lang] || selectedTour.title?.en
    : lang === 'zh'
    ? '通用定制行程'
    : 'General Custom Circuit';
  const editLabel = lang === 'zh' ? '编辑' : 'Edit';

  return (
    <div>
      <SectionHeader
        icon={CheckCircle2}
        title={lang === 'zh' ? '确认信息并提交' : 'Review & Submit'}
        description={lang === 'zh' ? '提交前请确认您填写的信息无误。' : 'Please confirm your details before submitting.'}
      />

      <div className="space-y-4">
        <SummaryCard title={lang === 'zh' ? '个人信息' : 'Personal Details'} onEdit={() => onEdit(0)} editLabel={editLabel}>
          <Row label={lang === 'zh' ? '姓名' : 'Name'} value={form.name || dash} />
          <Row label={lang === 'zh' ? '邮箱' : 'Email'} value={form.email || dash} />
          <Row
            label={lang === 'zh' ? '电话' : 'Phone'}
            value={form.phone ? `${form.phoneCountryCode} ${form.phone}` : dash}
          />
          <Row label={lang === 'zh' ? '国家/地区' : 'Country'} value={form.country || dash} />
          <Row label={lang === 'zh' ? '微信' : 'WeChat'} value={form.wechatId || dash} />
        </SummaryCard>

        <SummaryCard title={lang === 'zh' ? '旅程详情' : 'Travel Plan'} onEdit={() => onEdit(1)} editLabel={editLabel}>
          <Row label={lang === 'zh' ? '意向路线' : 'Intended Tour'} value={tourTitle} />
          <Row
            label={lang === 'zh' ? '出行人数' : 'Group Size'}
            value={`${form.groupSize} ${lang === 'zh' ? '人' : form.groupSize === 1 ? 'traveler' : 'travelers'}`}
          />
          <Row label={lang === 'zh' ? '出发月份' : 'Travel Month'} value={form.travelDate || dash} />
        </SummaryCard>
      </div>
    </div>
  );
}
