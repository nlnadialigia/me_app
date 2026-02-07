'use client';

import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language-context';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

interface Particle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  tx: number;
  ty: number;
}

const FIREWORK_COLORS = ['#93c5fd', '#c4b5fd', '#f8bbd0', '#fcd34d', '#a7f3d0'];
const PARTICLES_PER_BURST = 50;
const BURST_INTERVAL = 1500;
const PARTICLE_LIFETIME = 3500;

function Fireworks() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    const createFireworks = () => {
      const newParticles: Particle[] = [];
      const burstId = Date.now();

      for (let i = 0; i < PARTICLES_PER_BURST; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 300 + 150;

        newParticles.push({
          id: `${burstId}-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
          duration: Math.random() + 1.5,
          tx: Math.cos(angle) * distance,
          ty: Math.sin(angle) * distance,
        });
      }

      setParticles((prev) => [...prev, ...newParticles]);

      const timeout = setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !p.id.startsWith(`${burstId}-`)));
      }, PARTICLE_LIFETIME);

      timeouts.push(timeout);
    };

    const interval = setInterval(createFireworks, BURST_INTERVAL);
    createFireworks();

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <style>{`
        @keyframes burst {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
          }
        }
      `}</style>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            animation: `burst ${particle.duration}s ease-out forwards`,
            '--tx': `${particle.tx}px`,
            '--ty': `${particle.ty}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export function HomeContent() {
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  const title = useMemo(
    () => (language === 'pt-BR' ? 'ESSA SOU EU!' : 'THIS IS ME!'),
    [language]
  );

  const exploreText = useMemo(
    () => t('common.explore') || (language === 'pt-BR' ? 'Explorar' : 'Explore'),
    [t, language]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 px-4">
          {title}
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
      <Fireworks />

      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      <main className="text-center space-y-8 z-10 px-4">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse">
          {title}
        </h1>

        <div className="pt-8">
          <Link href="/explore" aria-label={exploreText}>
            <Button
              size="lg"
              className="px-8 py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {exploreText}
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
