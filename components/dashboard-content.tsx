'use client';

import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useCreateProject, useDeleteProject, useProjects, useUpdateProject } from '@/hooks/useProjects';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { Project } from '@/types/project';
import { Eye, FolderGit2, LogOut, Pencil, Plus, Trash2, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function DashboardContent() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();

  const { data: projects } = useProjects();
  const projectsList: Project[] = projects ?? [];
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  async function handleProfileUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bioText = formData.get('bio') as string;
    const bioArray = bioText.split('\n').filter(line => line.trim());
    
    const updates = {
      name: formData.get('name') as string,
      title: formData.get('title') as string,
      bio: bioArray,
      githubUrl: formData.get('github_url') as string,
      linkedinUrl: formData.get('linkedin_url') as string,
      email: formData.get('email') as string,
    };

    await updateProfile.mutateAsync(updates);
  }

  async function handleProjectSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const techString = formData.get('technologies') as string;
    const technologies = techString ? techString.split(',').map(t => t.trim()).filter(t => t) : [];

    const projectData: any = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      liveUrl: formData.get('live_url') as string,
      githubUrl: formData.get('github_url') as string,
      technologies,
    };

    try {
      if (editingProject) {
        await updateProject.mutateAsync({ id: editingProject.id, ...projectData });
      } else {
        await createProject.mutateAsync({ ...projectData, orderIndex: projectsList.length });
      }
      setProjectDialogOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  }

  async function handleDeleteProject(id: string) {
    if (confirm(t('admin.confirmDelete'))) {
      await deleteProject.mutateAsync(id);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-100">{t('admin.dashboard')}</h1>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/">
              <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                <Eye className="mr-2 h-4 w-4" />
                {t('common.viewPortfolio')}
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-slate-400 hover:text-slate-200">
              <LogOut className="mr-2 h-4 w-4" />
              {t('common.signOut')}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="profile" className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">
              <User className="mr-2 h-4 w-4" />
              {t('admin.profile')}
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">
              <FolderGit2 className="mr-2 h-4 w-4" />
              {t('admin.projects')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-100">Informações do Perfil</CardTitle>
                <CardDescription className="text-slate-400">
                  Atualize suas informações pessoais e de contato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-300">Nome</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={profile?.name ?? ''}
                        className="bg-slate-800 border-slate-700 text-slate-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-slate-300">Título</Label>
                      <Input
                        id="title"
                        name="title"
                        defaultValue={profile?.title ?? ''}
                        className="bg-slate-800 border-slate-700 text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-slate-300">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      defaultValue={profile?.bio?.join('\n') ?? ''}
                      rows={6}
                      placeholder="Digite cada parágrafo em uma linha separada"
                      className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                    <p className="text-xs text-slate-500">Cada linha será um parágrafo separado</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

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

                  <Button type="submit" disabled={updateProfile.isPending} className="bg-slate-700 hover:bg-slate-600 text-slate-100">
                    {updateProfile.isPending ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">{t('admin.projects')}</h2>
                  <p className="text-slate-400">{t('admin.manageProjects')}</p>
                </div>
                <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingProject(null)} className="bg-slate-700 hover:bg-slate-600 text-slate-100">
                      <Plus className="mr-2 h-4 w-4" />
                      {t('admin.newProject')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-slate-100">
                        {editingProject ? t('admin.editProject') : t('admin.newProject')}
                      </DialogTitle>
                      <DialogDescription className="text-slate-400">
                        {t('admin.manageProjects')}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleProjectSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="project-name" className="text-slate-300">{t('admin.projectName')}</Label>
                        <Input
                          id="project-name"
                          name="name"
                          defaultValue={editingProject?.name}
                          required
                          className="bg-slate-800 border-slate-700 text-slate-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project-description" className="text-slate-300">{t('admin.description')}</Label>
                        <Textarea
                          id="project-description"
                          name="description"
                          defaultValue={editingProject?.description}
                          required
                          rows={3}
                          className="bg-slate-800 border-slate-700 text-slate-100"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="project-live-url" className="text-slate-300">{t('admin.projectUrl')}</Label>
                          <Input
                            id="project-live-url"
                            name="live_url"
                            defaultValue={editingProject?.liveUrl as any}
                            className="bg-slate-800 border-slate-700 text-slate-100"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="project-github-url" className="text-slate-300">{t('admin.githubUrl')}</Label>
                          <Input
                            id="project-github-url"
                            name="github_url"
                            defaultValue={editingProject?.githubUrl as any}
                            className="bg-slate-800 border-slate-700 text-slate-100"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project-technologies" className="text-slate-300">
                          {t('admin.technologies')}
                        </Label>
                        <Input
                          id="project-technologies"
                          name="technologies"
                          defaultValue={editingProject?.technologies?.join(', ')}
                          placeholder="React, Node.js, TypeScript"
                          className="bg-slate-800 border-slate-700 text-slate-100"
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={createProject.isPending || updateProject.isPending} className="bg-slate-700 hover:bg-slate-600 text-slate-100">
                          {createProject.isPending || updateProject.isPending ? t('common.saving') : t('common.save')}
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
                    <p className="text-slate-400">{t('admin.noProjectsAdded')}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projectsList.map((project) => (
                    <Card key={project.id} className="bg-slate-900 border-slate-800">
                      <CardHeader>
                        <CardTitle className="text-slate-100">{project.name}</CardTitle>
                        <CardDescription className="text-slate-400 line-clamp-2">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.slice(0, 3).map((tech, index) => (
                              <span key={index} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                                {tech}
                              </span>
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
                            {t('common.edit')}
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
        </Tabs>
      </main>
    </div>
  );
}
