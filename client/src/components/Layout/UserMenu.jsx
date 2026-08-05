import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';

const CLOSE_DELAY_MS = 200;

function InitialAvatar({ name }) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || 'U';
  return (
    <span
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-maroon-700 text-white text-[11px] font-bold font-serif border border-[#9F2845]"
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

const itemFocusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-maroon-700/40';

export default function UserMenu({ user, variant = 'desktop', onRequestLogout, onNavigate }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const firstItemRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const close = useCallback(() => {
    clearCloseTimeout();
    setOpen(false);
  }, [clearCloseTimeout]);

  const scheduleClose = useCallback(() => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }, [clearCloseTimeout]);

  const openNow = useCallback(() => {
    clearCloseTimeout();
    setOpen(true);
  }, [clearCloseTimeout]);

  useEffect(() => () => clearCloseTimeout(), [clearCloseTimeout]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, close]);

  // Escape closes the menu and returns focus to the trigger
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, close]);

  // ArrowDown from the trigger opens the menu and jumps focus into it
  const handleTriggerKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      openNow();
      requestAnimationFrame(() => firstItemRef.current?.focus());
    }
  };

  const handleProfileClick = () => {
    close();
    onNavigate?.();
  };
  const handleLogoutClick = () => {
    close();
    onRequestLogout?.();
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const isOwner = user.role === 'owner';

  if (variant === 'mobile') {
    return (
      <div ref={containerRef} className="py-1 font-sans">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-heading hover:bg-beige transition-colors cursor-pointer"
        >
          <span className="flex items-center space-x-2.5 min-w-0">
            <InitialAvatar name={user.name} />
            <span className="text-sm font-semibold truncate">{user.name}</span>
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div role="menu" aria-orientation="vertical" className="pl-2 pt-1 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
            {isAdmin ? (
              <Link
                to="/admin/dashboard"
                role="menuitem"
                ref={firstItemRef}
                onClick={handleProfileClick}
                className={`flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-sm font-bold text-heading hover:bg-beige transition-colors ${itemFocusRing}`}
              >
                <LayoutDashboard className="h-4 w-4 text-saffron-600 shrink-0" />
                <span>{lang === 'zh' ? '我的控制台' : 'My Dashboard'}</span>
              </Link>
            ) : isOwner ? (
              <Link
                to="/owner/dashboard"
                role="menuitem"
                ref={firstItemRef}
                onClick={handleProfileClick}
                className={`flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-sm font-bold text-heading hover:bg-beige transition-colors ${itemFocusRing}`}
              >
                <LayoutDashboard className="h-4 w-4 text-saffron-600 shrink-0" />
                <span>{lang === 'zh' ? '我的控制台' : 'My Dashboard'}</span>
              </Link>
            ) : (
              <Link
                to="/account"
                role="menuitem"
                ref={firstItemRef}
                onClick={handleProfileClick}
                className={`flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-sm font-medium text-heading hover:bg-beige transition-colors ${itemFocusRing}`}
              >
                <User className="h-4 w-4 text-saffron-500 shrink-0" />
                <span>{t('navbar.myProfile')}</span>
              </Link>
            )}

            <div className="h-px bg-card-border/70 mx-3" />

            <button
              type="button"
              role="menuitem"
              onClick={handleLogoutClick}
              className={`w-full text-left flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer ${itemFocusRing}`}
            >
              <LogOut className="h-4 w-4 text-red-500 shrink-0" />
              <span>{t('navbar.logout')}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Desktop variant
  return (
    <div
      ref={containerRef}
      className="relative font-sans"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? close() : openNow())}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center space-x-1.5 rounded-full border border-card-border bg-white pl-1.5 pr-3 py-1.5 text-xs font-semibold text-heading transition-all duration-300 hover:border-maroon-700 cursor-pointer shadow-xs"
      >
        <InitialAvatar name={user.name} />
        <span className="max-w-32 truncate">{user.name}</span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      <div
        className={`absolute right-0 top-full w-56 pt-2 z-50 transition-all duration-200 ease-out ${
          open
            ? 'opacity-100 translate-y-0 visible pointer-events-auto'
            : 'opacity-0 -translate-y-1.5 invisible pointer-events-none'
        }`}
      >
        <div
          role="menu"
          aria-orientation="vertical"
          className="origin-top-right rounded-2xl border border-card-border/60 bg-white/95 backdrop-blur-xl shadow-xl overflow-hidden py-1.5 font-sans"
        >
          {isAdmin ? (
            <Link
              to="/admin/dashboard"
              role="menuitem"
              ref={firstItemRef}
              onClick={handleProfileClick}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-bold text-heading hover:bg-beige transition-colors duration-200 cursor-pointer ${itemFocusRing}`}
            >
              <LayoutDashboard className="h-4 w-4 text-saffron-600 shrink-0" />
              <span>{lang === 'zh' ? '我的控制台' : 'My Dashboard'}</span>
            </Link>
          ) : isOwner ? (
            <Link
              to="/owner/dashboard"
              role="menuitem"
              ref={firstItemRef}
              onClick={handleProfileClick}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-bold text-heading hover:bg-beige transition-colors duration-200 cursor-pointer ${itemFocusRing}`}
            >
              <LayoutDashboard className="h-4 w-4 text-saffron-600 shrink-0" />
              <span>{lang === 'zh' ? '我的控制台' : 'My Dashboard'}</span>
            </Link>
          ) : (
            <Link
              to="/account"
              role="menuitem"
              ref={firstItemRef}
              onClick={handleProfileClick}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium text-heading hover:bg-beige transition-colors duration-200 cursor-pointer ${itemFocusRing}`}
            >
              <User className="h-4 w-4 text-saffron-500 shrink-0" />
              <span>{t('navbar.myProfile')}</span>
            </Link>
          )}

          <div className="h-px bg-card-border/60 mx-3 my-1" />

          <button
            type="button"
            role="menuitem"
            onClick={handleLogoutClick}
            className={`w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer ${itemFocusRing}`}
          >
            <LogOut className="h-4 w-4 text-red-500 shrink-0" />
            <span>{t('navbar.logout')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
