export interface Project {
  id: string;
  name: string;
  description: string;
  liveUrl: string;
  githubUrl: string;
  imageUrl: string;
  technologies: string[];
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}