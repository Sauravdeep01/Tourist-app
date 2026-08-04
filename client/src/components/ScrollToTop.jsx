import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

// Every route change — Link clicks, navigate() calls, and browser
// back/forward — should always land at the top of the new page.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  // `undefined` when Lenis isn't mounted (prefers-reduced-motion) or hasn't
  // finished its first-mount effect yet — both cases fall back below.
  const lenis = useLenis();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    if (lenis) {
      // Reset through Lenis (not a raw window.scrollTo) so its internal
      // target/animated scroll values stay in sync — otherwise the next
      // wheel tick could glide from the stale pre-navigation position.
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return null;
}
