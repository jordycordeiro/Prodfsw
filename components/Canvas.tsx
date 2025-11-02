"use client";

import React from "react";
import { useProdocStore } from "./useProdocStore";

/** === Admin Studio: blocos de Exame/Queixas/Medicações === */
import { AdminBlockList } from "@/components/admin/BlockList";
import { AdminTextEditor } from "@/components/admin/TemplateEditor";

type Card = { id: string; title: string; content: string };
type NodeLike = { [k: string]: any };

const STABLE_KEY = "prodoc-stable-v1";
const STORE_KEY = "prodoc-store-v1";

const SECTION_TITLES = ["USO ORAL", "USO EV", "USO IM", "USO SC", "USO INALATÓRIO", "USO TÓPICO"];
const isSection = (t: string) => SECTION_TITLES.includes((t || "").trim().toUpperCase());
const isNotes = (t: string) => (t || "").trim().toUpperCase() === "NOTAS";
const isMedicationItem = (t: string) => /^\s*\d+\.\s+/m.test(t || "");

const notify = (m: string) => {
  try {
    (window as any)?.toast?.(m);
  } catch {}
  try {
    alert(m);
  } catch {}
};
const persist = (s: any) => {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(s));
  } catch {}
};

function loadStable(): Record<string, { cards: Card[]; updatedAt: string }> {
  try {
    const raw = localStorage.getItem(STABLE_KEY);
    return raw ? (JSON.parse(raw).byPath || {}) : {};
  } catch {
    return {};
  }
}
function saveStable(path: string, cards: Card[]) {
  const byPath = loadStable();
  byPath[path] = { cards: structuredClone(cards), updatedAt: new Date().toISOString() };
  try {
    localStorage.setItem(STABLE_KEY, JSON.stringify({ byPath }));
  } catch {}
}
function revertToStable(path: string): Card[] | null {
  const snap = loadStable()[path];
  return snap ? structuredClone(snap.cards) : null;
}

function normalizeOnlyMeds(cards: Card[]): Card[] {
  const next = [...cards];
  let i = 0;
  while (i < next.length) {
    if (isSection(next[i].title)) {
      next[i] = { ...next[i], title: next[i].title.replace(/^\s*\d+\.\s+/, "").trim().toUpperCase() };
      let count = 0,
        j = i + 1;
      while (j < next.length && !isSection(next[j].title) && !isNotes(next[j].title)) {
        count += 1;
        next[j] = { ...next[j], title: `${count}. ${next[j].title.replace(/^\s*\d+\.\s+/, "")}` };
        j++;
      }
      i = j;
    } else if (isNotes(next[i].title)) {
      next[i] = { ...next[i], title: next[i].title.replace(/^\s*\d+\.\s+/, "").trim().toUpperCase() };
      i += 1;
    } else {
      let count = 0;
      while (i < next.length && !isSection(next[i].title) && !isNotes(next[i].title)) {
        count += 1;
        next[i] = { ...next[i], title: `${count}. ${next[i].title.replace(/^\s*\d+\.\s+/, "")}` };
        i++;
      }
    }
  }
  return next;
}

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/* ---------------- helpers p/ sidebar/menu ---------------- */
const getKeyOf = (it: NodeLike) => it?.key || it?.path || it?.id;

