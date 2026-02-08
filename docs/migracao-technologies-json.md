# Migração de Tecnologias para JSON

## Problema
O banco de dados tem tecnologias no formato `String[]` mas o código espera `Json` com objetos `{name, color}`.

## Solução

### Opção 1: Reset (desenvolvimento - perde dados)
```bash
pnpm prisma migrate reset
pnpm prisma migrate dev
```

### Opção 2: Migração manual (preserva dados)

1. Crie a migração:
```bash
pnpm prisma migrate dev --create-only --name change_technologies_to_json
```

2. Edite o arquivo de migração criado em `prisma/migrations/` e adicione:

```sql
-- Criar coluna temporária
ALTER TABLE projects ADD COLUMN technologies_new JSONB;

-- Converter dados existentes
UPDATE projects 
SET technologies_new = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'name', tech,
      'color', '#64748b'
    )
  )
  FROM unnest(technologies) AS tech
)
WHERE technologies IS NOT NULL AND array_length(technologies, 1) > 0;

-- Para projetos sem tecnologias
UPDATE projects 
SET technologies_new = '[]'::jsonb
WHERE technologies IS NULL OR array_length(technologies, 1) IS NULL;

-- Remover coluna antiga e renomear
ALTER TABLE projects DROP COLUMN technologies;
ALTER TABLE projects RENAME COLUMN technologies_new TO technologies;
```

3. Aplique a migração:
```bash
pnpm prisma migrate dev
```

### Opção 3: Limpar projetos existentes via API

Se preferir, pode deletar os projetos existentes pelo admin e criar novos com o formato correto.
