import Link from "next/link";
import { categories } from "@/lib/categories";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-nexus-500 font-black">N</span>
            <strong className="text-xl">Nexus Nerd</strong>
          </div>
          <p className="max-w-md text-sm leading-6 text-white/62">
            Portal premium para quem vive cultura geek: notícias, teorias, análises, HQs, mangás, animes, cinema e games.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold uppercase text-white/44">Categorias</h2>
          <div className="grid grid-cols-2 gap-2 text-sm text-white/64">
            {categories.map((category) => (
              <Link key={category.slug} href={`/${category.slug}`} className="hover:text-white">
                {category.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold uppercase text-white/44">Clube Nexus</h2>
          <p className="text-sm leading-6 text-white/62">
            Receba curadoria semanal, listas de leitura e alertas dos maiores lançamentos geek.
          </p>
        </div>
      </div>
    </footer>
  );
}
