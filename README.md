<div align="center">

# ✈️ TravellingBeku

**A high-performance Travel Content Hub with a built-in Admin CMS.**

Built with Next.js 15 · Tailwind CSS · Cloudflare R2 · Cloudflare Workers · NextAuth.js · Tiptap

</div>

---

## Overview

TravellingBeku is a full-stack travel blog platform where:

- All **blog content and images** are stored in **Cloudflare R2** (no database needed)
- Pages are **Server-Side Rendered (SSR)** — always fresh, no stale cache
- The **Admin CMS** is hidden behind a stealth 404 for unauthenticated users
- The entire app deploys as a **Cloudflare Worker** via `@opennextjs/cloudflare`

---

## Prerequisites

Before you begin, make sure you have the following installed:

| Tool | Version | Install |
|---|---|---|
| **Node.js** | v18+ | [nodejs.org](https://nodejs.org) |
| **npm** | v9+ | Comes with Node.js |
| **Git** | Any recent | [git-scm.com](https://git-scm.com) |

You'll also need a **free Cloudflare account** with an R2 bucket set up.
→ See [`CLOUDFLARE_SETUP.md`](./CLOUDFLARE_SETUP.md) for the full Cloudflare setup guide.

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/your-username/travellingbeku.git
cd travellingbeku
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
# Windows (Command Prompt)
copy .env.example .env.local

# Windows (PowerShell)
Copy-Item .env.example .env.local

# macOS/Linux
cp .env.example .env.local
```

Then open `.env.local` in your editor and fill in every value:

```env
# Generate this with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
AUTH_SECRET=

# Admin CMS login credentials — choose anything you like
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-strong-password-here

# From Cloudflare Dashboard — see CLOUDFLARE_SETUP.md
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=travellingbeku-content
R2_PUBLIC_URL=https://pub-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.r2.dev

# Leave these as-is for local dev
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
```

> **Tip:** Generate `AUTH_SECRET` quickly in your terminal:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
> ```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Accessing the Admin CMS

> ⚠️ The admin panel is intentionally hidden. Visiting `/admin` while unauthenticated returns a **real 404** — not a redirect.

1. Navigate to **[http://localhost:3000/login](http://localhost:3000/login)**
2. Enter the `ADMIN_USERNAME` and `ADMIN_PASSWORD` from your `.env.local`
3. You'll be redirected to the **Admin Dashboard** at `/admin`

From there you can:
- **Create** new blog posts with the Tiptap WYSIWYG editor
- **Upload** a cover image (drag & drop onto the cover zone)
- **Drop images directly into the editor** — they auto-upload to R2 and embed instantly
- **Edit / Delete** existing posts from the tile dashboard
- Toggle posts between **Draft** and **Published**

---

## Project Structure

```
travellingbeku/
│
├── src/
│   ├── middleware.ts              ← Returns 404 for unauthenticated /admin/*
│   ├── types/index.ts             ← BlogPost, BlogPostMeta TypeScript interfaces
│   │
│   ├── lib/
│   │   ├── r2.ts                  ← All R2 read/write operations (S3-compatible)
│   │   ├── auth.ts                ← NextAuth v5 credentials config
│   │   └── utils.ts               ← slugify, formatDate, cn, stripHtml
│   │
│   ├── actions/
│   │   ├── blog-actions.ts        ← saveBlogPost, deleteBlogPost (Server Actions)
│   │   └── upload-actions.ts      ← uploadEditorImage → R2 (Server Action)
│   │
│   ├── app/
│   │   ├── page.tsx               ← / — Landing page
│   │   ├── login/page.tsx         ← /login — Hidden admin login
│   │   ├── blogs/page.tsx         ← /blogs — Blog feed with category filter
│   │   ├── blogs/[slug]/page.tsx  ← /blogs/:slug — Individual post
│   │   ├── admin/page.tsx         ← /admin — Dashboard (protected)
│   │   ├── admin/new/page.tsx     ← /admin/new — Create post
│   │   └── admin/edit/[id]/page.tsx ← /admin/edit/:id — Edit post
│   │
│   └── components/
│       ├── layout/                ← Header, Footer
│       ├── home/                  ← HeroSection, FeaturedTools
│       ├── blog/                  ← BlogCard, CategoryNav, CommentsSection
│       ├── admin/                 ← BlogTile, DashboardGrid, BlogForm
│       └── editor/                ← TiptapEditor (WYSIWYG + R2 image upload)
│
├── wrangler.toml                  ← Cloudflare Workers + R2 binding config
├── next.config.ts                 ← Next.js config (SSR, next/image domains)
├── .env.example                   ← Environment variable template
└── CLOUDFLARE_SETUP.md            ← Step-by-step Cloudflare dashboard guide
```

---

## How R2 Storage Works

All data lives in a single R2 bucket (`travellingbeku-content`):

```
travellingbeku-content/
├── posts/
│   ├── index.json              ← Fast manifest: all post metadata (no content)
│   ├── exploring-bali.json     ← Full post: title, content, image_url, etc.
│   └── a-week-in-tokyo.json
└── images/
    ├── covers/
    │   └── exploring-bali.jpg  ← Cover image uploaded via the CMS form
    └── inline/
        └── 1710856800-img.jpg  ← Images dropped into the Tiptap editor
```

- **No SQL. No migrations. No ORM.** Pure JSON + binary files.
- The `index.json` manifest is updated automatically on every create/edit/delete.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server |
| `npm run build` | Build Next.js for production |
| `npm run build:worker` | Build for Cloudflare Workers (`next build` + `opennextjs-cloudflare build`) |
| `npm run preview` | Preview the Worker locally with the real Cloudflare Workers runtime |
| `npm run deploy` | Build + deploy to Cloudflare Workers |
| `npm run cf-typegen` | Generate TypeScript types for Wrangler bindings |
| `npm run lint` | Run ESLint |

---

## Deploying to Cloudflare Workers

```bash
# 1. Log in to Cloudflare
npx wrangler login

# 2. Set all secrets (run each and paste the value when prompted)
npx wrangler secret put AUTH_SECRET
npx wrangler secret put ADMIN_USERNAME
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put R2_ACCOUNT_ID
npx wrangler secret put R2_ACCESS_KEY_ID
npx wrangler secret put R2_SECRET_ACCESS_KEY
npx wrangler secret put R2_BUCKET_NAME
npx wrangler secret put R2_PUBLIC_URL

# 3. Build and deploy
npm run deploy
```

See [`CLOUDFLARE_SETUP.md`](./CLOUDFLARE_SETUP.md) for how to create the R2 bucket and API tokens first.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, SSR) |
| Styling | Tailwind CSS v4 |
| UI Components | Lucide React icons |
| Rich Text Editor | Tiptap v3 (WYSIWYG) |
| Authentication | NextAuth.js v5 (Credentials) |
| Storage | Cloudflare R2 (S3-compatible) |
| Deployment | Cloudflare Workers (`@opennextjs/cloudflare`) |
| Language | TypeScript |

---

## License

MIT — do whatever you want with it.
