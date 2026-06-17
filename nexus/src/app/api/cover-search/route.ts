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
  noticias: "geek pop culture",
  marvel: "marvel superhero comic",
  dc: "dc superhero comic",
  mangas: "manga anime",
  animes: "anime cinematic",
  games: "video game console",
  filmes: "cinema movie",
  teorias: "mystery theory neon"
};

function buildQuery(title: string, category = "") {
  const cleanTitle = title
    .replace(/[#*_`~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const categoryTerm = categoryTerms[category] ?? "geek nerd culture";

  return `${cleanTitle} ${categoryTerm} high resolution landscape`;
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
    return NextResponse.json({ error: "Informe o titulo do post antes de buscar a capa." }, { status: 400 });
  }

  const query = buildQuery(title, body.category);
  const result = (await searchPexels(query)) ?? (await searchUnsplash(query));

  if (!result) {
    return NextResponse.json(
      {
        error: "Configure PEXELS_API_KEY ou UNSPLASH_ACCESS_KEY para buscar capas automaticamente."
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ...result,
    query
  });
}
