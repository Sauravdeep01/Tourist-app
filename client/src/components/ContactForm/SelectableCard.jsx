import React from 'react';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';


export default function SelectableCard({ icon, title, subtitle, selected, onClick }) {
  const Icon = typeof icon === 'string' ? Icons[icon] : icon;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
      aria-pressed={selected}
      className={`relative flex flex-col items-start gap-2.5 p-4 rounded-2xl border text-left cursor-pointer transition-colors duration-300 ${
        selected
          ? 'bg-saffron-500/10 border-saffron-400 shadow-[0_0_0_1px_rgba(255,159,0,0.35),0_8px_24px_-8px_rgba(255,159,0,0.45)]'
          : 'bg-white/3 border-slate-700 hover:border-slate-600 hover:bg-white/6'
      }`}
    >
      {Icon && (
        <div
          className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-colors duration-300 ${
            selected ? 'bg-saffron-500 text-neutral-950 border-saffron-400' : 'bg-white/5 text-slate-300 border-slate-700'
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
      )}

      <div>
        <p className={`text-xs font-bold leading-snug ${selected ? 'text-saffron-300' : 'text-white'}`}>{title}</p>
        {subtitle && <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{subtitle}</p>}
      </div>

      {selected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full bg-saffron-400 flex items-center justify-center"
        >
          <Icons.Check className="h-2.5 w-2.5 text-neutral-950" strokeWidth={3} />
        </motion.div>
      )}
    </motion.button>
  );
}
