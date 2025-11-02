
// scripts/apply-toolbar-normalization-v2.mjs
import fs from 'node:fs'
import path from 'node:path'

const files = [
  'components/ExameFisico.tsx',
  'components/Observacoes.tsx',
  'components/Medicacoes.tsx',
  'components/Canvas.tsx',
]

const enc = 'utf8'

function read(p){ return fs.readFileSync(p, enc) }
function write(p, s){ fs.writeFileSync(p, s, enc) }
function backup(p){ fs.copyFileSync(p, p + '.bak') }

// remove tags and normalize accents/case
function normalize(txt){
  const noTags = txt.replace(/<[^>]+>/g, ' ')
  return noTags
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

// capture all <button|Button>...</button|Button> blocks
function captureAllButtons(source){
  const re = /<(button|Button)\b[\s\S]*?>[\s\S]*?<\/\1>/g
  const out = []
  let m
  while ((m = re.exec(source))){
    out.push({ text: m[0], index: m.index })
  }
  return out
}

function findButtonByLabel(source, wanted){
  const normWanted = normalize(wanted)
  const buttons = captureAllButtons(source)
  for (const b of buttons){
    const innerNorm = normalize(b.text)
    if (innerNorm.includes(normWanted)){
      return b
    }
  }
  return null
}

function ensureOrder(source, firstLabel, secondLabel){
  const first = findButtonByLabel(source, firstLabel)
  const second = findButtonByLabel(source, secondLabel)
  if (!first || !second) {
    return { source, changed:false, reason:`missing '${first ? '' : firstLabel}' '${second ? '' : secondLabel}'` }
  }
  if (first.index < second.index) {
    return { source, changed:false, reason:'already ok' }
  }
  // move 'first' block before 'second'
  const beforeSecond = source.slice(0, second.index)
  const between = source.slice(second.index, first.index)
  const afterFirst = source.slice(first.index + first.text.length)

  // remove the 'first' text from 'between' if present
  const betweenClean = between.replace(first.text, '')
  const newSource = beforeSecond + first.text + betweenClean + afterFirst
  return { source: newSource, changed:true }
}

function removeButton(source, label){
  const b = findButtonByLabel(source, label)
  if (!b) return { source, changed:false }
  const newSource = source.slice(0, b.index) + source.slice(b.index + b.text.length)
  return { source: newSource, changed:true }
}

function run(){
  let touched = 0
  for (const f of files){
    const p = path.resolve(process.cwd(), f)
    if (!fs.existsSync(p)){ console.log(`⚠️  ${f} não encontrado, pulando.`); continue }
    const original = read(p)
    let s = original
    let ch = false

    if (f.endsWith('ExameFisico.tsx')){
      const r = ensureOrder(s, 'Copiar exame inteiro', 'Editar todos os blocos'); s = r.source; ch ||= r.changed
    }
    if (f.endsWith('Observacoes.tsx')){
      const r = ensureOrder(s, 'Copiar selecionados', 'Adicionar'); s = r.source; ch ||= r.changed
    }
    if (f.endsWith('Medicacoes.tsx')){
      const r = ensureOrder(s, 'Copiar selecionados', 'Adicionar'); s = r.source; ch ||= r.changed
    }
    if (f.endsWith('Canvas.tsx')){
      const r = ensureOrder(s, 'Copiar prescricao', 'Editar prescricao'); s = r.source; ch ||= r.changed
      // também tenta com acentos explícitos
      const r2 = ensureOrder(s, 'Copiar prescrição', 'Editar prescrição'); s = r2.source; ch ||= r2.changed
      const r3 = removeButton(s, 'Imprimir'); s = r3.source; ch ||= r3.changed
    }

    if (ch && s !== original){
      backup(p)
      write(p, s)
      console.log(`✅ ${f} atualizado. Backup em ${f}.bak`)
      touched++
    } else {
      console.log(`ℹ️  ${f} sem mudanças (ou não encontrou os rótulos).`)
    }
  }
  console.log(`\nConcluído. Arquivos tocados: ${touched}`)
}

run()
