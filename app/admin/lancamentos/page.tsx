"use client";

import { useEffect, useState } from "react";

type Entry = { id: string; presenter_name: string; points: number };

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function LancamentosPage() {
  const [liveDate, setLiveDate] = useState(todayIso());
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  const [presenterName, setPresenterName] = useState("");
  const [points, setPoints] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPresenterName, setEditPresenterName] = useState("");
  const [editPoints, setEditPoints] = useState("");

  async function loadEntries(date: string) {
    setLoading(true);
    setListError(null);
    try {
      const res = await fetch(`/api/entries?live_date=${date}`);
      if (!res.ok) throw new Error((await res.json()).error ?? "Erro ao carregar");
      const data = await res.json();
      setEntries(data.entries);
    } catch (err: any) {
      setListError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loadEntries reseta loading/erro antes do fetch assíncrono
    loadEntries(liveDate);
  }, [liveDate]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const pointsNumber = Number(points);
    if (!presenterName.trim()) {
      setFormError("Informe o nome do presenteador.");
      return;
    }
    if (points === "" || Number.isNaN(pointsNumber) || pointsNumber < 0) {
      setFormError("Informe um valor de pontos não negativo.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ live_date: liveDate, presenter_name: presenterName, points: pointsNumber }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Erro ao salvar");
      setPresenterName("");
      setPoints("");
      await loadEntries(liveDate);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(entry: Entry) {
    setEditingId(entry.id);
    setEditPresenterName(entry.presenter_name);
    setEditPoints(String(entry.points));
  }

  async function saveEdit(id: string) {
    const pointsNumber = Number(editPoints);
    if (!editPresenterName.trim() || Number.isNaN(pointsNumber) || pointsNumber < 0) return;

    await fetch(`/api/entries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ presenter_name: editPresenterName, points: pointsNumber }),
    });
    setEditingId(null);
    await loadEntries(liveDate);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/entries/${id}`, { method: "DELETE" });
    await loadEntries(liveDate);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="label-text">Área do admin</p>
      <h1 className="mt-1 font-display text-3xl tracking-wide text-ink sm:text-4xl">
        LANÇAMENTOS DA LIVE
      </h1>

      <div className="mt-6 flex items-center gap-3">
        <label htmlFor="live_date" className="label-text">
          Data da live
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

      <form onSubmit={handleCreate} className="sleeve-panel mt-6 flex flex-col gap-4 p-6">
        <p className="label-text">Novo lançamento</p>
        <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
          <div>
            <label htmlFor="presenter_name" className="label-text">
              Nome do presenteador
            </label>
            <input
              id="presenter_name"
              value={presenterName}
              onChange={(e) => setPresenterName(e.target.value)}
              className="input-field mt-1"
              placeholder="Ex.: João Silva"
            />
          </div>
          <div>
            <label htmlFor="points" className="label-text">
              Pontos
            </label>
            <input
              id="points"
              type="number"
              min={0}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="input-field mt-1"
            />
          </div>
        </div>

        {formError && <p className="font-mono text-sm text-ember">{formError}</p>}

        <button type="submit" disabled={saving} className="btn-admin self-start disabled:opacity-50">
          {saving ? "Salvando…" : "Salvar lançamento"}
        </button>
      </form>

      <div className="sleeve-panel mt-6 min-h-[6rem]">
        <p className="label-text px-4 pt-4">Lançamentos de {liveDate}</p>

        {loading && <p className="p-4 font-mono text-sm text-ink/60">Carregando…</p>}
        {listError && <p className="p-4 font-mono text-sm text-ember">{listError}</p>}
        {!loading && !listError && entries.length === 0 && (
          <p className="p-6 text-center font-mono text-sm text-ink/60">
            Nenhum lançamento cadastrado para esta data ainda.
          </p>
        )}

        {!loading &&
          entries.map((entry) =>
            editingId === entry.id ? (
              <div key={entry.id} className="track-row grid-cols-[1fr_6rem_auto_auto]">
                <input
                  value={editPresenterName}
                  onChange={(e) => setEditPresenterName(e.target.value)}
                  className="input-field"
                />
                <input
                  type="number"
                  min={0}
                  value={editPoints}
                  onChange={(e) => setEditPoints(e.target.value)}
                  className="input-field"
                />
                <button onClick={() => saveEdit(entry.id)} className="btn-admin">
                  Salvar
                </button>
                <button onClick={() => setEditingId(null)} className="btn-admin-ghost">
                  Cancelar
                </button>
              </div>
            ) : (
              <div key={entry.id} className="track-row grid-cols-[1fr_auto_auto_auto]">
                <span>{entry.presenter_name}</span>
                <span className="font-bold">{entry.points} pts</span>
                <button onClick={() => startEdit(entry)} className="btn-admin-ghost">
                  Editar
                </button>
                <button onClick={() => handleDelete(entry.id)} className="btn-admin-ghost">
                  Excluir
                </button>
              </div>
            )
          )}
      </div>
    </div>
  );
}
