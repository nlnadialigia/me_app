'use client';

import { useLanguage, Language } from '@/lib/language-context';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <Button
        variant={language === 'pt-BR' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('pt-BR')}
        className={language === 'pt-BR' ? 'bg-slate-700 hover:bg-slate-600 text-slate-100' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'}
      >
        PT
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className={language === 'en' ? 'bg-slate-700 hover:bg-slate-600 text-slate-100' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'}
      >
        EN
      </Button>
    </div>
  );
}
