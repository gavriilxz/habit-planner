import { supabase } from './supabase.js'
import './style.css'

// ── Estado global ─────────────────────────────────────────────
const USER_ID = (() => {
  let id = localStorage.getItem('habit_user_id')
  if (!id) { id = crypto.randomUUID(); localStorage.setItem('habit_user_id', id) }
  return id
})()

const MONTHS = [
  { name: 'Janeiro', days: 31 }, { name: 'Fevereiro', days: 28 },
  { name: 'Março', days: 31 }, { name: 'Abril', days: 30 },
  { name: 'Maio', days: 31 }, { name: 'Junho', days: 30 },
  { name: 'Julho', days: 31 }, { name: 'Agosto', days: 31 },
  { name: 'Setembro', days: 30 }, { name: 'Outubro', days: 31 },
  { name: 'Novembro', days: 30 }, { name: 'Dezembro', days: 31 },
]

// Dia de hoje
const today = new Date()
const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

let habits = []
let checkins = {} // { "habit_id|date": value }
let currentView = 'today' // 'today' | 'month' | 'settings'
let currentMonth = today.getMonth()
let loading = true

// ── Helpers ───────────────────────────────────────────────────
function dateStr(year, month, day) {
  return `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
}

function checkinKey(habitId, date) { return `${habitId}|${date}` }

function getCheckin(habitId, date) {
  return checkins[checkinKey(habitId, date)] ?? 0
}

// ── Supabase ──────────────────────────────────────────────────
async function loadHabits() {
  const { data } = await supabase.from('habits')
    .select('*').eq('user_id', USER_ID).order('position')
  habits = data || []
}

async function loadCheckins() {
  const { data } = await supabase.from('checkins')
    .select('*').eq('user_id', USER_ID)
  checkins = {}
  ;(data || []).forEach(c => {
    checkins[checkinKey(c.habit_id, c.date)] = c.value
  })
}

async function saveCheckin(habitId, date, value) {
  checkins[checkinKey(habitId, date)] = value
  await supabase.from('checkins').upsert({
    user_id: USER_ID, habit_id: habitId, date, value
  }, { onConflict: 'habit_id,date' })
}

async function addHabit(name, isWater = false) {
  const pos = habits.length
  const { data } = await supabase.from('habits').insert({
    user_id: USER_ID, name, is_water: isWater, position: pos
  }).select().single()
  if (data) habits.push(data)
}

async function deleteHabit(id) {
  habits = habits.filter(h => h.id !== id)
  await supabase.from('habits').delete().eq('id', id)
}

// ── Render ────────────────────────────────────────────────────
function render() {
  const app = document.getElementById('app')
  if (loading) {
    app.innerHTML = `<div class="splash"><div class="splash-logo">✦</div><p>Carregando...</p></div>`
    return
  }

  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <div class="topbar-left">
          <span class="logo">✦</span>
          <span class="app-title">Hábitos</span>
        </div>
        <div class="topbar-date">${formatDate(today)}</div>
      </header>

      <main class="content">
        ${currentView === 'today' ? renderToday() : ''}
        ${currentView === 'month' ? renderMonth() : ''}
        ${currentView === 'settings' ? renderSettings() : ''}
      </main>

      <nav class="bottomnav">
        <button class="nav-btn ${currentView==='today'?'active':''}" data-view="today">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          <span>Hoje</span>
        </button>
        <button class="nav-btn ${currentView==='month'?'active':''}" data-view="month">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          <span>Mês</span>
        </button>
        <button class="nav-btn ${currentView==='settings'?'active':''}" data-view="settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
          <span>Hábitos</span>
        </button>
      </nav>
    </div>
  `
  attachEvents()
}

function formatDate(d) {
  const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`
}

// ── VIEW: HOJE ────────────────────────────────────────────────
function renderToday() {
  if (habits.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-icon">🌱</div>
        <p>Nenhum hábito ainda.</p>
        <p class="empty-sub">Vá em <strong>Hábitos</strong> para adicionar.</p>
      </div>
    `
  }

  const total = habits.length
  const done = habits.filter(h => {
    const v = getCheckin(h.id, todayStr)
    return h.is_water ? v >= 6 : v >= 1
  }).length
  const pct = total > 0 ? Math.round((done/total)*100) : 0

  return `
    <div class="today-wrap">
      <div class="progress-card">
        <div class="progress-header">
          <span class="progress-label">Progresso de hoje</span>
          <span class="progress-pct">${pct}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="progress-sub">${done} de ${total} hábitos completos</div>
      </div>

      <div class="habits-list">
        ${habits.map(h => renderHabitRow(h, todayStr)).join('')}
      </div>
    </div>
  `
}

function renderHabitRow(habit, date) {
  const val = getCheckin(habit.id, date)
  const done = habit.is_water ? val >= 6 : val >= 1

  if (habit.is_water) {
    const pct = Math.min((val / 6) * 100, 100)
    return `
      <div class="habit-row ${done ? 'done' : ''}">
        <div class="habit-info">
          <span class="habit-icon">💧</span>
          <div class="habit-text">
            <span class="habit-name">${habit.name}</span>
            <span class="habit-sub">${val}/6 garrafas · ${val * 500}ml</span>
          </div>
        </div>
        <div class="water-controls">
          <button class="water-btn minus" data-id="${habit.id}" data-date="${date}" data-delta="-1" ${val<=0?'disabled':''}>−</button>
          <div class="water-display">
            <div class="water-bar" style="width:${pct}%"></div>
            <span class="water-num">${val}</span>
          </div>
          <button class="water-btn plus" data-id="${habit.id}" data-date="${date}" data-delta="1" ${val>=6?'disabled':''}>+</button>
        </div>
      </div>
    `
  }

  return `
    <div class="habit-row ${done ? 'done' : ''}" data-tap-id="${habit.id}" data-tap-date="${date}">
      <div class="habit-info">
        <span class="habit-icon">${habitIcon(habit.name)}</span>
        <span class="habit-name">${habit.name}</span>
      </div>
      <div class="check-box ${done ? 'checked' : ''}">
        ${done ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
      </div>
    </div>
  `
}

