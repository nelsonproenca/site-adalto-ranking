import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      {/* Gatefold: disco à esquerda, bio + "faixas" à direita */}
      <div className="sleeve-panel grid overflow-hidden sm:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-6 border-b-4 border-ink bg-ink p-8 text-center sm:border-b-0 sm:border-r-4 sm:p-12">
          <div className="group relative grid h-40 w-40 place-items-center rounded-full border-4 border-gold bg-ink shadow-[0_0_0_6px_#0b0b0d] sm:h-56 sm:w-56">
            <div className="absolute inset-3 animate-[spin_18s_linear_infinite] rounded-full border border-gold/30" />
            <div className="absolute inset-6 animate-[spin_18s_linear_infinite] rounded-full border border-gold/20" />
            <span className="grid h-12 w-12 place-items-center rounded-full bg-paper sm:h-16 sm:w-16">
              <span className="h-3 w-3 rounded-full bg-ink" />
            </span>
          </div>
          <div>
            <h1 className="font-display text-4xl leading-none tracking-wide text-paper sm:text-5xl">
              ADALTO
              <br />
              ARCANDES
            </h1>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-gold">
              Cover de Raul Seixas · Rock 70/80/90
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-8 sm:p-12">
          <div>
            <p className="label-text">Lado A</p>
            <h2 className="mt-1 font-display text-2xl tracking-wide text-ink">
              SOBRE O CANTOR
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <article className="rounded-[4px] border-2 border-ink/20 p-4">
              <p className="text-sm leading-relaxed sm:text-base">
                Adalto Arcandes é cantor cover de <strong>Raul Seixas</strong>, revivendo em cada show a
                irreverência e a energia de um dos maiores nomes do rock brasileiro.
              </p>
            </article>
            <article className="rounded-[4px] border-2 border-ink/20 p-4">
              <p className="text-sm leading-relaxed sm:text-base">
                Além do repertório de Raul, o show percorre clássicos do rock das décadas de{" "}
                <strong>70, 80 e 90</strong> — um set list pensado para quem viveu (ou quer reviver) a
                era de ouro do rock.
              </p>
            </article>
            <article className="rounded-[4px] border-2 border-ink/20 p-4">
              <p className="text-sm leading-relaxed sm:text-base">
                Acompanhe as lives ao vivo no TikTok e confira aqui, todos os dias, o placar oficial de
                quem mais apoiou o show.
              </p>
            </article>
          </div>

          <div className="mt-2">
            <p className="label-text">Lado B — faixas do site</p>
            <div className="sleeve-panel mt-2">
              <Link href="/consulta" className="track-row hover:bg-ink/5">
                <span className="track-row-index">A1</span>
                <span className="font-display tracking-wide">CONSULTA DO DIA</span>
                <span className="text-ink/50">→</span>
              </Link>
              <Link href="/ranking" className="track-row hover:bg-ink/5">
                <span className="track-row-index">A2</span>
                <span className="font-display tracking-wide">RANKING ACUMULADO</span>
                <span className="text-ink/50">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
