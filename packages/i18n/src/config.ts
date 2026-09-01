// =============================================================================
// BuyTuk Academy - i18n Configuration
// =============================================================================

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './locales/ar.js';
import en from './locales/en.js';

i18n.use(initReactI18next).init({
  resources: {
    ar,
    en,
  },
  lng: 'ar',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
