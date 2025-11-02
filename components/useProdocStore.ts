'use client'
import { useSyncExternalStore } from 'react'

// ========== Types ==========
export type Card = { id: string; title: string; content: string; note?: boolean }
export type Prescription = { id: string; title: string; cards: Card[] }
export type SubItem = { id: string; title: string; key: string }
export type MenuItem = { id: string; title: string; key: string; children?: SubItem[] }
export type PageKey = string
type ExtraBlock = { id: string; label: string; value: string }
type ExamBlock = { geral: string; ar: string; acv: string; abd: string; mmii: string; extras: ExtraBlock[] }
type ExamState = { gender: 'masculino'|'feminino'; masculino: ExamBlock; feminino: ExamBlock }
export type SimpleModel = { id: string; title: string; content: string; selected?: boolean }
type State = {
  menu: MenuItem[]
  activeKey: PageKey
  pages: Record<PageKey, Prescription>
  appearance: string
  profileName: string
  plan: 'basico'|'pro'|'enterprise'
  exam: ExamState
  observacoes: SimpleModel[]
  medicacoes: SimpleModel[]
}

// ========== Storage helpers ==========
const STORAGE_KEYS = ['prodoc-store-v1','prodoc-store','prodoc-v1']
const MAIN_KEY = STORAGE_KEYS[0]

function loadFromStorage(): any | null {
  if (typeof window === 'undefined') return null
  for (const k of STORAGE_KEYS) {
    const raw = localStorage.getItem(k)
    if (!raw) continue
    try {
      const data = JSON.parse(raw)
      if (k !== MAIN_KEY) {
        localStorage.setItem(MAIN_KEY, JSON.stringify(data))
        localStorage.removeItem(k)
      }
      return data
    } catch {}
  }
  return null
}
function save(next: State){
  try { if (typeof window !== 'undefined') localStorage.setItem(MAIN_KEY, JSON.stringify(next)) } catch {}
}
const cleanExtras = (extras:any[]): ExtraBlock[] =>
  (Array.isArray(extras)? extras:[]).filter(e=> (e?.label?.trim?.() || e?.value?.trim?.()))

// ========== Seed (executado só no cliente) ==========
const defaultBlock = (): ExamBlock => ({
  geral: 'Paciente em bom estado geral, hidratado(a), corado(a).',
  ar: 'AR: murmúrios vesiculares presentes, sem ruídos adventícios.',
  acv: 'ACV: bulhas normofonéticas, ritmo regular, sem sopros.',
  abd: 'ABD: plano, flácido, indolor, RHA presentes.',
  mmii: 'MMII: sem edemas, pulsos presentes, perfusão satisfatória.',
  extras: []
})
const getExamDefault = (): ExamState => ({ gender:'masculino', masculino: defaultBlock(), feminino: defaultBlock() })

function seed(): State{
  // IMPORTANTE: chamado somente no cliente (na primeira inscrição), pois usa randomUUID
  const asma: Prescription = { id: crypto.randomUUID(), title: 'Asma — CID J45', cards: [{ id: crypto.randomUUID(), title: 'USO / MEDICAÇÃO', content: '<strong>Nome do item</strong>\\nPosologia / instruções' }] }
  const dor:  Prescription = { id: crypto.randomUUID(), title: 'Dor Torácica', cards: [{ id: crypto.randomUUID(), title: 'AVALIAÇÃO', content: 'ECG, Troponina seriada, analgesia conforme protocolo.' }] }
  const vs:   Prescription = { id: crypto.randomUUID(), title: 'Violência Sexual', cards: [{ id: crypto.randomUUID(), title: 'PROFILAXIA', content: 'AZT + 3TC + TDF por 28 dias; Ceftriaxona; Azitromicina; Avaliar vacina Hep B.' }] }
  const patAdultoKey = 'pat-adulto', asmaKey='pat-asma', dorKey='pat-dor-toracica', vsKey='pat-violencia-sexual'
  return {
    menu: [
      { id: crypto.randomUUID(), title: 'Exame Físico', key: 'exame-fisico' },
      { id: crypto.randomUUID(), title: 'Observações Gerais', key: 'observacoes-gerais' },
      { id: crypto.randomUUID(), title: 'Medicações na Unidade', key: 'med-unidade' },
      { id: crypto.randomUUID(), title: 'Patologias - Adulto', key: patAdultoKey, children: [
        { id: crypto.randomUUID(), title: 'Asma', key: asmaKey },
        { id: crypto.randomUUID(), title: 'Dor Torácica', key: dorKey },
        { id: crypto.randomUUID(), title: 'Violência Sexual', key: vsKey },
      ]},
      { id: crypto.randomUUID(), title: 'Patologias - Pediatria', key: 'pat-pediatria', children: []},
    ],
    activeKey: asmaKey,
    pages: { [asmaKey]: asma, [dorKey]: dor, [vsKey]: vs },
    appearance: 'padrao',
    profileName: 'Dr(a). Usuário(a)',
    plan: 'pro',
    exam: getExamDefault(),
    observacoes: [
      { id: crypto.randomUUID(), title: 'Síndrome gripal', content: 'Orientado repouso, hidratação, analgésicos/antitérmicos conforme necessidade.' },
      { id: crypto.randomUUID(), title: 'Diarréico agudo', content: 'Hidratação oral, SRO, dieta leve; sinais de alarme explicados.' }
    ],
    medicacoes: [
      { id: crypto.randomUUID(), title: 'Dipirona EV', content: '1 g EV diluído, repetir se necessário, máx 4x/dia.' },
      { id: crypto.randomUUID(), title: 'Ondansetrona EV', content: '4 mg EV lento, repetir conforme necessidade.' }
    ],
  }
}

