import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import fortunoPt from './locales/pt/fortuno.json';

export const DEFAULT_LOCALE = 'pt-BR';

void i18next.use(initReactI18next).init({
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  ns: ['fortuno'],
  defaultNS: 'fortuno',
  resources: {
    [DEFAULT_LOCALE]: {
      fortuno: fortunoPt,
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
