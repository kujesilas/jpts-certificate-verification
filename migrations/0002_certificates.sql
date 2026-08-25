-- Official certificate register for JPTS Akwanga Centre.
create table if not exists certificates (
  id text primary key,
  year integer not null,
  serial integer not null,
  cert_number text not null unique,
  verification_code text not null unique,
  holder_name text not null,
  holder_email text,
  programme text not null,
  qualification text not null,
  grade text,
  issue_date date not null,
  expiry_date date,
  status text not null default 'valid',
  revoke_reason text,
  revoked_at timestamptz,
  issued_by_user_id text not null,
  issued_by_name text,
  notes text,
  created_at timestamptz not null default now(),
  unique (year, serial),
  constraint certificates_status_chk check (status in ('valid', 'revoked'))
);

create index if not exists certificates_cert_number_idx on certificates (cert_number);
create index if not exists certificates_verification_code_idx on certificates (verification_code);
create index if not exists certificates_holder_name_idx on certificates (holder_name);
create index if not exists certificates_status_idx on certificates (status);
create index if not exists certificates_issue_date_idx on certificates (issue_date desc);
