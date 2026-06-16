import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { PostsProvider } from "@/context/posts-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: {
    default: "Nexus Nerd | Cultura geek premium",
    template: "%s | Nexus Nerd"
  },
  description:
    "Portal geek sobre Marvel, DC Comics, mangás, animes, filmes, séries, games, teorias e notícias nerd.",
  keywords: ["Nexus Nerd", "Marvel", "DC Comics", "animes", "mangás", "games", "filmes", "cultura geek"],
  openGraph: {
    title: "Nexus Nerd",
    description: "Uma experiência premium para fãs de cultura nerd e geek.",
    type: "website",
    locale: "pt_BR"
  },
  manifest: "/manifest.json",
  themeColor: "#8b3dff"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} bg-radial-grid text-white antialiased`}>
        <AuthProvider>
          <PostsProvider>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </PostsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
