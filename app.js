/**
 * Portfolio Growth Ladder & Capital Vault System
 * Core Application Engine & Functional Implementation
 * Master Function Spec v10 Compliance
 */

// ==========================================
// 1. STORAGE KEYS & CONSTANTS
// ==========================================
const STORAGE_KEYS = {
  PROFILES: 'pgl_ladder_profiles_v10',
  ACTIVE_PROFILE: 'pgl_active_profile_v10',
  SESSION: 'pgl_session_v10',
  LOGS: 'pgl_logs_v10',
  LOCKED_SESSIONS: 'pgl_locked_sessions_v10',
  NOTES: 'pgl_notes_v10',
  TIMESTAMPS: 'pgl_timestamps_v10',
  PACE: 'pgl_pace_v10',
  PLAN_VIEW_MODE: 'pgl_plan_view_mode_v10',
  VAULT_LEDGER: 'pgl_vault_ledger_v10',
  MILESTONE_CFG: 'pgl_milestone_cfg_v10',
  MILESTONE_ENABLED: 'pgl_milestone_enabled_v10',
  SKIM_MODE: 'pgl_skim_mode_v10',
  BILLS_BREAKDOWN: 'pgl_bills_breakdown_v10',
  BILLS_BASIS: 'pgl_bills_basis_v10',
  TRADE_LOGS: 'pgl_trade_logs_v10',
  SYNC_KEY: 'pgl_sync_key_v10',
  WEBHOOK_URL: 'pgl_webhook_url_v10',
  FIREBASE_CFG: 'pgl_firebase_cfg_v10',
  LAST_SYNCED: 'pgl_last_synced_v10',
  SPREADSHEET_ID: 'pgl_spreadsheet_id_v10',
  SPREADSHEET_URL: 'pgl_spreadsheet_url_v10',
  FOLDER_ID: 'pgl_folder_id_v10',
};

// Built-in Firebase Project Configuration (Zero-configuration live cloud sync)
const BUILTIN_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDv3bRZGKMAyew6iuascU4l2V7TqarHZdI",
  authDomain: "port-growth-tracker.firebaseapp.com",
  projectId: "port-growth-tracker",
  storageBucket: "port-growth-tracker.firebasestorage.app",
  messagingSenderId: "845323309196",
  appId: "1:845323309196:web:14f21bdc4cb7d961066ba9"
};

// ==========================================
// 2. MATHEMATICAL & ALGORITHMIC ENGINES
// ==========================================

/**
 * Tri-Pace Independent Ladder Generator (Section 3.2.A)
 * Generates three concurrent compounding paths across N sessions:
 * Relaxed (to T), Mid (to 1.8*T), Aggressive (to 2.5*T)
 */
function generateIndependentTriPaceLadder(base, target, totalSessions) {
  const N = Math.max(2, parseInt(totalSessions) || 2);
  const C0 = Math.max(0.01, parseFloat(base) || 0.01);
  const T = Math.max(C0, parseFloat(target) || C0);
  if (N === 2) return calculateSmoothSeries(C0, T, N);
  const K = Math.min(N - 1, Math.max(1, Math.round(N * 0.25)));

  const T_rel = T;
  const T_mid = Math.round(T * 1.8);
  const T_agg = Math.round(T * 2.5);

  // Checkpoints at session K: ensure strictly greater than base C0 and properly paced toward T
  const smoothK_rel = C0 * Math.pow(T_rel / C0, K / N);
  const smoothK_mid = C0 * Math.pow(T_mid / C0, K / N);
  const smoothK_agg = C0 * Math.pow(T_agg / C0, K / N);

  const Ck_rel = Math.min(T_rel * 0.95, Math.max(Math.round(smoothK_rel), Math.round(T * 0.10), Math.round(C0 * 1.05)));
  const Ck_mid = Math.min(T_mid * 0.95, Math.max(Math.round(smoothK_mid), Math.round(T * 0.18), Math.round(C0 * 1.10)));
  const Ck_agg = Math.min(T_agg * 0.95, Math.max(Math.round(smoothK_agg), Math.round(T * 0.25), Math.round(C0 * 1.15)));

  const r1_rel = Math.pow(Ck_rel / C0, 1 / K);
  const r1_mid = Math.pow(Ck_mid / C0, 1 / K);
  const r1_agg = Math.pow(Ck_agg / C0, 1 / K);

  const r2_rel = Math.pow(T_rel / Ck_rel, 1 / (N - K));
  const r2_mid = Math.pow(T_mid / Ck_mid, 1 / (N - K));
  const r2_agg = Math.pow(T_agg / Ck_agg, 1 / (N - K));

  const sessions = [];
  for (let s = 1; s <= N; s++) {
    let bal_rel, bal_mid, bal_agg;
    if (s <= K) {
      bal_rel = C0 * Math.pow(r1_rel, s);
      bal_mid = C0 * Math.pow(r1_mid, s);
      bal_agg = C0 * Math.pow(r1_agg, s);
    } else {
      bal_rel = Ck_rel * Math.pow(r2_rel, s - K);
      bal_mid = Ck_mid * Math.pow(r2_mid, s - K);
      bal_agg = Ck_agg * Math.pow(r2_agg, s - K);
    }

    let tag = '';
    if (s === 1) tag = 'Outpost Camp';
    else if (s === K) tag = `Checkpoint K (${Math.round((K / N) * 100)}%)`;
    else if (s === N) tag = 'Trove Target';
    else if (s % 7 === 0) tag = `Week ${s / 7} Checkpoint`;

    sessions.push({
      s,
      r: Math.round(bal_rel * 100) / 100,
      m: Math.round(bal_mid * 100) / 100,
      a: Math.round(bal_agg * 100) / 100,
      target: Math.round(bal_rel * 100) / 100,
      tag
    });
  }
  return sessions;
}

/**
 * Smooth Exponential Compounding (Section 3.2.B)
 */
function calculateSmoothSeries(base, target, totalSessions) {
  const N = Math.max(2, parseInt(totalSessions) || 2);
  const C0 = Math.max(0.01, parseFloat(base) || 0.01);
  const T = Math.max(C0, parseFloat(target) || C0);
  const sessions = [];
  for (let s = 1; s <= N; s++) {
    const f = s / N;
    const r = C0 * Math.pow(T / C0, f);
    const m = C0 * Math.pow((T * 1.8) / C0, f);
    const a = C0 * Math.pow((T * 2.5) / C0, f);
    sessions.push({
      s,
      r: Math.round(r * 100) / 100,
      m: Math.round(m * 100) / 100,
      a: Math.round(a * 100) / 100,
      target: Math.round(r * 100) / 100,
      tag: s === 1 ? 'Outpost Camp' : (s === N ? 'Trove Target' : (s % 7 === 0 ? `Week ${s / 7}` : ''))
    });
  }
  return sessions;
}

/**
 * Front-Loaded Decay Compounding (Section 3.2.C)
 */
function calculateDecaySeries(base, target, totalSessions) {
  const N = Math.max(2, parseInt(totalSessions) || 2);
  const C0 = Math.max(0.01, parseFloat(base) || 0.01);
  const T = Math.max(C0, parseFloat(target) || C0);
  const sessions = [];
  for (let s = 1; s <= N; s++) {
    const f = Math.pow(s / N, 0.75);
    const r = C0 * Math.pow(T / C0, f);
    const m = C0 * Math.pow((T * 1.8) / C0, f);
    const a = C0 * Math.pow((T * 2.5) / C0, f);
    sessions.push({
      s,
      r: Math.round(r * 100) / 100,
      m: Math.round(m * 100) / 100,
      a: Math.round(a * 100) / 100,
      target: Math.round(r * 100) / 100,
      tag: s === 1 ? 'Outpost Camp' : (s === N ? 'Trove Target' : (s % 7 === 0 ? `Week ${s / 7}` : ''))
    });
  }
  return sessions;
}

/**
 * Portfolio Target with Scheduled Cash-Out (Section 3.2.D)
 */
function calculatePortTargetWithdrawal(base, target, totalSessions, withdrawalTarget, withdrawalDays) {
  const N = Math.max(2, parseInt(totalSessions) || 2);
  const C0 = Math.max(0.01, parseFloat(base) || 0.01);
  const T = Math.max(C0, parseFloat(target) || C0);
  const Dwith = Math.min(N, Math.max(1, parseInt(withdrawalDays) || N));
  const Wtarget = Math.max(0, parseFloat(withdrawalTarget) || 0);

  const sessions = [];
  for (let s = 1; s <= N; s++) {
    const deskTarget = C0 * Math.pow(T / C0, s / N);
    let withdrawalGoal = 0;
    if (s <= Dwith) {
      withdrawalGoal = Wtarget * (s / Dwith);
    } else {
      withdrawalGoal = Wtarget;
    }
    const totalTarget = deskTarget + withdrawalGoal;
    sessions.push({
      s,
      deskTarget: Math.round(deskTarget * 100) / 100,
      withdrawalGoal: Math.round(withdrawalGoal * 100) / 100,
      r: Math.round(totalTarget * 100) / 100,
      m: Math.round((deskTarget * 1.8 + withdrawalGoal) * 100) / 100,
      a: Math.round((deskTarget * 2.5 + withdrawalGoal) * 100) / 100,
      target: Math.round(totalTarget * 100) / 100,
      tag: s === 1 ? 'Outpost Camp' : (s === N ? 'Trove Target' : (s === Dwith ? 'Cash-Out Completed' : ''))
    });
  }
  return sessions;
}

/**
 * Central curve dispatcher
 */
function generateRoadmapSessions(curveType, base, target, totalSessions, withdrawalTarget, withdrawalDays) {
  switch (curveType) {
    case 'smooth':
      return calculateSmoothSeries(base, target, totalSessions);
    case 'decay':
      return calculateDecaySeries(base, target, totalSessions);
    case 'port_target_withdrawal':
      return calculatePortTargetWithdrawal(base, target, totalSessions, withdrawalTarget, withdrawalDays);
    case 'tri_pace_independent':
    default:
      return generateIndependentTriPaceLadder(base, target, totalSessions);
  }
}

/**
 * Rebased Recovery Engine (Section 3.3)
 */
function calculateRebasedPlan(currentSession, currentBal, finalTarget, totalSessions) {
  const s = currentSession;
  const N = totalSessions;
  const Bs = Math.max(1, currentBal);
  const T = Math.max(Bs, finalTarget);

  if (s >= N) {
    return { requiredRate: 0, sessions: {} };
  }

  const remainingSessions = N - s;
  const requiredRate = Math.pow(T / Bs, 1 / remainingSessions) - 1;

  const rebasedMap = {};
  for (let i = s; i <= N; i++) {
    const val = Bs * Math.pow(T / Bs, (i - s) / remainingSessions);
    rebasedMap[i] = Math.round(val * 100) / 100;
  }
  return { requiredRate, rebasedMap };
}

/**
 * Automated Realized Profit Allocation Preview (Section 3.4)
 */
function calculateProfitAllocationPreview(dailyProfit, bills, reserveFloor, deskBalance) {
  if (dailyProfit <= 0) return null;

  // Unfunded bills liability check
  const unpaidBillsRemaining = bills
    .filter(b => b.status !== 'paid')
    .reduce((sum, b) => sum + Math.max(0, b.amountDue - (b.amountReserved || 0)), 0);

  const phase = unpaidBillsRemaining > 0 ? 1 : 2;
  let allocBills = 0;
  let allocDesk = 0;
  let allocSavings = 0;

  if (phase === 1) {
    allocBills = dailyProfit * 0.70;
    allocDesk = dailyProfit * 0.20;
    allocSavings = dailyProfit * 0.10;

    // Overflow redistribution
    if (allocBills > unpaidBillsRemaining) {
      const overflow = allocBills - unpaidBillsRemaining;
      allocBills = unpaidBillsRemaining;
      allocDesk += 0.60 * overflow;
      allocSavings += 0.40 * overflow;
    }
  } else {
    allocDesk = dailyProfit * 0.45;
    allocSavings = dailyProfit * 0.35;
    allocBills = dailyProfit * 0.20;
  }

  const totalSkim = allocBills + allocSavings;
  const postDeskBalance = deskBalance - totalSkim;
  const floorViolated = postDeskBalance < (reserveFloor || 0);

  return {
    phase,
    unpaidBillsRemaining: Math.round(unpaidBillsRemaining * 100) / 100,
    allocBills: Math.round(allocBills * 100) / 100,
    allocDesk: Math.round(allocDesk * 100) / 100,
    allocSavings: Math.round(allocSavings * 100) / 100,
    totalSkim: Math.round(totalSkim * 100) / 100,
    postDeskBalance: Math.round(postDeskBalance * 100) / 100,
    floorViolated
  };
}

/**
 * Total Financial Goal (Section 3.5)
 */
function calculateTotalFinancialGoal(profile, activeDeskBalance, vaultLedger, bills, milestoneCfg) {
  // 1. Trading Component
  const tradingTarget = profile ? Math.max(0, Number(profile.portTarget) || 0) : 0;
  const tradingAchieved = Math.min(tradingTarget, Math.max(0, activeDeskBalance));
  const tradingRemaining = Math.max(0, tradingTarget - activeDeskBalance);

  // 2. Savings Component
  let savingsTarget = 0;
  if (milestoneCfg && Number(milestoneCfg.savingsGoal) > 0 && Number(milestoneCfg.savingsGoal) !== 5000) {
    savingsTarget = Number(milestoneCfg.savingsGoal);
  } else if (profile && Number(profile.withdrawalTarget) > 0) {
    savingsTarget = Number(profile.withdrawalTarget);
  }
  const savingsBalance = vaultLedger
    .filter(r => r.bucket === 'savings')
    .reduce((sum, r) => sum + (r.bucket === 'savings' ? Math.max(0, Number(r.amount) || 0) : 0), 0);
  const savingsAchieved = savingsTarget > 0 ? Math.min(savingsTarget, Math.max(0, savingsBalance)) : savingsBalance;
  const savingsRemaining = Math.max(0, savingsTarget - savingsBalance);

  // 3. Bills Component
  const billsTarget = bills.reduce((sum, b) => sum + Math.max(0, Number(b.amountDue) || 0), 0);
  const billsAchieved = bills.reduce((sum, b) => {
    if (b.status === 'paid') return sum + Math.max(0, Number(b.amountDue) || 0);
    return sum + Math.min(Math.max(0, Number(b.amountDue) || 0), Math.max(0, Number(b.amountReserved) || 0));
  }, 0);
  const billsRemaining = Math.max(0, billsTarget - billsAchieved);

  const totalTarget = tradingTarget + savingsTarget + billsTarget;
  const totalAchieved = tradingAchieved + savingsAchieved + billsAchieved;
  const progressPercent = totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0;

  return {
    trading: { target: tradingTarget, achieved: tradingAchieved, remaining: tradingRemaining },
    savings: { target: savingsTarget, achieved: savingsAchieved, remaining: savingsRemaining, current: savingsBalance },
    bills: { target: billsTarget, achieved: billsAchieved, remaining: billsRemaining },
    total: { target: totalTarget, achieved: totalAchieved, progressPercent }
  };
}

// ==========================================
// 3. GLOBAL APPLICATION STATE
// ==========================================

const DEFAULT_PROFILE = {
  id: 'challenge_1',
  name: '28-Day Challenge',
  base: 100,
  portTarget: 7000,
  targetBalance: 7000,
  totalSessions: 28,
  startDate: new Date().toISOString().split('T')[0],
  curveType: 'tri_pace_independent',
  withdrawalTarget: 0,
  withdrawalDays: 28,
  skimMode: false,
  sessions: generateIndependentTriPaceLadder(100, 7000, 28)
};

const appState = {
  profiles: [],
  activeProfileId: null,
  activeSession: 1,
  logs: {},
  lockedSessions: {},
  notes: {},
  timestamps: {},
  pace: 'relaxed',
  planViewMode: 'original',
  vaultLedger: [],
  milestoneCfg: {
    savingsGoal: 0,
    deadline: '',
    reserveFloor: 100,
    strategy: 'gradual'
  },
  milestoneEnabled: false,
  skimMode: false,
  bills: [],
  billsBasis: 'days',
  tradeLogs: [],
  // Cloud & Firebase sync state
  syncKey: '',
  webhookUrl: '',
  firebaseCfg: JSON.stringify(BUILTIN_FIREBASE_CONFIG, null, 2),
  currentUser: null,
  cloudStatus: 'offline', // 'offline' | 'connecting' | 'online' | 'syncing' | 'error'
  lastSyncedAt: null,
  spreadsheetId: '',
  spreadsheetUrl: '',
  folderId: '',
  googleAccessToken: null,
};

// Calendar navigation state
let calendarViewYear = new Date().getFullYear();
let calendarViewMonth = new Date().getMonth();

let setupNewProfileDraft = true;

// Cloud synchronization runtime state
let cloudSyncTimeout = null;
let sheetSyncTimeout = null;
let firestoreDb = null;
let firestoreUnsubscribe = null;
let firebaseAuthUnsubscribe = null;
let isApplyingRemoteSync = false;

// ==========================================
// 4. STATE PERSISTENCE & LOAD ENGINE
// ==========================================

function loadStateFromStorage() {
  try {
    // One-time clean fresh start migration for production release with 0 default challenges
    const CLEAN_SLATE_KEY = 'trove_clean_slate_2026_zero_challenges_v2';
    if (localStorage.getItem(CLEAN_SLATE_KEY) !== 'done') {
      const keysToReset = [
        STORAGE_KEYS.PROFILES,
        STORAGE_KEYS.ACTIVE_PROFILE,
        STORAGE_KEYS.SESSION,
        STORAGE_KEYS.LOGS,
        STORAGE_KEYS.LOCKED_SESSIONS,
        STORAGE_KEYS.NOTES,
        STORAGE_KEYS.TIMESTAMPS,
        STORAGE_KEYS.PACE,
        STORAGE_KEYS.VAULT_LEDGER,
        STORAGE_KEYS.TRADE_LOGS,
        STORAGE_KEYS.BILLS_BREAKDOWN,
        STORAGE_KEYS.MILESTONE_CFG,
        STORAGE_KEYS.MILESTONE_ENABLED
      ];
      keysToReset.forEach(k => localStorage.removeItem(k));
      localStorage.setItem(CLEAN_SLATE_KEY, 'done');
    }

    const rawProfiles = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (rawProfiles) {
      try {
        const parsed = JSON.parse(rawProfiles);
        appState.profiles = Array.isArray(parsed) ? parsed : [];
        let profilesMigrated = false;
        appState.profiles.forEach(p => {
          if (p && p.base > 0 && (p.portTarget || p.targetBalance) > p.base) {
            if (!p.sessions || !p.sessions.length || p.sessions[0].r <= p.base) {
              p.sessions = generateRoadmapSessions(
                p.curveType || 'tri_pace_independent',
                p.base,
                p.portTarget || p.targetBalance,
                p.totalSessions,
                p.withdrawalTarget,
                p.withdrawalDays
              );
              profilesMigrated = true;
            }
          }
        });
        if (profilesMigrated) {
          localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(appState.profiles));
        }
      } catch (e) {
        appState.profiles = [];
      }
    } else {
      appState.profiles = [];
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(appState.profiles));
    }

    const savedActive = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE);
    if (savedActive && appState.profiles.some(p => p.id === savedActive)) {
      appState.activeProfileId = savedActive;
    } else {
      appState.activeProfileId = appState.profiles[0]?.id || null;
    }

    appState.activeSession = parseInt(localStorage.getItem(STORAGE_KEYS.SESSION)) || 1;
    appState.logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '{}');
    appState.lockedSessions = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCKED_SESSIONS) || '{}');
    appState.notes = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES) || '{}');
    appState.timestamps = JSON.parse(localStorage.getItem(STORAGE_KEYS.TIMESTAMPS) || '{}');
    appState.pace = localStorage.getItem(STORAGE_KEYS.PACE) || 'relaxed';
    appState.planViewMode = localStorage.getItem(STORAGE_KEYS.PLAN_VIEW_MODE) || 'original';
    appState.vaultLedger = JSON.parse(localStorage.getItem(STORAGE_KEYS.VAULT_LEDGER) || '[]');
    appState.milestoneCfg = JSON.parse(localStorage.getItem(STORAGE_KEYS.MILESTONE_CFG) || '{"savingsGoal":0,"deadline":"","reserveFloor":100,"strategy":"gradual"}');
    if (appState.milestoneCfg && appState.milestoneCfg.savingsGoal === 5000) {
      appState.milestoneCfg.savingsGoal = 0;
      localStorage.setItem(STORAGE_KEYS.MILESTONE_CFG, JSON.stringify(appState.milestoneCfg));
    }
    appState.milestoneEnabled = localStorage.getItem(STORAGE_KEYS.MILESTONE_ENABLED) === 'true';
    appState.skimMode = localStorage.getItem(STORAGE_KEYS.SKIM_MODE) === 'true';
    appState.bills = JSON.parse(localStorage.getItem(STORAGE_KEYS.BILLS_BREAKDOWN) || '[]');
    appState.billsBasis = localStorage.getItem(STORAGE_KEYS.BILLS_BASIS) || 'days';
    appState.tradeLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRADE_LOGS) || '[]');
    appState.syncKey = localStorage.getItem(STORAGE_KEYS.SYNC_KEY) || '';
    appState.webhookUrl = localStorage.getItem(STORAGE_KEYS.WEBHOOK_URL) || '';
    appState.firebaseCfg = localStorage.getItem(STORAGE_KEYS.FIREBASE_CFG) || JSON.stringify(BUILTIN_FIREBASE_CONFIG, null, 2);
    appState.lastSyncedAt = localStorage.getItem(STORAGE_KEYS.LAST_SYNCED) || null;
    appState.spreadsheetId = localStorage.getItem(STORAGE_KEYS.SPREADSHEET_ID) || '';
    appState.spreadsheetUrl = localStorage.getItem(STORAGE_KEYS.SPREADSHEET_URL) || '';
    appState.folderId = localStorage.getItem(STORAGE_KEYS.FOLDER_ID) || '';

    // Verify active profile exists
    if (!getActiveProfile()) {
      appState.activeProfileId = appState.profiles[0]?.id || null;
    }
  } catch (err) {
    console.error('Error loading state from storage, resetting safely:', err);
  }
}

