
'use client';

import { useState, useEffect } from 'react';
import { Language, translations } from '@/lib/i18n/translations';

export function useLanguage() {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('mushroom-sense-lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ta')) {
      setLang(savedLang);
    }
  }, []);

  const toggleLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('mushroom-sense-lang', newLang);
  };

  const t = translations[lang];

  return { lang, toggleLanguage, t };
}
