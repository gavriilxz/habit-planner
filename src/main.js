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