function saveStateToStorage(skipCloudSync = false) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(appState.profiles));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE, appState.activeProfileId || '');
    localStorage.setItem(STORAGE_KEYS.SESSION, appState.activeSession.toString());
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(appState.logs));
    localStorage.setItem(STORAGE_KEYS.LOCKED_SESSIONS, JSON.stringify(appState.lockedSessions));
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(appState.notes));
    localStorage.setItem(STORAGE_KEYS.TIMESTAMPS, JSON.stringify(appState.timestamps));
    localStorage.setItem(STORAGE_KEYS.PACE, appState.pace);
    localStorage.setItem(STORAGE_KEYS.PLAN_VIEW_MODE, appState.planViewMode);
    localStorage.setItem(STORAGE_KEYS.VAULT_LEDGER, JSON.stringify(appState.vaultLedger));
    localStorage.setItem(STORAGE_KEYS.MILESTONE_CFG, JSON.stringify(appState.milestoneCfg));
    localStorage.setItem(STORAGE_KEYS.MILESTONE_ENABLED, appState.milestoneEnabled.toString());
    localStorage.setItem(STORAGE_KEYS.SKIM_MODE, appState.skimMode.toString());
    localStorage.setItem(STORAGE_KEYS.BILLS_BREAKDOWN, JSON.stringify(appState.bills));
    localStorage.setItem(STORAGE_KEYS.BILLS_BASIS, appState.billsBasis);
    localStorage.setItem(STORAGE_KEYS.TRADE_LOGS, JSON.stringify(appState.tradeLogs));
    localStorage.setItem(STORAGE_KEYS.SYNC_KEY, appState.syncKey || '');
    localStorage.setItem(STORAGE_KEYS.WEBHOOK_URL, appState.webhookUrl || '');
    localStorage.setItem(STORAGE_KEYS.FIREBASE_CFG, appState.firebaseCfg || '');
    localStorage.setItem(STORAGE_KEYS.SPREADSHEET_ID, appState.spreadsheetId || '');
    localStorage.setItem(STORAGE_KEYS.SPREADSHEET_URL, appState.spreadsheetUrl || '');
    localStorage.setItem(STORAGE_KEYS.FOLDER_ID, appState.folderId || '');
    if (appState.lastSyncedAt) {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNCED, appState.lastSyncedAt);
    }

    if (!skipCloudSync && !isApplyingRemoteSync) {
      debounceCloudSync();
      debounceSheetSync();
    }
  } catch (err) {
    console.error('Error saving state to storage:', err);
  }
}

// ==========================================
// 5. HELPER DATA RESOLVERS
// ==========================================

function getActiveProfile() {
  if (!appState.profiles || appState.profiles.length === 0) return null;
  return appState.profiles.find(p => p.id === appState.activeProfileId) || appState.profiles[0] || null;
}

/**
 * Defensive Balance Resolvers (Section 3.1 & 7.1)
 */
function getCurrentDeskBalance(sessionIndex) {
  const profile = getActiveProfile();
  const s = sessionIndex || appState.activeSession;

  if (appState.logs[s] !== undefined && appState.logs[s] !== null) {
    return parseFloat(appState.logs[s]);
  }

  // Walk backward to find the highest logged session < s
  for (let k = s - 1; k >= 1; k--) {
    if (appState.logs[k] !== undefined && appState.logs[k] !== null) {
      return parseFloat(appState.logs[k]);
    }
  }

  return profile ? profile.base : 0;
}

function getPreviousDeskBalance(sessionIndex) {
  const profile = getActiveProfile();
  const s = sessionIndex || appState.activeSession;

  if (s <= 1) {
    return profile ? profile.base : 0;
  }

  // Walk backward to find highest logged session < s
  for (let k = s - 1; k >= 1; k--) {
    if (appState.logs[k] !== undefined && appState.logs[k] !== null) {
      return parseFloat(appState.logs[k]);
    }
  }

  return profile ? profile.base : 100;
}

function getSessionVaultSkims(sessionIndex) {
  const s = sessionIndex || appState.activeSession;
  return appState.vaultLedger
    .filter(r => r.session === s && r.amount > 0)
    .reduce((sum, r) => sum + r.amount, 0);
}

function getNormalizedDailyPnL(sessionIndex) {
  const s = sessionIndex || appState.activeSession;
  if (appState.logs[s] === undefined || appState.logs[s] === null) {
    return 0; // Awaiting entry
  }
  const Bs = parseFloat(appState.logs[s]);
  const Ws = getSessionVaultSkims(s);
  const Bs_prev = getPreviousDeskBalance(s);
  return (Bs + Ws) - Bs_prev;
}

function getSessionReturnPct(sessionIndex) {
  const s = sessionIndex || appState.activeSession;
  if (appState.logs[s] === undefined || appState.logs[s] === null) {
    return 0;
  }
  const pnl = getNormalizedDailyPnL(s);
  const prevBal = getPreviousDeskBalance(s);
  return prevBal > 0 ? (pnl / prevBal) * 100 : 0;
}

function getVaultTotalBalance() {
  return appState.vaultLedger.reduce((sum, r) => sum + r.amount, 0);
}

function getVaultSavingsBalance() {
  return appState.vaultLedger
    .filter(r => r.bucket === 'savings')
    .reduce((sum, r) => sum + r.amount, 0);
}

function getVaultBillsReserved() {
  return appState.bills.reduce((sum, b) => sum + (b.amountReserved || 0), 0);
}

function getTrueTotalWealth() {
  const activeBal = getCurrentDeskBalance();
  return activeBal + getVaultTotalBalance();
}

