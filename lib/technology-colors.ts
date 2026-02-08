import { Technology } from '@/hooks/useTechnologies';

export function getTechnologyColor(techName: string, technologies: Technology[]): string {
  const tech = technologies.find(t => t.name.toLowerCase() === techName.toLowerCase());
  return tech?.color || '#64748b'; // slate-500 como fallback
}
