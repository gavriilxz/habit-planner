# 📱 Planner de Hábitos 2026

App PWA de hábitos com sync entre celular e PC.

---

## 🚀 Como colocar no ar (passo a passo)

### 1. Criar banco de dados no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Vá em **SQL Editor** e cole e execute este SQL:

```sql
create table habits (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  name text not null,
  is_water boolean default false,
  position int default 0,
  created_at timestamptz default now()
);

create table checkins (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  habit_id uuid references habits(id) on delete cascade,
  date text not null,
  value int default 0,
  created_at timestamptz default now(),
  unique(habit_id, date)
);

alter table habits enable row level security;
alter table checkins enable row level security;
create policy "public access habits" on habits for all using (true) with check (true);
create policy "public access checkins" on checkins for all using (true) with check (true);
```

3. Vá em **Settings > API** e copie:
   - **Project URL**
   - **anon public key**

4. Abra o arquivo `src/supabase.js` e substitua:
   - `COLOQUE_SUA_URL_AQUI` → sua Project URL
   - `COLOQUE_SUA_ANON_KEY_AQUI` → sua anon key

---

### 2. Subir o código no GitHub

1. Acesse [github.com](https://github.com) → **New repository**
2. Nome: `habit-planner` → Create repository
3. Faça upload de todos os arquivos desta pasta

---

### 3. Publicar na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. **Add New Project** → importe o repositório do GitHub
3. Em **Build Settings**:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output: `dist`
4. Clique **Deploy** — em 1 minuto seu app está no ar!

---

### 4. Instalar no iPhone

1. Abra o link do app no **Safari**
2. Toque no botão compartilhar (□↑)
3. "Adicionar à Tela de Início"
4. Pronto — aparece como app!

### 5. Instalar no Mac

1. Abra no **Chrome**
2. Clique no ícone de instalar na barra de endereço
3. Pronto!

---

## ✨ Funcionalidades

- ✅ Checkboxes clicáveis para cada hábito
- 💧 Contador especial para água (0–6 garrafas)
- 📊 Progresso diário em tempo real
- 📅 Visão mensal com histórico completo
- ☁️ Sync automático entre todos os dispositivos
- 📱 Instalável como app no iPhone e Mac
