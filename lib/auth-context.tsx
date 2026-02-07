'use client';

import { signIn as nextSignIn, signOut as nextSignOut, SessionProvider, useSession } from 'next-auth/react';
import { createContext, useContext } from 'react';

type User = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any; }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

function InnerAuthProvider({ children }: { children: React.ReactNode; }) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  const signIn = async (email: string, password: string) => {
    const res = await nextSignIn('credentials', { redirect: false, email, password });
    return { error: (res as any)?.error ?? null };
  };

  const signOut = async () => {
    await nextSignOut({ redirect: false });
  };

  const user = session?.user ?? null;

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode; }) {
  return <SessionProvider>{/* SessionProvider holds session state */}
    <InnerAuthProvider>{children}</InnerAuthProvider>
  </SessionProvider>;
}