// ========== Migration & prune ==========
function pruneOrphans(s: State): State {
  const menuKeys = new Set<string>()
  for (const m of s.menu){ 
    menuKeys.add(m.key); (m.children||[]).forEach(c=>menuKeys.add(c.key)) 
  }
  const pages: Record<string, Prescription> = {}
  Object.entries(s.pages).forEach(([k,v])=>{ if (menuKeys.has(k)) pages[k] = v })
  let activeKey = s.activeKey

  // se o activeKey está num menu-pai com filhos, redireciona para o 1º filho
  const parent = s.menu.find(m => m.key === activeKey && m.children?.length)
  if (parent) {
    const firstChild = parent.children!.find(c => pages[c.key]) || parent.children![0]
    if (firstChild) activeKey = firstChild.key
  }

  if (!menuKeys.has(activeKey)) {
    // tenta 1º filho do 1º menu com filhos
    const firstMenuWithChildren = s.menu.find(m => m.children?.length)
    if (firstMenuWithChildren) {
      const fc = firstMenuWithChildren.children![0]
      activeKey = fc?.key ?? s.menu[0]?.key ?? Object.keys(pages)[0] ?? 'exame-fisico'
    } else {
      activeKey = s.menu[0]?.key ?? Object.keys(pages)[0] ?? 'exame-fisico'
    }
  }
  return { ...s, pages, activeKey }
}

function migrateState(s: any): State{
  const base = seed()
  const pickArray = <T,>(val: T[] | undefined, fallback: T[]) => Array.isArray(val) ? val : fallback
  const exam = {
    gender: s?.exam?.gender ?? base.exam.gender,
    masculino: { ...base.exam.masculino, ...(s?.exam?.masculino||{}), extras: cleanExtras(s?.exam?.masculino?.extras) },
    feminino:  { ...base.exam.feminino,  ...(s?.exam?.feminino||{}),  extras: cleanExtras(s?.exam?.feminino?.extras)  },
  } as State['exam']
  const next: State = {
    menu: pickArray(s?.menu, base.menu),
    activeKey: typeof s?.activeKey==='string'? s.activeKey : base.activeKey,
    pages: s?.pages && typeof s.pages==='object'? s.pages : base.pages,
    appearance: s?.appearance ?? base.appearance,
    profileName: s?.profileName ?? base.profileName,
    plan: (s?.plan ?? base.plan) as State['plan'],
    exam,
    observacoes: pickArray(s?.observacoes, base.observacoes),
    medicacoes: pickArray(s?.medicacoes, base.medicacoes),
  }
  return pruneOrphans(next)
}

// ========== External store (singleton) ==========
type Listener = () => void
const listeners = new Set<Listener>()

// SSR snapshot estável: não use seed() aqui (evita ids aleatórios no server)
let state: State = {
  menu: [], activeKey: 'exame-fisico', pages: {},
  appearance: 'padrao', profileName: 'Dr(a). Usuário(a)', plan: 'pro',
  exam: { gender:'masculino',
          masculino:{geral:'',ar:'',acv:'',abd:'',mmii:'',extras:[]},
          feminino: {geral:'',ar:'',acv:'',abd:'',mmii:'',extras:[]} },
  observacoes: [], medicacoes: []
}
let initialized = false

function emit(){ for (const l of Array.from(listeners)) l() }
function setState(updater: (s: State)=> State){
  state = updater(state)
  save(state)
  emit()
}
function getSnapshot(){ return state }
function getServerSnapshot(){ return state }

