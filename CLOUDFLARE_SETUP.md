# ☁️ Cloudflare Setup Guide

> Complete step-by-step guide to configure everything in your Cloudflare dashboard
> for the TravellingBeku project. Follow the sections **in order**.

---

## What You'll Be Setting Up

| # | What | Why |
|---|---|---|
| 1 | **Cloudflare Account** | Required to use R2 and Workers |
| 2 | **R2 Bucket** | Stores all blog JSON files and images |
| 3 | **R2 Public Access** | Lets your blog load images from R2 URLs |
| 4 | **R2 API Token** | Lets the Next.js app read/write to R2 |
| 5 | **Worker Secrets** | Securely pass credentials to your deployed Worker |
| 6 | **Custom Domain** _(optional)_ | Connect your own domain |

---

## Step 1 — Create a Cloudflare Account

1. Go to [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. Sign up with your email
3. Skip the "Add a site" step — you don't need a domain for R2 or Workers

> **Find your Account ID:**
> - In the Cloudflare dashboard, look at the **right sidebar** on any page
> - You'll see a box labelled **Account ID** — copy and save this value
> - It looks like: `a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4`
> - You'll need this for the `R2_ACCOUNT_ID` environment variable

---

## Step 2 — Create the R2 Bucket

R2 is Cloudflare's S3-compatible object storage. Your blog posts (JSON) and images all live here.

1. In the Cloudflare dashboard, click **R2 Object Storage** in the left sidebar
   _(If you don't see it, go to the top-left ≡ menu → R2 Object Storage)_

2. Click **Create bucket**

3. Fill in:
   - **Bucket name:** `travellingbeku-content`
   - **Location:** Leave as default (automatic) — Cloudflare picks the closest region

4. Click **Create bucket**

You should now see your empty bucket in the list.

---

## Step 3 — Enable Public Access on the Bucket

This makes your images accessible via a public URL (so they can be displayed on your blog).

1. Click on the `travellingbeku-content` bucket to open it

2. Click the **Settings** tab

3. Scroll down to **Public access**

4. Click **Allow Access** (or toggle it on)

5. Cloudflare will generate a public URL for your bucket. It looks like:
   ```
   https://pub-a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4.r2.dev
   ```

6. **Copy this URL** — this is your `R2_PUBLIC_URL` environment variable

> **Optional — Custom Domain for R2:**
> If you have a domain (e.g. `travellingbeku.com`) and want images served from
> `https://cdn.travellingbeku.com` instead of the ugly `pub-xxx.r2.dev` URL:
> 1. Still in **Settings → Custom Domains**, click **Connect Domain**
> 2. Enter `cdn.travellingbeku.com` (or any subdomain)
> 3. Follow the DNS instructions shown
> 4. Use `https://cdn.travellingbeku.com` as your `R2_PUBLIC_URL`
> 5. Also update `next.config.ts` → `images.remotePatterns` with this hostname

---

## Step 4 — Create an R2 API Token

This gives your Next.js app permission to read and write files in R2.

1. In the Cloudflare dashboard, click **R2 Object Storage** in the left sidebar

2. Click **Manage R2 API Tokens** (top-right of the R2 page)

3. Click **Create API Token**

4. Fill in:
   - **Token name:** `travellingbeku-api`
   - **Permissions:** Select **Object Read & Write**
   - **Specify bucket(s):** Select **Only specific buckets** → choose `travellingbeku-content`
   - **TTL / Expiry:** Leave blank (no expiry) unless you want to rotate regularly

5. Click **Create API Token**

6. You'll see a one-time display of THREE values — **copy all three immediately**, they won't be shown again:

   | Value shown | Environment variable |
   |---|---|
   | **Access Key ID** | `R2_ACCESS_KEY_ID` |
   | **Secret Access Key** | `R2_SECRET_ACCESS_KEY` |
   | **Endpoint** _(ignore this)_ | _(not needed — we construct it from Account ID)_ |

> ⚠️ **Save these in a password manager.** You cannot view the Secret Access Key again after closing this page. If you lose it, you'll need to delete this token and create a new one.

---

## Step 5 — Configure CORS on the Bucket (for direct image serving)

This ensures browsers can load images from R2 without cross-origin errors.

1. Open the `travellingbeku-content` bucket → **Settings** tab

2. Scroll to **CORS Policy**

3. Click **Add CORS policy** and paste:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://travellingbeku.com",
      "https://*.travellingbeku.com"
    ],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 86400
  }
]
```

> Replace `travellingbeku.com` with your actual domain. Add `"*"` to `AllowedOrigins` temporarily during development if you run into issues, but narrow it down for production.

4. Click **Save**

---

## Step 6 — Deploy as a Cloudflare Worker

This is how the Next.js app runs in production — as a Cloudflare Worker (not on Vercel or any server).

### 6a. Install Wrangler (if not already)

```bash
# Already included in this project's devDependencies
# But to use it globally:
npm install -g wrangler
```

### 6b. Log in to Cloudflare from your terminal

```bash
npx wrangler login
```

This opens a browser window — click **Allow** to grant Wrangler access to your account.

### 6c. Verify the R2 bucket exists in Wrangler

```bash
npx wrangler r2 bucket list
```

You should see `travellingbeku-content` in the list. If not, create it via Wrangler:

```bash
npx wrangler r2 bucket create travellingbeku-content
```

### 6d. Set all secrets on the Worker

Run each command and paste the value when prompted. These are stored encrypted in Cloudflare — they are **never in your code or git history**.

```bash
# Generate AUTH_SECRET first:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

