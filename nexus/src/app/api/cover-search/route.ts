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
  noticias: "geek culture",
  marvel: "Marvel superhero cosplay comic",
  "dc-comics": "DC Comics superhero cosplay comic",
  mangas: "manga anime illustration",
  animes: "anime illustration",
  games: "video game character",
  "filmes-series": "movie series character",
  teorias: "mystery geek theory"
};

const titleTerms: Array<{ match: RegExp; terms: string[] }> = [
  { match: /homem[-\s]?aranha|spider[-\s]?man/i, terms: ["Spider-Man cosplay", "Spider Man superhero red blue suit", "spiderman comic cosplay"] },
  { match: /demolidor|daredevil/i, terms: ["Daredevil cosplay", "Daredevil superhero red suit", "Daredevil Marvel fan art"] },
  { match: /justiceiro|punisher/i, terms: ["Punisher cosplay", "Punisher skull superhero", "Punisher comic fan art"] },
  { match: /batman|cavaleiro das trevas/i, terms: ["Batman cosplay", "Batman superhero dark suit", "Batman comic fan art"] },
  { match: /superman/i, terms: ["Superman cosplay", "Superman superhero suit", "Superman comic fan art"] },
  { match: /mulher[-\s]?maravilha|wonder woman/i, terms: ["Wonder Woman cosplay", "Wonder Woman superhero armor", "Wonder Woman comic fan art"] },
  { match: /coringa|joker/i, terms: ["Joker cosplay", "Joker comic villain", "Joker fan art"] },
  { match: /elektra/i, terms: ["Elektra cosplay", "Elektra comic red assassin", "Elektra fan art"] },
  { match: /wolverine|logan/i, terms: ["Wolverine cosplay", "Wolverine claws superhero", "Wolverine comic fan art"] },
  { match: /deadpool/i, terms: ["Deadpool cosplay", "Deadpool superhero red suit", "Deadpool comic fan art"] },
  { match: /vingadores|avengers/i, terms: ["Avengers cosplay", "Marvel Avengers superhero team", "Avengers comic fan art"] },
  { match: /x[-\s]?men/i, terms: ["X-Men cosplay", "X Men superhero team", "X Men comic fan art"] },
  { match: /naruto/i, terms: ["Naruto cosplay", "Naruto anime ninja", "Naruto fan art"] },
  { match: /one piece/i, terms: ["One Piece cosplay", "One Piece anime pirate", "One Piece fan art"] },
  { match: /dragon ball|goku/i, terms: ["Dragon Ball cosplay", "Goku anime", "Dragon Ball fan art"] },
  { match: /jujutsu|gojo|sukuna/i, terms: ["Jujutsu Kaisen cosplay", "Gojo cosplay", "Jujutsu Kaisen fan art"] },
  { match: /demon slayer|kimetsu/i, terms: ["Demon Slayer cosplay", "Kimetsu no Yaiba anime", "Demon Slayer fan art"] },
  { match: /attack on titan|shingeki/i, terms: ["Attack on Titan cosplay", "Shingeki no Kyojin anime", "Attack on Titan fan art"] },
  { match: /playstation|ps5/i, terms: ["PlayStation 5 controller", "PS5 gaming setup"] },
  { match: /xbox/i, terms: ["Xbox controller", "Xbox gaming setup"] },
  { match: /nintendo|switch/i, terms: ["Nintendo Switch", "Nintendo gaming setup"] }
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
  "por",
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
    .slice(0, 5)
    .join(" ");
}

function getMappedTerms(title: string) {
  return titleTerms.find((item) => item.match.test(title))?.terms ?? [];
}

function buildQueries(title: string, category = "") {
  const cleanTitle = normalizeTitle(title);
  const keywords = getKeywords(cleanTitle);
  const mappedTerms = getMappedTerms(cleanTitle);
  const categoryTerm = categoryTerms[category] ?? "geek culture";
  const genericCategory = category === "noticias" ? "" : categoryTerm;

  return Array.from(
    new Set(
      [
        ...mappedTerms,
        ...mappedTerms.map((term) => `${term} ${genericCategory}`.trim()),
        keywords ? `${keywords} ${genericCategory}`.trim() : "",
        `${cleanTitle} ${genericCategory}`.trim(),
        categoryTerm
      ]
        .filter(Boolean)
        .map((query) => `${query} high resolution landscape`)
    )
  );
}

function scoreImage(text: string, query: string) {
  const normalizedText = text.toLowerCase();
  const words = query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3);

  return words.reduce((score, word) => score + (normalizedText.includes(word) ? 1 : 0), 0);
}

async function searchOpenverse(query: string): Promise<CoverResult | null> {
  const response = await fetch(
    `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&aspect_ratio=wide,mature=false&page_size=12`,
    {
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
      title?: string;
      url?: string;
      thumbnail?: string;
      creator?: string | null;
      source?: string;
    }>;
  };

  const results = data.results ?? [];
  const ranked = results
    .filter((image) => image.url || image.thumbnail)
    .sort((a, b) => scoreImage(`${b.title ?? ""} ${b.source ?? ""}`, query) - scoreImage(`${a.title ?? ""} ${a.source ?? ""}`, query));
  const image = ranked[0];
  const url = image?.url ?? image?.thumbnail;

  if (!url) {
    return null;
  }

  return {
    url,
    alt: image?.title ?? query,
    credit: image?.creator ? `Openverse - ${image.creator}` : "Openverse"
  };
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

  const photos = data.photos ?? [];
  const photo = photos
    .filter((item) => item.src?.large2x || item.src?.original || item.src?.landscape)
    .sort((a, b) => scoreImage(b.alt ?? "", query) - scoreImage(a.alt ?? "", query))[0];
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

  const results = data.results ?? [];
  const photo = results
    .filter((item) => item.urls?.regular || item.urls?.full)
    .sort((a, b) => scoreImage(`${b.alt_description ?? ""} ${b.description ?? ""}`, query) - scoreImage(`${a.alt_description ?? ""} ${a.description ?? ""}`, query))[0];
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
    const result = (await searchOpenverse(query)) ?? (await searchPexels(query)) ?? (await searchUnsplash(query));

    if (result) {
      return NextResponse.json({
        ...result,
        query
      });
    }
  }

  return NextResponse.json(
    {
      error: "Não encontrei uma capa relacionada. Tente um título mais específico ou cole a URL manualmente."
    },
    { status: 400 }
  );
}
