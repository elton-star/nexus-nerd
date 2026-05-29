# Nexus Nerd

Portal geek premium em Next.js 15, React, TypeScript, Tailwind CSS, Framer Motion e Supabase preparado.

## Rodar localmente

```bash
npm install
npm run dev
```

Crie um arquivo `.env.local` com as chaves do Supabase caso queira conectar autenticação e banco reais.

Para posts aparecerem para qualquer pessoa ao abrir o link pelo WhatsApp, configure o Supabase:

1. Crie um projeto no Supabase.
2. Rode o SQL do arquivo `supabase-schema.sql`.
3. Crie `.env.local` com:

```bash
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
```

Sem Supabase, os posts ficam salvos apenas no navegador de quem publicou.

## Inclui

- Home cinematográfica com carrosséis e cards estilo streaming.
- Categorias para Notícias, Marvel, DC Comics, Mangás, Animes, Games, Filmes e Séries e Teorias.
- Página individual de artigo com curtidas e comentários.
- Login/cadastro demo, perfil do usuário e painel admin.
- CRUD local de posts, gerenciamento de usuários e estatísticas.
- Arquivo `supabase-schema.sql` com tabelas e políticas iniciais.