function findNodeInArray(arr: any[], key: string): NodeLike | null {
  for (const it of arr) {
    if (!it || typeof it !== "object") continue;
    if (getKeyOf(it) === key) return it;
    if (Array.isArray(it.children)) {
      const f = findNodeInArray(it.children, key);
      if (f) return f;
    }
  }
  return null;
}
function findParentOfKey(arr: any[], key: string): NodeLike | null {
  for (const it of arr) {
    if (!it || typeof it !== "object") continue;
    if (Array.isArray(it.children) && it.children.some((c: any) => getKeyOf(c) === key)) return it;
    if (Array.isArray(it.children)) {
      const f = findParentOfKey(it.children, key);
      if (f) return f;
    }
  }
  return null;
}
function findAllMenuArrays(state: any): any[][] {
  const out: any[][] = [];
  const seen = new Set<any>();
  const walk = (obj: any) => {
    if (!obj || typeof obj !== "object") return;
    if (seen.has(obj)) return;
    seen.add(obj);
    if (Array.isArray(obj)) {
      if (obj.some((x) => x && typeof x === "object" && (x.key || x.path || x.id || x.children))) out.push(obj);
      for (const x of obj) walk(x);
      return;
    }
    for (const k of Object.keys(obj)) walk(obj[k]);
  };
  walk(state);
  return out;
}
function insertChildUnderParent(
  state: any,
  parentKey: string,
  child: { key: string; path: string; label: string; name: string; title: string }
) {
  const arrays = findAllMenuArrays(state);
  for (const arr of arrays) {
    const parent = findParentOfKey(arr, parentKey) || findNodeInArray(arr, parentKey);
    if (parent) {
      parent.children = Array.isArray(parent.children) ? parent.children : [];
      if (!parent.children.some((n: any) => getKeyOf(n) === child.key)) parent.children.push(child);
    }
  }
  if (state.children && typeof state.children === "object") {
    state.children[parentKey] = Array.isArray(state.children[parentKey]) ? state.children[parentKey] : [];
    if (!state.children[parentKey].includes(child.key)) state.children[parentKey].push(child.key);
  }
}

/** === pega o rótulo do topo (pai raiz) do item ativo e mapeia para escopo Admin === */
function getRootScopeLabel(state: any, activeKey: string): string | null {
  const items: any[] = (state?.sidebar?.items ?? []) as any[];
  if (!Array.isArray(items) || !activeKey) return null;

  // sobe até o topo acumulando pais
  let curKey = activeKey;
  let parent = findParentOfKey(items, curKey);
  let lastParent: NodeLike | null = null;
  while (parent) {
    lastParent = parent;
    curKey = getKeyOf(parent);
    parent = findParentOfKey(items, curKey);
  }
  const root = lastParent || findNodeInArray(items, activeKey);
  const label = (root?.label || root?.name || root?.title || "").toString().trim();

  return label || null;
}

function mapLabelToScope(label: string): "exame_fisico" | "observacoes" | "medicacoes" | null {
  const l = (label || "").toLowerCase();
  if (l.startsWith("exame físico") || l.startsWith("exame fisico")) return "exame_fisico";
  if (l.startsWith("queixas")) return "observacoes";
  if (l.startsWith("medicações") || l.startsWith("medicacoes")) return "medicacoes";
  return null;
}

/* -------------------------------------------------------------------------- */

