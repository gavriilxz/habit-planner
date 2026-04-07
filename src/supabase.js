// ─── CONFIGURE AQUI ───────────────────────────────────────────
// Substitua pelos seus valores do Supabase (Settings > API)
const SUPABASE_URL = 'https://akxdgwlgrwojqoxvmvop.supabase.co'
const SUPABASE_KEY = 'sb_publishable_6DPvYo_RsBRFco5jhidvZg_Pd6iqZgK'
// ──────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// SQL para rodar no Supabase SQL Editor (uma única vez):
// 
// create table habits (
//   id uuid default gen_random_uuid() primary key,
//   user_id text not null,
//   name text not null,
//   is_water boolean default false,
//   position int default 0,
//   created_at timestamptz default now()
// );
//
// create table checkins (
//   id uuid default gen_random_uuid() primary key,
//   user_id text not null,
//   habit_id uuid references habits(id) on delete cascade,
//   date text not null,
//   value int default 0,
//   created_at timestamptz default now(),
//   unique(habit_id, date)
// );
//
// alter table habits enable row level security;
// alter table checkins enable row level security;
// create policy "public access habits" on habits for all using (true) with check (true);
// create policy "public access checkins" on checkins for all using (true) with check (true);
