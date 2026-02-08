'use client';

import { useLanguage } from '@/lib/language-context';

export default function Loading() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-slate-400">{t('common.loading')}</div>
    </div>
  );
}
