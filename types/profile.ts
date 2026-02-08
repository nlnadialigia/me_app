export interface Profile {
  id: string;
  name: string;
  titlePt: string;
  titleEn: string;
  bioPt: string[];
  bioEn: string[];
  email: string;
  avatarUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
}