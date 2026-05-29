import type { Comment, Post } from "@/types";

export const posts: Post[] = [
  {
    id: "1",
    slug: "multiverso-marvel-nova-fase",
    title: "A nova fase do multiverso Marvel quer recuperar o senso de evento",
    excerpt: "Com heróis cósmicos, variantes e ameaças maiores, a Marvel reposiciona suas próximas sagas.",
    content:
      "A Marvel está preparando uma fase em que o multiverso volta a ter peso emocional. O segredo não está só em participações especiais, mas em mostrar consequências claras para cada escolha dos heróis. O público quer escala, mas também quer personagens com dilemas fortes e jornadas reconhecíveis.",
    category: "marvel",
    cover: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1600&q=80",
    author: "Lia Nova",
    date: "2026-05-22",
    readTime: "6 min",
    likes: 2480,
    comments: 184,
    featured: true,
    trending: true,
    tags: ["Marvel", "Cinema", "Multiverso"]
  },
  {
    id: "2",
    slug: "batman-dcu-detetive",
    title: "O próximo Batman do DCU precisa abraçar o lado detetive",
    excerpt: "A força do personagem pode estar menos no espetáculo e mais na investigação urbana.",
    content:
      "O Batman funciona melhor quando Gotham parece viva, perigosa e cheia de camadas. Um DCU moderno pode diferenciar sua versão do herói ao apostar em mistério, tecnologia discreta e uma galeria de aliados tão importante quanto os vilões.",
    category: "dc-comics",
    cover: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&w=1600&q=80",
    author: "Caio Wayne",
    date: "2026-05-20",
    readTime: "5 min",
    likes: 1910,
    comments: 132,
    featured: true,
    tags: ["DC", "Batman", "Cinema"]
  },
  {
    id: "3",
    slug: "mangas-dark-fantasy-em-alta",
    title: "Por que os mangás de dark fantasy voltaram ao topo das listas",
    excerpt: "Histórias sombrias com mundos densos estão conquistando uma nova geração de leitores.",
    content:
      "A nova onda de dark fantasy combina ação brutal com construção de mundo minuciosa. O resultado são narrativas que conversam com games, animes e séries, criando comunidades que discutem teorias capítulo a capítulo.",
    category: "mangas",
    cover: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=1600&q=80",
    author: "Mika Tanaka",
    date: "2026-05-18",
    readTime: "7 min",
    likes: 1684,
    comments: 96,
    trending: true,
    tags: ["Mangás", "Dark Fantasy", "Leitura"]
  },
  {
    id: "4",
    slug: "animes-temporada-imperdiveis",
    title: "Os animes mais fortes da temporada para colocar na lista",
    excerpt: "A temporada mistura ação, romance, fantasia e continuações aguardadas.",
    content:
      "A melhor estratégia para acompanhar a temporada é equilibrar grandes continuações com estreias menores. Algumas produções surpreendem pela direção de arte, outras pelo roteiro enxuto e personagens que prendem já no primeiro episódio.",
    category: "animes",
    cover: "https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&w=1600&q=80",
    author: "Nina Pixel",
    date: "2026-05-17",
    readTime: "4 min",
    likes: 2201,
    comments: 211,
    trending: true,
    tags: ["Animes", "Temporada", "Guia"]
  },
  {
    id: "5",
    slug: "games-soulslike-futuro",
    title: "O futuro dos soulslikes passa por mundos menos previsíveis",
    excerpt: "O gênero amadurece quando troca dificuldade vazia por exploração significativa.",
    content:
      "Soulslikes ainda dependem de combate preciso, mas o próximo salto do gênero está na surpresa. Mapas que reagem ao jogador, chefes com leituras diferentes e progressão menos óbvia podem renovar a sensação de descoberta.",
    category: "games",
    cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
    author: "Dante Core",
    date: "2026-05-15",
    readTime: "8 min",
    likes: 3104,
    comments: 267,
    featured: true,
    trending: true,
    tags: ["Games", "RPG", "Soulslike"]
  },
  {
    id: "6",
    slug: "streaming-geek-adaptacoes",
    title: "Adaptações geek entram na era do prestígio no streaming",
    excerpt: "Séries baseadas em games e HQs estão mais ambiciosas, caras e autorais.",
    content:
      "Depois de anos de adaptações irregulares, os streamings entenderam que fidelidade não é copiar tudo. É preservar o espírito da obra e usar a linguagem audiovisual para ampliar temas, conflitos e personagens.",
    category: "filmes-series",
    cover: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80",
    author: "Bruno Frame",
    date: "2026-05-14",
    readTime: "6 min",
    likes: 1435,
    comments: 88,
    tags: ["Streaming", "Séries", "Adaptações"]
  },
  {
    id: "7",
    slug: "teoria-guerras-secretas-xmen",
    title: "Teoria: Guerras Secretas pode ser a ponte definitiva para os X-Men",
    excerpt: "Pistas recentes sugerem que mutantes podem surgir por colisões entre realidades.",
    content:
      "A chegada dos X-Men pode ser mais poderosa se nascer de uma crise multiversal. Essa abordagem permite apresentar mutantes já estabelecidos, sem gastar anos explicando por que estavam ausentes.",
    category: "teorias",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1600&q=80",
    author: "Theo Prime",
    date: "2026-05-12",
    readTime: "5 min",
    likes: 2788,
    comments: 341,
    trending: true,
    tags: ["Teorias", "X-Men", "Marvel"]
  },
  {
    id: "8",
    slug: "noticias-trailers-semana",
    title: "Resumo geek: trailers, anúncios e datas que movimentaram a semana",
    excerpt: "Tudo que vale entrar no seu radar sem precisar caçar novidade por novidade.",
    content:
      "A semana trouxe anúncios de games, datas de estreias, novos trailers e confirmações importantes. O destaque fica para produções que parecem mirar fãs antigos sem afastar o público novo.",
    category: "noticias",
    cover: "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?auto=format&fit=crop&w=1600&q=80",
    author: "Editor Nexus",
    date: "2026-05-10",
    readTime: "3 min",
    likes: 982,
    comments: 53,
    tags: ["Notícias", "Trailers", "Resumo"]
  }
];

export const comments: Comment[] = [
  {
    id: "c1",
    postSlug: "multiverso-marvel-nova-fase",
    user: "Rafa",
    message: "Tomara que voltem a focar nos personagens, não só em cameo.",
    date: "2026-05-23"
  },
  {
    id: "c2",
    postSlug: "games-soulslike-futuro",
    user: "Ana",
    message: "Exploração com surpresa real é exatamente o que falta no gênero.",
    date: "2026-05-16"
  }
];

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: string) {
  return posts.filter((post) => post.category === category);
}

export function searchPosts(query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return posts;
  }

  return posts.filter((post) => {
    const searchable = [post.title, post.excerpt, post.category, post.author, ...post.tags].join(" ").toLowerCase();
    return searchable.includes(normalized);
  });
}
