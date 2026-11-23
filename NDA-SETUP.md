# NDA-gated Offering Memorandums: setup

How it works:

1. In **Edit Listing**, tick **Require NDA before OM access**, paste the NDA text, and upload the OM PDF.
   The OM is stored privately and has no public link.
2. On the listing page, visitors click **Sign NDA to Request OM**. They read the NDA, tick "I agree", and type their full legal name.
   The site records the name, date and time, IP address, browser, and the exact NDA text they agreed to.
3. The listing's brokers get an email, and the request appears under **Dashboard → NDA Requests** with a red count.
4. A broker clicks **Approve** or **Don't approve**.
   - Approved leads see **Download OM** when they return to the listing, and get a link that expires after 5 minutes.
   - **Revoke** removes access again.
5. A lead on a different device can click **"Email me my access link"**. You can also click **Copy link** on an approved request and email it to them yourself.

Do the steps below **in this order**, because the website update needs the database changes first.

## 1. Database (Supabase → CRE Site → SQL Editor)
Open a new query, paste all of `supabase/migrations/002_nda.sql`, and click **Run**. It's safe to run more than once.

## 2. The `nda` function (Supabase → Edge Functions)
1. Click **Deploy a new function**, then **Via Editor**, and name it exactly `nda`.
2. Paste in all of `supabase/functions/nda/index.ts`, then click **Deploy**.
3. In the function's **Details / Settings**, turn **Verify JWT / Enforce JWT verification OFF**. Visitors aren't logged in, so they can't send a login token.

## 3. Secrets (Supabase → Edge Functions → Secrets)
| Name | Value | Needed? |
|---|---|---|
| `RECAPTCHA_SECRET_KEY` | your Google reCAPTCHA secret (it may already be there for `verify-recaptcha`) | Yes, it blocks bots |
| `SITE_URL` | `https://farislee.com` (or your Vercel address) | Yes, for links in emails |
| `RESEND_API_KEY` | from resend.com → API Keys | For emails |
| `NDA_EMAIL_FROM` | e.g. `Faris Lee Investments <nda@farislee.com>` | For emails |
| `NDA_NOTIFY_EMAIL` | optional extra recipients, comma-separated (e.g. a team inbox) | Optional |

Without the Resend secrets, everything still works except the emails. Requests still appear on the Dashboard.

**Resend setup:** create a free account at resend.com, add your domain (farislee.com) under **Domains**, and add the DNS records it shows at your domain registrar. Once the domain shows **Verified**, create an API key.

Broker alerts go to the email addresses on each listing's assigned brokers (Dashboard → Brokers), plus `NDA_NOTIFY_EMAIL`.

## 4. Website (GitHub → Vercel)
Upload the updated files to the GitHub repository. Vercel redeploys automatically.
