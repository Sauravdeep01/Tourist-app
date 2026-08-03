import React from 'react';
import { Compass, Minus, Plus, Sparkles } from 'lucide-react';
import SelectableCard from './SelectableCard';
import SectionHeader from './SectionHeader';
import { GROUP_SIZE_OPTIONS, SEASON_OPTIONS } from './formConstants';

export default function StepTravel({ form, setForm, tours, lang }) {
  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const adjustGroupSize = (delta) => {
    setForm((prev) => ({ ...prev, groupSize: Math.min(100, Math.max(1, Number(prev.groupSize || 1) + delta)) }));
  };

  return (
    <div className="space-y-8 font-sans">
      <div>
        <SectionHeader
          icon={Compass}
          title={lang === 'zh' ? '旅程规划' : 'Travel Plan'}
          description={lang === 'zh' ? '选择您期望的朝圣路线。' : 'Choose your preferred journey.'}
        />

        <p className="text-[11px] font-bold text-[#4B4B4B] uppercase tracking-wider mb-2 pl-1 font-sans">
          {lang === 'zh' ? '意向朝圣路线' : 'Intended Tour'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectableCard
            icon={Sparkles}
            title={lang === 'zh' ? '通用定制行程' : 'General Custom Circuit'}
            subtitle={lang === 'zh' ? '由顾问为您专属规划' : 'Planned by our specialists'}
            selected={!form.tourId}
            onClick={() => setField('tourId', '')}
          />
          {tours.map((t) => (
            <SelectableCard
              key={t._id}
              icon={Compass}
              title={t.title?.[lang] || t.title?.en || t.title?.zh || 'Pilgrimage Circuit'}
              subtitle={
                t.days && t.nights
                  ? `${t.days}${lang === 'zh' ? '天' : 'D'} / ${t.nights}${lang === 'zh' ? '晚' : 'N'}`
                  : undefined
              }
              selected={form.tourId === t._id}
              onClick={() => setField('tourId', t._id)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold text-[#4B4B4B] uppercase tracking-wider mb-2 pl-1 font-sans">
          {lang === 'zh' ? '参团人数' : 'Group Size'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {GROUP_SIZE_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.val}
              icon={opt.icon}
              title={opt.label[lang] || opt.label.en}
              subtitle={opt.subtitle[lang] || opt.subtitle.en}
              selected={Number(form.groupSize) === opt.val}
              onClick={() => setField('groupSize', opt.val)}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between p-3.5 rounded-[14px] border-2 border-[#D7DDE5] bg-[#F6F7F9] shadow-[inset_0_1px_3px_rgba(16,24,40,0.04)] font-sans">
          <span className="text-xs font-semibold text-[#4B4B4B]">
            {lang === 'zh' ? '确切出行人数' : 'Number of Travelers'}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => adjustGroupSize(-1)}
              className="h-8 w-8 rounded-full flex items-center justify-center border border-[#D7DDE5] bg-white text-maroon-700 hover:border-saffron-500 transition-colors cursor-pointer"
              aria-label={lang === 'zh' ? '减少人数' : 'Decrease travelers'}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-heading tabular-nums">{form.groupSize}</span>
            <button
              type="button"
              onClick={() => adjustGroupSize(1)}
              className="h-8 w-8 rounded-full flex items-center justify-center border border-[#D7DDE5] bg-white text-maroon-700 hover:border-saffron-500 transition-colors cursor-pointer"
              aria-label={lang === 'zh' ? '增加人数' : 'Increase travelers'}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold text-[#4B4B4B] uppercase tracking-wider mb-2 pl-1 font-sans">
          {lang === 'zh' ? '预计出发月份' : 'Travel Month'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SEASON_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.val}
              icon={opt.icon}
              title={opt.val}
              subtitle={opt.subtitle[lang] || opt.subtitle.en}
              selected={form.travelDate === opt.val}
              onClick={() => setField('travelDate', opt.val)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
