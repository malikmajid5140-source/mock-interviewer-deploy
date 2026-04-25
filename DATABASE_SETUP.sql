-- Profiles table
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text,
  last_name text,
  target_role text,
  experience_level text,
  industry text,
  created_at timestamptz default now()
);

-- Sessions table (tracks every practice session)
create table if not exists sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  role text not null,
  session_type text not null, -- 'question_bank' | 'mcq' | 'mock_interview'
  score integer,
  total integer,
  questions_practiced integer default 0,
  created_at timestamptz default now()
);

-- MCQ table (tracks detailed mcq scores)
create table if not exists mcq_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  role text not null,
  total_questions integer,
  correct_answers integer,
  score_percentage integer,
  created_at timestamptz default now()
);

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table sessions enable row level security;
alter table mcq_attempts enable row level security;

-- RLS policies
create policy "own profile" on profiles for all using (auth.uid() = id);
create policy "own sessions" on sessions for all using (auth.uid() = user_id);
create policy "own mcq" on mcq_attempts for all using (auth.uid() = user_id);
