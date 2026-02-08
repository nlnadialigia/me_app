# 💼 Portfólio Pessoal

<div align="center">

![Made by Nadia Ligia](https://img.shields.io/badge/made%20by-Nadia%20Ligia-blueviolet?style=flat-square)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat-square&logo=typescript)

**Aplicação full-stack para gerenciar e exibir portfólio pessoal com painel administrativo**

[Demo](#) • [Documentação](#-sobre) • [Instalação](#-instalação)

</div>

---

## 📋 Índice

- [Sobre](#-sobre)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Scripts](#-scripts)
- [API](#-api)
- [Licença](#-licença)

---

## 🎯 Sobre

Aplicação moderna de portfólio pessoal desenvolvida com Next.js 16, oferecendo uma interface pública para visualização de projetos e perfil, além de um painel administrativo completo para gerenciamento de conteúdo.

### Características principais:

- 🌐 **Multilíngue** - Suporte para Português e Inglês
- 🔐 **Autenticação** - Sistema de login seguro com NextAuth
- 📱 **Responsivo** - Interface adaptável para todos os dispositivos
- 🎨 **Design Moderno** - UI com Tailwind CSS e Shadcn/ui
- ⚡ **Performance** - SSR e otimizações do Next.js 16
- 🗄️ **Banco de Dados** - PostgreSQL com Prisma ORM

---

## ✨ Funcionalidades

### Área Pública (`/explore`)
- Visualização de perfil com bio multilíngue
- Listagem de projetos com tecnologias
- Links para projetos ao vivo e repositórios
- Troca de idioma (PT/EN)

### Painel Administrativo (`/admin`)
- **Autenticação segura** com credenciais
- **Gerenciamento de Perfil**:
  - Edição de nome, título e bio (PT/EN)
  - Upload de avatar
  - Links de contato (email, GitHub, LinkedIn)
- **Gerenciamento de Projetos**:
  - CRUD completo de projetos
  - Descrições multilíngues
  - Associação com tecnologias
  - Ordenação customizada
  - Links para demo e código

---

## 🛠️ Tecnologias

### Frontend
- **Next.js 16.1.6** - Framework React com SSR
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **Shadcn/ui** - Componentes UI
- **TanStack Query** - Gerenciamento de estado servidor
- **Lucide React** - Ícones

### Backend
- **Next.js API Routes** - Endpoints REST
- **NextAuth.js** - Autenticação
- **Prisma 7** - ORM
- **PostgreSQL** - Banco de dados
- **Bcrypt** - Hash de senhas
- **Pino** - Logging

### DevOps
- **pnpm** - Gerenciador de pacotes
- **ESLint** - Linting
- **TypeScript** - Type checking

---

## 📁 Estrutura do Projeto

```
me_app/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # Autenticação
│   │   ├── profile/               # API de perfil
│   │   ├── projects/              # API de projetos
│   │   └── logs/                  # Logs da aplicação
│   ├── admin/
│   │   ├── dashboard/             # Painel admin
│   │   └── login/                 # Login admin
│   ├── explore/                   # Área pública
│   └── layout.tsx                 # Layout raiz
├── components/
│   ├── ui/                        # Componentes Shadcn
│   ├── dashboard-content.tsx      # Conteúdo do dashboard
│   ├── explore-content.tsx        # Conteúdo público
│   └── language-switcher.tsx      # Seletor de idioma
├── hooks/
│   ├── useProfile.ts              # Hook de perfil
│   ├── useProjects.ts             # Hook de projetos
│   └── useTechnologies.ts         # Hook de tecnologias
├── lib/
│   ├── auth-context.tsx           # Contexto de autenticação
│   ├── language-context.tsx       # Contexto de idioma
│   ├── prisma.ts                  # Cliente Prisma
│   └── logger.ts                  # Logger Pino
├── prisma/
│   ├── schema.prisma              # Schema do banco
│   └── migrations/                # Migrações
├── public/                        # Arquivos estáticos
└── types/                         # Tipos TypeScript
```

---

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+

### Passo a passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/me_app.git
cd me_app
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

4. **Configure o banco de dados**
```bash
# Execute as migrations
pnpm prisma migrate dev

# (Opcional) Popule com dados iniciais
pnpm prisma db seed
```

5. **Inicie o servidor de desenvolvimento**
```bash
pnpm dev
```

Acesse:
- Área pública: http://localhost:3000/explore
- Admin: http://localhost:3000/admin/login

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"

# Admin Credentials (para primeiro acesso)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="senha-segura"
```

### Banco de Dados

O schema Prisma inclui:

- **Profile** - Informações do perfil (nome, bio, contatos)
- **Project** - Projetos do portfólio
- **Technology** - Tecnologias disponíveis
- **ProjectTechnology** - Relação many-to-many
- **User** - Usuários do sistema
- **Account/Session** - Dados do NextAuth

---

## 📜 Scripts

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor dev (limpa .next)
pnpm build            # Build de produção
pnpm start            # Inicia servidor de produção

# Qualidade de código
pnpm lint             # Executa ESLint
pnpm typecheck        # Verifica tipos TypeScript

# Banco de dados
pnpm prisma migrate dev       # Cria e aplica migration
pnpm prisma db push           # Sincroniza schema sem migration
pnpm prisma studio            # Interface visual do banco
pnpm prisma generate          # Gera Prisma Client
```

---

## 🔌 API

### Endpoints Públicos

#### `GET /api/profile`
Retorna dados do perfil

**Response:**
```json
{
  "id": "...",
  "name": "Nádia Ligia",
  "titlePt": "Desenvolvedora Full Stack",
  "titleEn": "Full Stack Developer",
  "bioPt": ["..."],
  "bioEn": ["..."],
  "email": "email@example.com",
  "avatarUrl": "https://...",
  "githubUrl": "https://github.com/...",
  "linkedinUrl": "https://linkedin.com/in/..."
}
```

#### `GET /api/projects`
Lista todos os projetos com tecnologias

**Response:**
```json
[
  {
    "id": "...",
    "name": "Projeto X",
    "descriptionPt": "...",
    "descriptionEn": "...",
    "liveUrl": "https://...",
    "githubUrl": "https://...",
    "technologies": [
      { "name": "React", "color": "#61dafb" }
    ],
    "orderIndex": 0
  }
]
```

### Endpoints Protegidos (requer autenticação)

#### `PUT /api/profile`
Atualiza perfil

#### `POST /api/projects`
Cria novo projeto

**Body:**
```json
{
  "name": "Projeto",
  "descriptionPt": "...",
  "descriptionEn": "...",
  "liveUrl": "https://...",
  "githubUrl": "https://...",
  "technologies": ["React", "Node.js"],
  "orderIndex": 0
}
```

#### `PUT /api/projects`
Atualiza projeto existente

#### `DELETE /api/projects`
Remove projeto

---

## 📝 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

**Desenvolvido com ❤️ por [Nádia Ligia](https://github.com/nlnadialigia)**

</div>
