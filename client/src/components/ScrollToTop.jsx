import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Every route change — Link clicks, navigate() calls, and browser
// back/forward — should always land at the top of the new page.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
