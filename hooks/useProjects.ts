import type { Project } from '@/types/project';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const fetchProjects = async (): Promise<Project[]> => {
  const res = await fetch('/api/projects');
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
};

export function useProjects() {
  return useQuery<Project[]>({ queryKey: ['projects'], queryFn: fetchProjects });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation<Project, Error, Partial<Project>>({
    mutationFn: async (data: Partial<Project>) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create project');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation<Project, Error, Partial<Project> & { id: string; }>({
    mutationFn: async (data: Partial<Project> & { id: string; }) => {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update project');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: async (id: string) => {
      const res = await fetch('/api/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete project');
      return true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}
