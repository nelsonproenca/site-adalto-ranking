"use client";

import { useEffect, useRef, useState } from "react";

type RankingEntry = { position: number; presenter_name: string; total_points: number };

function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(0);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    const start = performance.now();
    const from = 0;

    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1);
      setValue(Math.round(from + (target - from) * progress));
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    }

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, durationMs]);

  return value;
}

function RankingRow({ entry, maxPoints }: { entry: RankingEntry; maxPoints: number }) {
  const animated = useCountUp(entry.total_points);

  return (
    <div className="track-row">
      <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-gold font-bold text-ink">
        {entry.position}
      </span>
      <span className="flex flex-col gap-1">
        <span>{entry.presenter_name}</span>
        <span className="h-1 rounded-full bg-ink/10">
          <span
            className="block h-1 rounded-full bg-gold"
            style={{ width: `${maxPoints ? (entry.total_points / maxPoints) * 100 : 0}%` }}
          />
        </span>
      </span>
      <span className="font-bold text-ink">{animated} pts</span>
    </div>
  );
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<RankingEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/public/ranking")
      .then((res) => {
        if (!res.ok) throw new Error("Não foi possível carregar o ranking.");
        return res.json();
      })
      .then((data) => setRanking(data.ranking))
      .catch((err) => setError(err.message));
  }, []);

  const maxPoints = ranking?.length ? Math.max(...ranking.map((r) => r.total_points)) : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="label-text">Lado A2</p>
      <h1 className="mt-1 font-display text-3xl tracking-wide text-ink sm:text-4xl">
        RANKING ACUMULADO
      </h1>
      <p className="mt-3 text-sm text-ink/70 sm:text-base">
        Soma de pontos de todas as lives já cadastradas, do maior para o menor.
      </p>

      <div className="sleeve-panel mt-6 min-h-[8rem]">
        {!ranking && !error && (
          <p className="p-4 font-mono text-sm text-ink/60">Carregando…</p>
        )}

        {error && <p className="p-4 font-mono text-sm text-ember">{error}</p>}

        {ranking && ranking.length === 0 && (
          <p className="p-6 text-center font-mono text-sm text-ink/60">
            Ainda não há registros suficientes para montar o ranking.
          </p>
        )}

        {ranking &&
          ranking.map((entry) => (
            <RankingRow key={entry.presenter_name} entry={entry} maxPoints={maxPoints} />
          ))}
      </div>
    </div>
  );
}