npx wrangler secret put AUTH_SECRET
# → paste the generated base64 string

npx wrangler secret put ADMIN_USERNAME
# → paste your chosen admin username

npx wrangler secret put ADMIN_PASSWORD
# → paste your chosen admin password

npx wrangler secret put R2_ACCOUNT_ID
# → paste your Cloudflare Account ID (from Step 1)

npx wrangler secret put R2_ACCESS_KEY_ID
# → paste from Step 4

npx wrangler secret put R2_SECRET_ACCESS_KEY
# → paste from Step 4

npx wrangler secret put R2_BUCKET_NAME
# → travellingbeku-content

npx wrangler secret put R2_PUBLIC_URL
# → paste your R2 public URL from Step 3 (e.g. https://pub-xxx.r2.dev)
```

### 6e. Build and deploy

```bash
npm run deploy
```

This runs:
1. `next build` — compile Next.js
2. `opennextjs-cloudflare build` — adapt for Workers runtime
3. `wrangler deploy` — push to Cloudflare

Your site will be live at: `https://travellingbeku.<your-subdomain>.workers.dev`

---

## Step 7 — Connect a Custom Domain to the Worker _(optional)_

If you own a domain and want `https://travellingbeku.com` instead of the workers.dev URL:

### If your domain's DNS is managed by Cloudflare:

1. Go to **Workers & Pages** → click your `travellingbeku` worker
2. Click **Settings** → **Domains & Routes**
3. Click **Add** → **Custom Domain**
4. Enter `travellingbeku.com` (or `www.travellingbeku.com`)
5. Click **Add Domain** — Cloudflare sets up the DNS record automatically

### If your domain is at another registrar (GoDaddy, Namecheap, etc.):

1. First add your domain to Cloudflare:
   - Dashboard → **Add a site** → enter your domain → select the **Free** plan
   - Cloudflare will show you two nameservers (e.g. `ada.ns.cloudflare.com`)
   - Go to your registrar and update the nameservers to point to Cloudflare
   - Wait 10–60 minutes for propagation
2. Then follow the steps above (your domain is now managed by Cloudflare)

---

## Step 8 — View Logs & Monitor

To see real-time logs from your deployed Worker:

```bash
npx wrangler tail
```

To check your deployed Worker's status and URL:

```bash
npx wrangler deployments list
```

To view secrets you've set (names only, not values):

```bash
npx wrangler secret list
```

---

## Summary Checklist

Use this as a quick reference once you've done the full setup:

- [ ] Cloudflare account created
- [ ] Account ID copied and saved
- [ ] R2 bucket `travellingbeku-content` created
- [ ] Public access enabled on the bucket → `R2_PUBLIC_URL` copied
- [ ] CORS policy added to the bucket
- [ ] R2 API Token created → `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` saved
- [ ] `wrangler login` run in the terminal
- [ ] All 8 secrets set via `wrangler secret put`
- [ ] `npm run deploy` succeeds
- [ ] Site accessible at `*.workers.dev` URL
- [ ] _(Optional)_ Custom domain connected

---

## Environment Variable Quick Reference

| Variable | Where to get it |
|---|---|
| `AUTH_SECRET` | Generate locally: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `ADMIN_USERNAME` | Choose any username |
| `ADMIN_PASSWORD` | Choose any strong password |
| `R2_ACCOUNT_ID` | Cloudflare Dashboard → right sidebar → **Account ID** |
| `R2_ACCESS_KEY_ID` | R2 → Manage R2 API Tokens → Create Token → **Access Key ID** |
| `R2_SECRET_ACCESS_KEY` | R2 → Manage R2 API Tokens → Create Token → **Secret Access Key** |
| `R2_BUCKET_NAME` | `travellingbeku-content` (the bucket name you created) |
| `R2_PUBLIC_URL` | R2 → your bucket → Settings → **Public access URL** |

---

## Troubleshooting

**Images not loading after deployment**
→ Check that `R2_PUBLIC_URL` is set correctly and matches the hostname in `next.config.ts` → `images.remotePatterns`

**`wrangler deploy` fails with "binding not found"**
→ Make sure the bucket name in `wrangler.toml` (`travellingbeku-content`) matches the actual bucket name in your Cloudflare dashboard

**Admin login fails on the deployed site**
→ Check that `ADMIN_USERNAME` and `ADMIN_PASSWORD` secrets are set: `npx wrangler secret list`
→ Check that `AUTH_SECRET` is set — without it NextAuth.js cannot create sessions

**Worker deployment succeeds but site shows errors**
→ Run `npx wrangler tail` and check the real-time error logs while visiting the page

**R2 write fails (images not uploading)**
→ Verify the API token has **Object Read & Write** permission on `travellingbeku-content`
→ Verify `R2_ACCOUNT_ID` is correct — it must match the account that owns the bucket
