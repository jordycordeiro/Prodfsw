# Prodoc — Relatório de Limpeza (auto)

Data: 2025-11-02 11:56:37

Este pacote foi limpo automaticamente com as seguintes regras:

- Remoção de diretórios de build/cache: `node_modules`, `.next`, `.turbo`, `dist`, `build`, `out`, `.vercel`, `.git`, etc.
- Remoção de arquivos temporários ou de sistema: `.DS_Store`, `Thumbs.db`, `*.log`, backups `*.bak`, `*.old`, `*~`, `file (1).*`, e variações.
- Exclusão de `.env` reais (mantidos apenas `.env.example`/`sample`/`.local`).
- Deduplicação por hash de conteúdo: mantido um exemplar mais "canônico"; os demais foram removidos.
- Preservado apenas o que é claramente fonte/configuração/ativos de projeto (Next.js 14): `app/`, `components/`, `styles/`, `public/`, `lib/`, `hooks/`, `store/`, configs (`package.json`, `next.config.*`, `tsconfig.json`, `tailwind.config.*`, `postcss.config.js`, etc.), `supabase.sql`, `README`, e mídias necessárias.

> Observação: Para evitar quebrar imports, **não** renomeamos ou movemos arquivos de lugar — apenas removemos artefatos e duplicatas evidentes.

## Sugestão de estrutura alvo (Prodoc)
```
/app
/components
/styles
/public
/lib | /hooks | /store | /utils
/supabase.sql
package.json
next.config.(js|mjs)
tsconfig.json
tailwind.config.(js|ts)
postcss.config.js
README.md
```

Se desejar, posso rodar uma **organização assistida** (refactor de pastas + correção automática de imports) em uma próxima iteração.

— Ferramenta de limpeza automatizada
