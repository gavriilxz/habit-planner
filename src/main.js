import { supabase } from './supabase.js'
import './style.css'


const GABRIEL_PHOTO = 'data:image/jpeg;base64,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'

function checkBeta() {
  return !localStorage.getItem('beta_accepted')
}

function acceptBeta() {
  localStorage.setItem('beta_accepted', '1')
  render()
}

function renderBeta() {
  return `
    <div class="beta-wrap">
      <div class="beta-card">
        <div class="beta-badge">🚧 VERSÃO BETA</div>
        <div class="beta-photo-wrap">
          <img src="${GABRIEL_PHOTO}" class="beta-photo" alt="Gabriel Sales" />
        </div>
        <h2 class="beta-dev">Desenvolvido por<br><strong>Gabriel Sales</strong></h2>
        <p class="beta-text">
          Este aplicativo está em fase de testes ativos.<br>
          Alguns recursos podem estar incompletos ou mudar sem aviso prévio.
        </p>
        <p class="beta-ask">
          Ao continuar, você concorda em reportar bugs e feedbacks que ajudem a melhorar o app. 🙏
        </p>
        <button class="beta-btn" id="beta-continue">Entendi, continuar</button>
      </div>
    </div>`
}

let currentUser = null
let habits = []
let checkins = {}
let currentView = 'today'
let currentMonth = new Date().getMonth()
let loading = true
let authMode = 'login'

const today = new Date()
const todayStr = fmtDate(today)

function fmtDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const MONTH_DAYS = [31,28,29,31,30,31,30,31,31,30,31,30,31]
const WEEK_DAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

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

async function signUp(email, password) {
  const { error } = await supabase.auth.signUp({ email, password })
  return error
}
async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return error
}
async function signOut() {
  await supabase.auth.signOut()
  habits = []; checkins = {}; currentView = 'today'; render()
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

// ── Streak ────────────────────────────────────────────────────
function calcStreak() {
  let streak = 0
  const d = new Date(today)
  while (true) {
    const dateStr = fmtDate(d)
    const allDone = habits.length > 0 && habits.every(h => {
      const v = getCheckin(h.id, dateStr)
      return h.is_water ? v >= 6 : v >= 1
    })
    if (!allDone) break
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

// ── Render ────────────────────────────────────────────────────
function render() {
  const app = document.getElementById('app')

  if (checkBeta()) {
    app.innerHTML = renderBeta()
    document.getElementById('beta-continue').addEventListener('click', acceptBeta)
    return
  }

  if (loading) {
    app.innerHTML = `<div class="splash"><div class="splash-logo">✦</div><p>Carregando...</p></div>`
    return
  }

  if (!currentUser) {
    app.innerHTML = renderAuth()
    attachAuthEvents()
    return
  }

  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <div class="topbar-left">
          <span class="logo">✦</span>
          <span class="app-title">Fiel</span>
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

// ── Auth ──────────────────────────────────────────────────────
function renderAuth() {
  const isLogin = authMode === 'login'
  return `
    <div class="login-wrap">
      <div class="login-card">
        <div class="login-logo">
          <img src="/icon-192.png" alt="Fiel" />
        </div>
        <h1 class="login-title">Fiel</h1>
        <p class="login-sub">Seu planner de hábitos diários</p>
        <div class="auth-tabs">
          <button class="auth-tab ${isLogin?'active':''}" data-mode="login">Entrar</button>
          <button class="auth-tab ${!isLogin?'active':''}" data-mode="register">Criar conta</button>
        </div>
        <div class="login-form">
          <input type="email" id="auth-email" placeholder="seu@email.com" autocomplete="email" />
          <input type="password" id="auth-password" placeholder="Senha (mín. 6 caracteres)" autocomplete="${isLogin?'current-password':'new-password'}" />
          <button class="login-btn" id="auth-submit">${isLogin?'Entrar':'Criar conta'}</button>
        </div>
        <div id="auth-msg" class="login-msg"></div>
        <p class="login-footer">Seus dados são privados e seguros ✦</p>
      </div>
    </div>`
}

function attachAuthEvents() {
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => { authMode = tab.dataset.mode; render() })
  })

  const btn = document.getElementById('auth-submit')
  const emailInput = document.getElementById('auth-email')
  const passInput = document.getElementById('auth-password')
  const msg = document.getElementById('auth-msg')

  async function doAuth() {
    const email = emailInput.value.trim()
    const password = passInput.value
    if (!email || !password) { msg.textContent = 'Preencha e-mail e senha.'; msg.className = 'login-msg error'; return }
    if (password.length < 6) { msg.textContent = 'Senha precisa ter pelo menos 6 caracteres.'; msg.className = 'login-msg error'; return }
    btn.disabled = true
    btn.textContent = authMode === 'login' ? 'Entrando...' : 'Criando conta...'
    const error = authMode === 'login' ? await signIn(email, password) : await signUp(email, password)
    if (error) {
      const errMap = {
        'Invalid login credentials': 'E-mail ou senha incorretos.',
        'User already registered': 'Este e-mail já está cadastrado. Tente entrar.',
      }
      msg.textContent = errMap[error.message] || 'Erro: ' + error.message
      msg.className = 'login-msg error'
      btn.disabled = false
      btn.textContent = authMode === 'login' ? 'Entrar' : 'Criar conta'
    } else if (authMode === 'register') {
      msg.innerHTML = '✅ Conta criada! Clique em <strong>Entrar</strong>.'
      msg.className = 'login-msg success'
      authMode = 'login'
      setTimeout(() => render(), 1500)
    }
  }

  btn.addEventListener('click', doAuth)
  passInput.addEventListener('keydown', e => { if (e.key === 'Enter') doAuth() })
}

// ── Today ─────────────────────────────────────────────────────
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
  const pct = Math.round((done/habits.length)*100)
  const streak = calcStreak()

  return `
    <div class="today-wrap">
      <div class="stats-row">
        <div class="progress-card">
          <div class="progress-header">
            <span class="progress-label">Hoje</span>
            <span class="progress-pct">${pct}%</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="progress-sub">${done} de ${habits.length} completos</div>
        </div>
        <div class="streak-card">
          <div class="streak-fire">${streak > 0 ? '🔥' : '💤'}</div>
          <div class="streak-num">${streak}</div>
          <div class="streak-label">${streak === 1 ? 'dia' : 'dias'}</div>
        </div>
      </div>
      <div class="habits-list">
        ${habits.map(h => renderHabitRow(h, todayStr)).join('')}
      </div>
    </div>`
}

