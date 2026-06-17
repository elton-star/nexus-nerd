import { NextResponse } from "next/server";

type CoverSearchBody = {
  title?: string;
  category?: string;
};

type CoverResult = {
  url: string;
  alt: string;
  credit: string;
};

const categoryTerms: Record<string, string> = {
  noticias: "geek pop culture news",
  marvel: "Marvel superhero comic cinematic",
  "dc-comics": "DC Comics superhero cinematic",
  mangas: "manga japanese comic art",
  animes: "anime japanese animation cinematic",
  games: "video game cinematic console",
  "filmes-series": "movie series streaming cinematic",
  teorias: "mystery theory neon cinematic"
};

const titleTerms: Array<{ match: RegExp; term: string }> = [
  { match: /demolidor|daredevil/i, term: "Daredevil Marvel superhero comic dark city" },
  { match: /justiceiro|punisher/i, term: "Punisher Marvel antihero comic dark action" },
  { match: /homem[-\s]?aranha|spider[-\s]?man/i, term: "Spider Man Marvel superhero comic city" },
  { match: /batman|cavaleiro das trevas/i, term: "Batman DC superhero comic Gotham dark" },
  { match: /superman/i, term: "Superman DC superhero comic cinematic sky" },
  { match: /mulher[-\s]?maravilha|wonder woman/i, term: "Wonder Woman DC superhero comic warrior" },
  { match: /coringa|joker/i, term: "Joker DC villain comic dark city" },
  { match: /elektra/i, term: "Elektra Marvel assassin comic red" },
  { match: /wolverine|logan/i, term: "Wolverine Marvel superhero comic claws" },
  { match: /deadpool/i, term: "Deadpool Marvel antihero comic action" },
  { match: /vingadores|avengers/i, term: "Avengers Marvel superhero team cinematic" },
  { match: /x[-\s]?men/i, term: "X Men Marvel superhero team comic" },
  { match: /naruto/i, term: "Naruto anime manga ninja" },
  { match: /one piece/i, term: "One Piece anime manga pirate sea" },
  { match: /dragon ball|goku/i, term: "Dragon Ball anime manga energy" },
  { match: /jujutsu|gojo|sukuna/i, term: "Jujutsu Kaisen anime manga dark fantasy" },
  { match: /demon slayer|kimetsu/i, term: "Demon Slayer anime manga sword" },
  { match: /attack on titan|shingeki/i, term: "Attack on Titan anime manga dark fantasy" },
  { match: /playstation|ps5/i, term: "PlayStation 5 controller gaming" },
  { match: /xbox/i, term: "Xbox controller gaming" },
  { match: /nintendo|switch/i, term: "Nintendo Switch gaming console" }
];

const stopWords = new Set([
  "a",
  "o",
  "os",
  "as",
  "um",
  "uma",
  "de",
  "da",
  "do",
  "das",
  "dos",
  "em",
  "no",
  "na",
  "nos",
  "nas",
  "e",
  "ou",
  "que",
  "por",
  "para",
  "com",
  "sem",
  "sobre",
  "tudo",
  "porque",
  "por que",
  "esta",
  "está",
  "foi",
  "ser",
  "mais",
  "menos"
]);

function normalizeTitle(title: string) {
  return title
    .replace(/[#*_`~:;!?()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getKeywords(title: string) {
  return normalizeTitle(title)
    .split(" ")
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !stopWords.has(word.toLowerCase()))
    .slice(0, 6)
    .join(" ");
}

function getMappedTerm(title: string) {
  return titleTerms.find((item) => item.match.test(title))?.term;
}

function buildQueries(title: string, category = "") {
  const cleanTitle = normalizeTitle(title);
  const keywords = getKeywords(cleanTitle);
  const mappedTerm = getMappedTerm(cleanTitle);
  const categoryTerm = categoryTerms[category] ?? "geek nerd culture cinematic";

  return Array.from(
    new Set(
      [
        mappedTerm ? `${mappedTerm} ${categoryTerm}` : "",
        keywords ? `${keywords} ${categoryTerm}` : "",
        `${cleanTitle} ${categoryTerm}`,
        categoryTerm
      ]
        .filter(Boolean)
        .map((query) => `${query} high resolution landscape`)
    )
  );
}

async function searchPexels(query: string): Promise<CoverResult | null> {
  const key = process.env.PEXELS_API_KEY;

  if (!key) {
    return null;
  }

  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&size=large&per_page=10`,
    {
      headers: {
        Authorization: key
      },
      next: {
        revalidate: 3600
      }
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    photos?: Array<{
      alt?: string;
      photographer?: string;
      src?: {
        large2x?: string;
        original?: string;
        landscape?: string;
      };
    }>;
  };

  const photo = data.photos?.[0];
  const url = photo?.src?.large2x ?? photo?.src?.original ?? photo?.src?.landscape;

  if (!url) {
    return null;
  }

  return {
    url,
    alt: photo?.alt ?? query,
    credit: photo?.photographer ? `Pexels - ${photo.photographer}` : "Pexels"
  };
}

async function searchUnsplash(query: string): Promise<CoverResult | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;

  if (!key) {
    return null;
  }

  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=10&content_filter=high`,
    {
      headers: {
        Authorization: `Client-ID ${key}`
      },
      next: {
        revalidate: 3600
      }
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    results?: Array<{
      alt_description?: string | null;
      description?: string | null;
      urls?: {
        regular?: string;
        full?: string;
      };
      user?: {
        name?: string;
      };
    }>;
  };

  const photo = data.results?.[0];
  const url = photo?.urls?.regular ?? photo?.urls?.full;

  if (!url) {
    return null;
  }

  return {
    url,
    alt: photo?.alt_description ?? photo?.description ?? query,
    credit: photo?.user?.name ? `Unsplash - ${photo.user.name}` : "Unsplash"
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as CoverSearchBody;
  const title = body.title?.trim();

  if (!title) {
    return NextResponse.json({ error: "Informe o título do post antes de buscar a capa." }, { status: 400 });
  }

  const queries = buildQueries(title, body.category);

  for (const query of queries) {
    const result = (await searchPexels(query)) ?? (await searchUnsplash(query));

    if (result) {
      return NextResponse.json({
        ...result,
        query
      });
    }
  }

  return NextResponse.json(
    {
      error: "Configure PEXELS_API_KEY ou UNSPLASH_ACCESS_KEY para buscar capas automaticamente."
    },
    { status: 400 }
  );
}
