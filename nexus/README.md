# Nexus Nerd

Portal geek premium em Next.js 15, React, TypeScript, Tailwind CSS, Framer Motion e Supabase preparado.

## Rodar localmente

```bash
npm install
npm run dev
```

Crie um arquivo `.env.local` com as chaves do Supabase caso queira conectar autenticaÃ§Ã£o e banco reais.

Para posts aparecerem para qualquer pessoa ao abrir o link pelo WhatsApp, configure o Supabase:

1. Crie um projeto no Supabase.
2. Rode o SQL do arquivo `supabase-schema.sql`.
3. Crie `.env.local` com:

```bash
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
```

Sem Supabase, os posts ficam salvos apenas no navegador de quem publicou.

## NotificaÃ§Ãµes push

Para avisar celulares quando um post novo for publicado, configure tambÃ©m:

```bash
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
NEXT_PUBLIC_VAPID_PUBLIC_KEY=sua_vapid_public_key
VAPID_PRIVATE_KEY=sua_vapid_private_key
VAPID_SUBJECT=mailto:seu-email@dominio.com
```

Gere as chaves VAPID com:

```bash
npx web-push generate-vapid-keys
```

Depois rode novamente o SQL de `supabase-schema.sql` para criar `push_subscriptions`.


## Capas automaticas dos posts

No painel admin, use o botao **Gerar capa** para buscar uma imagem pronta em alta qualidade pelo titulo e categoria do post.

Configure pelo menos uma destas chaves no `.env.local`:

```bash
PEXELS_API_KEY=sua_chave_pexels
UNSPLASH_ACCESS_KEY=sua_chave_unsplash
```

O sistema tenta primeiro o Pexels e, se nao encontrar, tenta o Unsplash.

## Inclui

- Home cinematogrÃ¡fica com carrossÃ©is e cards estilo streaming.
- Categorias para NotÃ­cias, Marvel, DC Comics, MangÃ¡s, Animes, Games, Filmes e SÃ©ries e Teorias.
- PÃ¡gina individual de artigo com curtidas e comentÃ¡rios.
- Login/cadastro demo, perfil do usuÃ¡rio e painel admin.
- CRUD local de posts, gerenciamento de usuÃ¡rios e estatÃ­sticas.
- Arquivo `supabase-schema.sql` com tabelas e polÃ­ticas iniciais.

