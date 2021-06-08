import i18n, { InitOptions } from 'i18next';
import detector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import interfaceEN from 'assets/locales/en/interface.json';
import interfaceRU from 'assets/locales/ru/interface.json';
import errorsEN from 'assets/locales/en/errors.json';
import errorsRU from 'assets/locales/ru/errors.json';

const localeSettingsSetup = (language?: string): InitOptions => ({
  resources: {
    en: {
      interface: interfaceEN,
      errors: errorsEN,
    },
    ru: {
      interface: interfaceRU,
      errors: errorsRU,
    },
  },
  fallbackLng: 'ru',
  ns: ['interface', 'errors'],
  defaultNS: 'interface',
  lng: language,
  debug: false,

  interpolation: {
    escapeValue: false, // not needed for react!!
  },

  // react i18next special options
  react: {
    useSuspense: false,
    wait: true,
    bindI18n: 'languageChanged loaded',
    nsMode: 'default',
  },

  initImmediate: true,
});

void i18n.use(detector).use(initReactI18next).init(localeSettingsSetup('ru'));

export default i18n;
