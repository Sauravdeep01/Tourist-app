import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Home, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function SuccessScreen({ lang }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
      className="flex flex-col items-center text-center py-6"
    >
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.05 }}
        className="relative h-20 w-20 mb-6"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500/25 animate-ping" />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.5)]">
          <Check className="h-10 w-10 text-white" strokeWidth={3} />
        </span>
      </motion.div>

      <motion.h3 variants={item} className="text-2xl sm:text-3xl font-serif font-bold text-white">
        {lang === 'zh' ? '我们已收到您的咨询！' : "We've received your inquiry."}
      </motion.h3>

      <motion.p variants={item} className="text-sm text-slate-300 mt-3 max-w-sm leading-relaxed">
        {lang === 'zh'
          ? '我们的高级朝圣顾问将在24小时内与您联系，为您提供专属报价与行程建议。'
          : 'Our travel expert will contact you within 24 hours with a personalized itinerary and quote.'}
      </motion.p>

      <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-3 mt-8 w-full sm:w-auto">
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-700 text-white text-sm font-semibold hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Home className="h-4 w-4" />
          {lang === 'zh' ? '返回首页' : 'Return Home'}
        </Link>
        <Link
          to="/tours"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-neutral-950 text-sm font-bold shadow-lg transition-colors cursor-pointer"
        >
          <Compass className="h-4 w-4" />
          {lang === 'zh' ? '探索朝圣路线' : 'Explore Tours'}
        </Link>
      </motion.div>
    </motion.div>
  );
}
