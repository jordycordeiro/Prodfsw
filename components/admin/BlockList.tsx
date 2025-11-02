"use client";

import React from "react";
import { useProdocStore } from "@/components/useProdocStore";

type Scope = "exame_fisico" | "observacoes" | "medicacoes";
type Card = { id: string; title: string; content: string };

function getRootNode(items: any[], key: string) {
  // sobe até o topo para descobrir o menu-pai do item ativo
  const getKey = (n: any) => n?.key || n?.path || n?.id;
  const findParent = (arr: any[], k: string): any | null => {
    for (const it of arr) {
      if (Array.isArray(it?.children) && it.children.some((c: any) => getKey(c) === k)) return it;
      if (Array.isArray(it?.children)) {
        const f = findParent(it.children, k);
        if (f) return f;
      }
    }
    return null;
  };

  let cur = key;
  let parent = findParent(items, cur);
  let lastParent: any = null;
  while (parent) {
    lastParent = parent;
    cur = getKey(parent);
    parent = findParent(items, cur);
  }
  return lastParent;
}

export function AdminBlockList({
  scope,
  onPick,
}: {
  scope: Scope;
  onPick: (id: string) => void;
}) {
  const { state }: any = useProdocStore();
  const activeKey = state?.activeKey as string;
  const sidebar = (state?.sidebar?.items ?? []) as any[];

  // Descobre o nó raiz (menu-pai) do item ativo e, a partir dele,
  // pega a "página"/path que contém os cards que o usuário já vê.
  const root = React.useMemo(() => getRootNode(sidebar, activeKey), [sidebar, activeKey]);

  // Heurísticas por escopo para localizar os blocos no estado
  const cards: Card[] = React.useMemo(() => {
    if (!root) return [];

    const keyOf = (n: any) => n?.key || n?.path || n?.id;
    const children = Array.isArray(root.children) ? root.children : [];

    // pega a primeira child que tiver cards no state.paths/pages
    for (const child of children) {
      const k = keyOf(child);
      const page =
        (state?.paths && state.paths[k]) ||
        (state?.pages && state.pages[k]) ||
        null;
      if (page?.cards?.length) return page.cards as Card[];
    }

    // fallback: alguns setups colocam os cards direto na página ativa
    const page =
      (state?.paths && state.paths[activeKey]) ||
      (state?.pages && state.pages[activeKey]) ||
      null;
    return (page?.cards ?? []) as Card[];
  }, [root, state, activeKey]);

  return (
    <div className="rounded-xl border bg-white p-2">
      <div className="text-sm font-semibold text-slate-700 mb-2">Blocos</div>
      <div className="flex flex-col gap-1">
        {cards.length === 0 && (
          <div className="text-sm text-slate-500 px-2 py-3">
            Nenhum bloco encontrado neste menu.
          </div>
        )}
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => onPick(c.id)}
            className="w-full text-left px-2 py-2 rounded-md border hover:bg-slate-50"
            title="Editar este bloco"
          >
            <div className="text-[12px] font-bold tracking-wide text-slate-700 uppercase">
              {c.title || "Sem título"}
            </div>
            {!!c.content && (
              <div className="text-[12px] text-slate-500 line-clamp-2">
                {c.content}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
