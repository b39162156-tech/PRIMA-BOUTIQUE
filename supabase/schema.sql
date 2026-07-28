-- =========================================================
-- PRIMA BOUTIQUE — schéma Supabase / PostgreSQL
-- À exécuter dans Supabase SQL Editor (ou via `supabase db push`)
-- =========================================================

create extension if not exists "uuid-ossp";

-- ---------- CATÉGORIES ----------
create table if not exists categories (
  id text primary key,               -- ex: 'cosmetiques'
  label text not null,
  icon text,                         -- nom d'icône lucide-react
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- MARQUES ----------
create table if not exists brands (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  logo_url text,
  created_at timestamptz not null default now()
);

-- ---------- PRODUITS ----------
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  category_id text references categories(id) on delete set null,
  brand_id uuid references brands(id) on delete set null,
  price numeric(12,0) not null check (price >= 0),        -- FCFA, entier
  old_price numeric(12,0),                                 -- prix barré si promotion
  stock int not null default 0,
  is_new boolean not null default false,
  is_best_seller boolean not null default false,
  is_active boolean not null default true,
  rating numeric(2,1) not null default 0,
  reviews_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_brand on products(brand_id);
create index if not exists idx_products_promo on products(old_price) where old_price is not null;

-- ---------- IMAGES PRODUITS (uploadées via Supabase Storage) ----------
create table if not exists product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  storage_path text not null,       -- chemin dans le bucket 'product-images'
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- SLIDER PUBLICITAIRE ----------
create table if not exists slides (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  subtitle text,
  storage_path text not null,       -- image dans le bucket 'slider-images'
  link_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- PARAMÈTRES DU SITE (durée slider, frais livraison...) ----------
create table if not exists site_settings (
  key text primary key,
  value jsonb not null
);

insert into site_settings (key, value) values
  ('slider_duration_ms', '3700'),
  ('delivery_fee_dakar', '1500'),
  ('delivery_fee_regions', '3000'),
  ('whatsapp_number', '"221778028025"')
on conflict (key) do nothing;

-- ---------- PROFILS CLIENTS (liés à auth.users) ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  address text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- FAVORIS ----------
create table if not exists favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- ---------- AVIS ----------
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

-- ---------- COMMANDES ----------
create type order_status as enum ('en_attente', 'confirmee', 'en_preparation', 'expediee', 'livree');
create type payment_method as enum ('wave', 'orange_money', 'a_la_livraison');
create type delivery_zone as enum ('dakar', 'regions');

create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text not null unique,          -- ex: CMD-1042
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text,
  delivery_zone delivery_zone not null default 'dakar',
  delivery_fee numeric(12,0) not null default 0,
  payment_method payment_method not null,
  subtotal numeric(12,0) not null,
  total numeric(12,0) not null,
  status order_status not null default 'en_attente',
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,       -- copie figée au moment de la commande
  unit_price numeric(12,0) not null,
  quantity int not null check (quantity > 0)
);

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table categories enable row level security;
alter table brands enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table slides enable row level security;
alter table site_settings enable row level security;
alter table profiles enable row level security;
alter table favorites enable row level security;
alter table reviews enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Lecture publique du catalogue (front-office)
create policy "public read categories" on categories for select using (true);
create policy "public read brands" on brands for select using (true);
create policy "public read active products" on products for select using (is_active = true);
create policy "public read product images" on product_images for select using (true);
create policy "public read active slides" on slides for select using (is_active = true);
create policy "public read settings" on site_settings for select using (true);
create policy "public read reviews" on reviews for select using (true);

-- Favoris : chaque utilisateur gère les siens
create policy "read own favorites" on favorites for select using (auth.uid() = user_id);
create policy "insert own favorites" on favorites for insert with check (auth.uid() = user_id);
create policy "delete own favorites" on favorites for delete using (auth.uid() = user_id);

-- Profils : chacun lit/modifie le sien
create policy "read own profile" on profiles for select using (auth.uid() = id);
create policy "update own profile" on profiles for update using (auth.uid() = id);

-- Avis : lecture publique (ci-dessus), écriture par utilisateur connecté
create policy "insert own review" on reviews for insert with check (auth.uid() = user_id);

-- Commandes : le client voit ses propres commandes ; création ouverte (checkout)
create policy "read own orders" on orders for select using (auth.uid() = user_id);
create policy "insert order" on orders for insert with check (true);
create policy "read own order items" on order_items for select using (
  exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "insert order items" on order_items for insert with check (true);

-- Admin : accès complet sur toutes les tables de gestion
create policy "admin full access categories" on categories for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
);
create policy "admin full access brands" on brands for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
);
create policy "admin full access products" on products for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
);
create policy "admin full access product_images" on product_images for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
);
create policy "admin full access slides" on slides for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
);
create policy "admin full access settings" on site_settings for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
);
create policy "admin full access orders" on orders for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
);
create policy "admin full access order_items" on order_items for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
);
create policy "admin read profiles" on profiles for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
);

-- =========================================================
-- CRÉATION AUTOMATIQUE D'UN PROFIL À L'INSCRIPTION
-- =========================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================
-- DONNÉES DE DÉPART
-- =========================================================
insert into categories (id, label, icon, sort_order) values
  ('cosmetiques', 'Cosmétiques', 'sparkle', 1),
  ('alimentaire', 'Alimentaire', 'utensils-crossed', 2),
  ('maison', 'Maison', 'home', 3)
on conflict (id) do nothing;

insert into brands (name) values ('Balea'), ('Garnier'), ('Mixa'), ('Milsani')
on conflict (name) do nothing;

-- =========================================================
-- POUR CRÉER UN COMPTE ADMINISTRATEUR
-- =========================================================
-- 1. Créez un utilisateur via Supabase Auth (dashboard ou signUp())
-- 2. Puis exécutez (remplacez l'UUID) :
-- update profiles set is_admin = true where id = 'UUID-DE-L-UTILISATEUR';
