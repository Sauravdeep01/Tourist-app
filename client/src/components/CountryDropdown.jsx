import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { ALL_COUNTRIES, COUNTRY_CODES } from '../utils/countryCodes';

// Custom Country Select with real flag image symbols
export function CountrySelect({ value, onChange, id = 'country', error, touched }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  const selectedItem = ALL_COUNTRIES.find((c) => c.name === value) || ALL_COUNTRIES[0];

  const filtered = ALL_COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showError = touched && !!error;

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between pl-3.5 pr-3 py-2.5 rounded-xl border bg-[#192235] text-sm text-white focus:outline-none focus:ring-2 focus:ring-saffron-400 cursor-pointer ${
          showError ? 'border-red-400/70 ring-1 ring-red-400/30' : 'border-slate-700'
        }`}
      >
        <div className="flex items-center space-x-2.5 min-w-0">
          <img
            src={`https://flagcdn.com/w40/${selectedItem.iso}.png`}
            alt=""
            className="w-5 h-3.5 object-cover rounded-xs border border-white/20 shrink-0"
          />
          <span className="truncate">{selectedItem.name}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#161f30] rounded-2xl shadow-2xl border border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2 border-b border-slate-800 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#192235] text-xs text-white placeholder:text-slate-500 focus:outline-none border border-slate-700"
            />
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/50">
            {filtered.map((item) => (
              <div
                key={item.name}
                onClick={() => {
                  onChange(item.name);
                  setIsOpen(false);
                  setSearch('');
                }}
                className={`px-3.5 py-2.5 flex items-center space-x-2.5 text-xs font-medium cursor-pointer transition-colors ${
                  item.name === value ? 'bg-saffron-500/20 text-saffron-300 font-bold' : 'hover:bg-slate-800 text-slate-200'
                }`}
              >
                <img
                  src={`https://flagcdn.com/w40/${item.iso}.png`}
                  alt=""
                  className="w-5 h-3.5 object-cover rounded-xs border border-white/20 shrink-0"
                />
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Custom Phone Country Code Select with real flag image symbols
export function PhoneCodeSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedItem = COUNTRY_CODES.find((c) => c.code === value) || COUNTRY_CODES[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-36 shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-700 bg-[#192235] text-xs text-white focus:outline-none focus:ring-2 focus:ring-saffron-400 cursor-pointer"
      >
        <div className="flex items-center space-x-1.5 min-w-0">
          <img
            src={`https://flagcdn.com/w40/${selectedItem.iso}.png`}
            alt=""
            className="w-4 h-3 object-cover rounded-xs border border-white/20 shrink-0"
          />
          <span className="font-bold truncate">{selectedItem.code}</span>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-52 bg-[#161f30] rounded-2xl shadow-2xl border border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/50">
            {COUNTRY_CODES.map((item) => (
              <div
                key={item.code + item.country}
                onClick={() => {
                  onChange(item.code);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 flex items-center space-x-2 text-xs font-medium cursor-pointer transition-colors ${
                  item.code === value ? 'bg-saffron-500/20 text-saffron-300 font-bold' : 'hover:bg-slate-800 text-slate-200'
                }`}
              >
                <img
                  src={`https://flagcdn.com/w40/${item.iso}.png`}
                  alt=""
                  className="w-4 h-3 object-cover rounded-xs border border-white/20 shrink-0"
                />
                <span className="font-mono">{item.code}</span>
                <span className="text-slate-400 truncate">({item.country})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
