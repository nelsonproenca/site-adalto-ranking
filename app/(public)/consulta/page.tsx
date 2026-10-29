"use client";

import { useEffect, useState } from "react";

type DailyEntry = { presenter_name: string; points: number };

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function ConsultaPage() {
  const [liveDate, setLiveDate] = useState(todayIso());
  const [entries, setEntries] = useState<DailyEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset de estado ao trocar de data, antes do fetch assíncrono
    setLoading(true);
    setError(null);

    fetch(`/api/public/entries?live_date=${liveDate}`)
      .then((res) => {
        if (!res.ok) throw new Error("Não foi possível carregar os dados desta data.");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setEntries(data.entries);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [liveDate]);

  const maxPoints = entries?.length ? Math.max(...entries.map((e) => e.points)) : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="label-text">Lado A1</p>
      <h1 className="mt-1 font-display text-3xl tracking-wide text-ink sm:text-4xl">
        CONSULTA DO DIA
      </h1>
      <p className="mt-3 text-sm text-ink/70 sm:text-base">
        Selecione uma data para ver os pontos de cada presenteador naquela live.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <label htmlFor="live_date" className="label-text">
          Data
        </label>
        <input
          id="live_date"
          type="date"
          value={liveDate}
          max={todayIso()}
          onChange={(e) => setLiveDate(e.target.value)}
          className="input-field max-w-[12rem]"
        />
      </div>

      <div className="sleeve-panel mt-6 min-h-[8rem]">
        {loading && (
          <p className="p-4 font-mono text-sm text-ink/60">Carregando…</p>
        )}

        {!loading && error && (
          <p className="p-4 font-mono text-sm text-ember">{error}</p>
        )}

        {!loading && !error && entries && entries.length === 0 && (
          <p className="p-6 text-center font-mono text-sm text-ink/60">
            Sem dados cadastrados para esta data.
          </p>
        )}

        {!loading &&
          !error &&
          entries &&
          entries.length > 0 &&
          entries
            .slice()
            .sort((a, b) => b.points - a.points)
            .map((entry, i) => (
              <div key={`${entry.presenter_name}-${i}`} className="track-row">
                <span className="track-row-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex flex-col gap-1">
                  <span>{entry.presenter_name}</span>
                  <span className="h-1 rounded-full bg-ink/10">
                    <span
                      className="block h-1 rounded-full bg-ember"
                      style={{
                        width: `${maxPoints ? (entry.points / maxPoints) * 100 : 0}%`,
                      }}
                    />
                  </span>
                </span>
                <span className="font-bold text-ink">{entry.points} pts</span>
              </div>
            ))}
      </div>
    </div>
  );
}