function habitIcon(name) {
  const n = name.toLowerCase()
  if (n.includes('bíblia') || n.includes('biblia')) return '📖'
  if (n.includes('livro')) return '📚'
  if (n.includes('inglês') || n.includes('ingles')) return '🎬'
  if (n.includes('flex') || n.includes('treino') || n.includes('exerc')) return '💪'
  if (n.includes('vídeo') || n.includes('video') || n.includes('cristão')) return '🎥'
  if (n.includes('água') || n.includes('agua')) return '💧'
  return '✦'
}

// ── VIEW: MÊS ─────────────────────────────────────────────────
function renderMonth() {
  const month = MONTHS[currentMonth]
  const year = 2026

  return `
    <div class="month-wrap">
      <div class="month-nav">
        <button class="month-arrow" id="prev-month">‹</button>
        <span class="month-title">${month.name} ${year}</span>
        <button class="month-arrow" id="next-month">›</button>
      </div>

      <div class="month-grid-wrap">
        <table class="month-table">
          <thead>
            <tr>
              <th class="habit-col">Hábito</th>
              ${Array.from({length: month.days}, (_,i) => `<th class="day-col">${i+1}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${habits.map(h => `
              <tr>
                <td class="habit-name-cell">
                  <span>${habitIcon(h.name)}</span>
                  <span>${h.name}</span>
                </td>
                ${Array.from({length: month.days}, (_,i) => {
                  const d = dateStr(year, currentMonth, i+1)
                  const val = getCheckin(h.id, d)
                  const done = h.is_water ? val >= 6 : val >= 1
                  const isToday = d === todayStr
                  if (h.is_water) {
                    const color = val === 0 ? '' : val >= 6 ? 'cell-green' : 'cell-yellow'
                    return `<td class="day-cell ${color} ${isToday?'today-cell':''}">${val > 0 ? val : ''}</td>`
                  }
                  return `<td class="day-cell ${done?'cell-green':''} ${isToday?'today-cell':''}">
                    ${done ? '✓' : ''}
                  </td>`
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `
}

// ── VIEW: CONFIGURAÇÕES ───────────────────────────────────────
function renderSettings() {
  return `
    <div class="settings-wrap">
      <h2 class="settings-title">Meus Hábitos</h2>
      <p class="settings-sub">Adicione, edite ou remova seus hábitos.</p>

      <div class="habits-settings-list">
        ${habits.map(h => `
          <div class="habit-setting-row">
            <span class="hs-icon">${habitIcon(h.name)}</span>
            <span class="hs-name">${h.name}${h.is_water ? ' 💧' : ''}</span>
            <button class="hs-delete" data-delete-id="${h.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
            </button>
          </div>
        `).join('')}
      </div>

      <div class="add-habit-form">
        <input type="text" id="new-habit-input" placeholder="Nome do novo hábito..." maxlength="50" />
        <label class="water-toggle">
          <input type="checkbox" id="is-water-check" />
          <span>É contador de água (0–6)?</span>
        </label>
        <button class="add-btn" id="add-habit-btn">+ Adicionar hábito</button>
      </div>
    </div>
  `
}

// ── Eventos ───────────────────────────────────────────────────
function attachEvents() {
  // Nav
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentView = btn.dataset.view
      render()
    })
  })

  // Toggle hábito (check)
  document.querySelectorAll('[data-tap-id]').forEach(el => {
    el.addEventListener('click', async () => {
      const id = el.dataset.tapId
      const date = el.dataset.tapDate
      const cur = getCheckin(id, date)
      const newVal = cur >= 1 ? 0 : 1
      await saveCheckin(id, date, newVal)
      render()
    })
  })

  // Água
  document.querySelectorAll('.water-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation()
      const id = btn.dataset.id
      const date = btn.dataset.date
      const delta = parseInt(btn.dataset.delta)
      const cur = getCheckin(id, date)
      const newVal = Math.max(0, Math.min(6, cur + delta))
      await saveCheckin(id, date, newVal)
      render()
    })
  })

  // Mês nav
  document.getElementById('prev-month')?.addEventListener('click', () => {
    currentMonth = Math.max(0, currentMonth - 1)
    render()
  })
  document.getElementById('next-month')?.addEventListener('click', () => {
    currentMonth = Math.min(11, currentMonth + 1)
    render()
  })

  // Deletar hábito
  document.querySelectorAll('[data-delete-id]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Remover este hábito? Todo o histórico será perdido.')) return
      await deleteHabit(btn.dataset.deleteId)
      render()
    })
  })

  // Adicionar hábito
  document.getElementById('add-habit-btn')?.addEventListener('click', async () => {
    const input = document.getElementById('new-habit-input')
    const isWater = document.getElementById('is-water-check').checked
    const name = input.value.trim()
    if (!name) return
    input.value = ''
    await addHabit(name, isWater)
    render()
  })

  document.getElementById('new-habit-input')?.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') document.getElementById('add-habit-btn').click()
  })
}

// ── Init ──────────────────────────────────────────────────────
async function init() {
  render()
  await Promise.all([loadHabits(), loadCheckins()])
  loading = false
  render()

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  }
}

init()
