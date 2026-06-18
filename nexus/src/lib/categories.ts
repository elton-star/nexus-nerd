import type { CategorySlug } from "@/types";

export const categories: Array<{ slug: CategorySlug; label: string; description: string }> = [
  {
    slug: "noticias",
    label: "Notícias",
    description: "Atualizações rápidas do universo geek."
  },
  {
    slug: "marvel",
    label: "Marvel",
    description: "Filmes, séries, HQs e bastidores do multiverso."
  },
  {
    slug: "dc-comics",
    label: "DC Comics",
    description: "Batman, Superman, Liga da Justiça e eras do DCU."
  },
  {
    slug: "ficcao-cientifica",
    label: "Ficção Científica",
    description: "Lançamentos, arcos, rankings e clássicos da ficção científica."
  },
  {
    slug: "animes",
    label: "Animes",
    description: "Temporadas, estreias, reviews e guias de episódios."
  },
  {
    slug: "games",
    label: "Games",
    description: "Reviews, trailers, eSports e próximos lançamentos."
  },
  {
    slug: "filmes-series",
    label: "Filmes e Séries",
    description: "Streaming, cinema, adaptações e universos compartilhados."
  },
  {
    slug: "teorias",
    label: "Teorias",
    description: "Conexões, rumores e hipóteses para fãs atentos."
  }
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}
