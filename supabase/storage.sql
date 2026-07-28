-- =========================================================
-- PRIMA BOUTIQUE — configuration Supabase Storage
-- À exécuter APRÈS schema.sql
-- =========================================================

insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('slider-images', 'slider-images', true),
  ('brand-logos', 'brand-logos', true)
on conflict (id) do nothing;

-- Lecture publique (les images du site doivent être visibles par tout le monde)
create policy "public read product images bucket" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "public read slider images bucket" on storage.objects
  for select using (bucket_id = 'slider-images');
create policy "public read brand logos bucket" on storage.objects
  for select using (bucket_id = 'brand-logos');

-- Écriture réservée aux administrateurs (upload direct de fichiers depuis l'admin)
create policy "admin upload product images" on storage.objects
  for insert with check (
    bucket_id = 'product-images'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
  );
create policy "admin upload slider images" on storage.objects
  for insert with check (
    bucket_id = 'slider-images'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
  );
create policy "admin upload brand logos" on storage.objects
  for insert with check (
    bucket_id = 'brand-logos'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
  );

create policy "admin delete product images" on storage.objects
  for delete using (
    bucket_id = 'product-images'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
  );
create policy "admin delete slider images" on storage.objects
  for delete using (
    bucket_id = 'slider-images'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
  );
