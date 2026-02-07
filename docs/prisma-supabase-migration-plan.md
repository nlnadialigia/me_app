Plano de migração: Remover Supabase → Usar Prisma + TanStack Query

Resumo

Este documento descreve um plano prático para remover o Supabase do projeto e migrar para operações com banco via Prisma, expondo actions/rota API server-side e consumindo-as no cliente com TanStack Query (React Query).

Passos

1) Remover referências ao Supabase do código
- Buscar e eliminar importações de `@supabase/supabase-js` e `./lib/supabase`.
- Arquivos iniciais a ajustar: `lib/auth-context.tsx`, páginas que importam `supabase` (ex.: `app/page.tsx`, `app/admin/dashboard/page.tsx`).

2) Remover dependência do pacote
- Executar:

```bash
pnpm remove @supabase/supabase-js
rm -rf .next
pnpm build
```

3) Criar actions/rotas server-side com Prisma
- Usar o `prisma` já existente em `lib/prisma.ts`.
- Arquivos a criar (exemplos):
  - `app/api/profile/route.ts` — GET, PUT (perfil)
  - `app/api/projects/route.ts` — GET, POST, PUT, DELETE (projetos)
- Implementar handlers mínimos que retornem JSON, por exemplo:

```ts
export async function GET() {
  const profile = await prisma.profile.findFirst();
  return new Response(JSON.stringify(profile), { status: 200 });
}
```

- Opcional: criar helpers server-only em `lib/actions/profile.ts` e `lib/actions/projects.ts` que encapsulem chamadas ao `prisma` para reutilização.

4) Integrar TanStack Query no cliente
- Criar `components/QueryProvider.tsx` (client) com `QueryClient` e `QueryClientProvider`.
- Criar hooks em `hooks/`:
  - `hooks/useProfile.ts` — `useQuery('profile', fetchProfile)` e `useMutation` para updates.
  - `hooks/useProjects.ts` — `useQuery('projects', fetchProjects)` e mutações CRUD.
- Hooks usam `fetch('/api/...')` e tratam serialização/erros.

5) Substituir o `AuthProvider` baseado em Supabase
- Recomendações:
  - Opção A (recomendada): Usar `next-auth` com adapter Prisma.
    - Instalar: `pnpm add next-auth @next-auth/prisma-adapter` e criar `app/api/auth/[...nextauth]/route.ts`.
  - Opção B: Implementar autenticação custom (rotas `/api/auth/*`, sessions com cookies/token e tabela `Session` no Prisma).
- Atualizar ou remover `lib/auth-context.tsx` para usar `next-auth` ou novo flow.

6) Atualizar páginas e componentes para usar os novos endpoints/hooks
- Substituir chamadas diretas a `supabase` por hooks TanStack Query e chamadas aos endpoints `app/api/*`.
- Arquivos principais: `app/page.tsx`, `app/admin/dashboard/page.tsx`, componentes que acessavam `Profile`/`Project`.

7) Testes e build
- Rodar `pnpm dev` e testar fluxos: listagem de projetos, edição de perfil, login/logout (se aplicável).
- Após validar, rodar `pnpm build` para checar SSR/SSG.

8) Limpeza final
- Remover `lib/supabase` (se existir) e referências residuais.
- Atualizar `package.json` e README (variáveis de ambiente: `DATABASE_URL`, etc.).

Comandos úteis

```bash
pnpm remove @supabase/supabase-js
pnpm add next-auth @next-auth/prisma-adapter   # se escolher next-auth
rm -rf .next
pnpm dev
pnpm build
```

Sugestão de próximos passos (posso executar agora)

- Implementar endpoints mínimos server-side: `app/api/profile/route.ts` e `app/api/projects/route.ts`, e criar os hooks `hooks/useProfile.ts` e `hooks/useProjects.ts`.

Quer que eu comece criando os endpoints API e um exemplo de hook TanStack Query agora?