export default function Canvas() {
  const { state, actions }: any = useProdocStore();
  const activeKey = state?.activeKey as string;

  const current = React.useMemo(
    () => state?.paths?.[activeKey] || state?.pages?.[activeKey] || null,
    [state, activeKey]
  );

  const cards = React.useMemo<Card[]>(() => (current?.cards ?? []) as Card[], [current]);
  const [, force] = React.useReducer((x) => x + 1, 0);

  /** ==== DETECÇÃO: estamos em Exame/Queixas/Medicações? ==== */
  const rootLabel = React.useMemo(() => getRootScopeLabel(state, activeKey) || "", [state, activeKey]);
  const adminScope = React.useMemo(() => mapLabelToScope(rootLabel), [rootLabel]);

  /** ==== Se for um dos 3 menus-pai, renderiza o modo Admin (lista + editor de texto) ==== */
  const [pickedTemplateId, setPickedTemplateId] = React.useState<string | null>(null);
  if (adminScope) {
    return (
      <div className="p-0">
        <div
          className="prodoc-surface relative"
          style={{
            background: "#fff",
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(10,112,199,.15)",
            boxShadow: "0 18px 44px rgba(2,80,200,.10)",
          }}
        >
          {/* Header azul – usa o rótulo do menu pai */}
          <div
            className="prodoc-surface__header h-10 flex items-center"
            style={{
              background: "linear-gradient(180deg, var(--brand,#0a70c7), var(--brand-2,#1e40af))",
              color: "#fff",
              padding: "0 16px", height: "40px", lineHeight: "40px",
              fontWeight: 700,
            }}
          >
            {rootLabel || "Blocos"}
          </div>

          {/* Miolo: lista de blocos (esquerda interna) + editor (direita) */}
          <div className="grid gap-6 p-4 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div>
              <AdminBlockList scope={adminScope} onPick={(id) => setPickedTemplateId(id)} />
            </div>
            <div>
              {pickedTemplateId ? (
                <AdminTextEditor templateId={pickedTemplateId} />
              ) : (
                <div className="text-sm text-slate-500">Selecione um item na barra lateral para começar.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /** ==== Caso contrário, mantém o comportamento original (patologias/cards) ==== */
  if (!current)
    return <div className="p-6 text-sm opacity-70">Selecione um item na barra lateral para começar.</div>;

  const headerTitle = (() => {
    const cands = [current.title, current.name, current.label].filter(Boolean);
    if (cands.length) return String(cands[0]);
    const list: any[] = (state?.sidebar?.items ?? []) as any[];
    if (Array.isArray(list)) {
      const node = findNodeInArray(list, activeKey);
      if (node) return node.label || node.name || node.title || "Prescrição";
    }
    return "Prescrição";
  })();

  const editMode = Boolean(current.editMode ?? state.editMode);

  const copyPrescription = () => {
    const out: string[] = [];
    let sec: string | null = null,
      printed = false;
    const maybePrint = () => {
      if (sec && !printed) {
        if (out.length) out.push("");
        out.push(sec, "");
        printed = true;
      }
    };

    current.cards.forEach((c: Card) => {
      if (isNotes(c.title)) return;
      if (isSection(c.title)) {
        sec = c.title.trim();
        printed = false;
        return;
      }
      maybePrint();
      const t = c.title.trim();
      const b = (c.content || "").trim();
      out.push(t);
      if (b) out.push(b);
      out.push("");
    });

    const text = out.join("\n").replace(/\n+$/, "\n");
    navigator.clipboard.writeText(text).then(() => notify("Prescrição copiada"));
  };

  const toggleEdit = () => {
    const wasEditing = Boolean(current.editMode ?? state.editMode);
    if (actions?.toggleEditMode) actions.toggleEditMode();
    else {
      // Ao sair do modo edição: normalização automática
      if (wasEditing) {
        (current as any).cards = normalizeOnlyMeds((current as any).cards);
      }
      current.editMode = !wasEditing;
      force();
    }
    persist(state);
  };

  const createChildSubmenu = () => {
    const input =
      typeof window !== "undefined" && (window as any).prompt
        ? (window as any).prompt("Título do novo submenu:", "Nova Prescrição")
        : "Nova Prescrição";
    const title = (input || "").trim();
    if (!title) return;

    let parentKey: string | null = null;
    const sidebarItems: any[] = (state?.sidebar?.items ?? []) as any[];
    if (Array.isArray(sidebarItems)) {
      const parentNode = findParentOfKey(sidebarItems, activeKey);
      parentKey = parentNode ? (parentNode.key || parentNode.path || parentNode.id) : null;
    }
    if (!parentKey) {
      const parts = (activeKey || "").split("/").filter(Boolean);
      parentKey = parts.length > 1 ? parts.slice(0, -1).join("/") : activeKey;
    }
    const childKey = `${parentKey}/${slugify(title) || "submenu"}`;

    const defaultCards: Card[] = [
      { id: crypto.randomUUID(), title: "USO ORAL", content: "" },
      { id: crypto.randomUUID(), title: "NOTAS", content: "• Observações adicionais" },
    ];

    state.paths = state.paths ?? state.pages ?? {};
    (state.paths as any)[childKey] = { title, name: title, label: title, cards: defaultCards, editMode: true, parent: parentKey };

    if (actions?.createSubmenu) {
      try {
        actions.createSubmenu({ parentKey, key: childKey, title, cards: defaultCards });
      } catch {}
    }
    if (actions?.addChild) {
      try {
        actions.addChild(parentKey, { key: childKey, path: childKey, label: title, name: title, title });
      } catch {}
    }
    if (actions?.addSubmenu) {
      try {
        actions.addSubmenu(parentKey, { key: childKey, path: childKey, label: title, name: title, title });
      } catch {}
    }

    insertChildUnderParent(state, parentKey!, { key: childKey, path: childKey, label: title, name: title, title });

    state.activeKey = childKey;
    persist(state);
    force();
    notify("Submenu criado");
  };

  const titleInputCls =
    "w-full px-4 py-2 rounded-xl outline-none bg-white text-slate-900 border focus:ring-2 focus:ring-sky-400 focus:border-sky-400";
  const contentInputCls =
    "w-full min-h-[120px] resize-vertical outline-none bg-white text-slate-900 border border-slate-200 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 leading-relaxed text-[15px]";
  const handleBtnCls = "inline-flex items-center justify-center w-10 h-10 rounded-md border border-slate-200 bg-white text-slate-500 hover:text-slate-700";
  const delBtnCls = "inline-flex items-center justify-center w-10 h-10 rounded-md border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100";

  return (
    <div className="p-0">
      {/* ====== CARTÃO BRANCO MAIOR (Toolbar + Conteúdo) ====== */}
      <div
        className="prodoc-surface relative"
        style={{
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid rgba(10,112,199,.15)",
          boxShadow: "0 18px 44px rgba(2,80,200,.10)",
        }}
      >
        {/* Toolbar DENTRO do card branco (Copy + Title pill + Edit icon) */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white">
          {!editMode && (
            <button 
              className="h-10 px-4 rounded-lg font-semibold text-white"
              style={{ background: "linear-gradient(180deg, var(--brand,#0a70c7), var(--brand-2,#1e40af))" }}
              onClick={copyPrescription}
            >
              Copiar prescrição
            </button>
          )}

          {/* Title pill (blue) */}
          <div className="flex-1">
            <div
              className="h-10 flex items-center px-4 rounded-lg font-bold text-white"
              style={{
                background: "linear-gradient(180deg, var(--brand,#0a70c7), var(--brand-2,#1e40af))",
              }}
            >
              {editMode ? (
                <input
                  defaultValue={headerTitle}
                  onBlur={(e) => {
                    const newTitle = e.currentTarget.value.trim() || "Prescrição";
                    ["title", "name", "label"].forEach((k) => ((current as any)[k] = newTitle));
                    const items: any[] = (state?.sidebar?.items ?? []) as any[];
                    if (Array.isArray(items)) {
                      const n = findNodeInArray(items, activeKey);
                      if (n) {
                        n.label = newTitle;
                        n.title = newTitle;
                        n.name = newTitle;
                      }
                    }
                    persist(state);
                    force();
                  }}
                  className="w-full bg-transparent text-white font-bold outline-none placeholder-blue-100 border-b border-white/40 focus:border-white focus:ring-0"
                  placeholder="Título"
                  aria-label="Título da prescrição"
                />
              ) : (
                headerTitle
              )}
            </div>
          </div>

          {/* Edit icon */}
          <button
            className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            onClick={toggleEdit}
            aria-label={editMode ? "Sair do editar" : "Editar"}
            title={editMode ? "Sair do editar" : "Editar"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
            </svg>
          </button>

          {/* Extra buttons only when editing */}
          {editMode && (<>
            <button
              className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50"
              onClick={() => {
                saveStable(activeKey, cards);
                notify("Snapshot estável salvo");
              }}
            >
              Tornar Padrão
            </button>
            <button
              className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50"
              onClick={() => {
                const snap = revertToStable(activeKey);
                if (!snap) return notify("Nenhum estável salvo");
                (current as any).cards = snap;
                force();
                persist(state);
                notify("Revertido para estável");
              }}
            >
              Restaurar
            </button>
          </>)}
        </div>

        {/* Ações internas (somente no editar) */}
        {editMode && (
          <div className="px-4 py-3 border-t bg-slate-50 flex items-center gap-2">
            <button
              onClick={() => {
                // + Medicação abaixo da primeira seção (ou no topo)
                const idx = Math.max(0, (current as any).cards.findIndex((c: Card) => isSection(c.title)));
                let insertAt = idx === -1 ? 0 : idx + 1;
                (current as any).cards.splice(insertAt, 0, {
                  id: crypto.randomUUID(),
                  title: "1. NOME DO ITEM",
                  content: "Posologia / instruções",
                });
                force();
                persist(state);
              }}
              className="btn"
            >
              + Medicação
            </button>
            <button
              onClick={() => {
                (current as any).cards = [...(current as any).cards, { id: crypto.randomUUID(), title: "USO ORAL", content: "" }];
                force();
                persist(state);
              }}
              className="btn"
            >
              + Via de uso
            </button>
            <button
              onClick={() => {
                if (!(current as any).cards.some((c: Card) => isNotes(c.title)))
                  (current as any).cards = [
                    ...(current as any).cards,
                    { id: crypto.randomUUID(), title: "NOTAS", content: "• Observações adicionais" },
                  ];
                force();
                persist(state);
              }}
              className="btn"
            >
              + Nota
            </button>
          </div>
        )}

        {/* Conteúdo */}
        <div className="p-4 space-y-1.5">
          {(current as any).cards?.map((card: Card, idx: number) => {
            const section = isSection(card.title);
            const notes = isNotes(card.title);
            const medItem = isMedicationItem(card.title);
            return (
              <div
                key={card.id}
                className={[
                  section ? "rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900" : "",
                  notes ? "rounded-lg border border-amber-300 bg-amber-50" : "",
                  medItem ? "rounded-lg border border-blue-100 bg-blue-50/30" : "",
                  !section && !notes && !medItem ? "rounded-lg border border-neutral-200 bg-white" : "",
                ]
                  .join(" ")
                  .trim()}
              >
                {editMode && (
                  <div className="flex items-center gap-2 px-2 pt-2">
                    <button className={handleBtnCls} title="Mover (arraste)">
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                        <circle cx="5" cy="5" r="1.5" />
                        <circle cx="10" cy="5" r="1.5" />
                        <circle cx="15" cy="5" r="1.5" />
                        <circle cx="5" cy="10" r="1.5" />
                        <circle cx="10" cy="10" r="1.5" />
                        <circle cx="15" cy="10" r="1.5" />
                      </svg>
                    </button>
                    <button
                      className={delBtnCls}
                      title="Excluir"
                      onClick={() => {
                        (current as any).cards.splice(idx, 1);
                        force();
                        persist(state);
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                )}
                {editMode ? (
                  <div className="px-2">
                    <input
                      defaultValue={card.title.replace(/^\s*\d+\.\s+/, "")}
                      onBlur={(e) => {
                        const raw = e.currentTarget.value;
                        card.title = (section || notes) ? raw.replace(/^\s*\d+\.\s+/, "") : raw;
                        persist(state);
                      }}
                      className={
                        "w-full px-3 py-1.5 rounded-lg outline-none bg-white text-slate-900 border focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-sm " +
                        (section ? "border-blue-200 font-semibold" : notes ? "border-amber-300" : "border-slate-200")
                      }
                      placeholder={section ? "USO ORAL" : notes ? "NOTAS" : "1. NOME DO ITEM"}
                    />
                  </div>
                ) : (
                  <div
                    className={[
                      section ? "px-4 py-1.5 text-blue-900 font-semibold uppercase tracking-wide" : "",
                      medItem ? "px-3 py-1.5 text-blue-900 font-semibold text-sm" : "",
                      notes ? "px-3 py-1.5 text-amber-900 font-semibold uppercase text-sm" : "",
                      !section && !medItem && !notes ? "px-3 py-1.5 text-sm" : "",
                    ].join(" ")}
                  >
                    {card.title}
                  </div>
                )}
                <div className="px-3 pb-2">
                  {editMode ? (
                    <textarea
                      defaultValue={card.content}
                      onBlur={(e) => {
                        card.content = e.currentTarget.value;
                        persist(state);
                      }}
                      className="w-full min-h-[80px] resize-vertical outline-none bg-white text-slate-900 border border-slate-200 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 leading-relaxed text-sm rounded-lg px-2 py-1.5"
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm px-0 py-0.5 leading-snug">{card.content}</pre>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {editMode && (
          <button
            onClick={createChildSubmenu}
            className="absolute bottom-5 right-5 h-12 w-12 rounded-2xl border border-slate-200 bg-white shadow-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 flex items-center justify-center"
            title="Novo submenu"
            aria-label="Novo submenu"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="9" y="9" width="10" height="10" rx="2" />
              <rect x="5" y="5" width="10" height="10" rx="2" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}