# Moving off Base44: step-by-step

## 1. Create the database (5 min)
1. Supabase Dashboard > **SQL Editor** > New query.
2. Paste all of `supabase/migrations/001_init.sql` and click **Run**.
   This creates the tables, security rules (RLS), signup functions, and the `uploads` storage bucket.

## 2. Create your admin login
1. Dashboard > **Authentication > Users > Add user** > enter your email + a strong password (tick "Auto confirm").
2. Dashboard > **Authentication > Providers > Email**: turn **off** "Allow new users to sign up" (so strangers can't create accounts).
3. Back in **SQL Editor**, make that user an admin:
   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data,'{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = 'YOU@YOURDOMAIN.COM';
   ```
The old hard-coded code `414` is gone; the dashboard (`/Dashboard-confidential-4`) now needs this login.

## 3. Export your data from Base44
In the Base44 dashboard, open each entity's data table and export JSON (Broker, Listing, NewsStory, Subscriber, OmDownload).
Save them in a folder `base44-export/` named exactly `Broker.json`, `Listing.json`, etc.
**Do this before cancelling Base44.**

## 4. Move images/PDFs off Base44 and import the data
Get your **Project URL** and **service_role** key from Supabase > Project Settings > API.
The service_role key is secret: use it only in your terminal, never in the app or in Git.

```bash
npm install
export SUPABASE_URL=https://YOURREF.supabase.co
export SUPABASE_SERVICE_KEY=eyJ...service_role...

node scripts/migrate-assets.mjs ./base44-export   # re-hosts media + rewrites URLs in data AND code
node scripts/import-data.mjs    ./base44-export   # loads rows, keeping original IDs
```

## 5. Edge functions (Treasury rates + reCAPTCHA)
```bash
npm i -g supabase
supabase login
supabase link --project-ref YOURREF
supabase secrets set RECAPTCHA_SECRET_KEY=your_google_recaptcha_secret
supabase functions deploy get-treasury-rates --no-verify-jwt
supabase functions deploy verify-recaptcha  --no-verify-jwt
```
Your reCAPTCHA **secret key** is the one you originally put in Base44's environment variables.
Also confirm your site's domain is allowed in the Google reCAPTCHA admin console.

## 6. Run it
```bash
cp .env.example .env.local     # put your Project URL + anon (public) key in it
npm run dev
```
Check: home page loads listings/brokers/news, a listing's OM download signup works, `/Dashboard-confidential-4` login works, uploading an image works.

## 7. Deploy
Vercel / Netlify / Cloudflare Pages: connect the repo, build command `npm run build`, output `dist`,
add env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
Add a rewrite so all routes serve `index.html` (single-page app):
- Netlify: file `public/_redirects` containing `/*  /index.html  200`
- Vercel: file `vercel.json` containing `{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}`
Then point farislee.com DNS to the new host and add the domain in Supabase > Authentication > URL Configuration.

## What changed in the code
- `src/api/client.js`: new Supabase-backed layer with the same `entities / functions / integrations` shape, so most components were only touched by a rename.
- `src/lib/AuthContext.jsx` + `DashboardPasswordGate.jsx`: real Supabase login for admins only; visitors need no account.
- Subscriber signup and OM download logging now use secure SQL functions, so visitors can sign up without being able to read your subscriber list.
- `vite.config.js`: Base44 plugin removed (the `@` import alias is now defined directly).
- Removed: `@base44/*` packages, `OAuthConsent` (Base44 MCP feature), `app-params.js`, Base44-only components.