// ── Month (calendário em grade) ───────────────────────────────
function renderMonth() {
  const year = 2026
  const daysInMonth = MONTH_DAYS[currentMonth]

  // Dia da semana do dia 1 do mês
  const firstDayOfWeek = new Date(year, currentMonth, 1).getDay()

  // Gera os dias do calendário em grade
  const calDays = []
  for (let i = 0; i < firstDayOfWeek; i++) calDays.push(null)
  for (let d = 1; d <= daysInMonth; d++) calDays.push(d)
  while (calDays.length % 7 !== 0) calDays.push(null)

  return `
    <div class="month-wrap">
      <div class="month-nav">
        <button class="month-arrow" id="prev-month">‹</button>
        <span class="month-title">${MONTHS[currentMonth]} ${year}</span>
        <button class="month-arrow" id="next-month">›</button>
      </div>

      <div class="cal-grid">
        ${WEEK_DAYS.map(d => `<div class="cal-weekday">${d}</div>`).join('')}
        ${calDays.map(day => {
          if (!day) return `<div class="cal-day empty"></div>`
          const dateStr = `${year}-${String(currentMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
          const isToday = dateStr === todayStr
          const totalHabits = habits.length
          const doneCount = habits.filter(h => {
            const v = getCheckin(h.id, dateStr)
            return h.is_water ? v >= 6 : v >= 1
          }).length
          const allDone = totalHabits > 0 && doneCount === totalHabits
          const someDone = doneCount > 0 && !allDone
          const future = dateStr > todayStr

          let cls = 'cal-day'
          if (isToday) cls += ' cal-today'
          if (allDone) cls += ' cal-done'
          else if (someDone) cls += ' cal-partial'
          else if (future) cls += ' cal-future'

          return `
            <div class="${cls}">
              <span class="cal-num">${day}</span>
              ${!future && totalHabits > 0 ? `<span class="cal-dot-row">${
                allDone ? '✓' : someDone ? `${doneCount}/${totalHabits}` : ''
              }</span>` : ''}
            </div>`
        }).join('')}
      </div>

      <div class="cal-legend">
        <div class="leg-item"><div class="leg-dot done"></div><span>Tudo feito</span></div>
        <div class="leg-item"><div class="leg-dot partial"></div><span>Parcial</span></div>
        <div class="leg-item"><div class="leg-dot empty"></div><span>Nenhum</span></div>
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

  document.getElementById('prev-month')?.addEventListener('click', () => { currentMonth = Math.max(0, currentMonth-1); render() })
  document.getElementById('next-month')?.addEventListener('click', () => { currentMonth = Math.min(11, currentMonth+1); render() })

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
