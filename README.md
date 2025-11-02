
# Prodoc — Plataforma de Prescrições e Registros Médicos (Next.js 14)

**Prodoc** é uma plataforma para médicos plantonistas, com foco em agilizar atendimentos e padronizar prescrições e registros.
Frontend em **Next.js 14 + Tailwind**, estado global via **Zustand-like** (`useProdocStore`), e backend **Supabase (Postgres + RLS)**.

> Para o guia completo do banco: veja **[DB.md](./DB.md)**.

---

## ✨ Principais recursos

- Módulos: **Exame Físico, Observações (Queixas), Medicações, Patologias (Adulto / Pediatria)**.
- Cards com **barra azul arredondada** (título) e **card gelo** (conteúdo editável/copiar).
- **Patologias** com sub-blocos (uso oral/EV/notas) + **Duplicar, Resetar, Salvar/Reverter estável**.
- **Admin Studio**: cria submenus, publica templates (distribuição para usuários).
- **Autenticação Supabase** e **RLS** (cada usuário só vê seus cards).
- **Seeds idempotentes** e migrações **tolerantes a esquemas legados**.

---

## 🧱 Arquitetura (alto nível)

```
/app
  page.tsx                 # Workspace principal (Topbar, Sidebar, Canvas)
  /admin/studio            # Estúdio administrativo
/components
  ExameFisico.tsx          # Blocos pré-prontos (Geral, AR, ACV, ABD, MMII)
  Observacoes.tsx          # Queixas Gerais
  Medicacoes.tsx           # Protocolos da Unidade
  Canvas.tsx               # Conteúdo dinâmico (patologia/módulo selecionado)
  Sidebar.tsx              # Navegação lateral (inclui + Novo Bloco/Patologia/Medicação)
  SettingsPanel.tsx
  Toolbar.tsx / ToolbarButton.tsx
/styles
  prodoc-bars.css          # title-bar, title-input, btn/btn-chip/btn-warn
  globals.css
/store
  useProdocStore.ts        # updateModel, deleteModel, toggleSelect, duplicateToSubmenu,
                           # saveStable, revertStable
```

**Contrato com DB:**  
- `v_active_submenus` → use para popular selectors na UI (evita itens inativos).  
- `prescriptions` → cards do usuário (`parent_menu`, `submenu`, `content` JSON, `stable_payload`).  
- Templates → distribuição e versionamento de modelos (admin).

---

## 🛠️ Stack

- **Next.js 14** (React), **Tailwind CSS**.
- **Supabase** (Auth + Postgres + RLS).
- **Zustand-like store**, componentes estilizados próprios.

---

## 🚀 Começando (dev)

### 1) Pré‑requisitos
- **Node.js 18+** (LTS)
- **pnpm** (recomendado) ou npm/yarn
- Projeto Supabase (criado via dashboard).

### 2) Variáveis de ambiente

Crie `.env.local` com:

```bash
NEXT_PUBLIC_SUPABASE_URL=<sua-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<seu-anon-key>
# Opcional (server-side jobs/RPCs administrativos)
SUPABASE_SERVICE_ROLE=<service-role-key>
```

### 3) Banco de dados (rodar o estabilizador)
Execute no SQL editor do Supabase o arquivo **supabase_prodoc_all_in_one_v4.1_STABILIZER_TEMPLATES_HOTFIX3.sql**.  
Ele é idempotente e ajusta esquemas legados.

Após rodar, torne um usuário **admin**:

```sql
update public.profiles set role='admin' where id = auth.uid(); -- rode logado como o admin desejado
-- ou informe manualmente o UUID do usuário
```

### 4) Instalar e subir
```bash
pnpm install
pnpm dev  # http://localhost:3000
```

---

## 🧩 Fluxos-chave

- **Criar Submenu (Admin)**: insira `submenu_name`, `scope`, `is_active`. A UI reflete via `v_active_submenus`.
- **Salvar como estável**: persista `stable_payload` no card (`prescriptions`) e/ou crie `template_versions` quando pertinente.
- **Publicar Template**: admin cria `templates` e usa `publish_template()` → preenche `user_inbox` de todos; cada usuário aplica com `apply_inbox_item()` e gera seu card.

---

## ✅ Qualidade / Padrões

- Não duplicar `(submenu_name, scope)`. Valide antes no frontend.
- UI responsiva (tablet/celular) e **print‑friendly** (ocultar menus ao imprimir).
- Seeds e migrações sempre idempotentes.

---

## 🤝 Contribuindo

- Commits pequenos e descritivos.
- Novas migrations: **extensões → tipos → patches → constraints → RLS → seeds**.
- Mantenha compatibilidade com esquemas legados sempre que possível.

---

## 📄 Licença

Definir conforme o projeto (ex.: MIT).

