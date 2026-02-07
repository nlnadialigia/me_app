'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/lib/language-context';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn('credentials', { redirect: false, email, password });
    setLoading(false);

    if (res && (res as any).error) {
      setError((res as any).error as string);
      return;
    }

    router.push('/admin/dashboard');
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded">
        <h1 className="text-2xl font-bold text-slate-100 mb-4">{t('admin.signIn') || 'Admin sign in'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-slate-300">Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" className="bg-slate-800 text-slate-100" />
          </div>
          <div>
            <Label className="text-slate-300">Password</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" className="bg-slate-800 text-slate-100" />
          </div>

          {error && <div className="text-red-400">{error}</div>}

          <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100" disabled={loading}>{loading ? t('common.signingIn') : t('common.signIn') || 'Sign in'}</Button>
        </form>
      </div>
    </div>
  );
}

