import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export function useLanguage() {
  const { i18n } = useTranslation();

  const changeLanguage = useCallback(async (newLanguage: string) => {
    try {
      await i18n.changeLanguage(newLanguage);
      localStorage.setItem('i18nextLng', newLanguage);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  }, [i18n]);

  return {
    language: i18n.language,
    changeLanguage,
    supportedLanguages: ['en', 'es', 'fr', 'de']
  };
}