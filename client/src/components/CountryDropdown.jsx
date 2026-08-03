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

  const stateClasses = showError
    ? 'border-[#D14343] bg-[#F6F7F9] shadow-[0_0_0_4px_rgba(209,67,67,0.15)]'
    : isOpen
    ? 'border-saffron-500 bg-[#F6F7F9] shadow-[0_0_0_4px_rgba(198,146,46,0.18)]'
    : 'border-[#D7DDE5] bg-[#F6F7F9] hover:border-[#B9C3CF] shadow-[inset_0_1px_3px_rgba(16,24,40,0.04)]';

  return (
    <div ref={containerRef} className="relative w-full font-sans">
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between pl-3.5 pr-3 py-2.5 rounded-[14px] border-2 text-sm text-heading transition-all duration-300 focus:outline-none cursor-pointer ${stateClasses}`}
      >
        <div className="flex items-center space-x-2.5 min-w-0">
          <img
            src={`https://flagcdn.com/w40/${selectedItem.iso}.png`}
            alt=""
            className="w-5 h-3.5 object-cover rounded-xs border border-[#D7DDE5] shrink-0"
          />
          <span className="truncate">{selectedItem.name}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-maroon-700 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[14px] shadow-[0_20px_45px_-10px_rgba(31,31,31,0.18)] border-2 border-card-border overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2 border-b border-card-border relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-maroon-700" />
            <input
              type="text"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#F6F7F9] text-xs text-heading placeholder:text-[#8B8B8B] focus:outline-none focus:border-saffron-500 border border-[#D7DDE5] transition-colors duration-300"
            />
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-card-border">
            {filtered.map((item) => (
              <div
                key={item.name}
                onClick={() => {
                  onChange(item.name);
                  setIsOpen(false);
                  setSearch('');
                }}
                className={`px-3.5 py-2.5 flex items-center space-x-2.5 text-xs font-medium cursor-pointer transition-colors duration-200 ${
                  item.name === value ? 'bg-maroon-700/10 text-maroon-700 font-bold' : 'hover:bg-[#F6F7F9] text-heading'
                }`}
              >
                <img
                  src={`https://flagcdn.com/w40/${item.iso}.png`}
                  alt=""
                  className="w-5 h-3.5 object-cover rounded-xs border border-[#D7DDE5] shrink-0"
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

  const stateClasses = isOpen
    ? 'border-saffron-500 bg-[#F6F7F9] shadow-[0_0_0_4px_rgba(198,146,46,0.18)]'
    : 'border-[#D7DDE5] bg-[#F6F7F9] hover:border-[#B9C3CF] shadow-[inset_0_1px_3px_rgba(16,24,40,0.04)]';

  return (
    <div ref={containerRef} className="relative w-36 shrink-0 font-sans">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[14px] border-2 text-xs text-heading transition-all duration-300 focus:outline-none cursor-pointer ${stateClasses}`}
      >
        <div className="flex items-center space-x-1.5 min-w-0">
          <img
            src={`https://flagcdn.com/w40/${selectedItem.iso}.png`}
            alt=""
            className="w-4 h-3 object-cover rounded-xs border border-[#D7DDE5] shrink-0"
          />
          <span className="font-bold truncate">{selectedItem.code}</span>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-maroon-700 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-[14px] shadow-[0_20px_45px_-10px_rgba(31,31,31,0.18)] border-2 border-card-border overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="max-h-60 overflow-y-auto divide-y divide-card-border">
            {COUNTRY_CODES.map((item) => (
              <div
                key={item.code + item.country}
                onClick={() => {
                  onChange(item.code);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 flex items-center space-x-2 text-xs font-medium cursor-pointer transition-colors duration-200 ${
                  item.code === value ? 'bg-maroon-700/10 text-maroon-700 font-bold' : 'hover:bg-[#F6F7F9] text-heading'
                }`}
              >
                <img
                  src={`https://flagcdn.com/w40/${item.iso}.png`}
                  alt=""
                  className="w-4 h-3 object-cover rounded-xs border border-[#D7DDE5] shrink-0"
                />
                <span className="font-mono">{item.code}</span>
                <span className="text-muted truncate">({item.country})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
