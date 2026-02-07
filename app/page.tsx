'use client';

import { LanguageSwitcher } from '@/components/language-switcher';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/hooks/useProfile';
import { useProjects } from '@/hooks/useProjects';
import { useLanguage } from '@/lib/language-context';
import { Code2, ExternalLink, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { t } = useLanguage();
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const { data: projects = [], isLoading: loadingProjects } = useProjects();
  const loading = loadingProfile || loadingProjects;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="fixed top-4 right-4 z-50 flex gap-4">
        <LanguageSwitcher />
        <Link href="/admin/login">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
            {t('common.admin')}
          </Button>
        </Link>
      </div>

      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-6">
            <div className="inline-block p-1 rounded-full bg-gradient-to-r from-slate-700 to-slate-800">
              <div className="w-32 h-32 rounded-full bg-slate-900 flex items-center justify-center">
                <Code2 className="w-16 h-16 text-slate-300" />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-100">
                {profile?.name || 'Desenvolvedora Full Stack'}
              </h1>
              <p className="text-xl sm:text-2xl text-slate-400">
                {profile?.title || 'JavaScript & Python Developer'}
              </p>
            </div>

            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {profile?.bio || 'Olá! Sou uma desenvolvedora apaixonada por criar soluções criativas e eficientes.'}
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              {profile?.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="bg-slate-900 border-slate-700 hover:bg-slate-800 hover:border-slate-600">
                    <Github className="h-5 w-5 text-slate-300" />
                  </Button>
                </a>
              )}
              {profile?.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="bg-slate-900 border-slate-700 hover:bg-slate-800 hover:border-slate-600">
                    <Linkedin className="h-5 w-5 text-slate-300" />
                  </Button>
                </a>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`}>
                  <Button variant="outline" size="icon" className="bg-slate-900 border-slate-700 hover:bg-slate-800 hover:border-slate-600">
                    <Mail className="h-5 w-5 text-slate-300" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 text-center mb-12">
            {t('home.myProjects')}
          </h2>

          {projects.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              {t('home.noProjects')}
            </div>
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
                    <CardContent className="flex-grow">
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
                          {t('home.viewProject')}
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
        </div>
      </section>

      <footer className="py-8 px-4 text-center text-slate-500 border-t border-slate-800">
        <p>&copy; {new Date().getFullYear()} {profile?.name || 'Portfolio'}. {t('home.allRightsReserved')}</p>
      </footer>
    </div>
  );
}
