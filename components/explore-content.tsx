'use client';

import { LanguageSwitcher } from '@/components/language-switcher';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile } from '@/hooks/useProfile';
import { useProjects } from '@/hooks/useProjects';
import { useLanguage } from '@/lib/language-context';
import { ExternalLink, Mail } from 'lucide-react';
import Image from 'next/image';

export function ExploreContent() {
  const { t } = useLanguage();
  const { data: profile } = useProfile();
  const { data: projects = [] } = useProjects();

  return (
    <div className="min-h-screen bg-slate-950">
      <Tabs defaultValue="about" className="w-full">
        <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <TabsList className="bg-transparent border-0 h-full gap-8">
              <TabsTrigger 
                value="about" 
                className="data-[state=active]:bg-transparent data-[state=active]:text-slate-100 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none text-slate-500 hover:text-slate-300 transition-colors h-full"
              >
                {t('explore.aboutMe') || 'Sobre Mim'}
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="data-[state=active]:bg-transparent data-[state=active]:text-slate-100 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none text-slate-500 hover:text-slate-300 transition-colors h-full"
              >
                {t('explore.projects') || 'Projetos'}
              </TabsTrigger>
            </TabsList>
            <LanguageSwitcher />
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <TabsContent value="about" className="mt-0 space-y-12">
            {/* Seção Principal */}
            <section className="text-center space-y-6">
              {profile?.avatarUrl && (
                <div className="flex justify-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-700">
                    <Image 
                      src={profile.avatarUrl} 
                      alt={profile.name || 'Profile'} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <h1 className="text-4xl font-bold text-slate-100 mb-2">
                  {profile?.name || 'Developer'}
                </h1>
                <p className="text-xl text-slate-400">
                  {profile?.title || 'Full Stack Developer'}
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-4 text-slate-300 text-lg">
                {profile?.bio?.map((sentence, index) => (
                  <p key={index}>{sentence}</p>
                )) || <p>{t('explore.defaultBio') || 'Desenvolvedor apaixonado por criar soluções incríveis.'}</p>}
              </div>
            </section>

            {/* Seção de Contato */}
            <section className="max-w-2xl mx-auto">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-2xl text-slate-100">{t('explore.contact') || 'Contato'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile?.email && (
                    <a 
                      href={`mailto:${profile.email}`} 
                      className="flex items-center gap-3 text-slate-300 hover:text-slate-100 transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                      <span>{profile.email}</span>
                    </a>
                  )}
                  {profile?.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-slate-300 hover:text-slate-100 transition-colors"
                    >
                      <ExternalLink className="h-5 w-5" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {profile?.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-slate-300 hover:text-slate-100 transition-colors"
                    >
                      <ExternalLink className="h-5 w-5" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="projects" className="mt-0 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-100 mb-2">{t('explore.myProjects') || 'Meus Projetos'}</h2>
              <p className="text-slate-400">{t('explore.projectsDesc') || 'Confira alguns dos meus trabalhos e projetos'}</p>
            </div>

            {projects.length === 0 ? (
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="py-12 text-center">
                  <p className="text-slate-400">{t('explore.noProjects') || 'Nenhum projeto adicionado ainda'}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-slate-100">{project.name}</CardTitle>
                      <CardDescription className="text-slate-400 line-clamp-3">
                        {project.description}
                      </CardDescription>
                    </CardHeader>

                    {project.technologies && project.technologies.length > 0 && (
                      <CardContent className="grow">
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, index) => (
                            <Badge key={index} variant="secondary" className="bg-slate-800 text-slate-300 border-slate-700">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    )}

                    <CardFooter className="flex gap-2 pt-4">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button variant="default" className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {t('explore.viewProject') || 'Ver Projeto'}
                          </Button>
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button variant="outline" className="w-full bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {t('explore.viewCode') || 'Código'}
                          </Button>
                        </a>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </main>
      </Tabs>
    </div>
  );
}