// Inicializa depois do primeiro subscribe (após hidratação)
function ensureInitAfterSubscribe(){
  if (initialized || typeof window === 'undefined') return
  initialized = true
  const saved = loadFromStorage()
  state = saved ? migrateState(saved) : seed()
  window.addEventListener('storage', (e) => {
    if (e.key === MAIN_KEY && e.newValue){
      try { state = migrateState(JSON.parse(e.newValue)); emit() } catch {}
    }
  })
  emit()
}

function subscribe(l: Listener){
  if (typeof window !== 'undefined') ensureInitAfterSubscribe()
  listeners.add(l)
  return () => listeners.delete(l)
}

// ========== Actions ==========
const actions = {
  // Redireciona menus-pai para o 1º filho automaticamente
  setActive(key: PageKey){
    setState(s=>{
      let target = key
      const parent = s.menu.find(m => m.key === key && m.children && m.children.length)
      if (parent) {
        const firstChild = parent.children!.find(c => s.pages[c.key]) || parent.children![0]
        if (firstChild) target = firstChild.key
      }
      return { ...s, activeKey: target }
    })
  },

  updateActiveTitle(title: string){
    setState(s=>{
      const p = s.pages[s.activeKey]; if(!p) return s
      return { ...s, pages: { ...s.pages, [s.activeKey]: { ...p, title } } }
    })
  },

  addCard(note=false){
    setState(s=>{
      const p = s.pages[s.activeKey]; if(!p) return s
      const c: Card = { id: crypto.randomUUID(), title: note? 'NOTAS':'USO / MEDICAÇÃO', content: note? '• Observações adicionais':'<strong>Nome do item</strong>\\nPosologia / instruções', note }
      return { ...s, pages: { ...s.pages, [s.activeKey]: { ...p, cards: [...p.cards, c] } } }
    })
  },

  deleteCard(cardId: string){
    setState(s=>{
      const p = s.pages[s.activeKey]; if(!p || p.cards.length<=1) return s
      return { ...s, pages: { ...s.pages, [s.activeKey]: { ...p, cards: p.cards.filter(c=> c.id!==cardId) } } }
    })
  },

  createMainMenu(title='Nova patologia'){
    setState(s=>{
      const key = 'user-'+crypto.randomUUID()
      const mi: MenuItem = { id: crypto.randomUUID(), title, key }
      const def: Prescription = { id: crypto.randomUUID(), title, cards:[{ id: crypto.randomUUID(), title:'USO / MEDICAÇÃO', content:'<strong>Nome do item</strong>\\nPosologia / instruções' }] }
      return { ...s, menu:[...s.menu, mi], pages:{ ...s.pages, [key]: def }, activeKey:key }
    })
  },

  renameMenu(key: string, title: string){
    setState(s=>{
      return {
        ...s,
        menu: s.menu.map(m=> m.key===key ? { ...m, title } :
          (m.children ? { ...m, children: m.children.map(c=> c.key===key? { ...c, title }: c ) } : m)
        )
      }
    })
  },

  removeMenu(key: string){
    setState(s=>{
      const keysToDelete = new Set<string>()
      const newMenu: MenuItem[] = []
      for (const m of s.menu){
        if (m.key === key){
          keysToDelete.add(m.key)
          ;(m.children||[]).forEach(c=> keysToDelete.add(c.key))
          continue
        }
        if (m.children?.length){
          newMenu.push({ ...m, children: m.children.filter(c=> c.key !== key) })
        } else newMenu.push(m)
      }
      const newPages = { ...s.pages }; keysToDelete.forEach(k=>{ delete newPages[k] })
      return pruneOrphans({ ...s, menu:newMenu, pages:newPages })
    })
  },

  // Exame
  setExamGender(g: 'masculino'|'feminino'){ setState(s=>({ ...s, exam: { ...s.exam, gender: g } })) },
  updateExamSection(section: keyof ExamBlock, value: string){
    setState(s=>{
      const g = s.exam.gender; const blk = { ...(s.exam as any)[g] } as ExamBlock
      ;(blk as any)[section] = value
      return { ...s, exam: { ...s.exam, [g]: blk } as any }
    })
  },
  addExamExtra(label='Outro'){
    setState(s=>{
      const g = s.exam.gender; const blk = { ...(s.exam as any)[g] } as ExamBlock
      const extra: ExtraBlock = { id: crypto.randomUUID(), label, value: '' }
      return { ...s, exam: { ...s.exam, [g]: { ...blk, extras: [...cleanExtras(blk.extras), extra] } } as any }
    })
  },
  updateExamExtra(id: string, patch: Partial<ExtraBlock>){
    setState(s=>{
      const g = s.exam.gender; const blk = { ...(s.exam as any)[g] } as ExamBlock
      const extras = cleanExtras(blk.extras).map(e=> e.id===id ? { ...e, ...patch } : e)
      return { ...s, exam: { ...s.exam, [g]: { ...blk, extras } } as any }
    })
  },
  removeExamExtra(id: string){
    setState(s=>{
      const g = s.exam.gender; const blk = { ...(s.exam as any)[g] } as ExamBlock
      const extras = cleanExtras(blk.extras).filter(e=> e.id !== id)
      return { ...s, exam: { ...s.exam, [g]: { ...blk, extras } } as any }
    })
  },

  // Observações/Medicações
  addModel(kind:'observacoes'|'medicacoes'){
    setState(s=>{
      const arr = [...(s as any)[kind]] as SimpleModel[]
      arr.push({ id: crypto.randomUUID(), title: 'Novo modelo', content: '' })
      return { ...s, [kind]: arr } as any
    })
  },
  updateModel(kind:'observacoes'|'medicacoes', id:string, patch: Partial<SimpleModel>){
    setState(s=>{
      const arr = (s as any)[kind] as SimpleModel[]
      return { ...s, [kind]: arr.map(m=> m.id===id? { ...m, ...patch }: m) } as any
    })
  },
  deleteModel(kind:'observacoes'|'medicacoes', id:string){
    setState(s=>{
      const arr = (s as any)[kind] as SimpleModel[]
      return { ...s, [kind]: arr.filter(m=> m.id!==id) } as any
    })
  },
  toggleSelect(kind:'observacoes'|'medicacoes', id:string, v?:boolean){
    setState(s=>{
      const arr = (s as any)[kind] as SimpleModel[]
      return { ...s, [kind]: arr.map(m=> m.id===id? { ...m, selected: (v ?? !m.selected) }: m) } as any
    })
  },

  replacePageByKey(key: string, p: Prescription){ setState(s=>({ ...s, pages: { ...s.pages, [key]: p } })) },
  // ===== Added actions (analysis-approved) =====
  setAppearance(theme: 'padrao'|'escuro'|'altoContraste'|'clean'|'quadroAzul'){
    if (!(['padrao','escuro','altoContraste','clean','quadroAzul'] as any).includes(theme)) return
    setState(s=>({ ...s, appearance: theme }))
  },
  setProfileName(name: string){
    const v = String(name||'').replace(/\n/g,' ').trim().slice(0,80)
    setState(s=>({ ...s, profileName: v }))
  },
  setPlan(plan: 'basico'|'pro'|'enterprise'){
    if (!(['basico','pro','enterprise'] as any).includes(plan)) return
    setState(s=>({ ...s, plan }))
  },
  replaceModels(models: SimpleModel[], kind: 'observacoes'|'medicacoes' = 'observacoes'){
    if (!Array.isArray(models)) return
    const clean = (models as any[]).map((m:any)=>({
      id: String(m?.id || crypto.randomUUID()),
      title: String(m?.title || '').trim(),
      content: String(m?.content || '').toString(),
      selected: false,
    }))
    setState(s => ({ ...s, [kind]: clean } as any))
  },
  duplicateToSubmenu(){
    setState(s=>{
      const key = s.activeKey
      const p = s.pages[key]
      if (!p) return s
      const parentIdx = s.menu.findIndex(m => (m.children||[]).some(c=>c.key===key))
      if (parentIdx < 0) return s
      const newKey = crypto.randomUUID()
      const newTitle = `${p.title} (cópia)`
      const newPage: Prescription = {
        id: crypto.randomUUID(),
        title: newTitle,
        cards: (p.cards||[]).map(c=>({ id: crypto.randomUUID(), title: c.title, content: c.content, note: c.note })),
      }
      const menu = s.menu.slice()
      const parent = { ...menu[parentIdx] }
      const children = (parent.children||[]).slice()
      const idx = children.findIndex(c=>c.key===key)
      const insertAt = idx>=0 ? idx+1 : children.length
      children.splice(insertAt, 0, { id: crypto.randomUUID(), title: newTitle, key: newKey })
      parent.children = children
      menu[parentIdx] = parent
      const pages = { ...s.pages, [newKey]: newPage }
      return { ...s, menu, pages, activeKey: newKey }
    })
  },
}

// ========== Hook (shared store) ==========
export function useProdocStore(){
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return { state: snap, ...actions }
}
