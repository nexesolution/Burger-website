# 🍔 BUZZ BURGER — Supabase + Netlify Deployment Guide

Follow this simple **3-step guide** to connect your live website hosted on **Netlify** with your cloud database on **Supabase** so every change updates everywhere across all devices in real-time!

---

## 📌 Files Required for Deployment

| Service | File to Deploy / Upload | Location in Project |
| :--- | :--- | :--- |
| **Supabase (Database)** | [`supabase_schema.sql`](file:///C:/Users/ikon/.gemini/antigravity/scratch/buzz-restaurant/supabase_schema.sql) | `supabase_schema.sql` (Root Folder) |
| **Netlify (Website)** | [`buzz-restaurant-netlify-dist.zip`](file:///C:/Users/ikon/.gemini/antigravity/scratch/buzz-restaurant-netlify-dist.zip) | `C:\Users\ikon\.gemini\antigravity\scratch\` |

---

## ⚡ STEP 1: Set Up Supabase Cloud Database (2 Minutes)

1. Go to **[https://supabase.com/](https://supabase.com/)** and sign in (or create a free account).
2. Click **New Project** ➔ Name it **BUZZ BURGER POS** ➔ Set Database Password ➔ Click **Create New Project**.
3. Once created, click on **SQL Editor** on the left menu bar.
4. Open the file [`supabase_schema.sql`](file:///C:/Users/ikon/.gemini/antigravity/scratch/buzz-restaurant/supabase_schema.sql) in your code editor, copy all contents, paste it into the Supabase SQL Editor, and click **RUN**.
   *(This creates all tables: products, orders, waiters, riders, inventory, expenses, deals, coupons, and store settings with Realtime Sync enabled!)*
5. Click on **Project Settings** ➔ **API** (in the bottom left menu):
   - Copy **Project URL** (e.g. `https://xyzpdq.supabase.co`)
   - Copy **anon / public key** (e.g. `eyJh...`)

---

## 🚀 STEP 2: Deploy Website to Netlify (1 Minute)

1. Go to **[https://app.netlify.com/drop](https://app.netlify.com/drop)** in your browser.
2. Drag and drop the zip file [`buzz-restaurant-netlify-dist.zip`](file:///C:/Users/ikon/.gemini/antigravity/scratch/buzz-restaurant-netlify-dist.zip).
3. Netlify will immediately deploy your live site!

---

## 🔗 STEP 3: Connect Netlify to Supabase for Worldwide Live Sync

1. In your Netlify dashboard, click on your site ➔ Go to **Site Configuration** ➔ **Environment Variables**.
2. Click **Add a variable** and add the following two keys:
   - `VITE_SUPABASE_URL` = *(Your Supabase Project URL from Step 1)*
   - `VITE_SUPABASE_ANON_KEY` = *(Your Supabase Anon Key from Step 1)*
3. Click **Save** and trigger a **Re-deploy** (or re-upload the zip).

---

### 🎉 Done!
Now whenever you or your team make any changes on the website or POS terminal:
- Adding/editing menu items or prices
- Taking Dine-in / Takeaway / Delivery orders
- Recording waiter sales
- Updating store settings or discounts

**It immediately syncs everywhere in real-time across all mobile phones, tablets, and laptops worldwide!**
