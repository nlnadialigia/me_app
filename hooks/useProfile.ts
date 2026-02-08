import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type Profile = {
  id?: string;
  name?: string | null;
  titlePt?: string | null;
  titleEn?: string | null;
  bioPt?: string[] | null;
  bioEn?: string[] | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
};

const fetchProfile = async (): Promise<Profile> => {
  const res = await fetch('/api/profile');
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};

export function useProfile() {
  return useQuery<Profile>({ queryKey: ['profile'], queryFn: fetchProfile });
}

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation<Profile, Error, Profile>({
    mutationFn: async (data: Profile) => {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  });
}
