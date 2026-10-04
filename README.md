# Keshav Kumar Portfolio (Next.js)

Website plus admin dashboard. Everything on the site is edited from `/admin`.

## Run on your computer
1. `npm install`
2. `npm run dev`
3. Website: http://localhost:3000  Dashboard: http://localhost:3000/admin (password: `admin123` until you set your own)

Without MongoDB the data is saved in `data/db.json` (good for testing only).

## Go live (Vercel + MongoDB Atlas)
1. Create a free MongoDB Atlas cluster and copy the connection string.
2. Push this folder to GitHub and import it in Vercel.
3. In Vercel > Settings > Environment Variables add (see `.env.example`):
   - `MONGODB_URI`
   - `ADMIN_PASSWORD` (your dashboard password)
   - `AUTH_SECRET` (any long random text)
   - Optional email: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`
     (for Gmail use smtp.gmail.com, port 465 and a Gmail App Password)
4. Deploy. Open `yourdomain/admin` and log in.

## What you can change from the dashboard
Hero photo and text, introduction and YouTube video, My Work boxes (photo + Google Drive link),
software logos, video testimonials, written testimonials (approve or reject new ones),
experience companies, about text and achievements, phone, WhatsApp, email, address and social links.
Contact form messages are saved in the dashboard (Messages) and emailed if SMTP is set.

## Notes
- Uploaded photos are compressed and stored inside the database. Keep photos reasonable in size.
- Google Drive folders must be set to "Anyone with the link can view".
- Sample testimonials show a "Sample" label. Replace them with real reviews and untick that label.

## New in v4
Blog, case studies, pricing packages, FAQ, free check offer, Instagram posts (paste post links) and Visitors stats. All are edited from the dashboard.

## Drive gallery
Each My Work box opens a gallery page inside your website. Photos and videos come from the Google Drive folder you linked.
1. Set the folder to "Anyone with the link can view".
2. For a clean gallery with lightbox, create a free Google API key: Google Cloud Console > new project > enable "Google Drive API" > Credentials > Create API key. Paste it in Dashboard > My Work (or set `GOOGLE_API_KEY`).
3. Without a key, the folder still shows, but inside a simple Google frame.
New files you upload to the folder appear automatically (refreshes about every 2 minutes).

## v6 premium UI
- Smooth scrolling, custom cursor (desktop only), glass cards, 3D tilt on work cards and gallery photos, page curtain animation, skeleton loading, light and dark toggle in the header.
- Hero: tick "Magazine style" in Dashboard > Hero and upload a transparent PNG (or press "Remove background"; it downloads a small AI model in your browser the first time). Optional background .mp4 link.
- My Work: set Category (Video, Design, Shoot) for the filter buttons. Optional hover preview clip needs a direct .mp4 link (Drive links do not work for this).
- Photos stay in Google Drive. The gallery only shows them; click a photo to zoom.
