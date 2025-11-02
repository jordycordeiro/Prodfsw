"use client";

import React from "react";
import { useProdocStore } from "@/components/useProdocStore";

type Card = { id: string; title: string; content: string };

export function AdminTextEditor({ templateId }: { templateId: string }) {
  const { state }: any = useProdocStore();
  const [value, setValue] = React.useState("");
  const [title, setTitle] = React.useState("");

  // encontra a página que contém o card
  const pageEntry = React.useMemo(() => {
    const dicts = [state?.paths ?? {}, state?.pages ?? {}] as any[];
    for (const dict of dicts) {
      for (const k of Object.keys(dict)) {
        const page = dict[k];
        if (Array.isArray(page?.cards) && page.cards.some((c: Card) => c.id === templateId)) {
          return { key: k, page };
        }
      }
    }
    return null;
  }, [state, templateId]);

  const cardIndex = React.useMemo(() => {
    if (!pageEntry) return -1;
    return (pageEntry.page.cards as Card[]).findIndex((c) => c.id === templateId);
  }, [pageEntry, templateId]);

  React.useEffect(() => {
    if (!pageEntry || cardIndex < 0) return;
    const c = pageEntry.page.cards[cardIndex] as Card;
    setTitle(c.title || "");
    setValue(c.content || "");
  }, [pageEntry, cardIndex]);

  function persist() {
    try {
      localStorage.setItem("prodoc-store-v1", JSON.stringify(state));
    } catch {}
  }

  const save = () => {
    if (!pageEntry || cardIndex < 0) return;
    const c = pageEntry.page.cards[cardIndex] as Card;
    c.title = title;
    c.content = value;
    persist();
    try { (window as any)?.toast?.("Bloco salvo"); } catch {}
  };

  return (
    <div className="rounded-xl border bg-white p-3">
      <div className="mb-2 text-sm text-slate-600">Conteúdo do bloco (texto)</div>

      <input
        className="w-full mb-3 rounded-md border px-3 py-2 text-[14px]"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título do bloco"
      />

      <textarea
        className="w-full h-[56vh] resize-none rounded-md border px-3 py-2 text-[14px] leading-relaxed"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Digite o texto do bloco aqui…"
      />

      <div className="mt-3 flex gap-2">
        <button className="btn" onClick={save}>Salvar</button>
      </div>
    </div>
  );
}
