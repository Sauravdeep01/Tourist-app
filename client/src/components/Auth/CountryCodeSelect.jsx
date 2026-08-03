import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { COUNTRY_CODES } from '../../utils/countryCodes';


export default function CountryCodeSelect({ value, onChange, error, searchPlaceholder }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  const filtered = COUNTRY_CODES.filter(
    (c) => c.code.includes(query) || c.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-full items-center gap-1 rounded-xl border bg-white px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors focus:outline-none focus:ring-2 cursor-pointer ${
          error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-neutral-200 hover:border-neutral-300 focus:border-maroon-400 focus:ring-maroon-100'
        }`}
      >
        {value || '+86'}
        <ChevronDown className={`h-3.5 w-3.5 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-56 rounded-xl border border-neutral-200 bg-white shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="relative border-b border-neutral-100 p-2">
            <Search className="pointer-events-none absolute left-4.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border-0 bg-neutral-50 py-1.5 pl-7 pr-2 text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-maroon-200"
            />
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-xs text-neutral-400">No match</li>
            )}
            {filtered.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(c.code);
                    setOpen(false);
                    setQuery('');
                  }}
                  className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-sm hover:bg-saffron-50 cursor-pointer ${
                    c.code === value ? 'bg-saffron-50 text-maroon-700 font-medium' : 'text-neutral-700'
                  }`}
                >
                  <span>{c.label}</span>
                  <span className="text-neutral-400">{c.code}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
