
'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';

export function LanguageSelector() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 border rounded-full px-1 py-0.5 bg-muted/50">
      <Button
        variant={lang === 'en' ? 'default' : 'ghost'}
        size="sm"
        className="rounded-full h-7 text-xs"
        onClick={() => toggleLanguage('en')}
      >
        EN
      </Button>
      <Button
        variant={lang === 'ta' ? 'default' : 'ghost'}
        size="sm"
        className="rounded-full h-7 text-xs"
        onClick={() => toggleLanguage('ta')}
      >
        தமிழ்
      </Button>
    </div>
  );
}
