create extension if not exists "uuid-ossp";
create table games(
    id uuid primary key default uuid_generate_v4(),
    complete_word text not null,
    word_progress text not null,
    guesses integer not null,
    has_won boolean not null default false,
    created_at date not null  default now(),
    modified_at date not null
);