function getStreakCount() {
  let streak = 0;
  const profile = getActiveProfile();
  const maxSession = profile ? profile.totalSessions : 0;
  if (maxSession === 0) return 0;

  // Find all logged sessions in ascending order
  const logged = [];
  for (let s = 1; s <= maxSession; s++) {
    if (appState.logs[s] !== undefined && appState.logs[s] !== null) {
      logged.push(s);
    }
  }

  // Walk backward from the latest logged session
  for (let i = logged.length - 1; i >= 0; i--) {
    const s = logged[i];
    const pnl = getNormalizedDailyPnL(s);
    if (pnl >= 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function formatCurrency(val) {
  const num = parseFloat(val) || 0;
  return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatCurrencyPnL(val) {
  const num = parseFloat(val) || 0;
  const prefix = num >= 0 ? '+$' : '-$';
  return prefix + Math.abs(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPercent(val) {
  const num = parseFloat(val) || 0;
  const prefix = num >= 0 ? '+' : '';
  return prefix + num.toFixed(2) + '%';
}

function getDateForSession(startDateStr, sessionNum) {
  try {
    const baseDate = new Date(startDateStr || new Date());
    baseDate.setDate(baseDate.getDate() + (sessionNum - 1));
    return baseDate.toISOString().split('T')[0];
  } catch {
    return '2026-10-02';
  }
}

// ==========================================
// 6. UI RENDERING & COMPONENT MANAGERS
// ==========================================

/**
 * Top Position Bar & Header
 */
function renderHeaderAndTopBar() {
  const profile = getActiveProfile();
  const currentBal = getCurrentDeskBalance();
  const startBal = profile ? profile.base : 0;
  const s = appState.activeSession;

  // Header profile name
  const headerName = document.getElementById('headerProfileName');
  if (headerName) headerName.textContent = profile ? profile.name : 'No active challenge';

  // Top Position Bar Elements
  const elCurrentBal = document.getElementById('posCurrentBal');
  const elStartBal = document.getElementById('posStartBal');
  const elTodayPnL = document.getElementById('posTodayPnL');
  const elTodayReturn = document.getElementById('posTodayReturn');
  const elOverallPnL = document.getElementById('posOverallPnL');
  const elOverallReturn = document.getElementById('posOverallReturn');
  const elOverallTarget = document.getElementById('posOverallTarget');
  const elStreakCount = document.getElementById('posStreakCount');

  if (elCurrentBal) elCurrentBal.textContent = formatCurrency(currentBal);
  if (elStartBal) elStartBal.textContent = profile ? formatCurrency(startBal) : '—';

  if (profile && appState.logs[s] !== undefined && appState.logs[s] !== null) {
    const pnl = getNormalizedDailyPnL(s);
    const ret = getSessionReturnPct(s);
    if (elTodayPnL) {
      elTodayPnL.textContent = formatCurrencyPnL(pnl);
      elTodayPnL.className = `text-base sm:text-lg font-bold font-num ${pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`;
    }
    if (elTodayReturn) {
      elTodayReturn.textContent = formatPercent(ret);
      elTodayReturn.className = `text-base sm:text-lg font-bold font-num ${ret >= 0 ? 'text-emerald-600' : 'text-red-600'}`;
    }
  } else {
    if (elTodayPnL) {
      elTodayPnL.textContent = '+$0.00';
      elTodayPnL.className = 'text-base sm:text-lg font-bold font-num text-slate-400';
    }
    if (elTodayReturn) {
      elTodayReturn.textContent = '+0.00%';
      elTodayReturn.className = 'text-base sm:text-lg font-bold font-num text-slate-400';
    }
  }

  const totalWealth = getTrueTotalWealth();
  const overallPnL = profile ? (totalWealth - startBal) : 0;
  const overallReturn = (profile && startBal > 0) ? (overallPnL / startBal) * 100 : 0;

  if (elOverallPnL) {
    elOverallPnL.textContent = profile ? formatCurrencyPnL(overallPnL) : '+$0.00';
    elOverallPnL.className = `text-base sm:text-lg font-bold font-num ${overallPnL >= 0 ? 'text-emerald-600' : 'text-red-600'}`;
  }
  if (elOverallReturn) {
    elOverallReturn.textContent = profile ? formatPercent(overallReturn) : '+0.00%';
    elOverallReturn.className = `text-base sm:text-lg font-bold font-num ${overallReturn >= 0 ? 'text-emerald-600' : 'text-red-600'}`;
  }
  if (elOverallTarget) {
    elOverallTarget.textContent = profile ? formatCurrency(profile.portTarget) : '—';
  }
  const goalProgress = (profile && profile.portTarget > 0) ? Math.min(100, Math.max(0, (currentBal / profile.portTarget) * 100)) : 0;
  const goalPctEl = document.getElementById('dailyTargetProgress');
  const goalFillEl = document.getElementById('dailyTargetFill');
  if (goalPctEl) goalPctEl.textContent = `${goalProgress.toFixed(1)}%`;
  if (goalFillEl) goalFillEl.style.width = `${goalProgress}%`;
  if (elStreakCount) {
    const streak = getStreakCount();
    elStreakCount.textContent = `${streak}`;
  }
}

/**
 * Static 3-Pace Targets Section
 */
function render3PaceTargetsSection() {
  const profile = getActiveProfile();
  const s = appState.activeSession;
  const row = (profile && profile.sessions) ? (profile.sessions[s - 1] || profile.sessions[0]) : null;
  const currentBal = getCurrentDeskBalance(s);

  // Targets
  const targetRel = row ? row.r : 0;
  const targetMid = row ? row.m : 0;
  const targetAgg = row ? row.a : 0;

  // Finreq target calculation: desk needed to pace toward total obligations
  const tfg = calculateTotalFinancialGoal(profile, currentBal, appState.vaultLedger, appState.bills, appState.milestoneCfg);
  const remainingObligations = tfg.bills.remaining + tfg.savings.remaining;
  const sessionsLeft = profile ? Math.max(1, profile.totalSessions - s + 1) : 1;
  const targetFinreq = profile 
    ? (remainingObligations > 0 
        ? Math.round((currentBal + (remainingObligations / sessionsLeft)) * 100) / 100 
        : targetRel)
    : 0;

  // Set card contents
  const elRel = document.getElementById('targetRelVal');
  const elMid = document.getElementById('targetMidVal');
  const elAgg = document.getElementById('targetAggVal');
  const elFin = document.getElementById('targetFinreqVal');

  if (elRel) elRel.textContent = profile ? formatCurrency(targetRel) : '—';
  if (elMid) elMid.textContent = profile ? formatCurrency(targetMid) : '—';
  if (elAgg) elAgg.textContent = profile ? formatCurrency(targetAgg) : '—';
  if (elFin) elFin.textContent = profile ? formatCurrency(targetFinreq) : '—';

  // Diffs
  const diffRel = currentBal - targetRel;
  const diffMid = currentBal - targetMid;
  const diffAgg = currentBal - targetAgg;
  const diffFin = currentBal - targetFinreq;

  const elDiffRel = document.getElementById('diffRelVal');
  const elDiffMid = document.getElementById('diffMidVal');
  const elDiffAgg = document.getElementById('diffAggVal');
  const elDiffFin = document.getElementById('diffFinreqVal');

  if (elDiffRel) elDiffRel.textContent = profile ? `Diff: ${formatCurrencyPnL(diffRel)}` : 'Diff: —';
  if (elDiffMid) elDiffMid.textContent = profile ? `Diff: ${formatCurrencyPnL(diffMid)}` : 'Diff: —';
  if (elDiffAgg) elDiffAgg.textContent = profile ? `Diff: ${formatCurrencyPnL(diffAgg)}` : 'Diff: —';
  if (elDiffFin) elDiffFin.textContent = profile ? `Diff: ${formatCurrencyPnL(diffFin)}` : 'Diff: —';
  const questPaceSelect = document.getElementById('questPaceSelect');
  if (questPaceSelect) questPaceSelect.value = appState.pace;

  const paceCardByValue = { relaxed: 'paceCardRelaxed', mid: 'paceCardMid', aggressive: 'paceCardAgg', finreq: 'paceCardFinreq' };
  const paceTargets = { relaxed: targetRel, mid: targetMid, aggressive: targetAgg, finreq: targetFinreq };
  const paceLabels = { relaxed: 'Relaxed', mid: 'Mid', aggressive: 'Aggressive', finreq: 'Financial requirement' };
  Object.entries(paceCardByValue).forEach(([value, id]) => {
    const card = document.getElementById(id);
    if (card) {
      const selected = appState.pace === value;
      const completed = profile ? (currentBal >= paceTargets[value]) : false;
      card.classList.toggle('is-selected', selected);
      card.classList.toggle('is-complete', completed);
      card.setAttribute('aria-pressed', String(selected));
      card.setAttribute('aria-label', profile ? `${paceLabels[value]} pace: ${formatCurrency(paceTargets[value])}${completed ? ', target reached' : ''}` : `${paceLabels[value]} pace: No active challenge`);
    }
  });

  // Active badges
  const bRel = document.getElementById('badgePaceRel');
  const bMid = document.getElementById('badgePaceMid');
  const bAgg = document.getElementById('badgePaceAgg');
  const bFin = document.getElementById('badgePaceFinreq');
  const label = document.getElementById('activePaceLabel');

  [bRel, bMid, bAgg, bFin].forEach(b => { if (b) b.classList.add('hidden'); });

  if (appState.pace === 'relaxed') {
    if (bRel) bRel.classList.remove('hidden');
    if (label) { label.textContent = 'Relaxed'; label.className = 'badge badge-green'; }
  } else if (appState.pace === 'mid') {
    if (bMid) bMid.classList.remove('hidden');
    if (label) { label.textContent = 'Mid'; label.className = 'badge badge-amber'; }
  } else if (appState.pace === 'aggressive') {
    if (bAgg) bAgg.classList.remove('hidden');
    if (label) { label.textContent = 'Aggressive'; label.className = 'badge badge-purple'; }
  } else if (appState.pace === 'finreq') {
    if (bFin) bFin.classList.remove('hidden');
    if (label) { label.textContent = 'Financial Req.'; label.className = 'badge badge-blue'; }
  }
}

/**
 * Gets the active target value for a specific session based on pgl_pace_v10
 */
function getActiveTargetForSession(sessionNum) {
  const profile = getActiveProfile();
  if (!profile || !profile.sessions) return 0;
  const row = profile.sessions[sessionNum - 1] || profile.sessions[0];
  if (!row) return 0;

  if (appState.pace === 'mid') return row.m;
  if (appState.pace === 'aggressive') return row.a;
  if (appState.pace === 'finreq') {
    const cur = getCurrentDeskBalance(sessionNum);
    const tfg = calculateTotalFinancialGoal(profile, cur, appState.vaultLedger, appState.bills, appState.milestoneCfg);
    const remaining = tfg.bills.remaining + tfg.savings.remaining;
    const sLeft = Math.max(1, profile.totalSessions - sessionNum + 1);
    return remaining > 0 ? Math.round((cur + (remaining / sLeft)) * 100) / 100 : row.r;
  }
  return row.r;
}

/**
 * Daily Desk Panel
 */
function renderDailyDesk() {
  const profile = getActiveProfile();
  const s = appState.activeSession;
  const isLocked = !!appState.lockedSessions[s];
  const dateStr = profile ? getDateForSession(profile.startDate, s) : '—';
  const currentBal = getCurrentDeskBalance(s);
  const activeTarget = getActiveTargetForSession(s);
  const dailyPnl = getNormalizedDailyPnL(s);
  const dailyReturn = getSessionReturnPct(s);
  const dailyPnlEl = document.getElementById('dailySessionPnl');
  const dailyReturnEl = document.getElementById('dailySessionReturn');
  if (dailyPnlEl) {
    dailyPnlEl.textContent = dailyPnl === 0 ? formatCurrency(0) : formatCurrencyPnL(dailyPnl);
    dailyPnlEl.className = dailyPnl >= 0 ? 'positive' : 'negative';
  }
  if (dailyReturnEl) {
    dailyReturnEl.textContent = formatPercent(dailyReturn);
    dailyReturnEl.className = dailyReturn >= 0 ? 'positive' : 'negative';
  }

  // Session header
  const title = document.getElementById('activeSessionTitle');
  const dateEl = document.getElementById('activeSessionDate');
  const lockBadge = document.getElementById('sessionLockBadge');
  const lockBtn = document.getElementById('btnToggleLockSession');

  if (title) title.textContent = profile ? `Session ${s} of ${profile.totalSessions}` : 'No active challenge';
  if (dateEl) dateEl.textContent = profile ? `Date: ${dateStr}` : 'Create a challenge in Setup to begin';
  if (lockBadge) {
    lockBadge.textContent = isLocked ? '🔒 Locked' : '🔓 Unlocked';
    lockBadge.className = isLocked ? 'badge badge-amber text-[11px]' : 'badge badge-gray text-[11px]';
  }
  if (lockBtn) {
    lockBtn.textContent = isLocked ? '🔓 Unlock' : '🔒 Lock';
    lockBtn.disabled = !profile;
  }

  // Session selector dropdown
  const dropdown = document.getElementById('sessionSelectDropdown');
  if (dropdown) {
    dropdown.innerHTML = '';
    const totalSessions = profile ? profile.totalSessions : 0;
    if (totalSessions === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'No active sessions';
      dropdown.appendChild(opt);
    } else {
      for (let i = 1; i <= totalSessions; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `Session ${i}${appState.logs[i] !== undefined ? ' ✓' : ''}`;
        if (i === s) opt.selected = true;
        dropdown.appendChild(opt);
      }
    }
  }

  // Balance input & lock state
  const balInput = document.getElementById('sessionBalanceInput');
  const timestampText = document.getElementById('sessionTimestampText');

  if (balInput) {
    if (document.activeElement !== balInput) {
      balInput.value = appState.logs[s] !== undefined ? appState.logs[s] : '';
    }
    balInput.disabled = isLocked || !profile;
    if (isLocked || !profile) {
      balInput.classList.add('bg-slate-100', 'text-slate-600', 'cursor-not-allowed');
    } else {
      balInput.classList.remove('bg-slate-100', 'text-slate-600', 'cursor-not-allowed');
    }
  }

  if (timestampText) {
    if (appState.timestamps[s]) {
      const d = new Date(appState.timestamps[s]);
      timestampText.textContent = `Recorded: ${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
    } else {
      timestampText.textContent = profile ? 'Not logged yet' : 'No active challenge';
    }
  }

  // Notes
  const notesInput = document.getElementById('sessionNotesInput');
  if (notesInput) {
    notesInput.value = appState.notes[s] || '';
    notesInput.disabled = !profile;
  }

  // Shortfall & Rebase card
  const shortfallCard = document.getElementById('shortfallCard');
  if (shortfallCard) {
    if (profile) {
      const shortfall = activeTarget - currentBal;
      if (shortfall > 0) {
        shortfallCard.classList.remove('hidden');
        const badge = document.getElementById('shortfallAmountBadge');
        if (badge) badge.textContent = `-${formatCurrency(shortfall)}`;

        const rebase = calculateRebasedPlan(s, currentBal, profile.portTarget, profile.totalSessions);
        const rateText = document.getElementById('rebasedRateNeeded');
        if (rateText) rateText.textContent = `${(rebase.requiredRate * 100).toFixed(2)}%`;

        const btnOrig = document.getElementById('btnPlanModeOriginal');
        const btnRebase = document.getElementById('btnPlanModeRebased');
        if (btnOrig && btnRebase) {
          if (appState.planViewMode === 'rebased') {
            btnRebase.className = 'px-2.5 py-1 text-xs font-semibold rounded bg-amber-600 text-white shadow-sm';
            btnOrig.className = 'px-2.5 py-1 text-xs font-semibold rounded bg-white border border-amber-300 text-amber-900 shadow-sm';
          } else {
            btnOrig.className = 'px-2.5 py-1 text-xs font-semibold rounded bg-amber-600 text-white shadow-sm';
            btnRebase.className = 'px-2.5 py-1 text-xs font-semibold rounded bg-white border border-amber-300 text-amber-900 shadow-sm';
          }
        }
      } else {
        shortfallCard.classList.add('hidden');
      }
    } else {
      shortfallCard.classList.add('hidden');
    }
  }

  // Profit Allocation Card
  const profitCard = document.getElementById('profitAllocationCard');
  if (profitCard) {
    const dailyPnL = getNormalizedDailyPnL(s);
    if (profile && dailyPnL > 0 && appState.logs[s] !== undefined) {
      const preview = calculateProfitAllocationPreview(dailyPnL, appState.bills, appState.milestoneCfg.reserveFloor, currentBal);
      if (preview) {
        profitCard.classList.remove('hidden');
        document.getElementById('profitAllocGainVal').textContent = formatCurrencyPnL(dailyPnL);
        document.getElementById('profitAllocPhaseBadge').textContent = preview.phase === 1 ? 'Phase 1: Bills Priority' : 'Phase 2: Wealth Building';
        document.getElementById('profitAllocPhaseBadge').className = preview.phase === 1 ? 'badge badge-blue text-[10px]' : 'badge badge-green text-[10px]';

        document.getElementById('profitAllocDeskVal').textContent = formatCurrency(preview.allocDesk);
        document.getElementById('profitAllocBillsVal').textContent = formatCurrency(preview.allocBills);
        document.getElementById('profitAllocSavingsVal').textContent = formatCurrency(preview.allocSavings);

        const floorNote = document.getElementById('profitAllocFloorNote');
        if (floorNote) {
          if (preview.floorViolated) {
            floorNote.innerHTML = `⚠️ Post-skim desk: <strong>${formatCurrency(preview.postDeskBalance)}</strong> (<span class="text-red-600 font-bold">Below ${formatCurrency(appState.milestoneCfg.reserveFloor)} floor</span>)`;
          } else {
            floorNote.innerHTML = `✓ Post-skim desk: <strong>${formatCurrency(preview.postDeskBalance)}</strong> (Safe above ${formatCurrency(appState.milestoneCfg.reserveFloor)} floor)`;
          }
        }
      } else {
        profitCard.classList.add('hidden');
      }
    } else {
      profitCard.classList.add('hidden');
    }
  }

  // Render Visualizers & Master Table
  renderMountainTrail();
  renderMasterTable();
}

/** Isometric pixel-island challenge route; checkpoints remain fully interactive. */
function renderMountainTrail() {
  const container = document.getElementById('mountainTrailContainer');
  if (!container) return;

  const profile = getActiveProfile();
  if (!profile) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
        <p class="font-bold text-slate-600 mb-1">No active challenge</p>
        <p class="text-xs">Head to the <button onclick="switchMainTab('config')" class="text-emerald-700 underline font-semibold">Setup</button> tab to create your first challenge!</p>
      </div>`;
    return;
  }

  const N = Math.max(2, Number(profile.totalSessions) || 2);
  const completed = Object.keys(appState.logs).filter(k => Number(k) >= 1 && Number(k) <= N && Number.isFinite(Number(appState.logs[k]))).length;
  const progress = Math.min(1, completed / N);
  const target = Math.max(0, Number(profile.portTarget) || 0);
  const balance = getCurrentDeskBalance();
  const targetProgress = target > 0 ? Math.min(100, Math.max(0, balance / target * 100)) : 0;
  const checkpoints = [...new Set([1, Math.ceil(N * .25), Math.ceil(N * .5), Math.ceil(N * .75), N])].sort((a, b) => a - b);
  const names = ['The Outpost', 'Ancient Ruins', 'Shadow Grotto', 'Dragon Hoard', 'Treasure Trove'];
  const ys = [140, 96, 124, 76, 104];
  const points = checkpoints.map((session, i) => {
    const targetVal = getActiveTargetForSession(session);
    return {
      session,
      x: 48 + (i / Math.max(1, checkpoints.length - 1)) * 504,
      y: ys[Math.round(i * (ys.length - 1) / Math.max(1, checkpoints.length - 1))],
      name: names[Math.round(i * (names.length - 1) / Math.max(1, checkpoints.length - 1))],
      target: targetVal,
      formattedTarget: formatCurrency(targetVal),
      reached: completed >= session
    };
  });
  const route = points.map(p => `${p.x},${p.y}`).join(' ');
  const currentX = 48 + progress * 504;
  const segment = Math.min(points.length - 2, Math.floor(progress * Math.max(1, points.length - 1)));
  const segmentPct = progress >= 1 ? 1 : (progress * Math.max(1, points.length - 1)) - segment;
  const currentY = points[segment].y + (points[segment + 1].y - points[segment].y) * segmentPct;
  const reachedCount = points.filter(p => p.reached).length;
  const currentLevel = Math.floor(completed / 5) + 1;
  const nextStop = points.find(p => !p.reached) || points[points.length - 1];
  const safeNext = nextStop || { name: 'Treasure Trove', session: N, target: target };
  const nextTarget = safeNext.target || getActiveTargetForSession(safeNext.session);
  const diffToNext = Math.max(0, nextTarget - balance);

  const checkpointsSvg = points.map(p => {
    const active = !p.reached && p.session === nextStop.session;
    const color = p.reached ? '#64d59a' : (active ? '#f0c763' : '#ded0a8');
    const flag = p.reached ? '#59ad70' : (active ? '#e9a84d' : '#b58b55');
    const pillW = 76;
    const pillH = 26;
    const pillX = Math.max(4, Math.min(600 - pillW - 4, p.x - (pillW / 2)));
    const pillY = p.y + 24;
    const pillBg = p.reached ? '#1b3823' : (active ? '#422e11' : '#26221c');
    const pillBorder = p.reached ? '#48b868' : (active ? '#f5c85b' : '#6b5c47');
    const pillText = p.reached ? '#a7f3d0' : (active ? '#fef08a' : '#ded0a8');
    const pillAmt = p.reached ? '#6ee7b7' : (active ? '#fde047' : '#f5e8c6');

    return `<g class="quest-checkpoint ${p.reached ? 'is-reached' : ''} ${active ? 'is-next' : ''}" role="button" tabindex="0" aria-label="${p.name}, session ${p.session}, target ${p.formattedTarget}${p.reached ? ', complete' : ''}" onclick="jumpToSession(${p.session})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();jumpToSession(${p.session})}">
      <path d="m${p.x-20} ${p.y+10} 20-10 20 10-20 10z" fill="#50442f" stroke="#332a1e" stroke-width="2.5"/>
      <path d="M${p.x} ${p.y+4}v-26" stroke="#49382a" stroke-width="3.5"/>
      <path class="checkpoint-banner" d="M${p.x+2} ${p.y-22}h24v14h-24z" fill="${flag}" stroke="#3e2e1c" stroke-width="2"/>
      <path d="M${p.x+5} ${p.y-19}h7v3h-7zm10 0h7v3h-7z" fill="#f8e8b9"/>
      <rect x="${p.x-4}" y="${p.y}" width="8" height="8" fill="${color}" stroke="#3e2e1c" stroke-width="2"/>
      <g class="checkpoint-tag">
        <rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}" rx="3" fill="${pillBg}" stroke="${pillBorder}" stroke-width="1.8"/>
        <text x="${pillX + pillW/2}" y="${pillY + 10}" text-anchor="middle" font-size="7.5" font-weight="700" fill="${pillText}">${p.name} · S${p.session}</text>
        <text x="${pillX + pillW/2}" y="${pillY + 21}" text-anchor="middle" font-size="8.5" font-weight="800" font-family="'DM Mono', monospace" fill="${pillAmt}">${p.reached ? '✓ ' : ''}${p.formattedTarget}</text>
      </g>
      ${p.reached ? `<rect x="${p.x+14}" y="${p.y-30}" width="5" height="5" fill="#ffe18e"/>` : ''}
    </g>`;
  }).join('');

  const nextStatusBadge = completed >= N
    ? `<span class="quest-next-amt-badge is-reached">Treasure Trove unlocked — Legendary!</span>`
    : (balance >= nextTarget
        ? `<span class="quest-next-amt-badge is-reached">Target Cleared (${formatCurrency(nextTarget)}) ✓</span>`
        : `<span class="quest-next-amt-badge">Target: <strong>${formatCurrency(nextTarget)}</strong> · Need +${formatCurrency(diffToNext)}</span>`);

  container.innerHTML = `
    <div class="quest-progress-top">
      <div class="quest-top-row">
        <div class="quest-top-left">
          <span class="quest-level">LEVEL ${currentLevel}</span>
          <span class="quest-stat-pill"><strong>${completed}</strong> / ${N} Sessions</span>
          <span class="quest-stat-pill"><strong>${reachedCount}</strong> / ${checkpoints.length} Milestones</span>
        </div>
        <div class="quest-top-right">
          <span class="quest-money-metric">Desk: <strong class="text-emerald-500 font-num">${formatCurrency(balance)}</strong></span>
          <span class="quest-money-divider">/</span>
          <span class="quest-money-metric">Target: <strong class="text-amber-400 font-num">${formatCurrency(target)}</strong></span>
        </div>
      </div>
      <div class="quest-xp-track" role="progressbar" aria-label="Challenge sessions completed" aria-valuenow="${completed}" aria-valuemin="0" aria-valuemax="${N}">
        <span style="width:${progress * 100}%"></span>
      </div>
    </div>
    <svg class="quest-map" viewBox="0 0 600 238" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Expedition adventure map with ${completed} of ${N} sessions completed and ${reachedCount} milestones reached">
      <use href="#location-route" x="0" y="0" width="600" height="238"/>
      <path d="M0 180h600v58H0z" fill="#4f6548" opacity=".8"/>
      <polyline points="${route}" fill="none" stroke="#4c4130" stroke-width="12" stroke-linecap="square" stroke-linejoin="bevel"/>
      <polyline points="${route}" fill="none" stroke="#e0bf78" stroke-width="4" stroke-linecap="square" stroke-linejoin="bevel" stroke-dasharray="3 8" stroke-dashoffset="${Math.round((1 - progress) * 72)}"/>
      ${checkpointsSvg}
      <g class="quest-player-sprite" transform="translate(${currentX - 15} ${currentY - 46}) scale(.72)"><use href="#sprite-hero"/></g>
      <g fill="#ffe09a">
        <rect x="112" y="44" width="4" height="4"><animate attributeName="opacity" values=".4;1;.4" dur="1.8s" repeatCount="indefinite"/></rect>
        <rect x="316" y="35" width="4" height="4"><animate attributeName="opacity" values="1;.3;1" dur="2.3s" repeatCount="indefinite"/></rect>
        <rect x="473" y="67" width="4" height="4"><animate attributeName="opacity" values=".3;1;.3" dur="2s" repeatCount="indefinite"/></rect>
      </g>
    </svg>
    <div class="quest-map-footer">
      <div class="quest-next-stop">
        <span class="quest-next-icon">⚑</span>
        <div>
          <small>NEXT CHECKPOINT</small>
          <div class="quest-next-details">
            <strong>${completed >= N ? 'Treasure Trove Reached' : `${safeNext.name} · S${safeNext.session}`}</strong>
            ${nextStatusBadge}
          </div>
        </div>
      </div>
      <div class="quest-goal-stat">
        <small>GOAL PROGRESS</small>
        <div class="quest-goal-row">
          <strong>${targetProgress.toFixed(1)}%</strong>
          <span class="quest-goal-sub">${formatCurrency(balance)} of ${formatCurrency(target)}</span>
        </div>
      </div>
    </div>`;
}

/**
 * Master Session Table (Section 4.1)
 */
function renderMasterTable() {
  const tbody = document.getElementById('masterTableBody');
  if (!tbody) return;

  const profile = getActiveProfile();
  if (!profile) {
    tbody.innerHTML = `<tr><td colspan="10" class="text-center py-8 text-slate-400">No active challenge. Set up a challenge in the Setup tab to generate your roadmap.</td></tr>`;
    return;
  }

  const N = profile.totalSessions;
  const currentS = appState.activeSession;

  let rebaseMap = null;
  if (appState.planViewMode === 'rebased') {
    const curBal = getCurrentDeskBalance(currentS);
    rebaseMap = calculateRebasedPlan(currentS, curBal, profile.portTarget, N).rebasedMap;
  }

  let html = '';
  for (let s = 1; s <= N; s++) {
    const row = profile.sessions[s - 1] || profile.sessions[0];
    const dateStr = getDateForSession(profile.startDate, s);
    const isLogged = appState.logs[s] !== undefined;
    const closingBal = isLogged ? parseFloat(appState.logs[s]) : null;
    const isLocked = !!appState.lockedSessions[s];
    const notes = appState.notes[s] || '';
    const skims = getSessionVaultSkims(s);
    const pnl = getNormalizedDailyPnL(s);
    const ret = getSessionReturnPct(s);

    const isCurrent = s === currentS;

    html += `
      <tr class="${isCurrent ? 'bg-emerald-50/70 font-semibold' : ''}">
        <td class="font-num font-bold">
          <div class="flex items-center gap-1.5">
            <span>S${s}</span>
            ${row && row.tag ? `<span class="badge badge-purple text-[10px]">${row.tag}</span>` : ''}
          </div>
        </td>
        <td class="text-xs text-slate-500">${dateStr}</td>
        <td class="font-num">${formatCurrency(row ? row.r : 0)}</td>
        <td class="font-num text-amber-700">${formatCurrency(row ? row.m : 0)}</td>
        <td class="font-num text-purple-700">${formatCurrency(row ? row.a : 0)}</td>
        <td class="font-num font-bold">
          ${isLogged ? formatCurrency(closingBal) : '<span class="text-slate-400 font-normal">--</span>'}
        </td>
        <td class="font-num text-blue-600">${skims > 0 ? formatCurrency(skims) : '$0.00'}</td>
        <td class="font-num ${pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}">
          ${isLogged ? formatCurrencyPnL(pnl) : '<span class="text-slate-400 font-normal">--</span>'}
        </td>
        <td class="font-num ${ret >= 0 ? 'text-emerald-600' : 'text-red-600'}">
          ${isLogged ? formatPercent(ret) : '<span class="text-slate-400 font-normal">--</span>'}
        </td>
        <td>
          <span class="badge ${isLocked ? 'badge-amber' : 'badge-gray'} text-[10px]">
            ${isLocked ? '🔒' : '🔓'}
          </span>
        </td>
        <td class="text-xs max-w-xs truncate text-slate-600" title="${notes}">${notes || '-'}</td>
        <td>
          <div class="flex items-center gap-1">
            <button onclick="jumpToSession(${s})" class="px-2 py-0.5 rounded border border-slate-200 hover:bg-slate-100 text-xs">
              Go
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  tbody.innerHTML = html;
}

/**
 * Activity Calendar Panel (Section 4.1 Sub-Tab 2)
 */
function renderCalendarView() {
  const grid = document.getElementById('calendarGrid');
  const title = document.getElementById('calendarMonthTitle');
  if (!grid) return;

  const profile = getActiveProfile();
  const year = calendarViewYear;
  const month = calendarViewMonth;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  if (title) title.textContent = `${monthNames[month]} ${year}`;

  // Map dates to sessions
  const dateToSession = {};
  if (profile) {
    for (let s = 1; s <= profile.totalSessions; s++) {
      const dStr = getDateForSession(profile.startDate, s);
      dateToSession[dStr] = s;
    }
  }

  // Days in month
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sun
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Day labels header
  const daysHeader = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let html = daysHeader.map(d => `<div class="text-center font-bold text-xs text-slate-400 py-1 uppercase">${d}</div>`).join('');

  // Leading empty cells
  for (let i = 0; i < firstDayOfWeek; i++) {
    html += `<div class="h-20 bg-slate-50/50 rounded border border-slate-100 p-1 text-slate-300"></div>`;
  }

  // Actual days
  for (let d = 1; d <= totalDays; d++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const sessionNum = dateToSession[dStr];
    const isToday = new Date().toISOString().split('T')[0] === dStr;

    let sessionBadge = '';
    let pnlBadge = '';

    if (sessionNum) {
      const isLogged = appState.logs[sessionNum] !== undefined;
      const pnl = getNormalizedDailyPnL(sessionNum);

      sessionBadge = `<span class="badge ${sessionNum === appState.activeSession ? 'badge-amber' : 'badge-blue'} text-[10px]">S${sessionNum}</span>`;
      if (isLogged) {
        pnlBadge = `<div class="font-num text-xs font-bold ${pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}">${formatCurrencyPnL(pnl)}</div>`;
      }
    }

    // Trade count on this day
    const tradesOnDay = appState.tradeLogs.filter(t => t.date === dStr).length;
    const tradeBadge = tradesOnDay > 0 ? `<span class="badge badge-purple text-[9px]">${tradesOnDay} trades</span>` : '';

    html += `
      <div onclick="${sessionNum ? `jumpToSession(${sessionNum}); switchTrackerSubTab('desk');` : ''}" 
           class="h-20 bg-white rounded-lg border ${isToday ? 'border-emerald-500 ring-1 ring-emerald-400' : 'border-slate-200'} p-1.5 flex flex-col justify-between ${sessionNum ? 'cursor-pointer hover:bg-emerald-50/40 transition' : 'opacity-80'}">
        <div class="flex justify-between items-start">
          <span class="text-xs font-bold font-num ${isToday ? 'text-emerald-700' : 'text-slate-700'}">${d}</span>
          ${sessionBadge}
        </div>
        <div>
          ${pnlBadge}
          ${tradeBadge}
        </div>
      </div>
    `;
  }

  grid.innerHTML = html;
}

/**
 * Total Financial Goal Panel (Section 4.1 Sub-Tab 3)
 */
function renderTotalFinancialGoal() {
  const profile = getActiveProfile();
  const currentBal = getCurrentDeskBalance();
  const tfg = calculateTotalFinancialGoal(profile, currentBal, appState.vaultLedger, appState.bills, appState.milestoneCfg);

  // Overall bar & summary
  const elOverallPercent = document.getElementById('tfgOverallPercent');
  const elAchievedTotal = document.getElementById('tfgAchievedTotal');
  const elTargetTotal = document.getElementById('tfgTargetTotal');

  if (elOverallPercent) elOverallPercent.textContent = `${tfg.total.progressPercent.toFixed(1)}%`;
  if (elAchievedTotal) elAchievedTotal.textContent = `Achieved: ${formatCurrency(tfg.total.achieved)}`;
  if (elTargetTotal) elTargetTotal.textContent = `Total Target: ${formatCurrency(tfg.total.target)}`;

  // Bar widths
  const barTrading = document.getElementById('tfgBarTrading');
  const barSavings = document.getElementById('tfgBarSavings');
  const barBills = document.getElementById('tfgBarBills');

  if (tfg.total.target > 0) {
    const wTrading = (tfg.trading.achieved / tfg.total.target) * 100;
    const wSavings = (tfg.savings.achieved / tfg.total.target) * 100;
    const wBills = (tfg.bills.achieved / tfg.total.target) * 100;

    if (barTrading) barTrading.style.width = `${wTrading}%`;
    if (barSavings) barSavings.style.width = `${wSavings}%`;
    if (barBills) barBills.style.width = `${wBills}%`;
  }

  // 3 Pillar Cards
  const elTradingCur = document.getElementById('tfgTradingCurrent');
  const elTradingTar = document.getElementById('tfgTradingTarget');
  const elTradingRem = document.getElementById('tfgTradingRemaining');

  if (elTradingCur) elTradingCur.textContent = formatCurrency(currentBal);
  if (elTradingTar) elTradingTar.textContent = formatCurrency(tfg.trading.target);
  if (elTradingRem) elTradingRem.textContent = formatCurrency(tfg.trading.remaining);

  const elSavingsCur = document.getElementById('tfgSavingsCurrent');
  const elSavingsTar = document.getElementById('tfgSavingsTarget');
  const elSavingsRem = document.getElementById('tfgSavingsRemaining');

  if (elSavingsCur) elSavingsCur.textContent = formatCurrency(tfg.savings.current);
  if (elSavingsTar) elSavingsTar.textContent = formatCurrency(tfg.savings.target);
  if (elSavingsRem) elSavingsRem.textContent = formatCurrency(tfg.savings.remaining);

  const elBillsCur = document.getElementById('tfgBillsCurrent');
  const elBillsTar = document.getElementById('tfgBillsTarget');
  const elBillsRem = document.getElementById('tfgBillsRemaining');

  if (elBillsCur) elBillsCur.textContent = formatCurrency(tfg.bills.achieved);
  if (elBillsTar) elBillsTar.textContent = formatCurrency(tfg.bills.target);
  if (elBillsRem) elBillsRem.textContent = formatCurrency(tfg.bills.remaining);
}

/**
 * Module 2: Setup Plan & Challenge Roadmap (Section 4.2)
 */
function renderConfigModule() {
  const profile = getActiveProfile();
  const setupTitle = document.getElementById('setupFormTitle');
  const setupHelp = document.getElementById('setupFormHelp');
  if (setupTitle) setupTitle.textContent = (setupNewProfileDraft || !profile) ? 'New challenge' : `Edit "${profile.name}"`;
  if (setupHelp) setupHelp.textContent = (setupNewProfileDraft || !profile) ? 'Set the starting balance, goal and session count.' : 'Modify your parameters below and click Start challenge to save your changes.';
  const setupDate = document.getElementById('genStartDate');
  if (setupDate && !setupDate.value) {
    const today = new Date();
    setupDate.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }

  // Active Challenge Overview
  const nameEl = document.getElementById('cfgActiveChallengeName');
  const datesEl = document.getElementById('cfgActiveChallengeDates');
  const mBase = document.getElementById('cfgMetricBase');
  const mTarget = document.getElementById('cfgMetricTarget');
  const mSessions = document.getElementById('cfgMetricSessions');
  const mMultiplier = document.getElementById('cfgMetricMultiplier');
  const challengeTabs = document.getElementById('cfgChallengeTabs');
  const challengeCount = document.getElementById('setupChallengeCount');
  const editActiveButton = document.getElementById('btnEditActiveChallenge');
  const deleteActiveButton = document.getElementById('btnDeleteActiveChallenge');
  const noChallengesNotice = document.getElementById('cfgNoChallengesNotice');
  const activeStats = document.getElementById('cfgActiveStats');
  const challengeActions = document.querySelector('.setup-challenge-actions');

  if (profile) {
    if (noChallengesNotice) noChallengesNotice.classList.add('hidden');
    if (activeStats) activeStats.classList.remove('hidden');
    if (datesEl) {
      datesEl.classList.remove('hidden');
      const endDate = getDateForSession(profile.startDate, profile.totalSessions);
      datesEl.textContent = `Starts ${profile.startDate} · Goal date ${endDate}`;
    }
    if (challengeActions) challengeActions.classList.remove('hidden');
    if (nameEl) nameEl.textContent = profile.name;
    if (mBase) mBase.textContent = formatCurrency(profile.base);
    if (mTarget) mTarget.textContent = formatCurrency(profile.portTarget);
    if (mSessions) mSessions.textContent = `${Math.min(appState.activeSession, profile.totalSessions)} / ${profile.totalSessions} sessions`;
    if (mMultiplier) {
      const mult = profile.base > 0 ? (profile.portTarget / profile.base).toFixed(1) : '0.0';
      mMultiplier.textContent = `${mult}x`;
    }
  } else {
    if (noChallengesNotice) noChallengesNotice.classList.remove('hidden');
    if (activeStats) activeStats.classList.add('hidden');
    if (datesEl) datesEl.classList.add('hidden');
    if (challengeActions) challengeActions.classList.add('hidden');
    if (mBase) mBase.textContent = '—';
    if (mTarget) mTarget.textContent = '—';
    if (mSessions) mSessions.textContent = '—';
    if (mMultiplier) mMultiplier.textContent = '0.0x';
  }

  if (challengeCount) challengeCount.textContent = `${appState.profiles.length} ${appState.profiles.length === 1 ? 'challenge' : 'challenges'}`;
  if (challengeTabs) {
    challengeTabs.replaceChildren();
    appState.profiles.forEach((challenge, index) => {
      const isActive = challenge.id === appState.activeProfileId;
      const tab = document.createElement('button');
      const tabId = `challengeTab${index}`;
      tab.type = 'button';
      tab.id = tabId;
      tab.className = `setup-challenge-tab${isActive ? ' is-active' : ''}`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(isActive));
      tab.setAttribute('aria-controls', 'cfgActiveStats');
      tab.addEventListener('click', () => handleSwitchProfile(challenge.id));

      const tabName = document.createElement('strong');
      tabName.textContent = challenge.name || 'My Challenge';
      const tabGoal = document.createElement('span');
      tabGoal.textContent = `${formatCurrency(challenge.base)} → ${formatCurrency(challenge.portTarget)}`;
      const tabDuration = document.createElement('small');
      tabDuration.textContent = `${challenge.totalSessions} sessions`;
      tab.append(tabName, tabGoal, tabDuration);
      challengeTabs.appendChild(tab);
    });
  }
  if (editActiveButton) {
    editActiveButton.disabled = !profile;
    editActiveButton.onclick = () => handleLoadProfileIntoWizard(appState.activeProfileId);
  }
  if (deleteActiveButton) {
    deleteActiveButton.disabled = !profile;
    deleteActiveButton.title = !profile ? 'No active challenge' : 'Delete selected challenge';
    deleteActiveButton.onclick = () => handleDeleteProfile(appState.activeProfileId);
  }

  renderSetupChallengePreview();
  handleCurveTypeChange(document.getElementById('genCurveType')?.value || 'tri_pace_independent');
}

function renderSetupChallengePreview() {
  const base = Number(document.getElementById('genBase')?.value);
  const target = Number(document.getElementById('genTarget')?.value);
  const sessions = parseInt(document.getElementById('genSessions')?.value, 10);
  const startDate = document.getElementById('genStartDate')?.value;
  const startEl = document.getElementById('setupPreviewStart');
  const targetEl = document.getElementById('setupPreviewTarget');
  const durationEl = document.getElementById('setupPreviewDuration');
  const dateEl = document.getElementById('setupPreviewDate');
  if (startEl) startEl.textContent = base > 0 ? formatCurrency(base) : '—';
  if (targetEl) targetEl.textContent = target > 0 ? formatCurrency(target) : '—';
  if (durationEl) durationEl.textContent = sessions >= 2 ? `${sessions} sessions` : '—';
  if (dateEl) dateEl.textContent = startDate && sessions >= 2 ? getDateForSession(startDate, sessions) : '—';
}

/**
 * Module 3: Trade Journal (Section 4.3)
 */
function renderTradeJournalModule() {
  const profile = getActiveProfile();
  const totalSessions = profile ? profile.totalSessions : 0;

  // Populate session selectors
  const sessionSel = document.getElementById('tradeSessionSelect');
  const modalSessionSel = document.getElementById('modalTradeSessionSelect');
  const filterSel = document.getElementById('tradeHistorySessionFilter');

  [sessionSel, modalSessionSel].forEach(sel => {
    if (sel) {
      sel.innerHTML = '';
      if (totalSessions === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'No active challenge';
        sel.appendChild(opt);
      } else {
        for (let s = 1; s <= totalSessions; s++) {
          const opt = document.createElement('option');
          opt.value = s;
          opt.textContent = `Session ${s}`;
          if (s === appState.activeSession) opt.selected = true;
          sel.appendChild(opt);
        }
      }
    }
  });

  if (filterSel) {
    const currentVal = filterSel.value || 'all';
    filterSel.innerHTML = '<option value="all">All Sessions</option>';
    for (let s = 1; s <= totalSessions; s++) {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = `Session ${s}`;
      if (opt.value === currentVal) opt.selected = true;
      filterSel.appendChild(opt);
    }
  }

  // Default trade date to today
  const tradeDateInp = document.getElementById('tradeDateInput');
  if (tradeDateInp && !tradeDateInp.value) {
    tradeDateInp.value = new Date().toISOString().split('T')[0];
  }

  renderTradeHistoryTable();
  renderTradeAnalytics();
}

function renderTradeHistoryTable() {
  const tbody = document.getElementById('tradeHistoryTableBody');
  if (!tbody) return;

  const sessionFilter = document.getElementById('tradeHistorySessionFilter')?.value || 'all';
  const statusFilter = document.getElementById('tradeHistoryStatusFilter')?.value || 'all';

  let filtered = [...appState.tradeLogs];
  if (sessionFilter !== 'all') {
    filtered = filtered.filter(t => t.sessionNum === parseInt(sessionFilter));
  }
  if (statusFilter !== 'all') {
    filtered = filtered.filter(t => t.status === statusFilter);
  }

  if (filtered.length === 0) {
    const emptyMessage = appState.tradeLogs.length === 0
      ? 'Add your first trade above to start tracking your sessions.'
      : 'No trades match these filters. Try another session or status.';
    tbody.innerHTML = `<tr><td colspan="11" class="trade-empty-cell"><div class="trade-empty-state"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 20h28l4 7v13H6V27l4-7Z"/><path d="m10 20 7-11h14l7 11M6 27h12l3 5h6l3-5h12"/><path d="M24 2v6m-12 2-4-5m28 5 4-5"/></svg><strong>${appState.tradeLogs.length === 0 ? 'No trades yet' : 'No matching trades'}</strong><span>${emptyMessage}</span></div></td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(t => {
    const netPnL = t.exitValue - t.entryAmount - t.fees;
    const retPct = t.entryAmount > 0 ? (netPnL / t.entryAmount) * 100 : 0;
    const isClosed = t.status === 'closed';

    return `
      <tr>
        <td class="font-num font-bold">S${t.sessionNum}</td>
        <td class="font-semibold text-slate-800">${t.tradeNo}</td>
        <td class="text-xs text-slate-500">${t.date}</td>
        <td>
          <span class="badge ${isClosed ? 'badge-blue' : 'badge-amber'} text-[10px]">
            ${t.status}
          </span>
        </td>
        <td class="font-num">${formatCurrency(t.entryAmount)}</td>
        <td class="font-num">${formatCurrency(t.exitValue)}</td>
        <td class="font-num text-slate-500">${formatCurrency(t.fees)}</td>
        <td class="font-num font-bold ${netPnL >= 0 ? 'text-emerald-600' : 'text-red-600'}">
          ${formatCurrencyPnL(netPnL)}
        </td>
        <td class="font-num ${retPct >= 0 ? 'text-emerald-600' : 'text-red-600'}">
          ${formatPercent(retPct)}
        </td>
        <td class="text-xs max-w-xs truncate text-slate-600" title="${t.notes || ''}">${t.notes || '-'}</td>
        <td>
          <div class="flex items-center gap-1.5">
            <button onclick="openEditTradeModal('${t.id}')" class="text-xs text-blue-600 hover:underline">Edit</button>
            <button onclick="handleDeleteTrade('${t.id}')" class="text-xs text-red-600 hover:underline">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function calculateTradeJournalAnalytics() {
  const trades = appState.tradeLogs;
  const total = trades.length;
  const closed = trades.filter(t => t.status === 'closed');
  const open = trades.filter(t => t.status === 'open');

  const wins = closed.filter(t => (t.exitValue - t.entryAmount - t.fees) > 0);
  const winRate = closed.length > 0 ? (wins.length / closed.length) * 100 : 0;

  const totalPnL = closed.reduce((sum, t) => sum + (t.exitValue - t.entryAmount - t.fees), 0);
  const avgReturn = closed.length > 0 ? (closed.reduce((sum, t) => {
    return sum + (t.entryAmount > 0 ? ((t.exitValue - t.entryAmount - t.fees) / t.entryAmount) * 100 : 0);
  }, 0) / closed.length) : 0;

  return { total, closedCount: closed.length, openCount: open.length, winRate, totalPnL, avgReturn };
}

function renderTradeAnalytics() {
  const a = calculateTradeJournalAnalytics();

  const elCount = document.getElementById('metricTradeCount');
  const elOpenClosed = document.getElementById('metricTradeOpenClosed');
  const elWinRate = document.getElementById('metricTradeWinRate');
  const elAvgReturn = document.getElementById('metricTradeAvgReturn');
  const elRealized = document.getElementById('metricTradeRealizedPnL');

  if (elCount) elCount.textContent = a.total;
  if (elOpenClosed) elOpenClosed.textContent = `${a.closedCount} / ${a.openCount} trades`;
  if (elWinRate) elWinRate.textContent = `${a.winRate.toFixed(1)}%`;
  if (elAvgReturn) elAvgReturn.textContent = formatCurrency(a.closedCount ? a.totalPnL / a.closedCount : 0);
  if (elRealized) {
    elRealized.textContent = formatCurrency(a.totalPnL);
    elRealized.className = `text-xl font-bold font-num ${a.totalPnL >= 0 ? 'text-emerald-600' : 'text-red-600'}`;
  }
}

/**
 * Module 4: Capital Vault & Financial Planning (Section 4.4)
 */
function renderMilestonesModule() {
  const currentBal = getCurrentDeskBalance();
  const totalVault = getVaultTotalBalance();
  const savingsBal = getVaultSavingsBalance();
  const billsReserved = getVaultBillsReserved();

  // Top KPI Cards
  const elTotalVault = document.getElementById('vaultTotalWithdrawnVal');
  const elSavings = document.getElementById('vaultSavingsReserveVal');
  const elBills = document.getElementById('vaultBillsReserveVal');
  const elDesk = document.getElementById('vaultDeskDisplayVal');

  if (elTotalVault) elTotalVault.textContent = formatCurrency(totalVault);
  if (elSavings) elSavings.textContent = formatCurrency(savingsBal);
  if (elBills) elBills.textContent = formatCurrency(billsReserved);
  if (elDesk) elDesk.textContent = formatCurrency(currentBal);

  // Capital Distribution Bar
  const totalWealth = Math.max(1, currentBal + totalVault);
  const pDesk = Math.max(0, (currentBal / totalWealth) * 100);
  const pSavings = Math.max(0, (savingsBal / totalWealth) * 100);
  const pBills = Math.max(0, (billsReserved / totalWealth) * 100);

  const bDesk = document.getElementById('distBarDesk');
  const bSav = document.getElementById('distBarSavings');
  const bBil = document.getElementById('distBarBills');
  const tDist = document.getElementById('vaultDistributionText');

  if (bDesk) bDesk.style.width = `${pDesk}%`;
  if (bSav) bSav.style.width = `${pSavings}%`;
  if (bBil) bBil.style.width = `${pBills}%`;
  if (tDist) tDist.textContent = `Desk ${pDesk.toFixed(0)}% • Savings ${pSavings.toFixed(0)}% • Bills ${pBills.toFixed(0)}%`;

  // Recent Vault Ledger
  renderRecentVaultLedger();

  // Bills Breakdown Table
  renderBillsBreakdown();

  // Savings Reserve
  renderSavingsReserve();

  // Safety Milestones
  renderSafetyMilestones();
}

function renderRecentVaultLedger() {
  const tbody = document.getElementById('vaultRecentLedgerBody');
  if (!tbody) return;

  const records = [...appState.vaultLedger].reverse().slice(0, 10);
  if (records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-slate-400">No vault transactions recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = records.map(r => {
    const isPayment = r.amount < 0;
    return `
      <tr>
        <td class="text-xs text-slate-500">${new Date(r.date).toLocaleDateString()}</td>
        <td class="font-num">S${r.session}</td>
        <td>
          <span class="badge ${r.bucket === 'bills' ? 'badge-amber' : (r.bucket === 'savings' ? 'badge-purple' : 'badge-blue')} text-[10px]">
            ${r.bucket}
          </span>
        </td>
        <td class="font-num font-bold ${isPayment ? 'text-red-600' : 'text-emerald-600'}">
          ${formatCurrencyPnL(r.amount)}
        </td>
        <td class="text-xs text-slate-600">${r.note || '-'}</td>
      </tr>
    `;
  }).join('');
}

function renderBillsBreakdown() {
  const tbody = document.getElementById('billsTableBody');
  if (!tbody) return;

  const basis = appState.billsBasis;
  const bDays = document.getElementById('basisBtnDays');
  const bSessions = document.getElementById('basisBtnSessions');
  if (bDays && bSessions) {
    if (basis === 'days') {
      bDays.className = 'px-2 py-1 rounded bg-slate-800 text-white font-semibold text-xs';
      bSessions.className = 'px-2 py-1 rounded bg-slate-100 text-slate-700 font-semibold text-xs';
    } else {
      bSessions.className = 'px-2 py-1 rounded bg-slate-800 text-white font-semibold text-xs';
      bDays.className = 'px-2 py-1 rounded bg-slate-100 text-slate-700 font-semibold text-xs';
    }
  }

  // Calculate run rate
  const profile = getActiveProfile();
  const totalUnfunded = appState.bills
    .filter(b => b.status !== 'paid')
    .reduce((sum, b) => sum + Math.max(0, b.amountDue - (b.amountReserved || 0)), 0);

  const sessionsLeft = profile ? Math.max(1, profile.totalSessions - appState.activeSession + 1) : 30;
  const runRate = basis === 'days' ? (totalUnfunded / 30) : (totalUnfunded / sessionsLeft);

  const elRunRate = document.getElementById('billsRunRateValue');
  const elTotalUnfunded = document.getElementById('billsTotalUnfundedText');
  if (elRunRate) elRunRate.textContent = `${formatCurrency(runRate)} / ${basis === 'days' ? 'day' : 'session'}`;
  if (elTotalUnfunded) elTotalUnfunded.textContent = `Total Unfunded: ${formatCurrency(totalUnfunded)}`;

  if (appState.bills.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-slate-400">No bills added yet. Click "+ Add Bill" to record recurring expenses.</td></tr>`;
    return;
  }

  tbody.innerHTML = appState.bills.map(b => {
    const isPaid = b.status === 'paid';
    return `
      <tr class="${isPaid ? 'bg-slate-50 opacity-75' : ''}">
        <td class="font-bold text-slate-800">${b.name}</td>
        <td>
          <span class="badge ${b.priority === 'high' ? 'badge-red' : (b.priority === 'medium' ? 'badge-amber' : 'badge-gray')} text-[10px]">
            ${b.priority}
          </span>
        </td>
        <td class="text-xs text-slate-500">${b.dueDate || '-'}</td>
        <td class="font-num font-bold">${formatCurrency(b.amountDue)}</td>
        <td class="font-num text-amber-700">${formatCurrency(b.amountReserved || 0)}</td>
        <td>
          <span class="badge ${isPaid ? 'badge-green' : (b.status === 'funded' ? 'badge-blue' : 'badge-amber')} text-[10px]">
            ${b.status}
          </span>
        </td>
        <td class="text-xs text-slate-500 max-w-xs truncate">${b.notes || '-'}</td>
        <td>
          <div class="flex items-center gap-1 text-xs">
            ${!isPaid ? `
              <button onclick="handleBillSetAside('${b.id}')" class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-semibold">Set Aside</button>
              <button onclick="handleBillMarkPaid('${b.id}')" class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-semibold">Mark Paid</button>
            ` : `
              <button onclick="handleBillTogglePaid('${b.id}')" class="px-2 py-0.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold">Unmark Paid</button>
            `}
            <button onclick="openEditBillModal('${b.id}')" class="text-slate-500 hover:text-slate-900 px-1">✏️</button>
            <button onclick="handleDeleteBill('${b.id}')" class="text-red-500 hover:text-red-700 px-1">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderSavingsReserve() {
  const profile = getActiveProfile();
  let goal = 0;
  if (appState.milestoneCfg && Number(appState.milestoneCfg.savingsGoal) > 0 && Number(appState.milestoneCfg.savingsGoal) !== 5000) {
    goal = Number(appState.milestoneCfg.savingsGoal);
  } else if (profile && Number(profile.withdrawalTarget) > 0) {
    goal = Number(profile.withdrawalTarget);
  }
  const current = getVaultSavingsBalance();
  const pct = goal > 0 ? Math.min(100, (current / goal) * 100) : 0;

  const elPct = document.getElementById('savingsProgressPercent');
  const elBar = document.getElementById('savingsProgressBar');
  const elAchieved = document.getElementById('savingsAchievedText');
  const elTarget = document.getElementById('savingsTargetText');

  if (elPct) elPct.textContent = `${pct.toFixed(1)}%`;
  if (elBar) elBar.style.width = `${pct}%`;
  if (elAchieved) elAchieved.textContent = `Current: ${formatCurrency(current)}`;
  if (elTarget) elTarget.textContent = `Goal: ${formatCurrency(goal)}`;

  // Savings History Table
  const tbody = document.getElementById('savingsLedgerTableBody');
  if (!tbody) return;

  const savingsRecords = appState.vaultLedger.filter(r => r.bucket === 'savings');
  if (savingsRecords.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-slate-400">No savings deposits recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = [...savingsRecords].reverse().map(r => `
    <tr>
      <td class="text-xs text-slate-500">${new Date(r.date).toLocaleDateString()}</td>
      <td class="font-num">S${r.session}</td>
      <td class="font-num font-bold text-purple-700">${formatCurrency(r.amount)}</td>
      <td class="text-xs text-slate-600">${r.note || '-'}</td>
    </tr>
  `).join('');
}

function renderSafetyMilestones() {
  const profile = getActiveProfile();
  const totalVault = getVaultTotalBalance();
  const base = profile ? profile.base : 0;
  const floor = Math.max(0, Number(appState.milestoneCfg.reserveFloor) || 0);
  const goal = Math.max(0, Number(appState.milestoneCfg.savingsGoal) || 0);

  // Step 1: Recoup Start Deposit
  const b1 = document.getElementById('milestoneStep1Badge');
  const p1 = document.getElementById('milestoneStep1Progress');
  if (p1) p1.textContent = `${formatCurrency(totalVault)} / ${formatCurrency(base)}`;
  if (b1) {
    if (totalVault >= base && base > 0) {
      b1.textContent = '✓ Unlocked';
      b1.className = 'badge badge-green text-[10px]';
    } else {
      b1.textContent = 'In Progress';
      b1.className = 'badge badge-gray text-[10px]';
    }
  }

  // Step 2: Safety Cushion
  const b2 = document.getElementById('milestoneStep2Badge');
  const p2 = document.getElementById('milestoneStep2Progress');
  if (p2) p2.textContent = `${formatCurrency(totalVault)} / ${formatCurrency(floor)}`;
  if (b2) {
    if (totalVault >= floor && floor > 0) {
      b2.textContent = '✓ Unlocked';
      b2.className = 'badge badge-green text-[10px]';
    } else {
      b2.textContent = 'In Progress';
      b2.className = 'badge badge-gray text-[10px]';
    }
  }

  // Step 3: Target Goal Cleared
  const b3 = document.getElementById('milestoneStep3Badge');
  const p3 = document.getElementById('milestoneStep3Progress');
  if (p3) p3.textContent = `${formatCurrency(totalVault)} / ${formatCurrency(goal)}`;
  if (b3) {
    if (totalVault >= goal && goal > 0) {
      b3.textContent = '✓ Cleared';
      b3.className = 'badge badge-green text-[10px]';
    } else {
      b3.textContent = 'In Progress';
      b3.className = 'badge badge-gray text-[10px]';
    }
  }

  // Pacing inputs
  const goalInp = document.getElementById('milestoneGoalInput');
  const floorInp = document.getElementById('milestoneFloorInput');
  const stratSel = document.getElementById('milestoneStrategySelect');
  if (goalInp) goalInp.value = appState.milestoneCfg.savingsGoal;
  if (floorInp) floorInp.value = appState.milestoneCfg.reserveFloor;
  if (stratSel) stratSel.value = appState.milestoneCfg.strategy || 'gradual';
}

/**
 * Module 5: Stats & Performance Analytics (Section 4.5)
 */
function renderStatsModule() {
  const profile = getActiveProfile();
  const N = profile ? profile.totalSessions : 0;
  const startBal = profile ? profile.base : 0;
  const totalWealth = getTrueTotalWealth();

  // All-time ROI
  const allTimeRoi = startBal > 0 ? ((totalWealth - startBal) / startBal) * 100 : 0;
  const elRoi = document.getElementById('statAllTimeRoi');
  if (elRoi) {
    elRoi.textContent = formatPercent(allTimeRoi);
    elRoi.className = `text-base font-bold font-num ${allTimeRoi >= 0 ? 'text-emerald-600' : 'text-red-600'}`;
  }

  // Calculate historical sequence of logged sessions
  let peakWatermark = startBal;
  let maxDrawdown = 0;
  let wins = 0;
  let losses = 0;
  let grossGains = 0;
  let grossLosses = 0;
  let returnSum = 0;
  let bestSession = 0;
  let loggedCount = 0;

  const wealthHistory = [];
  const pnlHistory = [];

  for (let s = 1; s <= N; s++) {
    if (appState.logs[s] !== undefined && appState.logs[s] !== null) {
      loggedCount++;
      const pnl = getNormalizedDailyPnL(s);
      const ret = getSessionReturnPct(s);
      const w = parseFloat(appState.logs[s]) + appState.vaultLedger.filter(r => r.session <= s).reduce((sum, r) => sum + r.amount, 0);

      wealthHistory.push({ s, w, desk: parseFloat(appState.logs[s]) });
      pnlHistory.push({ s, pnl });

      if (w > peakWatermark) peakWatermark = w;
      const dd = peakWatermark > 0 ? ((peakWatermark - w) / peakWatermark) * 100 : 0;
      if (dd > maxDrawdown) maxDrawdown = dd;

      if (pnl > 0) {
        wins++;
        grossGains += pnl;
      } else if (pnl < 0) {
        losses++;
        grossLosses += Math.abs(pnl);
      }

      returnSum += ret;
      if (pnl > bestSession) bestSession = pnl;
    }
  }

  const winRate = loggedCount > 0 ? (wins / loggedCount) * 100 : 0;
  const profitFactor = grossLosses > 0 ? (grossGains / grossLosses) : (grossGains > 0 ? 'Inf' : '0.00');
  const avgDailyReturn = loggedCount > 0 ? (returnSum / loggedCount) : 0;

  document.getElementById('statPeakWatermark').textContent = formatCurrency(peakWatermark);
  document.getElementById('statMaxDrawdown').textContent = `${maxDrawdown.toFixed(2)}%`;
  document.getElementById('statWinLossRecord').textContent = `${wins}W - ${losses}L`;
  document.getElementById('statWinRate').textContent = `${winRate.toFixed(1)}%`;
  document.getElementById('statProfitFactor').textContent = typeof profitFactor === 'number' ? profitFactor.toFixed(2) : profitFactor;
  document.getElementById('statAvgDailyReturn').textContent = formatPercent(avgDailyReturn);
  document.getElementById('statBestSession').textContent = formatCurrencyPnL(bestSession);

  // Consistency Score: based on win rate, drawdown, and discipline
  let score = 70;
  if (loggedCount > 0) {
    score = Math.min(100, Math.max(20, Math.round((winRate * 0.6) + ((100 - maxDrawdown) * 0.4))));
  }
  const elCircle = document.getElementById('consistencyScoreCircle');
  const elBadge = document.getElementById('consistencyBadge');
  const questFill = document.getElementById('statsQuestFill');
  const questScore = document.getElementById('statsQuestScore');
  if (elCircle) elCircle.textContent = score;
  if (questFill) questFill.style.width = `${score}%`;
  if (questScore) questScore.textContent = score;
  if (elBadge) {
    if (score >= 85) elBadge.textContent = 'Disciplined Compounding (A+)';
    else if (score >= 70) elBadge.textContent = 'Consistent Execution (B)';
    else elBadge.textContent = 'Developing Consistency (C)';
  }

  // Visualizers
  renderEquityCurveSvg(wealthHistory);
  renderDailyPnLSvg(pnlHistory);
  renderTradeDistribution();
}

function renderEquityCurveSvg(history) {
  const container = document.getElementById('chartEquityCurve');
  if (!container) return;

  if (history.length === 0) {
    container.innerHTML = `<div class="text-xs text-slate-400">Log closing balances to view equity curve.</div>`;
    return;
  }

  const w = 480;
  const h = 180;
  const pad = 24;

  const maxVal = Math.max(...history.map(d => Math.max(d.w, d.desk))) * 1.1;
  const minVal = Math.min(0, ...history.map(d => Math.min(d.w, d.desk)));
  const range = maxVal - minVal || 1;

  const ptsWealth = history.map((d, i) => {
    const x = pad + (i / Math.max(1, history.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.w - minVal) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(' ');

  const ptsDesk = history.map((d, i) => {
    const x = pad + (i / Math.max(1, history.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.desk - minVal) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(' ');

  container.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}">
      <line x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}" stroke="var(--chart-grid)" stroke-width="1" />
      <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${h - pad}" stroke="var(--chart-grid)" stroke-width="1" />
      <polyline fill="none" stroke="var(--chart-wealth)" stroke-width="2.5" stroke-linecap="round" points="${ptsWealth}" />
      <polyline fill="none" stroke="var(--chart-desk)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="4,2" points="${ptsDesk}" />
    </svg>
  `;
}

function renderDailyPnLSvg(history) {
  const container = document.getElementById('chartDailyPnL');
  if (!container) return;

  if (history.length === 0) {
    container.innerHTML = `<div class="text-xs text-slate-400">Log session closing balances to view daily PnL distribution.</div>`;
    return;
  }

  const w = 480;
  const h = 180;
  const pad = 24;

  const maxAbs = Math.max(...history.map(d => Math.abs(d.pnl)), 50) * 1.1;
  const zeroY = h / 2;

  const barWidth = Math.max(4, ((w - pad * 2) / history.length) - 4);

  const bars = history.map((d, i) => {
    const x = pad + i * ((w - pad * 2) / history.length) + 2;
    const barH = (Math.abs(d.pnl) / maxAbs) * (h / 2 - pad);
    const y = d.pnl >= 0 ? zeroY - barH : zeroY;
    const color = d.pnl >= 0 ? 'var(--chart-desk)' : 'var(--chart-loss)';
    return `<rect x="${x}" y="${y}" width="${barWidth}" height="${Math.max(2, barH)}" fill="${color}" rx="2" />`;
  }).join('');

  container.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}">
      <line x1="${pad}" y1="${zeroY}" x2="${w - pad}" y2="${zeroY}" stroke="var(--chart-grid)" stroke-width="1" stroke-dasharray="3,3" />
      ${bars}
    </svg>
  `;
}

function renderTradeDistribution() {
  const container = document.getElementById('chartTradeDistribution');
  if (!container) return;

  const trades = appState.tradeLogs;
  if (trades.length === 0) {
    container.innerHTML = `<div class="text-xs text-slate-400 py-2">No trade executions logged in Trade Journal yet.</div>`;
    return;
  }

  const brackets = [
    { label: '< $50', count: 0 },
    { label: '$50 - $100', count: 0 },
    { label: '$100 - $250', count: 0 },
    { label: '$250+', count: 0 },
  ];

  trades.forEach(t => {
    const val = t.entryAmount || 0;
    if (val < 50) brackets[0].count++;
    else if (val <= 100) brackets[1].count++;
    else if (val <= 250) brackets[2].count++;
    else brackets[3].count++;
  });

  const maxCount = Math.max(...brackets.map(b => b.count), 1);

  container.innerHTML = brackets.map(b => {
    const pct = (b.count / maxCount) * 100;
    return `
      <div class="space-y-1">
        <div class="flex justify-between text-xs text-slate-600">
          <span>${b.label}</span>
          <span class="font-bold font-num">${b.count} trades</span>
        </div>
        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full bg-blue-500 rounded-full" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================
// 7. EVENT HANDLERS & USER ACTIONS
// ==========================================

function switchMainTab(tabName) {
  document.body.classList.remove('mobile-nav-open');
  const menuButton = document.getElementById('btnMobileMenu');
  if (menuButton) { menuButton.textContent = '☰'; menuButton.setAttribute('aria-label', 'Open navigation'); }
  const tabs = ['tracker', 'config', 'trades', 'milestones', 'stats', 'account'];
  tabs.forEach(t => {
    const content = document.getElementById(`tabContent${capitalize(t)}`);
    const btn = document.getElementById(`nav${capitalize(t)}Btn`);
    if (content) content.classList.remove('active');
    if (btn) {
      btn.classList.remove('active-nav-item');
      btn.className = 'px-4 py-2.5 text-slate-600 hover:text-slate-900 border-b-2 border-transparent whitespace-nowrap';
    }
  });

  const activeContent = document.getElementById(`tabContent${capitalize(tabName)}`);
  const activeBtn = document.getElementById(`nav${capitalize(tabName)}Btn`);
  if (activeContent) activeContent.classList.add('active');
  if (activeBtn) {
    activeBtn.className = 'px-4 py-2.5 text-emerald-600 border-b-2 border-emerald-600 font-bold whitespace-nowrap active-nav-item';
  }
  if (activeContent) { activeContent.classList.remove('view-transition'); void activeContent.offsetWidth; activeContent.classList.add('view-transition'); }

  // Refresh module data
  refreshAllViews();
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('pgl_theme_v1', theme);
  const button = document.getElementById('btnThemeToggle');
  if (button) {
    const dark = theme === 'dark';
    button.innerHTML = dark
      ? '<svg class="theme-toggle-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg><span>Light mode</span>'
      : '<svg class="theme-toggle-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"/></svg><span>Dark mode</span>';
    button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }
}

function toggleTheme() {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
}

function toggleMobileNav() {
  const open = document.body.classList.toggle('mobile-nav-open');
  const button = document.getElementById('btnMobileMenu');
  if (button) {
    button.textContent = open ? '×' : '☰';
    button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }
}

function switchTrackerSubTab(subtab) {
  const subtabs = ['desk', 'calendar', 'tfg'];
  subtabs.forEach(st => {
    const content = document.getElementById(`subtab${capitalize(st)}`);
    const btn = document.getElementById(`subnav${capitalize(st)}Btn`);
    if (content) content.classList.remove('active');
    if (btn) {
      btn.className = 'px-3 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 border-b-2 border-transparent';
    }
  });

  const activeContent = document.getElementById(`subtab${capitalize(subtab)}`);
  const activeBtn = document.getElementById(`subnav${capitalize(subtab)}Btn`);
  if (activeContent) activeContent.classList.add('active');
  if (activeBtn) {
    activeBtn.className = 'px-3 py-2 text-sm font-semibold text-emerald-700 border-b-2 border-emerald-600 active-subtab';
  }
  if (activeContent) { activeContent.classList.remove('view-transition'); void activeContent.offsetWidth; activeContent.classList.add('view-transition'); }

  if (subtab === 'calendar') renderCalendarView();
  if (subtab === 'tfg') renderTotalFinancialGoal();
}

function switchConfigSubTab(subtab) {
  const subtabs = ['active', 'wizard', 'reset'];
  subtabs.forEach(st => {
    const content = document.getElementById(`subtabCfg${capitalize(st)}`);
    const btn = document.getElementById(`subnavCfg${capitalize(st)}Btn`);
    if (content) content.classList.remove('active');
    if (btn) {
      btn.className = 'px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 border-b-2 border-transparent';
    }
  });

  const activeContent = document.getElementById(`subtabCfg${capitalize(subtab)}`);
  const activeBtn = document.getElementById(`subnavCfg${capitalize(subtab)}Btn`);
  if (activeContent) activeContent.classList.add('active');
  if (activeBtn) {
    activeBtn.className = 'px-4 py-2 text-sm font-semibold text-emerald-700 border-b-2 border-emerald-600 active-subtab';
  }
  if (activeContent) { activeContent.classList.remove('view-transition'); void activeContent.offsetWidth; activeContent.classList.add('view-transition'); }
}

function switchTradesSubTab(subtab) {
  const subtabs = ['logger', 'journal', 'analytics'];
  subtabs.forEach(st => {
    const content = document.getElementById(`subtabTrades${capitalize(st)}`);
    const btn = document.getElementById(`subnavTrades${capitalize(st)}Btn`);
    if (content) content.classList.remove('active');
    if (btn) {
      btn.className = 'px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 border-b-2 border-transparent';
    }
  });

  const activeContent = document.getElementById(`subtabTrades${capitalize(subtab)}`);
  const activeBtn = document.getElementById(`subnavTrades${capitalize(subtab)}Btn`);
  if (activeContent) activeContent.classList.add('active');
  if (activeBtn) {
    activeBtn.className = 'px-4 py-2 text-sm font-semibold text-emerald-700 border-b-2 border-emerald-600 active-subtab';
  }
  if (activeContent) { activeContent.classList.remove('view-transition'); void activeContent.offsetWidth; activeContent.classList.add('view-transition'); }

  if (subtab === 'journal') renderTradeHistoryTable();
  if (subtab === 'analytics') renderTradeAnalytics();
}

function switchVaultSubTab(subtab) {
  const subtabs = ['overview', 'bills', 'savings', 'milestones'];
  subtabs.forEach(st => {
    const content = document.getElementById(`subtabVault${capitalize(st)}`);
    const btn = document.getElementById(`subnavVault${capitalize(st)}Btn`);
    if (content) content.classList.remove('active');
    if (btn) {
      btn.className = 'px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 border-b-2 border-transparent';
    }
  });

  const activeContent = document.getElementById(`subtabVault${capitalize(subtab)}`);
  const activeBtn = document.getElementById(`subnavVault${capitalize(subtab)}Btn`);
  if (activeContent) activeContent.classList.add('active');
  if (activeBtn) {
    activeBtn.className = 'px-4 py-2 text-sm font-semibold text-emerald-700 border-b-2 border-emerald-600 active-subtab';
  }
  if (activeContent) { activeContent.classList.remove('view-transition'); void activeContent.offsetWidth; activeContent.classList.add('view-transition'); }

  if (subtab === 'overview') renderRecentVaultLedger();
  if (subtab === 'bills') renderBillsBreakdown();
  if (subtab === 'savings') renderSavingsReserve();
  if (subtab === 'milestones') renderSafetyMilestones();
}

function setPace(pace) {
  appState.pace = pace;
  saveStateToStorage();
  render3PaceTargetsSection();
  renderDailyDesk();
}

function setPlanViewMode(mode) {
  appState.planViewMode = mode;
  saveStateToStorage();
  renderDailyDesk();
}

function setBillsBasis(basis) {
  appState.billsBasis = basis;
  saveStateToStorage();
  renderBillsBreakdown();
}

function navigateSession(delta) {
  const profile = getActiveProfile();
  if (!profile) return;
  const next = appState.activeSession + delta;
  if (next >= 1 && next <= profile.totalSessions) {
    appState.activeSession = next;
    saveStateToStorage();
    renderDailyDesk();
    render3PaceTargetsSection();
    renderHeaderAndTopBar();
  }
}

function jumpToSession(sessionNum) {
  const profile = getActiveProfile();
  if (!profile) return;
  if (sessionNum >= 1 && sessionNum <= profile.totalSessions) {
    appState.activeSession = sessionNum;
    saveStateToStorage();
    renderDailyDesk();
    render3PaceTargetsSection();
    renderHeaderAndTopBar();
  }
}

function handleSessionBalanceChange(val) {
  const s = appState.activeSession;
  if (appState.lockedSessions[s]) return; // Protected

  const raw = typeof val === 'string' ? val.trim() : (val !== null && val !== undefined ? String(val).trim() : '');
  if (raw === '' || isNaN(Number(raw))) {
    delete appState.logs[s];
    delete appState.timestamps[s];
  } else {
    appState.logs[s] = parseFloat(raw);
    appState.timestamps[s] = new Date().toISOString();
  }

  saveStateToStorage();
  renderDailyDesk();
  render3PaceTargetsSection();
  renderHeaderAndTopBar();
}

function saveActiveSession() {
  const input = document.getElementById('sessionBalanceInput');
  const session = appState.activeSession;
  if (appState.lockedSessions[session]) {
    openModal({ title: 'Session is locked', message: 'Unlock this session before saving changes.' });
    return;
  }
  if (!input) return;

  const rawVal = input.value.trim();
  if (rawVal === '') {
    // Gracefully clear session balance if input is emptied
    delete appState.logs[session];
    delete appState.timestamps[session];
    const notes = document.getElementById('sessionNotesInput');
    if (notes) appState.notes[session] = notes.value;
    saveStateToStorage();
    refreshAllViews();
    const button = document.getElementById('btnSaveDailySession');
    if (button) {
      button.textContent = '✓ Cleared';
      button.classList.add('is-saved');
      setTimeout(() => {
        if (!button.isConnected) return;
        button.innerHTML = '<svg viewBox="0 0 40 56" aria-hidden="true"><use href="#sprite-hero"/></svg>Save session';
        button.classList.remove('is-saved');
      }, 1800);
    }
    return;
  }

  if (!Number.isFinite(Number(rawVal))) {
    openModal({ title: 'Valid balance needed', message: 'Please enter a valid numeric closing balance.' });
    input.focus();
    return;
  }

  appState.logs[session] = Number(rawVal);
  appState.timestamps[session] = new Date().toISOString();
  const notes = document.getElementById('sessionNotesInput');
  if (notes) appState.notes[session] = notes.value;
  saveStateToStorage();
  refreshAllViews();
  const button = document.getElementById('btnSaveDailySession');
  if (button) {
    button.textContent = '✓ Saved';
    button.classList.add('is-saved');
    setTimeout(() => {
      if (!button.isConnected) return;
      button.innerHTML = '<svg viewBox="0 0 40 56" aria-hidden="true"><use href="#sprite-hero"/></svg>Save session';
      button.classList.remove('is-saved');
    }, 1800);
  }
}

function handleSessionNotesChange(val) {
  const s = appState.activeSession;
  appState.notes[s] = val;
  saveStateToStorage();
}

function toggleLockActiveSession() {
  const s = appState.activeSession;
  appState.lockedSessions[s] = !appState.lockedSessions[s];
  saveStateToStorage();
  renderDailyDesk();
}

function fillTargetForActiveSession() {
  const s = appState.activeSession;
  if (appState.lockedSessions[s]) {
    openModal({
      title: 'Session is Locked',
      message: 'Unlock the session before editing balance.'
    });
    return;
  }
  const target = getActiveTargetForSession(s);
  appState.logs[s] = target;
  appState.timestamps[s] = new Date().toISOString();
  const balInput = document.getElementById('sessionBalanceInput');
  if (balInput) balInput.value = target;
  saveStateToStorage();
  renderDailyDesk();
  render3PaceTargetsSection();
  renderHeaderAndTopBar();
}

function executeProfitAllocation() {
  const s = appState.activeSession;
  const dailyPnL = getNormalizedDailyPnL(s);
  const curBal = getCurrentDeskBalance(s);
  const preview = calculateProfitAllocationPreview(dailyPnL, appState.bills, appState.milestoneCfg.reserveFloor, curBal);

  if (!preview) return;

  const performAllocation = () => {
    // 1. Deduct skim from closing balance
    const postBal = curBal - preview.totalSkim;
    appState.logs[s] = postBal;

    // 2. Add Bills skim record
    if (preview.allocBills > 0) {
      appState.vaultLedger.push({
        id: 'vrec_' + Date.now(),
        session: s,
        date: new Date().toISOString(),
        amount: preview.allocBills,
        note: `Automated Allocation - Bills (${preview.phase === 1 ? 'Phase 1' : 'Phase 2'})`,
        bucket: 'bills'
      });

      // Distribute to unfunded bills
      let remainingToDistribute = preview.allocBills;
      appState.bills.forEach(b => {
        if (b.status !== 'paid' && remainingToDistribute > 0) {
          const needed = b.amountDue - (b.amountReserved || 0);
          const add = Math.min(needed, remainingToDistribute);
          b.amountReserved = (b.amountReserved || 0) + add;
          remainingToDistribute -= add;
          if (b.amountReserved >= b.amountDue) {
            b.status = 'funded';
          } else {
            b.status = 'partial';
          }
        }
      });
    }

    // 3. Add Savings skim record
    if (preview.allocSavings > 0) {
      appState.vaultLedger.push({
        id: 'vrec_' + (Date.now() + 1),
        session: s,
        date: new Date().toISOString(),
        amount: preview.allocSavings,
        note: `Automated Allocation - Savings (${preview.phase === 1 ? 'Phase 1' : 'Phase 2'})`,
        bucket: 'savings'
      });
    }

    saveStateToStorage();
    refreshAllViews();
    openModal({
      title: 'Allocation Complete',
      message: `Successfully transferred ${formatCurrency(preview.totalSkim)} into Vault (${formatCurrency(preview.allocBills)} Bills, ${formatCurrency(preview.allocSavings)} Savings). Desk balance is now ${formatCurrency(postBal)}.`
    });
  };

  if (preview.floorViolated) {
    openModal({
      title: '⚠️ Capital Floor Warning',
      message: `Executing this allocation will leave trading desk balance at ${formatCurrency(preview.postDeskBalance)}, which is below your configured reserve floor of ${formatCurrency(appState.milestoneCfg.reserveFloor)}. Do you wish to proceed?`,
      confirmText: 'Proceed Anyway',
      onConfirm: performAllocation
    });
  } else {
    performAllocation();
  }
}

function copyMasterTableToClipboard() {
  const profile = getActiveProfile();
  if (!profile) {
    openModal({ title: 'No Challenge', message: 'There is no active challenge to copy.' });
    return;
  }
  let tsv = "Session\tDate\tRelaxed\tMid\tAggressive\tClosing Balance\tVault Skims\tDaily PnL\tReturn %\tNotes\n";

  for (let s = 1; s <= profile.totalSessions; s++) {
    const row = profile.sessions[s - 1] || profile.sessions[0];
    const dateStr = getDateForSession(profile.startDate, s);
    const bal = appState.logs[s] !== undefined ? appState.logs[s] : '';
    const skims = getSessionVaultSkims(s);
    const pnl = getNormalizedDailyPnL(s);
    const ret = getSessionReturnPct(s);
    const notes = appState.notes[s] || '';

    tsv += `${s}\t${dateStr}\t${row.r}\t${row.m}\t${row.a}\t${bal}\t${skims}\t${pnl}\t${ret.toFixed(2)}%\t${notes}\n`;
  }

  navigator.clipboard.writeText(tsv).then(() => {
    openModal({ title: 'Copied to Clipboard', message: 'Master table data copied in TSV format. You can paste it directly into Excel or Google Sheets!' });
  }).catch(() => {
    openModal({ title: 'Copy Error', message: 'Failed to copy to clipboard.' });
  });
}

function navigateCalendarMonth(delta) {
  calendarViewMonth += delta;
  if (calendarViewMonth < 0) {
    calendarViewMonth = 11;
    calendarViewYear--;
  } else if (calendarViewMonth > 11) {
    calendarViewMonth = 0;
    calendarViewYear++;
  }
  renderCalendarView();
}

function setCalendarToday() {
  const now = new Date();
  calendarViewYear = now.getFullYear();
  calendarViewMonth = now.getMonth();
  renderCalendarView();
}

// ==========================================
// 8. QUICK EDIT & CHALLENGE WIZARD
// ==========================================

function openQuickEditParamsModal() {
  const profile = getActiveProfile();
  if (!profile) {
    openModal({ title: 'No Challenge', message: 'No active challenge found to edit.' });
    return;
  }
  document.getElementById('quickEditBaseInput').value = profile.base;
  document.getElementById('quickEditTargetInput').value = profile.portTarget;
  openModalDialog('quickEditParamsModal');
}

function handleQuickEditApply() {
  const profile = getActiveProfile();
  if (!profile) return;
  const base = Math.max(0, parseFloat(document.getElementById('quickEditBaseInput').value) || 0);
  const target = Math.max(base, parseFloat(document.getElementById('quickEditTargetInput').value) || base);

  profile.base = base;
  profile.portTarget = target;
  profile.targetBalance = target;
  profile.sessions = generateRoadmapSessions(
    profile.curveType || 'tri_pace_independent',
    base,
    target,
    profile.totalSessions,
    profile.withdrawalTarget,
    profile.withdrawalDays
  );

  saveStateToStorage();
  closeModal('quickEditParamsModal');
  refreshAllViews();
}

function handleQuickSaveStep1() {
  const name = document.getElementById('genName').value.trim() || 'My Challenge';
  const base = Math.max(0, parseFloat(document.getElementById('genBase').value) || 0);
  const target = Math.max(base, parseFloat(document.getElementById('genTarget').value) || 0);
  const sessions = Math.max(2, parseInt(document.getElementById('genSessions').value) || 2);
  const startDate = document.getElementById('genStartDate').value || new Date().toISOString().split('T')[0];
  const curveType = document.getElementById('genCurveType')?.value || 'tri_pace_independent';
  const withdrawalTarget = parseFloat(document.getElementById('genWithdrawalTarget')?.value) || 0;
  const withdrawalDays = parseInt(document.getElementById('genWithdrawalDays')?.value) || sessions;
  const skimMode = !!document.getElementById('genSkimMode')?.checked;

  let profile;
  if (setupNewProfileDraft || !getActiveProfile()) {
    profile = {
      id: `prof_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name,
      base,
      portTarget: target,
      targetBalance: target,
      totalSessions: sessions,
      startDate,
      curveType,
      withdrawalTarget,
      withdrawalDays,
      skimMode,
      sessions: generateRoadmapSessions(curveType, base, target, sessions, withdrawalTarget, withdrawalDays)
    };
    appState.profiles.push(profile);
    appState.activeProfileId = profile.id;
    appState.activeSession = 1;
    setupNewProfileDraft = false;
  } else {
    profile = getActiveProfile();
    profile.name = name;
    profile.base = base;
    profile.portTarget = target;
    profile.targetBalance = target;
    profile.totalSessions = sessions;
    profile.startDate = startDate;
    profile.curveType = curveType;
    profile.withdrawalTarget = withdrawalTarget;
    profile.withdrawalDays = withdrawalDays;
    profile.skimMode = skimMode;
    profile.sessions = generateRoadmapSessions(curveType, base, target, sessions, withdrawalTarget, withdrawalDays);
  }

  saveStateToStorage();
  refreshAllViews();
}

function startChallengeFromSetup() {
  const baseInput = document.getElementById('genBase');
  const targetInput = document.getElementById('genTarget');
  const sessionsInput = document.getElementById('genSessions');
  const base = parseFloat(baseInput?.value);
  const target = parseFloat(targetInput?.value);
  const sessions = parseInt(sessionsInput?.value, 10);
  const invalid = [
    [baseInput, base > 0, 'Enter a starting balance above zero.'],
    [targetInput, target >= base, 'Your goal must be at least your starting balance.'],
    [sessionsInput, sessions >= 2, 'Enter at least 2 sessions.']
  ].find(([input, valid]) => input && !valid);
  if (invalid) {
    const [input, , message] = invalid;
    input.setCustomValidity(message);
    input.addEventListener('input', () => input.setCustomValidity(''), { once: true });
    input.focus();
    input.reportValidity();
    return;
  }
  handleQuickSaveStep1();
  switchMainTab('tracker');
}

function startNewChallengeDraft() {
  setupNewProfileDraft = true;
  const today = new Date();
  const dateValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  ['genName', 'genBase', 'genTarget', 'genSessions', 'genWithdrawalTarget', 'genWithdrawalDays'].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.value = '';
  });
  const startDate = document.getElementById('genStartDate');
  if (startDate) startDate.value = dateValue;
  const curveType = document.getElementById('genCurveType');
  if (curveType) curveType.value = 'tri_pace_independent';
  const skimMode = document.getElementById('genSkimMode');
  if (skimMode) skimMode.checked = false;
  handleCurveTypeChange('tri_pace_independent');
  renderSetupChallengePreview();
  const setupTitle = document.getElementById('setupFormTitle');
  const setupHelp = document.getElementById('setupFormHelp');
  if (setupTitle) setupTitle.textContent = 'New challenge';
  if (setupHelp) setupHelp.textContent = 'Set your challenge parameters, roadmap goals and session schedule.';
  document.getElementById('subtabCfgWizard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setSetupStep(step) {
  renderSetupChallengePreview();
}

function selectStrategyCurve(type) {
  const hiddenInput = document.getElementById('genCurveType');
  if (hiddenInput) hiddenInput.value = type;
  handleCurveTypeChange(type);
}

function handleCurveTypeChange(type) {
  const cashoutBox = document.getElementById('wizardCashoutSettings');
  const hiddenInput = document.getElementById('genCurveType');
  if (hiddenInput && hiddenInput.value !== type) {
    hiddenInput.value = type;
  }

  const descriptions = {
    tri_pace_independent: 'Keeps relaxed, steady and fast target paths separate.',
    smooth: 'Spreads growth evenly from your start to your goal.',
    decay: 'Sets bigger early steps, then eases the targets later.',
    port_target_withdrawal: 'Adds planned withdrawals to your portfolio targets.'
  };
  const description = document.getElementById('strategyDescription');
  if (description) description.textContent = descriptions[type] || descriptions.tri_pace_independent;

  if (cashoutBox) {
    if (type === 'port_target_withdrawal') {
      cashoutBox.classList.remove('hidden');
    } else {
      cashoutBox.classList.add('hidden');
    }
  }

  // Update visual state of strategy pills
  const pills = document.querySelectorAll('.strategy-pill');
  pills.forEach(pill => {
    const isMatch = pill.dataset.curve === type;
    pill.classList.toggle('active', isMatch);
    pill.setAttribute('aria-checked', isMatch ? 'true' : 'false');
  });
}

function renderWizardPreview() {
  const previewBox = document.getElementById('wizardCheckpointsPreview');
  if (!previewBox) return;

  const base = Math.max(0, parseFloat(document.getElementById('genBase').value) || 0);
  const target = Math.max(base, parseFloat(document.getElementById('genTarget').value) || 0);
  const sessions = Math.max(2, parseInt(document.getElementById('genSessions').value) || 2);
  const curveType = document.getElementById('genCurveType').value || 'tri_pace_independent';
  const withdrawalTarget = parseFloat(document.getElementById('genWithdrawalTarget')?.value) || 0;
  const withdrawalDays = parseInt(document.getElementById('genWithdrawalDays')?.value) || sessions;

  const generated = generateRoadmapSessions(curveType, base, target, sessions, withdrawalTarget, withdrawalDays);

  const keySessions = [1, Math.round(sessions * 0.25), Math.round(sessions * 0.5), Math.round(sessions * 0.75), sessions];
  const rows = keySessions.map(s => {
    const row = generated[s - 1] || generated[0];
    return `
      <tr>
        <td class="p-2 font-bold font-num">Session ${s}</td>
        <td class="p-2 font-num">${formatCurrency(row.r)}</td>
        <td class="p-2 font-num text-amber-700">${formatCurrency(row.m)}</td>
        <td class="p-2 font-num text-purple-700">${formatCurrency(row.a)}</td>
        <td class="p-2 text-slate-500">${row.tag || '-'}</td>
      </tr>
    `;
  }).join('');

  previewBox.innerHTML = `
    <table class="w-full text-left">
      <thead class="bg-slate-50 border-b border-slate-200">
        <tr>
          <th class="p-2">Milestone</th>
          <th class="p-2">Relaxed ($)</th>
          <th class="p-2">Mid ($)</th>
          <th class="p-2">Aggressive ($)</th>
          <th class="p-2">Tag</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function handleSaveProfile(updateActive = true) {
  const name = document.getElementById('genName').value.trim() || 'My Challenge';
  const base = Math.max(0, parseFloat(document.getElementById('genBase').value) || 0);
  const target = Math.max(base, parseFloat(document.getElementById('genTarget').value) || 0);
  const sessions = Math.max(2, parseInt(document.getElementById('genSessions').value) || 2);
  const startDate = document.getElementById('genStartDate').value || new Date().toISOString().split('T')[0];
  const curveType = document.getElementById('genCurveType').value || 'tri_pace_independent';
  const withdrawalTarget = parseFloat(document.getElementById('genWithdrawalTarget')?.value) || 0;
  const withdrawalDays = parseInt(document.getElementById('genWithdrawalDays')?.value) || sessions;
  const skimMode = !!document.getElementById('genSkimMode')?.checked;

  const newSessions = generateRoadmapSessions(curveType, base, target, sessions, withdrawalTarget, withdrawalDays);

  if (updateActive && getActiveProfile()) {
    const profile = getActiveProfile();
    profile.name = name;
    profile.base = base;
    profile.portTarget = target;
    profile.targetBalance = target;
    profile.totalSessions = sessions;
    profile.startDate = startDate;
    profile.curveType = curveType;
    profile.withdrawalTarget = withdrawalTarget;
    profile.withdrawalDays = withdrawalDays;
    profile.skimMode = skimMode;
    profile.sessions = newSessions;
  } else {
    const newProfile = {
      id: 'prof_' + Date.now(),
      name,
      base,
      portTarget: target,
      targetBalance: target,
      totalSessions: sessions,
      startDate,
      curveType,
      withdrawalTarget,
      withdrawalDays,
      skimMode,
      sessions: newSessions
    };
    appState.profiles.push(newProfile);
    appState.activeProfileId = newProfile.id;
  }

  saveStateToStorage();
  refreshAllViews();
  switchConfigSubTab('active');
  openModal({
    title: 'Challenge Profile Saved',
    message: `Challenge "${name}" is now saved and active!`
  });
}

function handleProfileSelect(profileId) {
  appState.activeProfileId = profileId;
  saveStateToStorage();
  refreshAllViews();
}

function handleSwitchProfile(profileId) {
  if (!profileId || profileId === appState.activeProfileId) return;
  setupNewProfileDraft = false;
  appState.activeProfileId = profileId;
  saveStateToStorage();
  refreshAllViews();
}

function handleEditActiveChallenge() {
  handleLoadProfileIntoWizard(appState.activeProfileId);
}

function handleDeleteActiveChallenge() {
  handleDeleteProfile(appState.activeProfileId);
}

function handleLoadProfileIntoWizard(profileId) {
  const p = appState.profiles.find(pr => pr.id === profileId) || getActiveProfile();
  if (!p) return;
  setupNewProfileDraft = false;

  const nameEl = document.getElementById('genName');
  const baseEl = document.getElementById('genBase');
  const targetEl = document.getElementById('genTarget');
  const sessionsEl = document.getElementById('genSessions');
  const dateEl = document.getElementById('genStartDate');
  const curveEl = document.getElementById('genCurveType');

  if (nameEl) nameEl.value = p.name || '';
  if (baseEl) baseEl.value = p.base || '';
  if (targetEl) targetEl.value = p.portTarget || p.targetBalance || '';
  if (sessionsEl) sessionsEl.value = p.totalSessions || 28;
  if (dateEl) dateEl.value = p.startDate || new Date().toISOString().split('T')[0];
  if (curveEl) curveEl.value = p.curveType || 'tri_pace_independent';

  handleCurveTypeChange(p.curveType || 'tri_pace_independent');
  if (document.getElementById('genWithdrawalTarget')) document.getElementById('genWithdrawalTarget').value = p.withdrawalTarget || 0;
  if (document.getElementById('genWithdrawalDays')) document.getElementById('genWithdrawalDays').value = p.withdrawalDays || p.totalSessions;
  if (document.getElementById('genSkimMode')) document.getElementById('genSkimMode').checked = !!p.skimMode;

  const setupTitle = document.getElementById('setupFormTitle');
  const setupHelp = document.getElementById('setupFormHelp');
  if (setupTitle) setupTitle.textContent = `Edit "${p.name || 'Challenge'}"`;
  if (setupHelp) setupHelp.textContent = 'Modify your parameters below and click Start Challenge to save your changes.';

  const wizardPanel = document.getElementById('subtabCfgWizard');
  if (wizardPanel) {
    wizardPanel.style.display = '';
  }
  renderSetupChallengePreview();
  wizardPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleDeleteProfile(profileId) {
  const p = appState.profiles.find(pr => pr.id === profileId) || getActiveProfile();
  if (!p) return;
  const challengeName = p.name || 'this challenge';

  openModal({
    title: 'Delete Challenge',
    message: `Are you sure you want to delete "${challengeName}"? This action will remove this challenge roadmap and its logged session history.`,
    confirmText: 'Delete Challenge',
    onConfirm: () => {
      appState.profiles = appState.profiles.filter(pr => pr.id !== p.id);
      if (appState.profiles.length > 0) {
        if (appState.activeProfileId === p.id) {
          appState.activeProfileId = appState.profiles[0].id;
          appState.activeSession = 1;
        }
      } else {
        appState.activeProfileId = null;
        appState.activeSession = 1;
        appState.logs = {};
        appState.lockedSessions = {};
        appState.notes = {};
        appState.timestamps = {};
      }
      startNewChallengeDraft();
      saveStateToStorage();
      refreshAllViews();
      openModal({ title: 'Challenge Deleted', message: `"${challengeName}" has been removed.` });
    }
  });
}

// ==========================================
// 9. TRADE JOURNAL ACTIONS
// ==========================================

function calculateTradePreview() {
  const entry = parseFloat(document.getElementById('tradeEntryInput')?.value) || 0;
  const exit = parseFloat(document.getElementById('tradeExitInput')?.value) || 0;
  const fees = parseFloat(document.getElementById('tradeFeesInput')?.value) || 0;

  const net = exit - entry - fees;
  const ret = entry > 0 ? (net / entry) * 100 : 0;

  const elNet = document.getElementById('tradePreviewNetPnL');
  const elRet = document.getElementById('tradePreviewReturn');

  if (elNet) {
    elNet.textContent = formatCurrency(net);
    elNet.className = `text-base font-bold font-num ${net >= 0 ? 'text-emerald-600' : 'text-red-600'}`;
  }
  if (elRet) {
    elRet.textContent = formatPercent(ret);
    elRet.className = `text-xs font-semibold font-num ${ret >= 0 ? 'text-emerald-700' : 'text-red-700'}`;
  }
}

function handleAddTradeSubmit() {
  const sessionNum = parseInt(document.getElementById('tradeSessionSelect').value) || appState.activeSession;
  const tradeNo = document.getElementById('tradeLabelInput').value || `Trade ${appState.tradeLogs.length + 1}`;
  const date = document.getElementById('tradeDateInput').value || new Date().toISOString().split('T')[0];
  const status = document.getElementById('tradeStatusSelect').value || 'closed';
  const entryAmount = parseFloat(document.getElementById('tradeEntryInput').value) || 0;
  const exitValue = parseFloat(document.getElementById('tradeExitInput').value) || 0;
  const fees = parseFloat(document.getElementById('tradeFeesInput').value) || 0;
  const notes = document.getElementById('tradeNotesInput').value || '';

  const newTrade = {
    id: 'trade_' + Date.now(),
    sessionNum,
    tradeNo,
    date,
    status,
    entryAmount,
    exitValue,
    fees,
    notes
  };

  appState.tradeLogs.push(newTrade);
  saveStateToStorage();

  // Reset logger inputs
  document.getElementById('tradeLabelInput').value = `Trade ${String.fromCharCode(65 + (appState.tradeLogs.length % 26))}`;
  document.getElementById('tradeEntryInput').value = '';
  document.getElementById('tradeExitInput').value = '';
  document.getElementById('tradeNotesInput').value = '';
  calculateTradePreview();

  renderTradeHistoryTable();
  renderTradeAnalytics();
}

function openLogTradeModal() {
  document.getElementById('tradeModalTitle').textContent = 'Log New Trade';
  document.getElementById('tradeModalId').value = '';
  document.getElementById('modalTradeLabelInput').value = `Trade ${appState.tradeLogs.length + 1}`;
  document.getElementById('modalTradeDateInput').value = new Date().toISOString().split('T')[0];
  document.getElementById('modalTradeStatusSelect').value = 'closed';
  document.getElementById('modalTradeEntryInput').value = '';
  document.getElementById('modalTradeExitInput').value = '';
  document.getElementById('modalTradeFeesInput').value = '';
  document.getElementById('modalTradeNotesInput').value = '';

  openModalDialog('tradeModal');
}

function openEditTradeModal(id) {
  const trade = appState.tradeLogs.find(t => t.id === id);
  if (!trade) return;

  document.getElementById('tradeModalTitle').textContent = `Edit ${trade.tradeNo}`;
  document.getElementById('tradeModalId').value = trade.id;
  document.getElementById('modalTradeSessionSelect').value = trade.sessionNum;
  document.getElementById('modalTradeLabelInput').value = trade.tradeNo;
  document.getElementById('modalTradeDateInput').value = trade.date;
  document.getElementById('modalTradeStatusSelect').value = trade.status;
  document.getElementById('modalTradeEntryInput').value = trade.entryAmount;
  document.getElementById('modalTradeExitInput').value = trade.exitValue;
  document.getElementById('modalTradeFeesInput').value = trade.fees;
  document.getElementById('modalTradeNotesInput').value = trade.notes || '';

  openModalDialog('tradeModal');
}

function handleSaveTradeModalSubmit() {
  const id = document.getElementById('tradeModalId').value;
  const sessionNum = parseInt(document.getElementById('modalTradeSessionSelect').value) || appState.activeSession;
  const tradeNo = document.getElementById('modalTradeLabelInput').value || 'Trade';
  const date = document.getElementById('modalTradeDateInput').value || new Date().toISOString().split('T')[0];
  const status = document.getElementById('modalTradeStatusSelect').value || 'closed';
  const entryAmount = parseFloat(document.getElementById('modalTradeEntryInput').value) || 0;
  const exitValue = parseFloat(document.getElementById('modalTradeExitInput').value) || 0;
  const fees = parseFloat(document.getElementById('modalTradeFeesInput').value) || 0;
  const notes = document.getElementById('modalTradeNotesInput').value || '';

  if (id) {
    const idx = appState.tradeLogs.findIndex(t => t.id === id);
    if (idx !== -1) {
      appState.tradeLogs[idx] = { id, sessionNum, tradeNo, date, status, entryAmount, exitValue, fees, notes };
    }
  } else {
    appState.tradeLogs.push({ id: 'trade_' + Date.now(), sessionNum, tradeNo, date, status, entryAmount, exitValue, fees, notes });
  }

  saveStateToStorage();
  closeModal('tradeModal');
  renderTradeHistoryTable();
  renderTradeAnalytics();
}

function handleDeleteTrade(id) {
  openModal({
    title: 'Delete Trade',
    message: 'Are you sure you want to remove this trade execution log?',
    confirmText: 'Delete',
    onConfirm: () => {
      appState.tradeLogs = appState.tradeLogs.filter(t => t.id !== id);
      saveStateToStorage();
      renderTradeHistoryTable();
      renderTradeAnalytics();
    }
  });
}

// ==========================================
// 10. BILLS & VAULT ACTIONS
// ==========================================

function openAddBillModal() {
  document.getElementById('billModalTitle').textContent = 'Add Recurring Bill Liability';
  document.getElementById('billModalId').value = '';
  document.getElementById('billNameInput').value = '';
  document.getElementById('billAmountDueInput').value = '';
  document.getElementById('billAmountReservedInput').value = '0';
  document.getElementById('billDueDateInput').value = new Date().toISOString().split('T')[0];
  document.getElementById('billPrioritySelect').value = 'high';
  document.getElementById('billStatusSelect').value = 'unfunded';
  document.getElementById('billNotesInput').value = '';

  openModalDialog('billModal');
}

function openEditBillModal(id) {
  const bill = appState.bills.find(b => b.id === id);
  if (!bill) return;

  document.getElementById('billModalTitle').textContent = `Edit ${bill.name}`;
  document.getElementById('billModalId').value = bill.id;
  document.getElementById('billNameInput').value = bill.name;
  document.getElementById('billAmountDueInput').value = bill.amountDue;
  document.getElementById('billAmountReservedInput').value = bill.amountReserved || 0;
  document.getElementById('billDueDateInput').value = bill.dueDate || '';
  document.getElementById('billPrioritySelect').value = bill.priority || 'medium';
  document.getElementById('billStatusSelect').value = bill.status || 'unfunded';
  document.getElementById('billNotesInput').value = bill.notes || '';

  openModalDialog('billModal');
}

function handleSaveBillSubmit() {
  const id = document.getElementById('billModalId').value;
  const name = document.getElementById('billNameInput').value || 'Bill';
  const amountDue = parseFloat(document.getElementById('billAmountDueInput').value) || 0;
  const amountReserved = parseFloat(document.getElementById('billAmountReservedInput').value) || 0;
  const dueDate = document.getElementById('billDueDateInput').value || '';
  const priority = document.getElementById('billPrioritySelect').value || 'medium';
  const status = document.getElementById('billStatusSelect').value || 'unfunded';
  const notes = document.getElementById('billNotesInput').value || '';

  if (id) {
    const idx = appState.bills.findIndex(b => b.id === id);
    if (idx !== -1) {
      appState.bills[idx] = { id, name, amountDue, amountReserved, dueDate, priority, status, notes };
    }
  } else {
    appState.bills.push({ id: 'bill_' + Date.now(), name, amountDue, amountReserved, dueDate, priority, status, notes });
  }

  saveStateToStorage();
  closeModal('billModal');
  renderBillsBreakdown();
  renderTotalFinancialGoal();
}

function handleBillSetAside(id) {
  const bill = appState.bills.find(b => b.id === id);
  if (!bill) return;

  const needed = bill.amountDue - (bill.amountReserved || 0);
  openModal({
    title: `Set Aside for ${bill.name}`,
    message: `Enter dollar amount to allocate from Vault into reserve for ${bill.name} (Amount needed: ${formatCurrency(needed)}):`,
    showInput: true,
    inputType: 'number',
    inputPlaceholder: needed.toString(),
    onConfirm: (val) => {
      const amt = parseFloat(val) || 0;
      if (amt <= 0) return;

      bill.amountReserved = (bill.amountReserved || 0) + amt;
      if (bill.amountReserved >= bill.amountDue) {
        bill.status = 'funded';
      } else {
        bill.status = 'partial';
      }

      saveStateToStorage();
      renderBillsBreakdown();
      renderTotalFinancialGoal();
    }
  });
}

function handleBillMarkPaid(id) {
  const bill = appState.bills.find(b => b.id === id);
  if (!bill || bill.status === 'paid') return;

  openModal({
    title: `Mark ${bill.name} as Paid`,
    message: `Confirm paying ${bill.name} (${formatCurrency(bill.amountDue)}). This will record a bill payment in the Vault ledger.`,
    confirmText: 'Pay from Vault',
    onConfirm: () => {
      // Record payment in vault ledger (Section 7.4)
      appState.vaultLedger.push({
        id: 'vrec_' + Date.now(),
        session: appState.activeSession,
        date: new Date().toISOString(),
        amount: -bill.amountDue,
        note: `Bill Payment: ${bill.name}`,
        bucket: 'bills',
        billId: bill.id
      });

      bill.status = 'paid';
      bill.amountReserved = bill.amountDue;

      saveStateToStorage();
      renderBillsBreakdown();
      renderRecentVaultLedger();
      renderTotalFinancialGoal();
    }
  });
}

function handleBillTogglePaid(id) {
  const bill = appState.bills.find(b => b.id === id);
  if (!bill) return;

  if (bill.status === 'paid') {
    // Remove payment record
    appState.vaultLedger = appState.vaultLedger.filter(r => r.billId !== bill.id);
    bill.status = bill.amountReserved >= bill.amountDue ? 'funded' : 'unfunded';
  } else {
    bill.status = 'paid';
    appState.vaultLedger.push({
      id: 'vrec_' + Date.now(),
      session: appState.activeSession,
      date: new Date().toISOString(),
      amount: -bill.amountDue,
      note: `Bill Payment: ${bill.name}`,
      bucket: 'bills',
      billId: bill.id
    });
  }

  saveStateToStorage();
  renderBillsBreakdown();
  renderRecentVaultLedger();
  renderTotalFinancialGoal();
}

function handleDeleteBill(id) {
  openModal({
    title: 'Delete Bill Liability',
    message: 'Are you sure you want to remove this bill liability?',
    confirmText: 'Delete',
    onConfirm: () => {
      appState.bills = appState.bills.filter(b => b.id !== id);
      saveStateToStorage();
      renderBillsBreakdown();
      renderTotalFinancialGoal();
    }
  });
}

function handleQuickPayNextBill() {
  const nextBill = appState.bills.find(b => b.status !== 'paid');
  if (!nextBill) {
    openModal({ title: 'No Unpaid Bills', message: 'All scheduled bills are currently funded and paid!' });
    return;
  }
  handleBillMarkPaid(nextBill.id);
}

function openAddSavingsModal() {
  document.getElementById('savingsAmountInput').value = '50';
  document.getElementById('savingsNoteInput').value = 'Surplus profit deposit';
  openModalDialog('savingsModal');
}

function addSavingsAmountChip(val) {
  const inp = document.getElementById('savingsAmountInput');
  if (inp) {
    inp.value = (parseFloat(inp.value) || 0) + val;
  }
}

function handleConfirmSavingsDeposit() {
  const amt = parseFloat(document.getElementById('savingsAmountInput').value) || 0;
  const note = document.getElementById('savingsNoteInput').value || 'Savings deposit';

  if (amt <= 0) return;

  appState.vaultLedger.push({
    id: 'vrec_' + Date.now(),
    session: appState.activeSession,
    date: new Date().toISOString(),
    amount: amt,
    note,
    bucket: 'savings'
  });

  saveStateToStorage();
  closeModal('savingsModal');
  renderMilestonesModule();
  renderTotalFinancialGoal();
}

function handleManualSkimSubmit() {
  const bucket = document.getElementById('manualSkimBucket').value || 'general';
  const amt = parseFloat(document.getElementById('manualSkimAmount').value) || 0;
  const note = document.getElementById('manualSkimNote').value || 'Manual skim';

  if (amt <= 0) return;

  const currentBal = getCurrentDeskBalance();
  const floor = Math.max(0, Number(appState.milestoneCfg.reserveFloor) || 0);
  const postBal = currentBal - amt;

  const executeSkim = () => {
    // Deduct from desk
    appState.logs[appState.activeSession] = postBal;

    // Record in vault ledger
    appState.vaultLedger.push({
      id: 'vrec_' + Date.now(),
      session: appState.activeSession,
      date: new Date().toISOString(),
      amount: amt,
      note,
      bucket
    });

    saveStateToStorage();
    document.getElementById('manualSkimAmount').value = '';
    document.getElementById('manualSkimNote').value = '';
    refreshAllViews();
    openModal({
      title: 'Skim Complete',
      message: `Transferred ${formatCurrency(amt)} to ${bucket} bucket in the Capital Vault.`
    });
  };

  if (postBal < floor) {
    openModal({
      title: '⚠️ Floor Reserve Violation',
      message: `Transferring ${formatCurrency(amt)} will drop your desk balance to ${formatCurrency(postBal)}, which is below your reserve floor of ${formatCurrency(floor)}. Proceed anyway?`,
      confirmText: 'Transfer Anyway',
      onConfirm: executeSkim
    });
  } else {
    executeSkim();
  }
}

function handleSaveMilestoneConfig() {
  appState.milestoneCfg.savingsGoal = Math.max(0, parseFloat(document.getElementById('milestoneGoalInput').value) || 0);
  appState.milestoneCfg.reserveFloor = Math.max(0, parseFloat(document.getElementById('milestoneFloorInput').value) || 0);
  appState.milestoneCfg.strategy = document.getElementById('milestoneStrategySelect').value || 'gradual';

  saveStateToStorage();
  refreshAllViews();
  openModal({ title: 'Settings Saved', message: 'Milestone and reserve floor settings updated.' });
}

// ==========================================
// 11. CLOUD SYNC & DATA INTEGRATIONS
// ==========================================

function parseFirebaseConfigInput(inputStr) {
  if (!inputStr || !inputStr.trim()) return null;
  let str = inputStr.trim();
  str = str.replace(/^(const|let|var)\s+\w+\s*=\s*/, '').replace(/;\s*$/, '');
  try {
    return JSON.parse(str);
  } catch (e1) {
    try {
      const jsonified = str
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
        .replace(/'/g, '"');
      return JSON.parse(jsonified);
    } catch (e2) {
      try {
        const fn = new Function('return ' + str);
        const obj = fn();
        if (typeof obj === 'object' && obj !== null && (obj.apiKey || obj.projectId)) {
          return obj;
        }
      } catch (e3) {}
      throw new Error('Please ensure you pasted a valid Firebase configuration JSON or JavaScript object.');
    }
  }
}

function getCloudSyncDocId() {
  if (appState.currentUser && appState.currentUser.uid) {
    return appState.currentUser.uid;
  }
  if (appState.syncKey && appState.syncKey.trim()) {
    return appState.syncKey.trim();
  }
  return null;
}

function updateCloudStatus(status) {
  appState.cloudStatus = status;
  renderCloudStatusBadges();
}

function formatTimeAgo(isoString) {
  if (!isoString) return 'Never';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 10) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return new Date(isoString).toLocaleDateString();
}

function renderCloudStatusBadges() {
  const headerBadge = document.getElementById('headerSyncStatus');
  const accountSyncBadge = document.getElementById('accountSyncBadge');
  const accountStatusDot = document.getElementById('accountStatusDot');
  const firebaseStatusBadge = document.getElementById('firebaseStatusBadge');
  const firebaseStatusHint = document.getElementById('firebaseStatusHint');

  const statusMap = {
    online: { text: 'Cloud: Online', badgeClass: 'badge badge-green', dotColor: 'var(--green)' },
    syncing: { text: 'Cloud: Syncing...', badgeClass: 'badge badge-amber', dotColor: 'var(--gold)' },
    connecting: { text: 'Cloud: Connecting...', badgeClass: 'badge badge-amber', dotColor: 'var(--gold)' },
    offline: { text: 'Cloud: Offline', badgeClass: 'badge badge-gray', dotColor: 'var(--muted)' },
    error: { text: 'Cloud: Error', badgeClass: 'badge badge-red', dotColor: 'var(--red)' }
  };

  const current = statusMap[appState.cloudStatus] || statusMap.offline;

  if (headerBadge) {
    headerBadge.textContent = current.text;
    headerBadge.className = `${current.badgeClass} cursor-pointer`;
  }
  if (accountSyncBadge) {
    accountSyncBadge.textContent = capitalize(appState.cloudStatus);
    accountSyncBadge.className = current.badgeClass;
  }
  if (accountStatusDot && appState.currentUser) {
    accountStatusDot.style.background = current.dotColor;
  }
  if (firebaseStatusBadge) {
    if (!appState.firebaseCfg) {
      firebaseStatusBadge.textContent = 'Not Configured';
      firebaseStatusBadge.className = 'badge badge-gray';
      if (firebaseStatusHint) firebaseStatusHint.textContent = 'Add web configuration JSON to connect.';
    } else if (appState.cloudStatus === 'error') {
      firebaseStatusBadge.textContent = 'Connection Error';
      firebaseStatusBadge.className = 'badge badge-red';
      if (firebaseStatusHint) firebaseStatusHint.textContent = 'Check Firebase credentials or security rules.';
    } else {
      firebaseStatusBadge.textContent = 'Configured & Ready';
      firebaseStatusBadge.className = 'badge badge-green';
      if (firebaseStatusHint) firebaseStatusHint.textContent = 'Firebase connected. Cloud sync is active.';
    }
  }
}

function debounceCloudSync() {
  if (cloudSyncTimeout) clearTimeout(cloudSyncTimeout);
  cloudSyncTimeout = setTimeout(() => {
    pushStateToCloud();
  }, 600);
}

function pushStateToCloud() {
  if (!firestoreDb) return;
  const docId = getCloudSyncDocId();
  if (!docId) return;

  updateCloudStatus('syncing');

  const payload = {
    profiles: appState.profiles,
    activeProfileId: appState.activeProfileId,
    activeSession: appState.activeSession,
    logs: appState.logs,
    lockedSessions: appState.lockedSessions,
    notes: appState.notes,
    timestamps: appState.timestamps,
    pace: appState.pace,
    planViewMode: appState.planViewMode,
    vaultLedger: appState.vaultLedger,
    milestoneCfg: appState.milestoneCfg,
    milestoneEnabled: appState.milestoneEnabled,
    skimMode: appState.skimMode,
    bills: appState.bills,
    billsBasis: appState.billsBasis,
    tradeLogs: appState.tradeLogs,
    userEmail: appState.currentUser ? appState.currentUser.email : null,
    syncKey: appState.syncKey || docId,
    updatedAt: new Date().toISOString()
  };

  firestoreDb.collection('users').doc(docId).set(payload)
    .then(() => {
      appState.lastSyncedAt = new Date().toISOString();
      updateCloudStatus('online');
      const lastSyncEl = document.getElementById('accountLastSync');
      if (lastSyncEl) lastSyncEl.textContent = formatTimeAgo(appState.lastSyncedAt);
    })
    .catch(err => {
      console.warn('Firestore write failed:', err);
      updateCloudStatus('error');
    });
}

function initFirebaseSync() {
  if (!window.firebase) {
    console.warn('Firebase compat library not loaded.');
    updateCloudStatus('offline');
    return;
  }

  if (!appState.firebaseCfg || !appState.firebaseCfg.trim()) {
    appState.firebaseCfg = JSON.stringify(BUILTIN_FIREBASE_CONFIG, null, 2);
  }

  try {
    const config = parseFirebaseConfigInput(appState.firebaseCfg);
    if (!config || (!config.apiKey && !config.projectId)) {
      console.warn('Firebase config missing essential properties.');
      updateCloudStatus('error');
      return;
    }

    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(config);
    }
    firestoreDb = firebase.firestore();

    updateCloudStatus('connecting');

    // Register Auth state listener
    if (firebase.auth) {
      if (firebaseAuthUnsubscribe) firebaseAuthUnsubscribe();
      firebaseAuthUnsubscribe = firebase.auth().onAuthStateChanged(user => {
        if (user) {
          appState.currentUser = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email || 'Adventurer',
            photoURL: user.photoURL || ''
          };
          document.body.classList.add('is-authenticated');
          const gate = document.getElementById('authGateOverlay');
          if (gate) gate.classList.add('hidden');
        } else {
          appState.currentUser = null;
          appState.googleAccessToken = null;
          document.body.classList.remove('is-authenticated');
          const gate = document.getElementById('authGateOverlay');
          if (gate) gate.classList.remove('hidden');
        }
        renderAccountModule();
        updateSheetUI();
        attachFirestoreListener();
      }, err => {
        console.warn('Firebase Auth state observer error:', err);
      });
    }

    attachFirestoreListener();
  } catch (err) {
    console.error('Failed to initialize Firebase sync:', err);
    updateCloudStatus('error');
  }
}

function updateSheetUI() {
  const url = appState.spreadsheetUrl;
  const headerBtn = document.getElementById('btnHeaderViewSheet');
  const accountBtn = document.getElementById('btnAccountViewSheet');
  const dataBtn = document.getElementById('btnDataViewSheet');
  const driveCard = document.getElementById('accountDriveCard');
  const sheetLink = document.getElementById('accountSheetLink');
  const sheetStatus = document.getElementById('accountSheetStatus');
  const driveFolder = document.getElementById('accountDriveFolder');

  if (url && appState.currentUser) {
    if (headerBtn) {
      headerBtn.href = url;
      headerBtn.classList.remove('hidden');
    }
    if (accountBtn) {
      accountBtn.href = url;
    }
    if (dataBtn) {
      dataBtn.href = url;
      dataBtn.classList.remove('opacity-50', 'pointer-events-none');
    }
    if (driveCard) driveCard.classList.remove('hidden');
    if (sheetLink) {
      sheetLink.href = url;
      sheetLink.textContent = 'View Google Sheet ↗';
    }
    if (driveFolder) driveFolder.textContent = 'Trove - Expedition Ledger';
  } else {
    if (headerBtn) headerBtn.classList.add('hidden');
    if (driveCard) driveCard.classList.add('hidden');
    if (dataBtn) dataBtn.classList.add('opacity-50', 'pointer-events-none');
    if (sheetLink) {
      sheetLink.href = '#';
      sheetLink.textContent = 'Auto-created on sign-in';
    }
  }
}

async function ensureGoogleDriveSheet(accessToken, user) {
  if (!accessToken || !user) return;

  // If already provisioned, update UI and return
  if (appState.spreadsheetId && appState.spreadsheetUrl) {
    updateSheetUI();
    return;
  }

  const statusText = document.getElementById('authGateStatusText');
  const statusArea = document.getElementById('authGateStatus');
  if (statusArea) statusArea.classList.remove('hidden');

  try {
    if (statusText) statusText.textContent = 'Checking Google Drive for your expedition folder...';

    // 1. Search for 'Trove - Expedition Ledger' folder
    const folderQuery = encodeURIComponent("name = 'Trove - Expedition Ledger' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
    const folderSearchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${folderQuery}&fields=files(id,name)`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const folderSearchData = await folderSearchRes.json();
    let folderId = null;

    if (folderSearchData.files && folderSearchData.files.length > 0) {
      folderId = folderSearchData.files[0].id;
    } else {
      if (statusText) statusText.textContent = 'Creating "Trove - Expedition Ledger" folder in Google Drive...';
      const createFolderRes = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Trove - Expedition Ledger',
          mimeType: 'application/vnd.google-apps.folder'
        })
      });
      const newFolder = await createFolderRes.json();
      folderId = newFolder.id;
    }

    // 2. Search for existing sheet inside the folder
    if (statusText) statusText.textContent = 'Preparing pre-made Google Sheet...';
    const sheetQuery = encodeURIComponent(`'${folderId}' in parents and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`);
    const sheetSearchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${sheetQuery}&fields=files(id,name,webViewLink)`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const sheetSearchData = await sheetSearchRes.json();

    let spreadsheetId = null;
    let spreadsheetUrl = null;

    if (sheetSearchData.files && sheetSearchData.files.length > 0) {
      spreadsheetId = sheetSearchData.files[0].id;
      spreadsheetUrl = sheetSearchData.files[0].webViewLink || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
    } else {
      // 3. Create fresh Google Sheet with structured tabs
      if (statusText) statusText.textContent = 'Creating personal Google Sheet ledger...';
      const sheetTitle = `Trove Expedition Ledger - ${user.displayName || 'Personal'}`;
      const createSheetRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: { title: sheetTitle },
          sheets: [
            { properties: { title: 'Daily Sessions', gridProperties: { frozenRowCount: 1 } } },
            { properties: { title: 'Capital Vault', gridProperties: { frozenRowCount: 1 } } },
            { properties: { title: 'Trades Journal', gridProperties: { frozenRowCount: 1 } } }
          ]
        })
      });
      const newSheet = await createSheetRes.json();
      spreadsheetId = newSheet.spreadsheetId;
      spreadsheetUrl = newSheet.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

      // Move into folder
      if (folderId && spreadsheetId) {
        await fetch(`https://www.googleapis.com/drive/v3/files/${spreadsheetId}?addParents=${folderId}&enforceSingleParent=true`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${accessToken}` }
        });
      }

      // Populate initial values
      await populateInitialGoogleSheetData(accessToken, spreadsheetId);
    }

    // 4. Save to appState and Firestore
    appState.folderId = folderId;
    appState.spreadsheetId = spreadsheetId;
    appState.spreadsheetUrl = spreadsheetUrl;
    saveStateToStorage(true);

    if (firestoreDb && user.uid) {
      firestoreDb.collection('users').doc(user.uid).set({
        folderId: folderId,
        spreadsheetId: spreadsheetId,
        spreadsheetUrl: spreadsheetUrl,
        sheetCreatedAt: new Date().toISOString()
      }, { merge: true });
    }

    updateSheetUI();
  } catch (err) {
    console.warn('Google Drive / Sheets auto-creation notice:', err);
  } finally {
    if (statusArea) statusArea.classList.add('hidden');
  }
}

async function populateInitialGoogleSheetData(accessToken, spreadsheetId) {
  if (!accessToken || !spreadsheetId) return;

  try {
    const profile = getActiveProfile();
    const sessionRows = [
      ["Session #", "Date", "Relaxed Target", "Balanced Target", "Aggressive Target", "Closing Balance", "Vault Skims", "Daily PnL", "Return %", "Notes"]
    ];

    const total = profile ? profile.totalSessions : 28;
    for (let s = 1; s <= total; s++) {
      const row = (profile && profile.sessions && profile.sessions[s - 1]) ? profile.sessions[s - 1] : { r: 0, m: 0, a: 0 };
      const dateStr = getDateForSession(profile ? profile.startDate : '2026-10-01', s);
      const bal = appState.logs[s] !== undefined ? appState.logs[s] : '';
      const skims = getSessionVaultSkims(s);
      const pnl = getNormalizedDailyPnL(s);
      const ret = getSessionReturnPct(s);
      const notes = appState.notes[s] || '';
      sessionRows.push([s, dateStr, row.r, row.m, row.a, bal, skims, pnl, `${ret.toFixed(2)}%`, notes]);
    }

    const vaultRows = [
      ["Timestamp", "Type", "Bucket", "Amount ($)", "Note", "Desk Balance ($)"]
    ];
    appState.vaultLedger.forEach(v => {
      vaultRows.push([v.timestamp, v.type, v.bucket, v.amount, v.note, v.postBal || '']);
    });

    const tradeRows = [
      ["Timestamp", "Session", "Pair", "Type", "Entry ($)", "Exit ($)", "Fees ($)", "PnL ($)", "Status", "Notes"]
    ];
    appState.tradeLogs.forEach(t => {
      tradeRows.push([t.timestamp, t.session, t.pair, t.type, t.entry, t.exit, t.fees, t.pnl, t.status, t.notes]);
    });

    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: [
          { range: 'Daily Sessions!A1', values: sessionRows },
          { range: 'Capital Vault!A1', values: vaultRows },
          { range: 'Trades Journal!A1', values: tradeRows }
        ]
      })
    });
  } catch (err) {
    console.warn('Google Sheet batch update error:', err);
  }
}

function debounceSheetSync() {
  if (sheetSyncTimeout) clearTimeout(sheetSyncTimeout);
  sheetSyncTimeout = setTimeout(() => {
    syncDataToGoogleSheet();
  }, 1200);
}

async function syncDataToGoogleSheet() {
  const token = appState.googleAccessToken;
  const sheetId = appState.spreadsheetId;
  if (!token || !sheetId) return;

  try {
    await populateInitialGoogleSheetData(token, sheetId);
  } catch (err) {
    console.warn('Background Google Sheet sync notice:', err);
  }
}

function attachFirestoreListener() {
  if (!firestoreDb) return;
  const docId = getCloudSyncDocId();
  if (!docId) {
    updateCloudStatus(appState.firebaseCfg ? 'offline' : 'offline');
    return;
  }

  if (firestoreUnsubscribe) {
    firestoreUnsubscribe();
    firestoreUnsubscribe = null;
  }

  updateCloudStatus('connecting');

  firestoreUnsubscribe = firestoreDb.collection('users').doc(docId).onSnapshot(doc => {
    if (doc.exists) {
      const data = doc.data();

      // Sync Google Sheet URL and ID across devices automatically
      if (data.spreadsheetUrl && !appState.spreadsheetUrl) {
        appState.spreadsheetUrl = data.spreadsheetUrl;
        appState.spreadsheetId = data.spreadsheetId || appState.spreadsheetId;
        appState.folderId = data.folderId || appState.folderId;
        saveStateToStorage(true);
        updateSheetUI();
      }

      if (data && data.updatedAt) {
        const remoteTime = new Date(data.updatedAt).getTime();
        const localTime = appState.lastSyncedAt ? new Date(appState.lastSyncedAt).getTime() : 0;

        if (remoteTime > localTime) {
          isApplyingRemoteSync = true;
          try {
            if (data.profiles && Array.isArray(data.profiles) && data.profiles.length) {
              data.profiles.forEach(p => {
                if (p && p.base > 0 && (p.portTarget || p.targetBalance) > p.base) {
                  if (!p.sessions || !p.sessions.length || p.sessions[0].r <= p.base) {
                    p.sessions = generateRoadmapSessions(
                      p.curveType || 'tri_pace_independent',
                      p.base,
                      p.portTarget || p.targetBalance,
                      p.totalSessions,
                      p.withdrawalTarget,
                      p.withdrawalDays
                    );
                  }
                }
              });
              appState.profiles = data.profiles;
            }
            if (data.activeProfileId) appState.activeProfileId = data.activeProfileId;
            if (data.activeSession) appState.activeSession = data.activeSession;
            if (data.logs) appState.logs = data.logs;
            if (data.lockedSessions) appState.lockedSessions = data.lockedSessions;
            if (data.notes) appState.notes = data.notes;
            if (data.timestamps) appState.timestamps = data.timestamps;
            if (data.vaultLedger && Array.isArray(data.vaultLedger)) appState.vaultLedger = data.vaultLedger;
            if (data.bills && Array.isArray(data.bills)) appState.bills = data.bills;
            if (data.tradeLogs && Array.isArray(data.tradeLogs)) appState.tradeLogs = data.tradeLogs;
            if (data.milestoneCfg) {
              appState.milestoneCfg = data.milestoneCfg;
              if (appState.milestoneCfg && appState.milestoneCfg.savingsGoal === 5000) {
                appState.milestoneCfg.savingsGoal = 0;
              }
            }
            if (data.milestoneEnabled !== undefined) appState.milestoneEnabled = !!data.milestoneEnabled;
            if (data.skimMode !== undefined) appState.skimMode = !!data.skimMode;
            if (data.spreadsheetUrl) appState.spreadsheetUrl = data.spreadsheetUrl;
            if (data.spreadsheetId) appState.spreadsheetId = data.spreadsheetId;
            if (data.folderId) appState.folderId = data.folderId;

            appState.lastSyncedAt = data.updatedAt;
            saveStateToStorage(true);
            refreshAllViews();
            updateSheetUI();
          } finally {
            isApplyingRemoteSync = false;
          }
        }
      }
    } else {
      pushStateToCloud();
    }
    updateCloudStatus('online');
    appState.lastSyncedAt = new Date().toISOString();
    const lastSyncEl = document.getElementById('accountLastSync');
    if (lastSyncEl) lastSyncEl.textContent = formatTimeAgo(appState.lastSyncedAt);
  }, err => {
    console.warn('Firestore subscription error:', err);
    updateCloudStatus('error');
  });
}

function startGoogleSignIn() {
  if (!window.firebase || !firebase.auth) {
    openModal({
      title: 'Firebase Library Loading',
      message: 'The Firebase SDK is not ready yet. Please check your network connection and reload the page.'
    });
    return;
  }

  if (!appState.firebaseCfg || !appState.firebaseCfg.trim()) {
    appState.firebaseCfg = JSON.stringify(BUILTIN_FIREBASE_CONFIG, null, 2);
  }

  if (!firebase.apps || !firebase.apps.length) {
    initFirebaseSync();
  }

  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    provider.addScope('https://www.googleapis.com/auth/spreadsheets');
    provider.setCustomParameters({ prompt: 'select_account' });

    const statusArea = document.getElementById('authGateStatus');
    const statusText = document.getElementById('authGateStatusText');
    if (statusArea) statusArea.classList.remove('hidden');
    if (statusText) statusText.textContent = 'Connecting to Google Authentication...';

    firebase.auth().signInWithPopup(provider)
      .then(async result => {
        const token = result.credential ? result.credential.accessToken : null;
        appState.googleAccessToken = token;
        appState.currentUser = {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || result.user.email || 'Adventurer',
          photoURL: result.user.photoURL || ''
        };

        document.body.classList.add('is-authenticated');
        const gate = document.getElementById('authGateOverlay');
        if (gate) gate.classList.add('hidden');

        if (statusText) statusText.textContent = 'Setting up your Google Drive ledger sheet...';
        await ensureGoogleDriveSheet(token, result.user);

        renderAccountModule();
        updateSheetUI();
        refreshAllViews();

        openModal({
          title: 'Welcome Adventurer!',
          message: `Signed in as ${result.user.displayName || result.user.email}.\n\nYour private Google Drive folder and Google Sheet have been prepared. Automatic cloud sync is active across all devices!`
        });
      })
      .catch(err => {
        console.error('Google Sign-In Error:', err);
        if (statusArea) statusArea.classList.add('hidden');

        if (err.code === 'auth/popup-blocked') {
          firebase.auth().signInWithRedirect(provider);
        } else if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
          openModal({
            title: 'Enable Google Sign-In',
            message: 'Google Sign-in is not enabled in your Firebase console. Go to Firebase Console > Authentication > Sign-in method, click Google, and enable it.'
          });
        } else if (err.code === 'auth/unauthorized-domain') {
          openModal({
            title: 'Authorize This Domain',
            message: `Please add "${window.location.hostname}" to Authorized Domains in Firebase Console > Authentication > Settings > Authorized domains.`
          });
        } else if (err.code === 'auth/popup-closed-by-user') {
          // User closed popup
        } else {
          openModal({
            title: 'Sign-In Failed',
            message: err.message || 'An error occurred during Google sign-in.'
          });
        }
      });
  } catch (err) {
    openModal({
      title: 'Sign-In Error',
      message: err.message || 'Could not initiate Google sign-in.'
    });
  }
}

function handleSaveGateFirebaseConfig() {
  const inp = document.getElementById('gateFirebaseCfgInput');
  if (!inp || !inp.value.trim()) return;
  const cfgStr = inp.value.trim();
  try {
    const parsed = parseFirebaseConfigInput(cfgStr);
    appState.firebaseCfg = JSON.stringify(parsed, null, 2);
    saveStateToStorage(true);
    initFirebaseSync();
    renderAccountModule();
    openModal({ title: 'Config Saved', message: 'Firebase configuration saved! Click "Continue with Google" to sign in.' });
  } catch (err) {
    openModal({ title: 'Config Error', message: 'Invalid configuration format: ' + err.message });
  }
}

function handleGoogleSignOut() {
  openModal({
    title: 'Sign Out Confirmation',
    message: 'Sign out from Google? Data will remain stored safely in your cloud database and Google Sheet. Signing in on any device restores your full session.',
    confirmText: 'Sign Out',
    onConfirm: () => {
      if (window.firebase && firebase.auth) {
        firebase.auth().signOut().then(() => {
          appState.currentUser = null;
          appState.googleAccessToken = null;
          if (firestoreUnsubscribe) {
            firestoreUnsubscribe();
            firestoreUnsubscribe = null;
          }
          updateCloudStatus('offline');
          document.body.classList.remove('is-authenticated');
          const gate = document.getElementById('authGateOverlay');
          if (gate) gate.classList.remove('hidden');
          updateSheetUI();
          renderAccountModule();
        }).catch(err => {
          openModal({ title: 'Sign Out Error', message: err.message });
        });
      } else {
        appState.currentUser = null;
        document.body.classList.remove('is-authenticated');
        renderAccountModule();
      }
    }
  });
}

function handleSaveFirebaseConfig() {
  const cfgStr = document.getElementById('firebaseCfgInput').value;
  const syncKey = document.getElementById('syncKeyInput').value;

  if (!cfgStr || !cfgStr.trim()) {
    openModal({
      title: 'Configuration Missing',
      message: 'Please paste your Firebase web config JSON in the text area.'
    });
    return;
  }

  try {
    const parsed = parseFirebaseConfigInput(cfgStr);
    if (!parsed || (!parsed.apiKey && !parsed.projectId)) {
      throw new Error('Config missing "apiKey" or "projectId".');
    }

    appState.firebaseCfg = JSON.stringify(parsed, null, 2);
    appState.syncKey = syncKey ? syncKey.trim() : '';
    saveStateToStorage(true);

    initFirebaseSync();
    renderAccountModule();

    openModal({
      title: 'Firebase Connected',
      message: 'Firebase configuration saved and initialized! You can now sign in with Google or sync your portfolio.'
    });
  } catch (err) {
    openModal({
      title: 'Invalid Config Format',
      message: 'The configuration provided is invalid: ' + err.message + '\n\nPlease ensure you copied the web config object from Firebase Console.'
    });
  }
}

function handleDisconnectFirebase() {
  openModal({
    title: 'Disconnect Firebase?',
    message: 'This will remove the saved Firebase configuration and pause cloud sync. All local browser data is kept safe.',
    confirmText: 'Disconnect',
    onConfirm: () => {
      if (window.firebase && firebase.auth && appState.currentUser) {
        firebase.auth().signOut().catch(() => {});
      }
      if (firestoreUnsubscribe) {
        firestoreUnsubscribe();
        firestoreUnsubscribe = null;
      }
      appState.firebaseCfg = '';
      appState.syncKey = '';
      appState.currentUser = null;
      firestoreDb = null;
      saveStateToStorage(true);
      updateCloudStatus('offline');
      renderAccountModule();
      openModal({
        title: 'Firebase Disconnected',
        message: 'Firebase has been disconnected. The application is now running in offline local mode.'
      });
    }
  });
}

function handleManualCloudSync() {
  if (!firestoreDb) {
    if (!appState.firebaseCfg) {
      openModal({
        title: 'Cloud Sync Setup Needed',
        message: 'No Firebase project is connected yet. Please add your Firebase configuration in the setup panel below.'
      });
      return;
    }
    initFirebaseSync();
  }

  pushStateToCloud();
  openModal({
    title: 'Sync Dispatched',
    message: 'Latest challenge balances, logs, and vault records dispatched to your cloud database.'
  });
}

function handleSaveWebhookUrl() {
  const url = document.getElementById('webhookUrlInput').value.trim();
  appState.webhookUrl = url;
  saveStateToStorage(true);
  renderAccountModule();
  openModal({
    title: 'Webhook Saved',
    message: url ? 'Google Sheets webhook URL has been saved.' : 'Google Sheets webhook cleared.'
  });
}

function handleSyncToSheets() {
  if (!appState.webhookUrl) {
    openModal({
      title: 'Missing Webhook URL',
      message: 'Enter your Google Apps Script Web App URL in the setup panel first.'
    });
    return;
  }

  const profile = getActiveProfile();
  const payload = {
    profileName: profile ? profile.name : 'No active challenge',
    activeSession: appState.activeSession,
    currentDeskBalance: getCurrentDeskBalance(),
    vaultTotal: getVaultTotalBalance(),
    totalWealth: getTrueTotalWealth(),
    logs: appState.logs,
    timestamp: new Date().toISOString()
  };

  fetch(appState.webhookUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(() => {
    openModal({
      title: 'Dispatched to Google Sheet',
      message: 'Portfolio snapshot sent successfully to your Google Sheet webhook!'
    });
  }).catch(err => {
    openModal({
      title: 'Sheet Sync Failed',
      message: 'Error sending data to Google Sheet webhook: ' + err.message
    });
  });
}

function copyFirestoreRulesToClipboard() {
  const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`;
  navigator.clipboard.writeText(rules).then(() => {
    openModal({
      title: 'Security Rules Copied',
      message: 'Firestore security rules copied to clipboard! Paste them into the Rules tab in your Firebase Console.'
    });
  }).catch(() => {
    openModal({
      title: 'Security Rules',
      message: rules
    });
  });
}

function openAppsScriptModal() {
  const code = `function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Trove_Ledger") || ss.insertSheet("Trove_Ledger");
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Challenge Name", "Active Session", "Desk Balance ($)", "Vault Total ($)", "Total Wealth ($)"]);
      sheet.getRange(1, 1, 1, 6).setFontWeight("bold");
    }
    
    sheet.appendRow([
      new Date(),
      data.profileName,
      data.activeSession,
      data.currentDeskBalance,
      data.vaultTotal,
      data.totalWealth
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;
  const codeEl = document.getElementById('appsScriptCodeText');
  if (codeEl) codeEl.value = code;
  openModalDialog('appsScriptModal');
}

function copyAppsScriptCode() {
  const codeEl = document.getElementById('appsScriptCodeText');
  if (codeEl) {
    navigator.clipboard.writeText(codeEl.value).then(() => {
      openModal({ title: 'Code Copied', message: 'Google Apps Script code copied to clipboard!' });
    });
  }
}

function exportDataToCsv() {
  const profile = getActiveProfile();
  if (!profile) {
    openModal({ title: 'No Challenge', message: 'There is no active challenge to export.' });
    return;
  }
  let csv = "data:text/csv;charset=utf-8,";
  csv += "Session,Date,Target_Relaxed,Target_Mid,Target_Aggressive,Closing_Balance,Vault_Skims,Daily_PnL,Return_Pct,Notes\n";

  for (let s = 1; s <= profile.totalSessions; s++) {
    const row = profile.sessions[s - 1] || profile.sessions[0];
    const dateStr = getDateForSession(profile.startDate, s);
    const bal = appState.logs[s] !== undefined ? appState.logs[s] : '';
    const skims = getSessionVaultSkims(s);
    const pnl = getNormalizedDailyPnL(s);
    const ret = getSessionReturnPct(s);
    const notes = (appState.notes[s] || '').replace(/"/g, '""');

    csv += `${s},${dateStr},${row.r},${row.m},${row.a},${bal},${skims},${pnl},${ret.toFixed(2)}%,"${notes}"\n`;
  }

  const encodedUri = encodeURI(csv);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `portfolio_challenge_${profile.id}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function renderAccountModule() {
  const user = appState.currentUser;
  const statusDot = document.getElementById('accountStatusDot');
  const statusTitle = document.getElementById('accountStatusTitle');
  const statusDetail = document.getElementById('accountStatusDetail');
  const userCard = document.getElementById('accountUserCard');
  const userName = document.getElementById('accountUserName');
  const userEmail = document.getElementById('accountUserEmail');
  const userUid = document.getElementById('accountUserUid');
  const userAvatar = document.getElementById('accountUserAvatar');
  const signOutArea = document.getElementById('accountSignOutArea');
  const signedInActions = document.getElementById('accountSignedInActions');
  const setupNote = document.getElementById('accountSetupNote');

  if (user) {
    if (statusDot) {
      statusDot.className = 'account-status-dot is-online';
      statusDot.style.background = 'var(--green)';
    }
    if (statusTitle) statusTitle.textContent = 'Google Account Connected';
    if (statusDetail) statusDetail.textContent = 'Data syncing privately to your cloud database.';

    if (userCard) userCard.classList.remove('hidden');
    if (userName) userName.textContent = user.displayName || 'Adventurer';
    if (userEmail) userEmail.textContent = user.email || 'Google User';
    if (userUid) userUid.textContent = `UID: ${user.uid.slice(0, 14)}...`;

    if (userAvatar) {
      if (user.photoURL) {
        userAvatar.innerHTML = `<img src="${user.photoURL}" alt="Avatar" class="w-full h-full object-cover" onerror="this.parentElement.textContent='${(user.displayName || user.email || 'U')[0].toUpperCase()}'">`;
      } else {
        userAvatar.textContent = (user.displayName || user.email || 'U')[0].toUpperCase();
      }
    }

    if (signOutArea) signOutArea.classList.add('hidden');
    if (signedInActions) signedInActions.classList.remove('hidden');
    if (setupNote) setupNote.classList.add('hidden');
  } else {
    if (statusDot) {
      statusDot.className = 'account-status-dot';
      statusDot.style.background = appState.firebaseCfg ? 'var(--gold)' : 'var(--muted)';
    }
    if (statusTitle) statusTitle.textContent = 'Local account';
    if (statusDetail) {
      statusDetail.textContent = appState.firebaseCfg
        ? 'Firebase connected. Sign in with Google to enable cloud sync.'
        : 'Your data is saved in this browser only.';
    }

    if (userCard) userCard.classList.add('hidden');
    if (signOutArea) signOutArea.classList.remove('hidden');
    if (signedInActions) signedInActions.classList.add('hidden');
    if (setupNote) {
      setupNote.classList.remove('hidden');
      setupNote.textContent = appState.firebaseCfg
        ? 'Firebase project connected. Click button above to sign in.'
        : 'Requires your Firebase Web Configuration in the panel below.';
    }
  }

  // Account details
  const accountEmail = document.getElementById('accountEmail');
  const accountStorageStatus = document.getElementById('accountStorageStatus');
  const accountSheetStatus = document.getElementById('accountSheetStatus');
  const accountSheetLink = document.getElementById('accountSheetLink');
  const accountLastSync = document.getElementById('accountLastSync');
  const accountDriveFolder = document.getElementById('accountDriveFolder');

  if (accountEmail) accountEmail.textContent = user ? user.email : 'Not signed in';
  if (accountStorageStatus) {
    accountStorageStatus.textContent = user
      ? 'Private Firestore & Local cache'
      : (appState.syncKey && appState.firebaseCfg ? 'Cloud (Sync Key) & Local cache' : 'This browser (Local)');
  }
  if (accountDriveFolder) {
    accountDriveFolder.textContent = 'Trove - Expedition Ledger';
  }
  if (accountSheetLink) {
    if (appState.spreadsheetUrl) {
      accountSheetLink.href = appState.spreadsheetUrl;
      accountSheetLink.textContent = 'View Google Sheet ↗';
    } else {
      accountSheetLink.href = '#';
      accountSheetLink.textContent = user ? 'Creating in Google Drive...' : 'Auto-created on sign-in';
    }
  }
  if (accountLastSync) {
    accountLastSync.textContent = formatTimeAgo(appState.lastSyncedAt);
  }

  // Setup inputs
  const cfgInput = document.getElementById('firebaseCfgInput');
  const gateCfgInput = document.getElementById('gateFirebaseCfgInput');
  const syncKeyInput = document.getElementById('syncKeyInput');
  const webhookInput = document.getElementById('webhookUrlInput');

  if (cfgInput && !cfgInput.value && appState.firebaseCfg) {
    cfgInput.value = appState.firebaseCfg;
  }
  if (gateCfgInput && !gateCfgInput.value && appState.firebaseCfg) {
    gateCfgInput.value = appState.firebaseCfg;
  }
  if (syncKeyInput && !syncKeyInput.value && appState.syncKey) {
    syncKeyInput.value = appState.syncKey;
  }
  if (webhookInput && !webhookInput.value && appState.webhookUrl) {
    webhookInput.value = appState.webhookUrl;
  }

  updateSheetUI();
  renderCloudStatusBadges();
}

// ==========================================
// 12. SAFE RESET & BACKUP CONTROLS
// ==========================================

function confirmResetSessionLogs() {
  openModal({
    title: '⚠️ Reset Session Logs',
    message: 'This will clear all logged balances, notes, locks, and timestamps for this challenge. Challenge settings and Capital Vault funds will be preserved.',
    confirmText: 'Reset Logs',
    onConfirm: () => {
      appState.logs = {};
      appState.lockedSessions = {};
      appState.notes = {};
      appState.timestamps = {};
      appState.activeSession = 1;
      saveStateToStorage();
      refreshAllViews();
      openModal({ title: 'Logs Reset', message: 'All daily session closing balances have been cleared.' });
    }
  });
}

function confirmClearVault() {
  openModal({
    title: '⚠️ Clear Capital Vault',
    message: 'This will purge all deposits, skims, and bill reservations in the Capital Vault. Trading desk logs will remain intact.',
    confirmText: 'Clear Vault',
    onConfirm: () => {
      appState.vaultLedger = [];
      appState.bills.forEach(b => {
        b.amountReserved = 0;
        b.status = 'unfunded';
      });
      saveStateToStorage();
      refreshAllViews();
      openModal({ title: 'Vault Cleared', message: 'Capital Vault ledger and bill allocations have been reset.' });
    }
  });
}

function confirmRestoreDefaultChallenge() {
  openModal({
    title: 'Restore Default Challenge',
    message: 'Reset active challenge profile to canonical 28-day Tri-Pace Roadmap ($100 to $7,000)?',
    confirmText: 'Restore Default',
    onConfirm: () => {
      const idx = appState.profiles.findIndex(p => p.id === DEFAULT_PROFILE.id);
      if (idx !== -1) {
        appState.profiles[idx] = Object.assign({}, DEFAULT_PROFILE);
      } else {
        appState.profiles.unshift(Object.assign({}, DEFAULT_PROFILE));
      }
      appState.activeProfileId = DEFAULT_PROFILE.id;
      saveStateToStorage();
      refreshAllViews();
      openModal({ title: 'Default Restored', message: 'Canonical 28-day challenge restored.' });
    }
  });
}

function confirmFactoryReset() {
  openModal({
    title: '🚨 Full Factory Reset',
    message: 'DANGER: This will completely delete all challenges, session logs, trade journal entries, and vault history. This action CANNOT be undone.',
    confirmText: 'Wipe Everything',
    onConfirm: () => {
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
      window.location.reload();
    }
  });
}

function exportJsonBackup() {
  const data = {
    exportedAt: new Date().toISOString(),
    version: 'v10',
    profiles: appState.profiles,
    activeProfileId: appState.activeProfileId,
    activeSession: appState.activeSession,
    logs: appState.logs,
    lockedSessions: appState.lockedSessions,
    notes: appState.notes,
    timestamps: appState.timestamps,
    vaultLedger: appState.vaultLedger,
    bills: appState.bills,
    tradeLogs: appState.tradeLogs,
    milestoneCfg: appState.milestoneCfg,
    pace: appState.pace
  };

  const str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', str);
  link.setAttribute('download', `portfolio_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function handleImportJsonBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data && data.profiles && Array.isArray(data.profiles)) {
        data.profiles.forEach(p => {
          if (p && p.base > 0 && (p.portTarget || p.targetBalance) > p.base) {
            if (!p.sessions || !p.sessions.length || p.sessions[0].r <= p.base) {
              p.sessions = generateRoadmapSessions(
                p.curveType || 'tri_pace_independent',
                p.base,
                p.portTarget || p.targetBalance,
                p.totalSessions,
                p.withdrawalTarget,
                p.withdrawalDays
              );
            }
          }
        });
        appState.profiles = data.profiles;
        if (data.activeProfileId) appState.activeProfileId = data.activeProfileId;
        if (data.activeSession) appState.activeSession = data.activeSession;
        if (data.logs) appState.logs = data.logs;
        if (data.lockedSessions) appState.lockedSessions = data.lockedSessions;
        if (data.notes) appState.notes = data.notes;
        if (data.timestamps) appState.timestamps = data.timestamps;
        if (data.vaultLedger) appState.vaultLedger = data.vaultLedger;
        if (data.bills) appState.bills = data.bills;
        if (data.tradeLogs) appState.tradeLogs = data.tradeLogs;
        if (data.milestoneCfg) {
          appState.milestoneCfg = data.milestoneCfg;
          if (appState.milestoneCfg && appState.milestoneCfg.savingsGoal === 5000) {
            appState.milestoneCfg.savingsGoal = 0;
          }
        }
        if (data.pace) appState.pace = data.pace;

        saveStateToStorage();
        refreshAllViews();
        openModal({ title: 'Import Successful', message: 'All portfolio data restored successfully from backup.' });
      } else {
        openModal({ title: 'Invalid Backup File', message: 'The uploaded file does not match the required schema.' });
      }
    } catch (err) {
      openModal({ title: 'Import Failed', message: 'Error reading JSON backup: ' + err.message });
    }
  };
  reader.readAsText(file);
}

// ==========================================
// 13. MODAL DIALOG CONTROLLER
// ==========================================

let activeCustomModalCallback = null;

function openModalDialog(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add('active');
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove('active');
}

function openModal(options) {
  const m = document.getElementById('customModal');
  const title = document.getElementById('customModalTitle');
  const msg = document.getElementById('customModalMessage');
  const inputContainer = document.getElementById('customModalInputContainer');
  const input = document.getElementById('customModalInput');
  const confirmBtn = document.getElementById('customModalConfirmBtn');
  const cancelBtn = document.getElementById('customModalCancelBtn');

  if (title) title.textContent = options.title || 'Notice';
  if (msg) msg.textContent = options.message || '';

  if (options.showInput) {
    inputContainer.classList.remove('hidden');
    input.type = options.inputType || 'text';
    input.value = options.inputPlaceholder || '';
  } else {
    inputContainer.classList.add('hidden');
  }

  if (confirmBtn) confirmBtn.textContent = options.confirmText || 'OK';
  if (cancelBtn) {
    if (options.onConfirm) {
      cancelBtn.classList.remove('hidden');
    } else {
      cancelBtn.classList.add('hidden');
    }
  }

  activeCustomModalCallback = options.onConfirm || null;
  if (m) m.classList.add('active');
}

function closeCustomModal(isConfirmed) {
  const m = document.getElementById('customModal');
  if (m) m.classList.remove('active');

  if (isConfirmed && activeCustomModalCallback) {
    const input = document.getElementById('customModalInput');
    activeCustomModalCallback(input ? input.value : null);
  }
  activeCustomModalCallback = null;
}

function updateGrowthProgressChart() {
  renderMountainTrail();
}

function saveMilestoneConfig() {
  handleSaveMilestoneConfig();
}

function calculateProfitFactor() {
  const profile = getActiveProfile();
  const N = profile ? profile.totalSessions : 28;
  let grossGains = 0;
  let grossLosses = 0;
  for (let s = 1; s <= N; s++) {
    if (appState.logs[s] !== undefined && appState.logs[s] !== null) {
      const pnl = getNormalizedDailyPnL(s);
      if (pnl > 0) grossGains += pnl;
      else if (pnl < 0) grossLosses += Math.abs(pnl);
    }
  }
  if (grossLosses === 0) return grossGains > 0 ? Infinity : 0;
  return Math.round((grossGains / grossLosses) * 100) / 100;
}

// ==========================================
// 14. APPLICATION INITIALIZATION
// ==========================================

function capitalize(s) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function refreshAllViews() {
  renderHeaderAndTopBar();
  render3PaceTargetsSection();
  renderDailyDesk();
  renderConfigModule();
  renderTradeJournalModule();
  renderMilestonesModule();
  renderStatsModule();
  renderTotalFinancialGoal();
  renderAccountModule();
}

window.addEventListener('DOMContentLoaded', () => {
  applyTheme(localStorage.getItem('pgl_theme_v1') || 'dark');
  loadStateFromStorage();
  refreshAllViews();
  initFirebaseSync();
});
