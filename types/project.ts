export interface Project {
  id: string;
  name: string;
  descriptionPt: string;
  descriptionEn: string;
  liveUrl: string;
  githubUrl: string;
  imageUrl: string;
  technologies: Array<{ name: string; color: string }>;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}