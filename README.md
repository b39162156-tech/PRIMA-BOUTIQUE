# PRIMA BOUTIQUE — projet Next.js + Supabase

Boutique e-commerce complète : storefront (cosmétiques, alimentaire, maison),
panier, paiement (Wave, Orange Money, à la livraison), et back-office
d'administration (produits, slider, commandes, clients).

## 1. Prérequis

- Un compte [Supabase](https://supabase.com) (gratuit pour démarrer)
- Un compte [Vercel](https://vercel.com) (gratuit pour démarrer)
- Node.js 18+ si vous voulez tester en local

## 2. Configurer Supabase (base de données + stockage + auth)

1. Créez un nouveau projet sur supabase.com.
2. Allez dans **SQL Editor** → collez le contenu de `supabase/schema.sql` → *Run*.
3. Toujours dans **SQL Editor** → collez le contenu de `supabase/storage.sql` → *Run*.
   (Cela crée les buckets `product-images`, `slider-images`, `brand-logos` et
   leurs règles d'accès.)
4. Allez dans **Authentication → Providers** et vérifiez que "Email" est activé.
5. Créez votre compte administrateur :
   - Allez dans **Authentication → Users → Add user**, créez un utilisateur
     avec votre e-mail et un mot de passe.
   - Copiez son UUID.
   - Dans **SQL Editor**, exécutez :
     ```sql
     update profiles set is_admin = true where id = 'COLLEZ-L-UUID-ICI';
     ```
6. Récupérez vos clés API : **Project Settings → API** :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (à garder secrète)

## 3. Configurer le projet

1. Copiez `.env.local.example` en `.env.local` et remplissez les valeurs
   récupérées à l'étape précédente.
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Testez en local :
   ```bash
   npm run dev
   ```
   Le site est sur http://localhost:3000, l'admin sur http://localhost:3000/admin

## 4. Publier le site (Vercel)

1. Poussez ce projet sur un dépôt GitHub (ou GitLab/Bitbucket).
2. Allez sur [vercel.com/new](https://vercel.com/new) → importez le dépôt.
3. Dans les paramètres du projet Vercel, ajoutez les mêmes variables
   d'environnement que dans `.env.local` (Settings → Environment Variables).
4. Cliquez sur **Deploy**. Vercel construit et publie le site automatiquement ;
   vous obtenez une URL en `.vercel.app` (vous pourrez ensuite y attacher
   votre propre nom de domaine dans Settings → Domains).
5. À chaque `git push`, Vercel republie automatiquement le site.

## 5. Ce qui est déjà fonctionnel

- Storefront complet (accueil, catégories, promotions, marques, panier,
  paiement, compte client, contact, à propos)
- Panier persistant côté navigateur, commande enregistrée dans Supabase
- Authentification client (inscription/connexion) et favoris liés au compte
- Back-office protégé (middleware + RLS) : produits (CRUD + upload photo
  réel vers Supabase Storage), slider (upload, réorganisation, durée),
  commandes (changement de statut), clients, tableau de bord
- SEO : sitemap.xml et robots.txt générés automatiquement, métadonnées et
  Open Graph dans `src/app/layout.tsx`
- Bouton WhatsApp flottant vers +221 77 802 80 25

## 6. Prochaines améliorations possibles

- Paiement en ligne réel (Wave/Orange Money proposent des API de paiement ;
  l'architecture du panier et de la commande est prête pour les brancher)
- Notifications automatiques par e-mail/WhatsApp à la création d'une commande
- Gestion fine des catégories depuis l'admin (actuellement en base via SQL)
- Tests automatisés

## Structure du projet

```
src/
  app/            → pages (App Router de Next.js)
    admin/        → back-office (protégé par middleware.ts)
  components/     → composants réutilisables (Header, ProductCard, etc.)
  lib/            → clients Supabase, types, utilitaires, contexte panier
supabase/
  schema.sql      → tables, RLS, données de départ
  storage.sql     → buckets et règles d'upload d'images
```
