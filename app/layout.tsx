import type { Metadata } from "next";
import { Anton, PT_Serif, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const body = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Adalto Arcandes — Cover de Raul Seixas & Rock 70/80/90",
  description:
    "Site oficial de Adalto Arcandes: cover de Raul Seixas e rock das décadas de 70, 80 e 90. Acompanhe a live diária e o ranking acumulado de presenteadores no TikTok.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} bg-paper text-ink font-body antialiased`}
      >
        <div className="flex min-h-dvh flex-col">
          <header className="border-b-4 border-ink">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
              <Link
                href="/"
                className="flex items-center gap-3 font-display text-lg tracking-wide text-ink"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full border-4 border-ink bg-ink text-paper">
                  <span className="h-2.5 w-2.5 rounded-full bg-paper" />
                </span>
                ADALTO ARCANDES
              </Link>
              <nav className="flex gap-4 font-mono text-xs uppercase tracking-wider sm:text-sm">
                <Link href="/consulta" className="hover:text-ember">
                  Consulta do dia
                </Link>
                <Link href="/ranking" className="hover:text-ember">
                  Ranking
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t-4 border-ink">
            <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-xs text-ink/70 sm:px-6">
              <p className="font-mono">
                © {new Date().getFullYear()} Adalto Arcandes — Cover de Raul Seixas &amp; Rock 70/80/90
              </p>
              <Link href="/admin/login" className="font-mono underline underline-offset-2 hover:text-ember">
                Acesso administrativo
              </Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
