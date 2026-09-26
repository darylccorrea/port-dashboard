# 🚀 Portfolio Growth Ladder & Capital Vault (Dcniper Edition)

A playful, zero-jargon trading desk dashboard designed for disciplined portfolio growth, capital security, and real-time multi-device cloud synchronization.

Built with **Tailwind CSS**, **Vanilla JavaScript**, and **Firebase Firestore** — zero build step, zero npm dependencies required.

---

## ✨ Highlights & Features

### 1. 🎯 Tab 1 — Active Tracker (Redesigned & Simplified)
- **Personalized Header**: `Welcome Dcniper 👋` with live date formatted specifically for Indian Standard Time (IST, e.g., `26th September`).
- **Closing Balance Logger**:
  - Live pulsing status indicator (`🟢 Live In Play` vs `🔒 Locked In`).
  - Session stepper (`Session 1` to `28`).
  - **Lock Mechanism**: Tap `🔒 Lock In Session` when your trading session concludes to safeguard your balance from accidental edits and trigger an instant cloud sync. Tap `🔓 Unlock to Edit` if you need to adjust numbers.
  - Quick-fill target shortcut.
- **Combined Session PnL & Weekly Milestone Progression Bar**:
  - Session gain/loss display (`+$XX.XX` / `+X.XX%`).
  - Visual 4-week milestone progress bar (Week 1, Week 2, Week 3, Week 4 checkpoints).
  - Playful pace indicator showing whether you are ahead of schedule (`🚀 +$XX ahead of target!`) or taking it easy (`🐢 -$XX behind`).
- **3 Bento Target Cards**:
  - ☕ **Relaxed Pace**: $120 ➔ $7,000 finish.
  - ⚡ **Mid Pace**: $120 ➔ $12,600 finish.
  - 🔥 **Aggressive Pace**: $120 ➔ $17,500 finish.
  - Displays remaining distance to target for the active session and allows 1-click switching of active target pace.
- **Simplified Micro-copy**: Jargon-free terminology throughout (Desk Balance, Banked Profit, Vault Skimming, True Wealth).

### 2. ☁️ Real-Time Multi-Device Sync (Firebase Firestore)
- **Instant Cross-Device Sync**: Use the dashboard seamlessly across your iPhone/Android, laptop, tablet, and desktop.
- **In-App Config Connector**: No need to hardcode API keys or rebuild code. Paste your `firebaseConfig` snippet inside the app's **Link Sheet / Cloud** modal on any device.
- **Sync Key**: Group your devices under a shared Sync Key (default: `dcniper_portfolio`).
- **Debounced Cloud Writes & Conflict-Free Updates**: Automatic background syncing whenever you update balances, lock sessions, or skim profits into the Vault.

### 3. 📊 Spreadsheet Export & Google Sheets Webhook
- **📥 1-Click Excel Export**: Downloads a clean, formatted `.csv` with UTF-8 BOM encoding for perfect Excel rendering.
- **📄 1-Click Google Sheets**: Copies table data directly to your clipboard and opens `sheets.new` so you can paste (`Ctrl+V`) immediately.
- **⚡ Google Apps Script Automation**: Full automated two-way cloud webhook script template included with 1-click copy.

---

## 🛠️ Multi-Device Firebase Firestore Setup (2 Minutes)

If you'd like your balances and vault history to stay in sync between your phone, laptop, and PC:

1. Go to the [Firebase Console](https://console.firebase.google.com/) and open your project.
2. Under **Build** in the left menu:
   - Click **Firestore Database** ➔ **Create Database** (choose any location, e.g., `asia-south1` or `us-central1`).
   - In the **Rules** tab, paste this and hit **Publish**:
     ```javascript
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write: if true;
         }
       }
     }
     ```
3. In Firebase **Project Settings** (gear icon) ➔ **General** ➔ **Your Apps**:
   - Add a Web App (`</>`).
   - Copy the `firebaseConfig` object, for example:
     ```javascript
     const firebaseConfig = {
       apiKey: "AIzaSy...",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project",
       storageBucket: "your-project.appspot.com",
       messagingSenderId: "123456789",
       appId: "1:123456789:web:abcdef"
     };
     ```
4. Open this dashboard on any browser:
   - Click the **📊 Link Sheet / Cloud** button in the top-right header.
   - Switch to the **🔥 Firebase Firestore** tab.
   - Paste the config into the box and click **🚀 Connect & Sync Across Devices**.
   - Repeat step 4 on your other devices with the same **Sync Key** (`dcniper_portfolio`) — changes on one device will instantly reflect on all other devices!

---

## 🚢 Deployment Guide

This project is a single static web application (`index.html`) with zero build dependencies. You can deploy it in less than a minute.

### Option A: Deploy to Vercel via GitHub (Recommended)

1. Push this folder to a new GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Dcniper Portfolio Dashboard"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in with GitHub.
3. Click **Add New...** ➔ **Project**.
4. Select your repository.
5. Leave all build settings at default (`Framework Preset: Other`, zero build command needed).
6. Click **Deploy**!
   Your site is now live with an HTTPS URL (e.g. `https://dcniper-portfolio.vercel.app`).

### Option B: Deploy to Firebase Hosting

1. Install Firebase CLI (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```
2. Log in and initialize:
   ```bash
   firebase login
   firebase use --add <YOUR_PROJECT_ID>
   ```
3. Deploy:
   ```bash
   firebase deploy --only hosting
   ```
   Your site will be live at `https://<YOUR_PROJECT_ID>.web.app`.

---

## 📁 Repository Structure

```text
├── index.html                                    # Full Single-Page Application (HTML, CSS, JS)
├── vercel.json                                   # Vercel static rewrites & cache rules
├── firebase.json                                 # Firebase Hosting configuration
├── firestore.rules                               # Firestore security rules
├── .gitignore                                    # Git ignore specifications
├── README.md                                     # This documentation guide
└── portfolio_growth_ladder_vault_documentation.md # Original design & mathematical specifications
```

---

## 🔒 Privacy & Data Ownership

- All data is stored primarily in your browser's local sandbox (`localStorage`).
- When Firebase is configured, data is synchronized only to your private Firestore instance.
- No third-party servers, tracking, or telemetry scripts are present.
