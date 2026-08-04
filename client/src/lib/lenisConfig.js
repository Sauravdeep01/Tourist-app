export const ANCHOR_OFFSET = -90;

export const LENIS_OPTIONS = {

  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),

  orientation: 'vertical',
  gestureOrientation: 'vertical',

  smoothWheel: true,
  wheelMultiplier: 1,
  syncTouch: false,
  touchMultiplier: 1,

  autoRaf: true,

  anchors: { offset: ANCHOR_OFFSET },
  
  allowNestedScroll: true,

  stopInertiaOnNavigate: true,
};
