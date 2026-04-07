import { supabase } from './supabase.js'
import './style.css'

// ── Estado global ─────────────────────────────────────────────
let currentUser = null
let habits = []
let checkins = {}
let currentView = 'today'
let currentMonth = new Date().getMonth()
let loading = true

const today = new Date()
const todayStr = fmtDate(today)

function fmtDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const MONTHS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
]
const MONTH_DAYS = [31,28,29,31,30,31,30,31,31,30,31,30,31]

// ── Auth ──────────────────────────────────────────────────────
async function init() {
  render()
  const { data: { session } } = await supabase.auth.getSession()
  currentUser = session?.user ?? null

  supabase.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user ?? null
    if (currentUser) loadAll()
    else { habits = []; checkins = {}; loading = false; render() }
  })

  if (currentUser) await loadAll()
  else { loading = false; render() }

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(()=>{})
}

async function sendMagicLink(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin }
  })
  return error
}

async function signOut() {
  await supabase.auth.signOut()
  habits = []; checkins = {}
  currentView = 'today'
  render()
}

// ── Data ──────────────────────────────────────────────────────
async function loadAll() {
  loading = true; render()
  await Promise.all([loadHabits(), loadCheckins()])
  loading = false; render()
}

async function loadHabits() {
  const { data } = await supabase.from('habits')
    .select('*').eq('user_id', currentUser.id).order('position')
  habits = data || []
}

async function loadCheckins() {
  const { data } = await supabase.from('checkins')
    .select('*').eq('user_id', currentUser.id)
  checkins = {}
  ;(data||[]).forEach(c => { checkins[`${c.habit_id}|${c.date}`] = c.value })
}

function getCheckin(hid, date) { return checkins[`${hid}|${date}`] ?? 0 }

async function saveCheckin(hid, date, value) {
  checkins[`${hid}|${date}`] = value
  await supabase.from('checkins').upsert(
    { user_id: currentUser.id, habit_id: hid, date, value },
    { onConflict: 'habit_id,date' }
  )
}

