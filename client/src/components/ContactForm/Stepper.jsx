import React from 'react';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';


export default function Stepper({ steps, currentIndex, lang, onStepClick }) {
  const progressPct = (currentIndex / (steps.length - 1)) * 100;

  return (
    <div>
      {/* Compact mobile version */}
      <div className="sm:hidden space-y-2 font-sans">
        <div className="flex items-center justify-between text-[11px] font-semibold text-body">
          <span>
            {lang === 'zh' ? `第 ${currentIndex + 1} 步，共 ${steps.length} 步` : `Step ${currentIndex + 1} of ${steps.length}`}
          </span>
          <span className="text-maroon-700 font-bold">{steps[currentIndex].label[lang] || steps[currentIndex].label.en}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-card-border overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-maroon-700"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Full version */}
      <div className="hidden sm:flex items-start font-sans">
        {steps.map((step, idx) => {
          const Icon = Icons[step.icon];
          const isDone = idx < currentIndex;
          const isActive = idx === currentIndex;
          const clickable = isDone && !!onStepClick;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center gap-2 w-0 flex-1 min-w-fit">
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={() => clickable && onStepClick(idx)}
                  className={`relative h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-maroon-700 border-maroon-700 shadow-[0_0_0_4px_rgba(109,31,50,0.15)] text-white font-bold'
                      : isDone
                      ? 'bg-maroon-700/10 border-maroon-700 text-maroon-700 cursor-pointer hover:bg-maroon-700/20'
                      : 'bg-white border-card-border text-muted'
                  }`}
                >
                  {isDone ? <Icons.Check className="h-4 w-4 text-maroon-700" strokeWidth={3} /> : Icon ? <Icon className="h-4 w-4" /> : idx + 1}
                </button>
                <span
                  className={`text-[11px] tracking-wide text-center transition-colors duration-300 ${
                    isActive ? 'text-maroon-700 font-extrabold' : isDone ? 'text-heading font-semibold' : 'text-muted font-normal'
                  }`}
                >
                  {step.label[lang] || step.label.en}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div className="flex-1 h-0.5 mt-5 rounded-full bg-card-border overflow-hidden">
                  <motion.div
                    className="h-full bg-maroon-700"
                    initial={false}
                    animate={{ width: idx < currentIndex ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
