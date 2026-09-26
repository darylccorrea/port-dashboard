# 🌿 Portfolio Growth Ladder & Capital Vault

A calm, organic, zero-jargon trading desk dashboard designed for disciplined portfolio compounding, capital preservation, and real-time multi-device cloud synchronization.

Built with **Tailwind CSS**, **Vanilla JavaScript**, and **Firebase Firestore** — zero build step, zero npm dependencies, runs instantly anywhere.

---

## 🧭 Dashboard Architecture

The dashboard is structured into 4 focused tabs:

1. **Daily Tracker (Tab 1)**:
   - **Session Logger**: Live balance tracking, session stepper (Sessions 1 to 28+), and session lock mechanism to prevent accidental edits.
   - **Today's PnL & Weekly Checkpoints**: Live dollar gain, percentage gain, and 4-week milestone progress bar.
   - **Optional Daily Savings Guide**: Switchable tab in today's card calculating daily surplus to keep aside for target deadlines.
   - **3 Target Paces (Always Visible)**: Relaxed ($7K), Mid ($12.6K), and Aggressive ($17.5K) pace cards. When a daily target is hit, the card fills with full pigment color and shows a completed checkmark icon.
   - **Console Hub**: Switch between calendar heatmaps, pace projections, vault skims, and master session ledger.

2. **Capital Vault (Tab 2)**:
   - **Safe Vault Storage**: Secure surplus trading profits away from daily drawdown exposure.
   - **Floor Reserve Safeguard**: Protects your minimum operational trading desk capital.
   - **Complete Ledger History**: Audit trail of every deposit with date, amount, note, and resulting desk balance.

3. **Stats & Performance (Tab 3 — Gamified)**:
   - **Hero Level & Discipline Rank**: Progress through 5 trader ranks (*Base Camp Pioneer* → *Summit Champion*) based on session count, green streaks, and discipline score.
   - **6 Core Performance Metrics**: Green win rate %, Net profit, Vault banked, Peak single-session gain, Daily average gain, and Summit goal progress %.
   - **7 Quest Badges**: Earn achievements for First Ascent, House Money, Safety Fortress, Pace Breaker, Triple Green Streak, Halfway Ridge, and Summit Conqueror.
   - **Pace Target Mastery**: Visual breakdown of sessions hitting Aggressive, Mid, Relaxed, or Below Target.
   - **Climber's Compass**: Calm, data-driven tactical advice personalized to your win rate and momentum.

4. **Settings & Active Challenges (Tab 4)**:
   - **Active Challenge Card**: Summary of starting deposit, target goal, duration, and growth multiplier.
   - **Available Challenges**: Switch between compounding roadmap profiles with one click.
   - **Custom Challenge Generator**: Plain-English challenge creator with customizable start, target, duration, and curve pacing.
   - **Workspace Preferences**: Set your default pace aim, toggle multi-pace ledger columns, and launch cloud sync.
   - **Reset & Fresh Start**: Distinct, safe reset buttons for session progress, vault history, restoring defaults, or completely wiping prior challenges.

---

## 🔥 Step-by-Step Firebase Firestore Setup (Multi-Device Sync)

Firebase Firestore lets you sync your balances and vault history across your phone, laptop, and tablet in real time. **It is 100% free.**

### Step 1: Create a Free Firebase Project
1. Open [Firebase Console](https://console.firebase.google.com/) and sign in with your Google account.
2. Click **Create a project** (or **Add project**).
3. Name your project (e.g., `trading-portfolio-vault`).
4. Disable Google Analytics (optional, not needed for this app), then click **Create project**.

### Step 2: Create Cloud Firestore Database
1. In your Firebase dashboard, click **Build** in the left sidebar, then click **Firestore Database**.
2. Click **Create database**.
3. Choose a location closest to you (e.g., `asia-south1` (Mumbai) or `us-central1`), then click **Next**.
4. Select **Start in test mode** (or production mode) and click **Create**.

### Step 3: Configure Security Rules
1. In your Firestore Database screen, click the **Rules** tab at the top.
2. Replace the contents with the following rules:
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
3. Click **Publish**.

### Step 4: Register Web App & Get Config
1. Click the **Gear icon (⚙️ Project settings)** at the top left of the Firebase sidebar.
2. Under the **General** tab, scroll down to **Your apps** and click the Web icon (`</>`).
3. Enter an app nickname (e.g. `Portfolio App`), leave *Firebase Hosting* unchecked, and click **Register app**.
4. Firebase will show your `firebaseConfig` object. Copy just the configuration object:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abcdef..."
   };
   ```

### Step 5: Connect in the Dashboard
1. Open the dashboard in your browser.
2. Click the **Sync** button in the header (or click **Open Sync & Export** in Tab 4 Settings).
3. In the modal, ensure the **Firebase Firestore** tab is selected.
4. Paste your configuration JSON into the text box.
5. Choose or keep your **Sync Key** (default: `dcniper_portfolio`).
6. Click **Connect & Sync Across Devices**.
7. To sync on your phone or other computer, simply open the dashboard there, paste the same config and same Sync Key. Any trade or skim you record will update everywhere automatically!

---

## ⚡ Step-by-Step Vercel Deployment Guide

Because this project is a single, zero-dependency static application (`index.html`), deploying it to Vercel takes under 2 minutes.

### Method 1: Deploy via GitHub (Recommended for automatic updates)

1. **Push your code to GitHub**:
   Open PowerShell or terminal in your project directory:
   ```bash
   git add .
   git commit -m "Clean production release"
   git branch -M main
   # Create a repository on github.com, then run:
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
   - Click **Add New...** → **Project**.
   - Find and select your newly pushed repository.
   - **Framework Preset**: Select `Other` (or leave default).
   - **Build and Output Settings**: Leave completely blank / default (no build command needed).
   - Click **Deploy**.

3. **You're Live!**
   - Vercel will deploy your dashboard in ~15 seconds and provide a free HTTPS URL (e.g. `https://your-portfolio.vercel.app`).
   - Any time you push a git commit to GitHub, Vercel will automatically redeploy the latest version.

---

### Method 2: Deploy directly via Vercel CLI (No GitHub needed)

1. Open PowerShell in your project folder:
   ```bash
   npm i -g vercel
   ```
2. Run:
   ```bash
   vercel
   ```
3. Follow the on-screen prompts:
   - *Set up and deploy?* → `y`
   - *Which scope?* → (Select your Vercel account)
   - *Link to existing project?* → `n`
   - *Project name?* → `port-dashboard`
   - *Directory?* → `./`
   - *Want to modify settings?* → `n`
4. For production deployment:
   ```bash
   vercel --prod
   ```
   You will receive your live production URL instantly.

---

## 🧹 Wiping Previous Challenge Data

If you ever want to start completely fresh:
1. Go to **Tab 4: Settings & Challenges**.
2. Scroll to section 4: **Reset & Start Fresh**.
3. Click **Wipe All Previous Challenges & Data**.
4. Confirm the prompt — this will restore the pristine 28-Session Tri-Pace profile starting at Session 1 ($120.00 base), wipe any experimental challenges, and clear all vault logs. Your Firebase connection credentials will be preserved.

---

## 📁 Repository Files

```text
├── index.html                                    # Full Single-Page Application (HTML, CSS, JS)
├── vercel.json                                   # Vercel static routing and cache headers
├── firebase.json                                 # Firebase Hosting configuration
├── firestore.rules                               # Firestore security rules
├── .gitignore                                    # Git ignore specifications
├── README.md                                     # Complete setup & deployment guide
└── portfolio_growth_ladder_vault_documentation.md # Mathematical roadmap documentation
```
