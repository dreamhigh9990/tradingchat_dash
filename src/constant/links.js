/**
 * TODO:
 * AS_PREFIX can be removed.
 * PATHNAME instead of HREF could sound better.
 */

export const LINKS = Object.freeze({
  INDEX: {
    HREF: '',
    ROUTE: '/',
    AS_PREFIX: ''
  },
  LOGIN: {
    HREF: 'login',
    ROUTE: '/auth/login',
    AS_PREFIX: 'auth'
  },
  SIGNUP: {
    HREF: 'register',
    ROUTE: '/auth/register',
    AS_PREFIX: 'auth'
  },
  COMING_SOON: {
    HREF: 'coming-soon',
    ROUTE: '/auth/coming-soon',
    AS_PREFIX: 'auth'
  },
 
  FORGOT_PASSWORD: {
    HREF: 'forgot-password',
    ROUTE: '/auth/forgot-password',
    AS_PREFIX: 'auth'
  },
  LOCK_SCREEN: {
    HREF: 'lock-screen',
    ROUTE: '/auth/lock-screen',
    AS_PREFIX: 'auth'
  },
  UNDER_CONSTRUCTION: {
    HREF: 'under-construction',
    ROUTE: '/auth/under-construction',
    AS_PREFIX: 'auth'
  },
  AUTH_PRICING: {
    HREF: 'pricing',
    ROUTE: '/auth/pricing',
    AS_PREFIX: 'auth'
  },
  ////////////////////////////////
  HOME: {
    HREF: 'home',
    ROUTE: '/dashboard/chat',
    AS_PREFIX: '/'
  },
   
  CHAT: {
    HREF: 'chat',
    ROUTE: '/dashboard/chat',
    AS_PREFIX: 'dashboard'
  },
  STOCKS: {
    HREF: 'stocks',
    ROUTE: '/dashboard/stocks',
    AS_PREFIX: 'dashboard'
  },
  // BLOG: {
  //   HREF: 'blog',
  //   ROUTE: 'dashboard/blog',
  //   AS_PREFIX: 'dashboard'
  // },
  // FAQ: {
  //   HREF: 'faq',
  //   ROUTE: 'dashboard/faq',
  //   AS_PREFIX: 'dashboard'
  // },
  NOTIFICATIONS: {
    HREF: 'notifications',
    ROUTE: '/dashboard/notifications',
    AS_PREFIX: 'dashboard'
  },
  PRICING: {
    HREF: 'pricing',
    ROUTE: '/auth/pricing',
    AS_PREFIX: 'dashboard'
  },
  PROFILE: {
    HREF: 'profile',
    ROUTE: '/dashboard/profile',
    AS_PREFIX: 'dashboard'
  },
  SETTINGS: {
    HREF: 'settings',
    ROUTE: '/dashboard/settings',
    AS_PREFIX: 'dashboard'
  },
  LOGOUT: {
    HREF: '#',
    AS_PREFIX: 'logout'
  },
  NOT_FOUND: {
    HREF: '/404',
    AS_PREFIX: ''
  },
  ERROR: {
    HREF: '/error',
    AS_PREFIX: ''
  }
});

