# Plano de Melhorias - Página Explore

## Mudanças Solicitadas

### 1. Header com Tabs
- ✅ Remover botão de voltar
- ✅ Mover tabs para o header
- ✅ Tabs inativas em cinza (legibilidade)

### 2. Seção "Sobre Mim"
- ✅ Imagem centralizada (avatar)
- ✅ Título
- ✅ Descrição como array de sentenças (para quebras de linha)

### 3. Seção de Contato
- ✅ Separada da seção principal
- ✅ Informações de contato (email, GitHub, LinkedIn)

### 4. Admin
- ✅ Remover suporte PT/EN
- ✅ Apenas português no admin
- ✅ Campo `bio` deve ser array de strings

## Alterações Necessárias

### Types
- Atualizar `Profile` interface: `bio: string[]` (array de sentenças)

### Componentes
- Refatorar `explore-content.tsx`:
  - Tabs no header
  - Remover botão voltar
  - Melhorar contraste tabs inativas
  - Imagem centralizada
  - Bio como array com quebras de linha
  - Seção de contato separada

### Admin (dashboard)
- Atualizar formulário de perfil
- Campo bio como textarea com quebras de linha
- Remover lógica de tradução PT/EN
