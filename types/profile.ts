export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string[];
  email: string;
  avatarUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
}