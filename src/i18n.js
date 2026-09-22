import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import ru from './locales/ru.json';
import tm from './locales/tm.json';

export const LANGUAGE_KEY = 'sowgatly_language';

export const LANGUAGES = [
    { code: 'tm', label: 'Türkmençe' },
    { code: 'ru', label: 'Русский' },
    { code: 'en', label: 'English' },
];

const resources = {
    tm: { translation: tm },
    en: { translation: en },
    ru: { translation: ru },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'tm',
    fallbackLng: 'tm',
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false,
    },
  });

// Restore the language the user picked last time.
AsyncStorage.getItem(LANGUAGE_KEY)
  .then((saved) => {
    if (saved && resources[saved] && saved !== i18n.language) {
      i18n.changeLanguage(saved);
    }
  })
  .catch(() => {});

export const setLanguage = async (code) => {
    await i18n.changeLanguage(code);
    try {
        await AsyncStorage.setItem(LANGUAGE_KEY, code);
    } catch (e) {
        // Language still switches for this session.
    }
};

export default i18n;
