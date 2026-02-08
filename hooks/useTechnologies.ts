import { useQuery } from '@tanstack/react-query';

export interface Technology {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

const fetchTechnologies = async (): Promise<Technology[]> => {
  const res = await fetch('/api/technologies');
  if (!res.ok) throw new Error('Failed to fetch technologies');
  return res.json();
};

export function useTechnologies() {
  return useQuery<Technology[]>({
    queryKey: ['technologies'],
    queryFn: fetchTechnologies,
  });
}

export async function createTechnology(name: string): Promise<Technology> {
  const res = await fetch('/api/technologies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to create technology');
  return res.json();
}
