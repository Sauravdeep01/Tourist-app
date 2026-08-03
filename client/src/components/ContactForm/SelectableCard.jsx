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
      className={`relative flex flex-col items-start gap-2.5 p-4 rounded-[14px] border-2 text-left cursor-pointer transition-all duration-300 font-sans ${
        selected
          ? 'bg-maroon-700/10 border-maroon-700 shadow-[0_0_0_1px_rgba(122,31,53,0.3)]'
          : 'bg-[#F6F7F9] border-[#D7DDE5] shadow-[inset_0_1px_3px_rgba(16,24,40,0.04)] hover:border-[#B9C3CF]'
      }`}
    >
      {Icon && (
        <div
          className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-colors duration-300 ${
            selected ? 'bg-maroon-700 text-white border-maroon-700' : 'bg-white text-maroon-700 border-[#D7DDE5]'
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
      )}

      <div>
        <p className={`text-xs font-bold leading-snug ${selected ? 'text-maroon-700' : 'text-heading'}`}>{title}</p>
        {subtitle && <p className="text-[11px] text-body mt-0.5 leading-snug">{subtitle}</p>}
      </div>

      {selected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full bg-maroon-700 flex items-center justify-center"
        >
          <Icons.Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
        </motion.div>
      )}
    </motion.button>
  );
}
