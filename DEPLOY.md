
# DEPLOY.md — Prodoc (Supabase + Vercel/Node)

Este guia cobre a instalação em um projeto **Supabase** e o deploy do **Prodoc** (Next.js 14).

> Para o modelo de dados, consulte **[DB.md](../DB.md)**.

---

## 1) Criar projeto no Supabase

1. Crie um novo projeto e **habilite Auth** (email/password ou provedor de sua escolha).  
2. No **SQL Editor**, rode **uma vez** o arquivo:

   **`supabase_prodoc_all_in_one_v4.1_STABILIZER_TEMPLATES_HOTFIX3.sql`**

   - O script habilita extensões (`citext`, `uuid-ossp`, `pgcrypto`), cria tipos, normaliza tabelas, ajusta RLS e aplica seeds idempotentes.
   - É seguro executar novamente (idempotente).

3. Crie/eleve um usuário a **admin**:

   ```sql
   -- Logado como o usuário desejado, rode:
   update public.profiles set role='admin' where id = auth.uid();
   -- ou atribua por UUID:
   update public.profiles set role='admin' where id = '<UUID-DO-USUARIO>';
   ```

4. (Opcional) Publicação global manual de templates:

   ```sql
   select public.publish_template(id, 1, 'Publicação inicial')
   from public.templates
   where slug in (
     'pat-adulto-pneumonia-comunitaria-v1',
     'kit-analgesia-basica-adulto-v1',
     'obs-sindrome-gripal-v1',
     'exame-fisico-padrao-v1',
     'med-antiemetico-ondasetrona-v1'
   );
   ```

---

## 2) Variáveis de ambiente (frontend)

Configure no provedor (Vercel, Railway, etc.):

```
NEXT_PUBLIC_SUPABASE_URL=<sua-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<seu-anon-key>
# Opcional: para jobs/RPCs administrativos server-side
SUPABASE_SERVICE_ROLE=<service-role-key>
```

No local, use **`.env.local`** com os mesmos valores.

> **Dica**: o **service role** nunca deve ser exposto no cliente; use apenas em rotas server-side (Next.js API), se necessário.

---

## 3) Deploy (Vercel)

1. Conecte o repositório no Vercel.  
2. Defina as envs acima no projeto.  
3. Defina `NODE_VERSION` (18+) se estiver diferente do projeto.  
4. Build & Deploy.

### Checks pós-deploy

- Rodar no Supabase:
  ```sql
  select * from v_active_submenus;
  select slug, version from templates;
  ```
- Login → Sidebar deve listar módulos; Studio Admin deve permitir criar submenus e publicar templates.

---

## 4) Problemas Comuns & Soluções

- **`type "citext" does not exist`**  
  Rode antes: `create extension if not exists citext;` (o estabilizador já faz).

- **`type "submenu_scope" does not exist`**  
  O arquivo cria o enum **antes** de usá-lo; verifique se o script foi executado completo.

- **`submenus.user_id NOT NULL`/seed falha**  
  O hotfix embutido tenta soltar NOT NULL; se não possível, o seed atribui **owner** automaticamente (admin → primeiro `auth.users`).

- **`templates.set_id NOT NULL`**  
  O script cria `public.sets` e semeia **set padrão** “Padrão” quando `set_id` é obrigatório.

- **`submenus.title NOT NULL` (legado)**  
  O hotfix remove CHECKs rígidos, faz backfill com `submenu_name` e solta NOT NULL (ou aplica default vazio).

---

## 5) Atualizações/Migrações futuras

Sempre manter a ordem:
1. **Extensões**  
2. **Tipos**  
3. **Patches de compatibilidade** (renomeios, backfill)  
4. **Constraints/Índices**  
5. **RLS**  
6. **Seeds**

E manter **idempotência**: usar `if not exists`, `on conflict do nothing`, `do $$ begin ... end $$` com checagens.

---

## 6) Checklist de produção

- [ ] Estabilizador aplicado sem erros.  
- [ ] Existe pelo menos um **admin**.  
- [ ] `v_active_submenus` populada.  
- [ ] Templates base presentes.  
- [ ] Login/fluxos básicos ok no ambiente final.

---

_fim_