async function addHabit(name, isWater) {
  const { data } = await supabase.from('habits').insert({
    user_id: currentUser.id, name, is_water: isWater, position: habits.length
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

  if (!currentUser) {
    app.innerHTML = renderLogin()
    attachLoginEvents()
    return
  }

  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <div class="topbar-left">
          <span class="logo">✦</span>
          <span class="app-title">Hábitos</span>
        </div>
        <div class="topbar-right">
          <span class="topbar-date">${fmtDateLabel(today)}</span>
          <button class="signout-btn" id="signout">Sair</button>
        </div>
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

function fmtDateLabel(d) {
  const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`
}

// ── Login ─────────────────────────────────────────────────────
function renderLogin() {
  return `
    <div class="login-wrap">
      <div class="login-card">
        <div class="login-logo">✦</div>
        <h1 class="login-title">Planner de Hábitos</h1>
        <p class="login-sub">Digite seu e-mail para entrar. Vamos te mandar um link mágico — sem senha!</p>
        <div class="login-form" id="login-form">
          <input type="email" id="login-email" placeholder="seu@email.com" />
          <button class="login-btn" id="login-submit">Entrar</button>
        </div>
        <div id="login-msg" class="login-msg"></div>
      </div>
    </div>
  `
}

function attachLoginEvents() {
  const btn = document.getElementById('login-submit')
  const input = document.getElementById('login-email')
  const msg = document.getElementById('login-msg')

  async function doLogin() {
    const email = input.value.trim()
    if (!email) return
    btn.textContent = 'Enviando...'
    btn.disabled = true
    const error = await sendMagicLink(email)
    if (error) {
      msg.textContent = 'Erro ao enviar. Tente novamente.'
      msg.className = 'login-msg error'
      btn.textContent = 'Entrar'
      btn.disabled = false
    } else {
      msg.innerHTML = `✅ Link enviado para <strong>${email}</strong>!<br>Verifique sua caixa de entrada.`
      msg.className = 'login-msg success'
      document.getElementById('login-form').style.display = 'none'
    }
  }

  btn.addEventListener('click', doLogin)
  input.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin() })
}

// ── Today ─────────────────────────────────────────────────────
function renderToday() {
  if (!habits.length) return `
    <div class="empty-state">
      <div class="empty-icon">🌱</div>
      <p>Nenhum hábito ainda.</p>
      <p class="empty-sub">Vá em <strong>Hábitos</strong> para adicionar.</p>
    </div>`

  const done = habits.filter(h => {
    const v = getCheckin(h.id, todayStr)
    return h.is_water ? v >= 6 : v >= 1
  }).length
  const pct = Math.round((done / habits.length) * 100)

  return `
    <div class="today-wrap">
      <div class="progress-card">
        <div class="progress-header">
          <span class="progress-label">Progresso de hoje</span>
          <span class="progress-pct">${pct}%</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="progress-sub">${done} de ${habits.length} hábitos completos</div>
      </div>
      <div class="habits-list">
        ${habits.map(h => renderHabitRow(h, todayStr)).join('')}
      </div>
    </div>`
}

function habitIcon(name) {
  const n = name.toLowerCase()
  if (n.includes('bíblia')||n.includes('biblia')) return '📖'
  if (n.includes('livro')) return '📚'
  if (n.includes('inglês')||n.includes('ingles')) return '🎬'
  if (n.includes('flex')||n.includes('treino')||n.includes('exerc')) return '💪'
  if (n.includes('vídeo')||n.includes('video')||n.includes('cristão')) return '🎥'
  if (n.includes('água')||n.includes('agua')) return '💧'
  return '✦'
}

function renderHabitRow(habit, date) {
  const val = getCheckin(habit.id, date)
  const done = habit.is_water ? val >= 6 : val >= 1

  if (habit.is_water) {
    const pct = Math.min((val/6)*100, 100)
    return `
      <div class="habit-row ${done?'done':''}">
        <div class="habit-info">
          <span class="habit-icon">💧</span>
          <div class="habit-text">
            <span class="habit-name">${habit.name}</span>
            <span class="habit-sub">${val}/6 garrafas · ${val*500}ml</span>
          </div>
        </div>
        <div class="water-controls">
          <button class="water-btn" data-id="${habit.id}" data-date="${date}" data-delta="-1" ${val<=0?'disabled':''}>−</button>
          <div class="water-display">
            <div class="water-bar" style="width:${pct}%"></div>
            <span class="water-num">${val}</span>
          </div>
          <button class="water-btn" data-id="${habit.id}" data-date="${date}" data-delta="1" ${val>=6?'disabled':''}>+</button>
        </div>
      </div>`
  }

  return `
    <div class="habit-row ${done?'done':''}" data-tap-id="${habit.id}" data-tap-date="${date}">
      <div class="habit-info">
        <span class="habit-icon">${habitIcon(habit.name)}</span>
        <span class="habit-name">${habit.name}</span>
      </div>
      <div class="check-box ${done?'checked':''}">
        ${done?'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>':''}
      </div>
    </div>`
}

// ── Month ─────────────────────────────────────────────────────
function renderMonth() {
  const year = 2026
  const daysInMonth = MONTH_DAYS[currentMonth]
  return `
    <div class="month-wrap">
      <div class="month-nav">
        <button class="month-arrow" id="prev-month">‹</button>
        <span class="month-title">${MONTHS[currentMonth]} ${year}</span>
        <button class="month-arrow" id="next-month">›</button>
      </div>
      <div class="month-grid-wrap">
        <table class="month-table">
          <thead><tr>
            <th class="habit-col">Hábito</th>
            ${Array.from({length:daysInMonth},(_,i)=>`<th class="day-col">${i+1}</th>`).join('')}
          </tr></thead>
          <tbody>
            ${habits.map(h => `
              <tr>
                <td class="habit-name-cell"><span>${habitIcon(h.name)}</span><span>${h.name}</span></td>
                ${Array.from({length:daysInMonth},(_,i) => {
                  const d = `${year}-${String(currentMonth+1).padStart(2,'0')}-${String(i+1).padStart(2,'0')}`
                  const val = getCheckin(h.id, d)
                  const done = h.is_water ? val>=6 : val>=1
                  const isToday = d === todayStr
                  if (h.is_water) {
                    const color = val===0?'':(val>=6?'cell-green':'cell-yellow')
                    return `<td class="day-cell ${color} ${isToday?'today-cell':''}">${val>0?val:''}</td>`
                  }
                  return `<td class="day-cell ${done?'cell-green':''} ${isToday?'today-cell':''}">${done?'✓':''}</td>`
                }).join('')}
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`
}

// ── Settings ──────────────────────────────────────────────────
function renderSettings() {
  return `
    <div class="settings-wrap">
      <h2 class="settings-title">Meus Hábitos</h2>
      <p class="settings-sub">Adicione ou remova hábitos.</p>
      <div class="habits-settings-list">
        ${habits.map(h => `
          <div class="habit-setting-row">
            <span class="hs-icon">${habitIcon(h.name)}</span>
            <span class="hs-name">${h.name}${h.is_water?' 💧':''}</span>
            <button class="hs-delete" data-delete-id="${h.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
            </button>
          </div>`).join('')}
      </div>
      <div class="add-habit-form">
        <input type="text" id="new-habit-input" placeholder="Nome do novo hábito..." maxlength="50" />
        <label class="water-toggle">
          <input type="checkbox" id="is-water-check" />
          <span>É contador de água (0–6)?</span>
        </label>
        <button class="add-btn" id="add-habit-btn">+ Adicionar hábito</button>
      </div>
      <div class="account-section">
        <p class="account-email">📧 ${currentUser.email}</p>
        <button class="signout-full" id="signout-full">Sair da conta</button>
      </div>
    </div>`
}

// ── Events ────────────────────────────────────────────────────
function attachEvents() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => { currentView = btn.dataset.view; render() })
  })

  document.getElementById('signout')?.addEventListener('click', signOut)
  document.getElementById('signout-full')?.addEventListener('click', signOut)

  document.querySelectorAll('[data-tap-id]').forEach(el => {
    el.addEventListener('click', async () => {
      const id = el.dataset.tapId, date = el.dataset.tapDate
      const newVal = getCheckin(id, date) >= 1 ? 0 : 1
      await saveCheckin(id, date, newVal); render()
    })
  })

  document.querySelectorAll('.water-btn').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.stopPropagation()
      const id = btn.dataset.id, date = btn.dataset.date
      const newVal = Math.max(0, Math.min(6, getCheckin(id, date) + parseInt(btn.dataset.delta)))
      await saveCheckin(id, date, newVal); render()
    })
  })

  document.getElementById('prev-month')?.addEventListener('click', () => {
    currentMonth = Math.max(0, currentMonth-1); render()
  })
  document.getElementById('next-month')?.addEventListener('click', () => {
    currentMonth = Math.min(11, currentMonth+1); render()
  })

  document.querySelectorAll('[data-delete-id]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Remover este hábito?')) return
      await deleteHabit(btn.dataset.deleteId); render()
    })
  })

  document.getElementById('add-habit-btn')?.addEventListener('click', async () => {
    const input = document.getElementById('new-habit-input')
    const isWater = document.getElementById('is-water-check').checked
    const name = input.value.trim()
    if (!name) return
    input.value = ''
    await addHabit(name, isWater); render()
  })

  document.getElementById('new-habit-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('add-habit-btn').click()
  })
}

init()
