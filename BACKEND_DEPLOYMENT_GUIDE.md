# 🚀 CHEESE O CHEESE — Full-Stack Backend & Production Deployment Guide

Your application is now equipped with a **Complete Working Full-Stack Backend (REST API + Real-Time WebSocket Synchronization)**.

---

## 🛠️ Architecture Overview

1. **Node.js Express REST API Server** (`/server/index.js` running on `http://localhost:5050`)
   - Handles data persistence for products, menu categories, combo deals, coupons, master orders, waitstaff sales, riders, inventory, expenses, and store settings.
   - Saves all data to persistent JSON database file (`server/db.json`) or scalable SQLite / PostgreSQL.

2. **Real-Time WebSocket Engine** (`ws://localhost:5050`)
   - **Instant Live Synchronization**: Whenever any change is made on any device (e.g. adding a menu item, changing prices, taking a dine-in order, recording waiter sales, updating kitchen status), it **instantly updates all connected screens in real-time without refreshing**.

3. **Frontend Sync Connector** (`src/services/backendSync.ts`)
   - Auto-detects server connection. Optimistically updates local UI and broadcasts mutations via WebSocket & HTTP API.

---

## 🏃 Running Locally

### Step 1: Start Backend Server
In your project terminal:
```bash
cd server
npm install
npm start
```
*Output: `🚀 CHEESE O CHEESE Backend Server running on http://localhost:5050`*

### Step 2: Start Frontend Application
In another terminal window:
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** (or **[http://localhost:5174/](http://localhost:5174/)**).

---

## ☁️ How to Deploy Live to Production (Free 5-Minute Setup)

### Option A: Deploy Backend Server to Render.com (Free Node.js Hosting)

1. Go to **[Render.com](https://render.com/)** and sign up for a free account.
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub repository containing the project.
4. Set the following settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **Create Web Service**. Render will give you a live URL (e.g., `https://cheese-o-cheese-api.onrender.com`).

### Option B: Deploy Frontend to Netlify

1. Upload the production build zip file:
   [`buzz-restaurant-netlify-dist.zip`](file:///C:/Users/ikon/.gemini/antigravity/scratch/buzz-restaurant-netlify-dist.zip)
2. In Netlify Site Settings ➔ **Environment Variables**, add:
   - `VITE_API_URL` = `https://cheese-o-cheese-api.onrender.com`
   - `VITE_WS_URL` = `wss://cheese-o-cheese-api.onrender.com`

---

## 📡 Live REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/state` | Fetch complete database state |
| `POST` | `/api/sync` | Broadcast full state sync to all connected clients |
| `GET` / `POST` | `/api/products` | Read or create menu products |
| `PUT` / `DELETE` | `/api/products/:id` | Update or delete product |
| `GET` / `POST` | `/api/orders` | Read or place customer/POS orders |
| `GET` / `POST` | `/api/waiters` | Read or add waitstaff |
| `POST` | `/api/waiters/:id/sale` | Record waiter sale |

---

© 2026 CHEESE O CHEESE — All rights reserved.
