'use client';

import { LanguageSwitcher } from '@/components/language-switcher';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile } from '@/hooks/useProfile';
import { useProjects } from '@/hooks/useProjects';
import { useLanguage } from '@/lib/language-context';
import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';

export function ExploreContent() {
  const { t } = useLanguage();
  const { data: profile } = useProfile();
  const { data: projects = [] } = useProjects();

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-slate-100 hover:text-slate-300 transition">
            ← Portfolio
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="about" className="space-y-8">
          <TabsList className="bg-slate-900 border border-slate-800 w-full sm:w-auto">
            <TabsTrigger value="about" className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100 flex-1 sm:flex-none">
              {t('explore.aboutMe') || 'Sobre mim'}
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100 flex-1 sm:flex-none">
              {t('explore.projects') || 'Projetos'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-3xl text-slate-100">{profile?.name || 'Developer'}</CardTitle>
                <CardDescription className="text-lg text-slate-400">
                  {profile?.title || 'Full Stack Developer'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-slate-300 text-lg leading-relaxed">
                  {profile?.bio || 'Desenvolvedor apaixonado por criar soluções incríveis.'}
                </p>

                <div className="space-y-4 pt-6 border-t border-slate-700">
                  <h3 className="text-xl font-semibold text-slate-100">Contato</h3>
                  <div className="flex flex-wrap gap-4">
                    {profile?.email && (
                      <a href={`mailto:${profile.email}`} className="text-slate-400 hover:text-slate-100 transition">
                        Email: {profile.email}
                      </a>
                    )}
                    {profile?.githubUrl && (
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-100 transition flex items-center gap-2"
                      >
                        <Github className="h-5 w-5" /> GitHub
                      </a>
                    )}
                    {profile?.linkedinUrl && (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-100 transition"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
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
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="icon" className="bg-slate-800 border-slate-700 hover:bg-slate-700">
                            <Github className="h-4 w-4 text-slate-300" />
                          </Button>
                        </a>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <footer className="py-8 px-4 text-center text-slate-500 border-t border-slate-800 mt-12">
        <p>&copy; {new Date().getFullYear()} {profile?.name || 'Portfolio'}. {t('explore.allRightsReserved') || 'Todos os direitos reservados.'}</p>
      </footer>
    </div>
  );
}
