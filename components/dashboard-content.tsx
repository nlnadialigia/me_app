'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useCreateProject, useDeleteProject, useProjects, useUpdateProject } from '@/hooks/useProjects';
import { createTechnology, useTechnologies } from '@/hooks/useTechnologies';
import { useAuth } from '@/lib/auth-context';
import { Project } from '@/types/project';
import { Eye, FolderGit2, LogOut, Mail, Pencil, Plus, Trash2, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function DashboardContent() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const { data: projects, isLoading: projectsLoading } = useProjects();
  const projectsList: Project[] = projects ?? [];
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const { data: technologies = [] } = useTechnologies();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  async function handleProfileUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bioPtText = formData.get('bio_pt') as string;
    const bioEnText = formData.get('bio_en') as string;
    const bioPtArray = bioPtText.split('\n').filter(line => line.trim());
    const bioEnArray = bioEnText.split('\n').filter(line => line.trim());
    
    const updates = {
      name: formData.get('name') as string,
      titlePt: formData.get('title_pt') as string,
      titleEn: formData.get('title_en') as string,
      bioPt: bioPtArray,
      bioEn: bioEnArray,
      email: formData.get('email') as string,
      githubUrl: formData.get('github_url') as string,
      linkedinUrl: formData.get('linkedin_url') as string,
      avatarUrl: formData.get('avatar_url') as string,
    };

    try {
      await updateProfile.mutateAsync(updates);
      setEditingProfile(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil');
    }
  }

  async function handleProjectSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const techString = formData.get('technologies') as string;
    
    const technologies = techString 
      ? techString.split(',').map(t => t.trim()).filter(t => t)
      : [];

    const projectData: any = {
      name: formData.get('name') as string,
      descriptionPt: formData.get('description_pt') as string,
      descriptionEn: formData.get('description_en') as string,
      liveUrl: formData.get('live_url') as string,
      githubUrl: formData.get('github_url') as string,
      technologies,
    };

    try {
      if (editingProject) {
        await updateProject.mutateAsync({ id: editingProject.id, ...projectData });
        toast.success('Projeto atualizado com sucesso!');
      } else {
        await createProject.mutateAsync({ ...projectData, orderIndex: projectsList.length });
        toast.success('Projeto criado com sucesso!');
      }
      setProjectDialogOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Error submitting project:', error);
      toast.error('Erro ao salvar projeto');
    }
  }

  async function handleDeleteProject(id: string) {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        await deleteProject.mutateAsync(id);
        toast.success('Projeto excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir projeto');
      }
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  if (!user) {
    return null;
  }

  if (profileLoading || projectsLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Tabs defaultValue="profile" className="w-full">
        <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-slate-100">Dashboard</h1>
              <TabsList className="bg-transparent border-0 h-full gap-4">
                <TabsTrigger 
                  value="profile" 
                  className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </TabsTrigger>
                <TabsTrigger 
                  value="projects" 
                  className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  <FolderGit2 className="mr-2 h-4 w-4" />
                  Projetos
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/explore">
                <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Portfólio
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-slate-400 hover:text-slate-200">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TabsContent value="profile">
            {!editingProfile ? (
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-slate-100">Perfil</CardTitle>
                      <CardDescription className="text-slate-400">
                        Visualização do seu perfil público
                      </CardDescription>
                    </div>
                    <Button onClick={() => setEditingProfile(true)} variant="outline" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Preview do Perfil */}
                  <div className="text-center space-y-6">
                    {profile?.avatarUrl && (
                      <div className="flex justify-center">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-700">
                          <Image 
                            src={profile.avatarUrl} 
                            alt={profile.name || 'Profile'} 
                            fill 
                            sizes="128px"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h2 className="text-3xl font-bold text-slate-100 mb-2">
                        {profile?.name || 'Seu Nome'}
                      </h2>
                      <div className="space-y-2">
                        <p className="text-lg text-slate-400">
                          <span className="text-xs text-slate-500">PT:</span> {profile?.titlePt || 'Título em português'}
                        </p>
                        <p className="text-lg text-slate-400">
                          <span className="text-xs text-slate-500">EN:</span> {profile?.titleEn || 'Title in english'}
                        </p>
                      </div>
                    </div>

                    <div className="max-w-2xl mx-auto space-y-6">
                      <div className="text-left">
                        <h3 className="text-sm font-semibold text-slate-500 mb-2">Bio (PT)</h3>
                        <div className="space-y-2 text-slate-300">
                          {profile?.bioPt?.map((sentence, index) => (
                            <p key={index}>{sentence}</p>
                          )) || <p className="text-slate-500">Nenhuma bio em português</p>}
                        </div>
                      </div>

                      <div className="text-left">
                        <h3 className="text-sm font-semibold text-slate-500 mb-2">Bio (EN)</h3>
                        <div className="space-y-2 text-slate-300">
                          {profile?.bioEn?.map((sentence, index) => (
                            <p key={index}>{sentence}</p>
                          )) || <p className="text-slate-500">No bio in english</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contato */}
                  <div className="border-t border-slate-800 pt-6">
                    <h3 className="text-xl font-semibold text-slate-100 mb-4">Contato</h3>
                    <div className="space-y-3">
                      {profile?.email && (
                        <div className="flex items-center gap-3 text-slate-300">
                          <Mail className="h-5 w-5" />
                          <span>{profile.email}</span>
                        </div>
                      )}
                      {profile?.githubUrl && (
                        <div className="flex items-center gap-3 text-slate-300">
                          <span className="text-sm">GitHub:</span>
                          <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                            {profile.githubUrl}
                          </a>
                        </div>
                      )}
                      {profile?.linkedinUrl && (
                        <div className="flex items-center gap-3 text-slate-300">
                          <span className="text-sm">LinkedIn:</span>
                          <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                            {profile.linkedinUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-100">Editar Perfil</CardTitle>
                  <CardDescription className="text-slate-400">
                    Atualize suas informações pessoais e de contato
                  </CardDescription>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="avatar_url" className="text-slate-300">URL da Imagem</Label>
                    <Input
                      id="avatar_url"
                      name="avatar_url"
                      defaultValue={profile?.avatarUrl ?? ''}
                      placeholder="https://exemplo.com/sua-foto.jpg"
                      className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">Nome</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={profile?.name ?? ''}
                      className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title_pt" className="text-slate-300">Título (PT)</Label>
                      <Input
                        id="title_pt"
                        name="title_pt"
                        defaultValue={profile?.titlePt ?? ''}
                        placeholder="Ex: Desenvolvedor Full Stack"
                        className="bg-slate-800 border-slate-700 text-slate-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title_en" className="text-slate-300">Título (EN)</Label>
                      <Input
                        id="title_en"
                        name="title_en"
                        defaultValue={profile?.titleEn ?? ''}
                        placeholder="Ex: Full Stack Developer"
                        className="bg-slate-800 border-slate-700 text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio_pt" className="text-slate-300">Bio (PT)</Label>
                    <Textarea
                      id="bio_pt"
                      name="bio_pt"
                      defaultValue={profile?.bioPt?.join('\n') ?? ''}
                      rows={6}
                      placeholder="Digite cada parágrafo em uma linha separada"
                      className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                    <p className="text-xs text-slate-500">Cada linha será um parágrafo separado</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio_en" className="text-slate-300">Bio (EN)</Label>
                    <Textarea
                      id="bio_en"
                      name="bio_en"
                      defaultValue={profile?.bioEn?.join('\n') ?? ''}
                      rows={6}
                      placeholder="Enter each paragraph on a separate line"
                      className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                    <p className="text-xs text-slate-500">Each line will be a separate paragraph</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={profile?.email ?? ''}
                        placeholder="seu@email.com"
                        className="bg-slate-800 border-slate-700 text-slate-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="github_url" className="text-slate-300">GitHub</Label>
                      <Input
                        id="github_url"
                        name="github_url"
                        defaultValue={profile?.githubUrl ?? ''}
                        placeholder="https://github.com/seu-usuario"
                        className="bg-slate-800 border-slate-700 text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url" className="text-slate-300">LinkedIn</Label>
                    <Input
                      id="linkedin_url"
                      name="linkedin_url"
                      defaultValue={profile?.linkedinUrl ?? ''}
                      placeholder="https://linkedin.com/in/seu-perfil"
                      className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={updateProfile.isPending} className="bg-slate-700 hover:bg-slate-600 text-slate-100">
                      {updateProfile.isPending ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                    <Button type="button" onClick={() => setEditingProfile(false)} variant="outline" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            )}
          </TabsContent>

          <TabsContent value="projects">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">Projetos</h2>
                  <p className="text-slate-400">Gerencie seus projetos</p>
                </div>
                <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingProject(null)} className="bg-slate-700 hover:bg-slate-600 text-slate-100">
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Projeto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-slate-100">
                        {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
                      </DialogTitle>
                      <DialogDescription className="text-slate-400">
                        Preencha as informações do projeto
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleProjectSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="project-name" className="text-slate-300">Nome do Projeto</Label>
                        <Input
                          id="project-name"
                          name="name"
                          defaultValue={editingProject?.name}
                          required
                          className="bg-slate-800 border-slate-700 text-slate-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project-description-pt" className="text-slate-300">Descrição (PT)</Label>
                        <Textarea
                          id="project-description-pt"
                          name="description_pt"
                          defaultValue={editingProject?.descriptionPt}
                          required
                          rows={3}
                          placeholder="Descrição do projeto em português"
                          className="bg-slate-800 border-slate-700 text-slate-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project-description-en" className="text-slate-300">Descrição (EN)</Label>
                        <Textarea
                          id="project-description-en"
                          name="description_en"
                          defaultValue={editingProject?.descriptionEn}
                          required
                          rows={3}
                          placeholder="Project description in english"
                          className="bg-slate-800 border-slate-700 text-slate-100"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="project-live-url" className="text-slate-300">URL do Projeto</Label>
                          <Input
                            id="project-live-url"
                            name="live_url"
                            defaultValue={editingProject?.liveUrl as any}
                            placeholder="https://seu-projeto.com"
                            className="bg-slate-800 border-slate-700 text-slate-100"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="project-github-url" className="text-slate-300">URL do GitHub</Label>
                          <Input
                            id="project-github-url"
                            name="github_url"
                            defaultValue={editingProject?.githubUrl as any}
                            placeholder="https://github.com/usuario/repo"
                            className="bg-slate-800 border-slate-700 text-slate-100"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project-technologies" className="text-slate-300">
                          Tecnologias
                        </Label>
                        <Input
                          id="project-technologies"
                          name="technologies"
                          defaultValue={editingProject?.technologies?.map(t => t.name).join(', ')}
                          placeholder="React, Node.js, TypeScript"
                          className="bg-slate-800 border-slate-700 text-slate-100"
                        />
                        <p className="text-xs text-slate-500">Digite os nomes separados por vírgula. As cores serão buscadas da tabela de tecnologias.</p>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={createProject.isPending || updateProject.isPending} className="bg-slate-700 hover:bg-slate-600 text-slate-100">
                          {createProject.isPending || updateProject.isPending ? 'Salvando...' : 'Salvar'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {projectsList.length === 0 ? (
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="py-12 text-center">
                    <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Nenhum projeto adicionado ainda</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projectsList.map((project) => (
                    <Card key={project.id} className="bg-slate-900 border-slate-800">
                      <CardHeader>
                        <CardTitle className="text-slate-100">{project.name}</CardTitle>
                        <CardDescription className="text-slate-400 line-clamp-2">
                          {project.descriptionPt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.slice(0, 3).map((tech, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                style={{ 
                                  borderColor: tech.color + '80'
                                }}
                                className="border bg-slate-800 text-slate-400"
                              >
                                {tech.name}
                              </Badge>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="text-xs text-slate-500 px-2 py-1">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingProject(project);
                              setProjectDialogOpen(true);
                            }}
                            className="flex-1 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProject(project.id)}
                            className="bg-slate-800 border-slate-700 text-red-400 hover:bg-red-950 hover:border-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </main>
      </Tabs>
    </div>
  );
}
