# The Sur School website

Website and admin panel for The Sur School (piano, guitar and ukulele lessons by Nakul Raikhelkar).
Built with Next.js 16, Supabase (database, photo storage, admin login) and hosted on Vercel.

## What is on the site

- **Public pages:** Home, Courses and fees, About, Gallery, Events and news, Contact. Light and dark mode.
- **Booking:** every course level has a "Book on WhatsApp" button that opens WhatsApp with the course already typed in. There are also call and email buttons, and a WhatsApp button on every page.
- **Admin panel (`/admin`):** edit contact details, the teacher's bio and photo, courses, levels and fees, gallery photos and YouTube videos, and events and news. Changes show on the website straight away.

Until the Supabase keys are added, the site shows built-in starter content (Nakul's details) and the admin cannot sign in.

## One-time setup

1. **Create a Supabase project** (free plan) in the client's own Supabase account.
2. **Create the tables.** In Supabase open *SQL Editor* and run these three files from `supabase/migrations/`, one after the other and in this order:
   1. `20261102000000_init.sql`
   2. `20261102000050_security.sql`
   3. `20261102000100_seed.sql`
   They are safe to run again.
3. **Create the admin login.** In Supabase open *Authentication > Users > Add user*. Use the email `thesurschool@gmail.com`, choose a strong password and tick *Auto Confirm User*.
   Then open *Authentication > Sign In / Providers* and turn **off** *Allow new users to sign up*, so nobody else can create an account.
   To use a different admin email, change it in the `admin_emails` table.
4. **Add the keys.** Copy `.env.example` to `.env.local` and fill in the project URL and the publishable key (*Project Settings > API*).
5. **Run it:** `npm install`, then `npm run dev`, and open <http://localhost:3000>. The admin is at <http://localhost:3000/admin>.

## Putting it online (Vercel)

Import the GitHub repository in Vercel, set the root directory to `website`, and add the same three variables from `.env.example` under *Settings > Environment Variables*. Set `NEXT_PUBLIC_SITE_URL` to the real address once the domain is chosen.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the site locally |
| `npm run build` | Build for production |
| `npm test` | Run the tests |
| `npm run test:coverage` | Run the tests and show coverage |
| `npm run typecheck` / `npm run lint` | Check the code |

## How security works

- Visitors can only read published content. Only the admin email can add, change or delete anything, enforced by database security rules (see `supabase/migrations/20261102000050_security.sql`), not just by the screens.
- Every admin page and action checks the signed-in user again on the server.
- Photos are shrunk in the browser before upload and stored in a public `site-media` bucket (JPEG, PNG or WebP, up to 5 MB each).
