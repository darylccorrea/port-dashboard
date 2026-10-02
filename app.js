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
  const N = Math.max(2, parseInt(totalSessions) || 28);
  const C0 = Math.max(1, parseFloat(base) || 100);
  const T = Math.max(C0, parseFloat(target) || 7000);
  const K = Math.max(2, Math.round(N * 0.25));

  const Ck_rel = Math.round(T * 0.10);
  const Ck_mid = Math.round(T * 0.18);
  const Ck_agg = Math.round(T * 0.25);

  const T_rel = T;
  const T_mid = Math.round(T * 1.8);
  const T_agg = Math.round(T * 2.5);

  const r1_rel = Math.pow(Ck_rel / C0, 1 / (K - 1));
  const r1_mid = Math.pow(Ck_mid / C0, 1 / (K - 1));
  const r1_agg = Math.pow(Ck_agg / C0, 1 / (K - 1));

  const r2_rel = Math.pow(T_rel / Ck_rel, 1 / (N - K));
  const r2_mid = Math.pow(T_mid / Ck_mid, 1 / (N - K));
  const r2_agg = Math.pow(T_agg / Ck_agg, 1 / (N - K));

  const sessions = [];
  for (let s = 1; s <= N; s++) {
    let bal_rel, bal_mid, bal_agg;
    if (s <= K) {
      bal_rel = C0 * Math.pow(r1_rel, s - 1);
      bal_mid = C0 * Math.pow(r1_mid, s - 1);
      bal_agg = C0 * Math.pow(r1_agg, s - 1);
    } else {
      bal_rel = Ck_rel * Math.pow(r2_rel, s - K);
      bal_mid = Ck_mid * Math.pow(r2_mid, s - K);
      bal_agg = Ck_agg * Math.pow(r2_agg, s - K);
    }

    let tag = '';
    if (s === 1) tag = 'Base Camp';
    else if (s === K) tag = `Checkpoint K (${Math.round((K / N) * 100)}%)`;
    else if (s === N) tag = 'Summit Target';
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
  const N = Math.max(2, parseInt(totalSessions) || 28);
  const C0 = Math.max(1, parseFloat(base) || 100);
  const T = Math.max(C0, parseFloat(target) || 7000);
  const sessions = [];
  for (let s = 1; s <= N; s++) {
    const f = (s - 1) / (N - 1);
    const r = C0 * Math.pow(T / C0, f);
    const m = C0 * Math.pow((T * 1.8) / C0, f);
    const a = C0 * Math.pow((T * 2.5) / C0, f);
    sessions.push({
      s,
      r: Math.round(r * 100) / 100,
      m: Math.round(m * 100) / 100,
      a: Math.round(a * 100) / 100,
      target: Math.round(r * 100) / 100,
      tag: s === 1 ? 'Base Camp' : (s === N ? 'Summit Target' : (s % 7 === 0 ? `Week ${s / 7}` : ''))
    });
  }
  return sessions;
}

/**
 * Front-Loaded Decay Compounding (Section 3.2.C)
 */
function calculateDecaySeries(base, target, totalSessions) {
  const N = Math.max(2, parseInt(totalSessions) || 28);
  const C0 = Math.max(1, parseFloat(base) || 100);
  const T = Math.max(C0, parseFloat(target) || 7000);
  const sessions = [];
  for (let s = 1; s <= N; s++) {
    const f = Math.pow((s - 1) / (N - 1), 0.75);
    const r = C0 * Math.pow(T / C0, f);
    const m = C0 * Math.pow((T * 1.8) / C0, f);
    const a = C0 * Math.pow((T * 2.5) / C0, f);
    sessions.push({
      s,
      r: Math.round(r * 100) / 100,
      m: Math.round(m * 100) / 100,
      a: Math.round(a * 100) / 100,
      target: Math.round(r * 100) / 100,
      tag: s === 1 ? 'Base Camp' : (s === N ? 'Summit Target' : (s % 7 === 0 ? `Week ${s / 7}` : ''))
    });
  }
  return sessions;
}

/**
 * Portfolio Target with Scheduled Cash-Out (Section 3.2.D)
 */
function calculatePortTargetWithdrawal(base, target, totalSessions, withdrawalTarget, withdrawalDays) {
  const N = Math.max(2, parseInt(totalSessions) || 28);
  const C0 = Math.max(1, parseFloat(base) || 100);
  const T = Math.max(C0, parseFloat(target) || 7000);
  const Dwith = Math.min(N, Math.max(1, parseInt(withdrawalDays) || N));
  const Wtarget = Math.max(0, parseFloat(withdrawalTarget) || 0);

  const sessions = [];
  for (let s = 1; s <= N; s++) {
    const deskTarget = C0 * Math.pow(T / C0, (s - 1) / (N - 1));
    let withdrawalGoal = 0;
    if (s <= Dwith) {
      withdrawalGoal = Dwith > 1 ? Wtarget * ((s - 1) / (Dwith - 1)) : Wtarget;
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
      tag: s === 1 ? 'Base Camp' : (s === N ? 'Summit Target' : (s === Dwith ? 'Cash-Out Completed' : ''))
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
  const tradingTarget = profile ? profile.portTarget : 7000;
  const tradingAchieved = Math.min(tradingTarget, Math.max(0, activeDeskBalance));
  const tradingRemaining = Math.max(0, tradingTarget - activeDeskBalance);

  // 2. Savings Component
  const savingsTarget = milestoneCfg && milestoneCfg.savingsGoal ? milestoneCfg.savingsGoal : 5000;
  const savingsBalance = vaultLedger
    .filter(r => r.bucket === 'savings')
    .reduce((sum, r) => sum + r.amount, 0);
  const savingsAchieved = Math.min(savingsTarget, Math.max(0, savingsBalance));
  const savingsRemaining = Math.max(0, savingsTarget - savingsBalance);

  // 3. Bills Component
  const billsTarget = bills.reduce((sum, b) => sum + b.amountDue, 0);
  const billsAchieved = bills.reduce((sum, b) => {
    if (b.status === 'paid') return sum + b.amountDue;
    return sum + (b.amountReserved || 0);
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
  id: 'default_28',
  name: '28-Day Challenge (Tri-Pace)',
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
  profiles: [DEFAULT_PROFILE],
  activeProfileId: 'default_28',
  activeSession: 1,
  logs: {},
  lockedSessions: {},
  notes: {},
  timestamps: {},
  pace: 'relaxed',
  planViewMode: 'original',
  vaultLedger: [],
  milestoneCfg: {
    savingsGoal: 5000,
    deadline: '',
    reserveFloor: 100,
    strategy: 'gradual'
  },
  milestoneEnabled: false,
  skimMode: false,
  bills: [],
  billsBasis: 'days',
  tradeLogs: [],
  syncKey: 'dcniper_portfolio',
  webhookUrl: '',
  firebaseCfg: '',
};

// Calendar navigation state
let calendarViewYear = new Date().getFullYear();
let calendarViewMonth = new Date().getMonth();

// Cloud sync debounce timers
let cloudSyncTimeout = null;
let firestoreDb = null;
let firestoreUnsubscribe = null;

// ==========================================
// 4. STATE PERSISTENCE & LOAD ENGINE
// ==========================================

function loadStateFromStorage() {
  try {
    const rawProfiles = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (rawProfiles) {
      appState.profiles = JSON.parse(rawProfiles);
    } else {
      appState.profiles = [DEFAULT_PROFILE];
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(appState.profiles));
    }

    appState.activeProfileId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE) || 'default_28';
    appState.activeSession = parseInt(localStorage.getItem(STORAGE_KEYS.SESSION)) || 1;
    appState.logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '{}');
    appState.lockedSessions = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCKED_SESSIONS) || '{}');
    appState.notes = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES) || '{}');
    appState.timestamps = JSON.parse(localStorage.getItem(STORAGE_KEYS.TIMESTAMPS) || '{}');
    appState.pace = localStorage.getItem(STORAGE_KEYS.PACE) || 'relaxed';
    appState.planViewMode = localStorage.getItem(STORAGE_KEYS.PLAN_VIEW_MODE) || 'original';
    appState.vaultLedger = JSON.parse(localStorage.getItem(STORAGE_KEYS.VAULT_LEDGER) || '[]');
    appState.milestoneCfg = JSON.parse(localStorage.getItem(STORAGE_KEYS.MILESTONE_CFG) || '{"savingsGoal":5000,"deadline":"","reserveFloor":100,"strategy":"gradual"}');
    appState.milestoneEnabled = localStorage.getItem(STORAGE_KEYS.MILESTONE_ENABLED) === 'true';
    appState.skimMode = localStorage.getItem(STORAGE_KEYS.SKIM_MODE) === 'true';
    appState.bills = JSON.parse(localStorage.getItem(STORAGE_KEYS.BILLS_BREAKDOWN) || '[]');
    appState.billsBasis = localStorage.getItem(STORAGE_KEYS.BILLS_BASIS) || 'days';
    appState.tradeLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRADE_LOGS) || '[]');
    appState.syncKey = localStorage.getItem(STORAGE_KEYS.SYNC_KEY) || 'dcniper_portfolio';
    appState.webhookUrl = localStorage.getItem(STORAGE_KEYS.WEBHOOK_URL) || '';
    appState.firebaseCfg = localStorage.getItem(STORAGE_KEYS.FIREBASE_CFG) || '';

    // Verify active profile exists
    if (!getActiveProfile()) {
      appState.activeProfileId = appState.profiles[0]?.id || 'default_28';
    }
  } catch (err) {
    console.error('Error loading state from storage, resetting safely:', err);
  }
}

function saveStateToStorage(skipCloudSync = false) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(appState.profiles));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE, appState.activeProfileId);
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
    localStorage.setItem(STORAGE_KEYS.SYNC_KEY, appState.syncKey);
    localStorage.setItem(STORAGE_KEYS.WEBHOOK_URL, appState.webhookUrl);
    localStorage.setItem(STORAGE_KEYS.FIREBASE_CFG, appState.firebaseCfg);

    if (!skipCloudSync) {
      debounceCloudSync();
    }
  } catch (err) {
    console.error('Error saving state to storage:', err);
  }
}

// ==========================================
// 5. HELPER DATA RESOLVERS
// ==========================================

function getActiveProfile() {
  return appState.profiles.find(p => p.id === appState.activeProfileId) || appState.profiles[0] || DEFAULT_PROFILE;
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

  return profile ? profile.base : 100;
}

function getPreviousDeskBalance(sessionIndex) {
  const profile = getActiveProfile();
  const s = sessionIndex || appState.activeSession;

  if (s <= 1) {
    return profile ? profile.base : 100;
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
  const maxSession = profile ? profile.totalSessions : 28;

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
  const startBal = profile ? profile.base : 100;
  const s = appState.activeSession;

  // Header profile name
  const headerName = document.getElementById('headerProfileName');
  if (headerName) headerName.textContent = profile.name;

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
  if (elStartBal) elStartBal.textContent = formatCurrency(startBal);

  if (appState.logs[s] !== undefined && appState.logs[s] !== null) {
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
  const overallPnL = totalWealth - startBal;
  const overallReturn = startBal > 0 ? (overallPnL / startBal) * 100 : 0;

  if (elOverallPnL) {
    elOverallPnL.textContent = formatCurrencyPnL(overallPnL);
    elOverallPnL.className = `text-base sm:text-lg font-bold font-num ${overallPnL >= 0 ? 'text-emerald-600' : 'text-red-600'}`;
  }
  if (elOverallReturn) {
    elOverallReturn.textContent = formatPercent(overallReturn);
    elOverallReturn.className = `text-base sm:text-lg font-bold font-num ${overallReturn >= 0 ? 'text-emerald-600' : 'text-red-600'}`;
  }
  if (elOverallTarget) {
    elOverallTarget.textContent = formatCurrency(profile.portTarget);
  }
  if (elStreakCount) {
    const streak = getStreakCount();
    elStreakCount.textContent = `${streak} 🔥`;
  }
}

/**
 * Static 3-Pace Targets Section
 */
function render3PaceTargetsSection() {
  const profile = getActiveProfile();
  const s = appState.activeSession;
  const row = profile.sessions[s - 1] || profile.sessions[0];
  const currentBal = getCurrentDeskBalance(s);

  // Targets
  const targetRel = row ? row.r : 100;
  const targetMid = row ? row.m : 180;
  const targetAgg = row ? row.a : 250;

  // Finreq target calculation: desk needed to pace toward total obligations
  const tfg = calculateTotalFinancialGoal(profile, currentBal, appState.vaultLedger, appState.bills, appState.milestoneCfg);
  const remainingObligations = tfg.bills.remaining + tfg.savings.remaining;
  const sessionsLeft = Math.max(1, profile.totalSessions - s + 1);
  const targetFinreq = Math.round((currentBal + (remainingObligations / sessionsLeft)) * 100) / 100;

  // Set card contents
  const elRel = document.getElementById('targetRelVal');
  const elMid = document.getElementById('targetMidVal');
  const elAgg = document.getElementById('targetAggVal');
  const elFin = document.getElementById('targetFinreqVal');

  if (elRel) elRel.textContent = formatCurrency(targetRel);
  if (elMid) elMid.textContent = formatCurrency(targetMid);
  if (elAgg) elAgg.textContent = formatCurrency(targetAgg);
  if (elFin) elFin.textContent = formatCurrency(targetFinreq);

  // Diffs
  const diffRel = currentBal - targetRel;
  const diffMid = currentBal - targetMid;
  const diffAgg = currentBal - targetAgg;
  const diffFin = currentBal - targetFinreq;

  const elDiffRel = document.getElementById('diffRelVal');
  const elDiffMid = document.getElementById('diffMidVal');
  const elDiffAgg = document.getElementById('diffAggVal');
  const elDiffFin = document.getElementById('diffFinreqVal');

  if (elDiffRel) elDiffRel.textContent = `Diff: ${formatCurrencyPnL(diffRel)}`;
  if (elDiffMid) elDiffMid.textContent = `Diff: ${formatCurrencyPnL(diffMid)}`;
  if (elDiffAgg) elDiffAgg.textContent = `Diff: ${formatCurrencyPnL(diffAgg)}`;
  if (elDiffFin) elDiffFin.textContent = `Diff: ${formatCurrencyPnL(diffFin)}`;

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
  const row = profile.sessions[sessionNum - 1] || profile.sessions[0];
  if (!row) return 100;

  if (appState.pace === 'mid') return row.m;
  if (appState.pace === 'aggressive') return row.a;
  if (appState.pace === 'finreq') {
    const cur = getCurrentDeskBalance(sessionNum);
    const tfg = calculateTotalFinancialGoal(profile, cur, appState.vaultLedger, appState.bills, appState.milestoneCfg);
    const remaining = tfg.bills.remaining + tfg.savings.remaining;
    const sLeft = Math.max(1, profile.totalSessions - sessionNum + 1);
    return Math.round((cur + (remaining / sLeft)) * 100) / 100;
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
  const dateStr = getDateForSession(profile.startDate, s);
  const currentBal = getCurrentDeskBalance(s);
  const activeTarget = getActiveTargetForSession(s);

  // Session header
  const title = document.getElementById('activeSessionTitle');
  const dateEl = document.getElementById('activeSessionDate');
  const lockBadge = document.getElementById('sessionLockBadge');
  const lockBtn = document.getElementById('btnToggleLockSession');

  if (title) title.textContent = `Session ${s} of ${profile.totalSessions}`;
  if (dateEl) dateEl.textContent = `Date: ${dateStr}`;
  if (lockBadge) {
    lockBadge.textContent = isLocked ? '🔒 Locked' : '🔓 Unlocked';
    lockBadge.className = isLocked ? 'badge badge-amber text-[11px]' : 'badge badge-gray text-[11px]';
  }
  if (lockBtn) {
    lockBtn.textContent = isLocked ? '🔓 Unlock Session' : '🔒 Lock Session';
  }

  // Session selector dropdown
  const dropdown = document.getElementById('sessionSelectDropdown');
  if (dropdown) {
    dropdown.innerHTML = '';
    for (let i = 1; i <= profile.totalSessions; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `Session ${i}${appState.logs[i] !== undefined ? ' ✓' : ''}`;
      if (i === s) opt.selected = true;
      dropdown.appendChild(opt);
    }
  }

  // Balance input & lock state
  const balInput = document.getElementById('sessionBalanceInput');
  const timestampText = document.getElementById('sessionTimestampText');

  if (balInput) {
    balInput.value = appState.logs[s] !== undefined ? appState.logs[s] : '';
    balInput.disabled = isLocked;
    if (isLocked) {
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
      timestampText.textContent = 'Not logged yet';
    }
  }

  // Notes
  const notesInput = document.getElementById('sessionNotesInput');
  if (notesInput) {
    notesInput.value = appState.notes[s] || '';
  }

  // Shortfall & Rebase card
  const shortfallCard = document.getElementById('shortfallCard');
  if (shortfallCard) {
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
  }

  // Profit Allocation Card
  const profitCard = document.getElementById('profitAllocationCard');
  if (profitCard) {
    const dailyPnL = getNormalizedDailyPnL(s);
    if (dailyPnL > 0 && appState.logs[s] !== undefined) {
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

/**
 * Mountain Trail Progress Visualizer (Section 4.1)
 */
function renderMountainTrail() {
  const container = document.getElementById('mountainTrailContainer');
  if (!container) return;

  const profile = getActiveProfile();
  const N = profile.totalSessions;
  const currentS = appState.activeSession;

  const width = Math.max(700, N * 38);
  const height = 90;
  const padX = 30;
  const usableWidth = width - padX * 2;
  const stepX = usableWidth / (N - 1);

  // Generate SVG path points
  const points = [];
  for (let i = 0; i < N; i++) {
    const s = i + 1;
    const x = padX + i * stepX;
    // Altitude increases up the mountain
    const y = height - 20 - ((i / (N - 1)) * (height - 40));
    points.push({ s, x, y });
  }

  let polylineStr = points.map(p => `${p.x},${p.y}`).join(' ');

  let nodesSvg = points.map(p => {
    const isCompleted = appState.logs[p.s] !== undefined;
    const isActive = p.s === currentS;
    const isCheckpoint = p.s % 7 === 0 || p.s === Math.round(N * 0.25) || p.s === N;

    let fillColor = '#94a3b8';
    let strokeColor = '#cbd5e1';
    let radius = 6;

    if (isCompleted) {
      fillColor = '#10b981';
      strokeColor = '#059669';
    }
    if (isActive) {
      fillColor = '#f59e0b';
      strokeColor = '#d97706';
      radius = 8;
    }

    return `
      <g class="cursor-pointer" onclick="jumpToSession(${p.s})">
        <circle cx="${p.x}" cy="${p.y}" r="${radius}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2" />
        <text x="${p.x}" y="${p.y + (isActive ? 16 : 14)}" font-size="9" font-family="monospace" text-anchor="middle" fill="#475569">S${p.s}</text>
        ${isCheckpoint ? `<circle cx="${p.x}" cy="${p.y - 10}" r="2.5" fill="#7c3aed" />` : ''}
      </g>
    `;
  }).join('');

  container.innerHTML = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="overflow-visible">
      <defs>
        <linearGradient id="trailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#10b981" />
          <stop offset="100%" stop-color="#7c3aed" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke="url(#trailGrad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${polylineStr}" />
      ${nodesSvg}
    </svg>
  `;
}

/**
 * Master Session Table (Section 4.1)
 */
function renderMasterTable() {
  const tbody = document.getElementById('masterTableBody');
  if (!tbody) return;

  const profile = getActiveProfile();
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
  for (let s = 1; s <= profile.totalSessions; s++) {
    const dStr = getDateForSession(profile.startDate, s);
    dateToSession[dStr] = s;
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

  // Active Challenge Overview
  const nameEl = document.getElementById('cfgActiveChallengeName');
  const datesEl = document.getElementById('cfgActiveChallengeDates');
  const mBase = document.getElementById('cfgMetricBase');
  const mTarget = document.getElementById('cfgMetricTarget');
  const mSessions = document.getElementById('cfgMetricSessions');
  const mMultiplier = document.getElementById('cfgMetricMultiplier');

  if (nameEl) nameEl.textContent = profile.name;
  if (datesEl) {
    const endDate = getDateForSession(profile.startDate, profile.totalSessions);
    datesEl.textContent = `Start: ${profile.startDate} • Projected Summit: ${endDate}`;
  }
  if (mBase) mBase.textContent = formatCurrency(profile.base);
  if (mTarget) mTarget.textContent = formatCurrency(profile.portTarget);
  if (mSessions) mSessions.textContent = `${appState.activeSession} / ${profile.totalSessions}`;
  if (mMultiplier) {
    const mult = profile.base > 0 ? (profile.portTarget / profile.base).toFixed(1) : '0.0';
    mMultiplier.textContent = `${mult}x`;
  }

  // Profile Selector
  const selector = document.getElementById('ladderProfileSelector');
  if (selector) {
    selector.innerHTML = '';
    appState.profiles.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.name} ($${p.base} → $${p.portTarget})`;
      if (p.id === appState.activeProfileId) opt.selected = true;
      selector.appendChild(opt);
    });
  }

  // Saved Challenges List
  const listEl = document.getElementById('cfgActiveChallengeList');
  if (listEl) {
    listEl.innerHTML = appState.profiles.map(p => {
      const isActive = p.id === appState.activeProfileId;
      return `
        <div class="p-3.5 rounded-lg border ${isActive ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 bg-white'} space-y-2">
          <div class="flex items-center justify-between">
            <h5 class="font-bold text-xs text-slate-900">${p.name}</h5>
            <span class="badge ${isActive ? 'badge-green' : 'badge-gray'} text-[10px]">${isActive ? 'Active' : 'Saved'}</span>
          </div>
          <div class="flex justify-between text-xs text-slate-600 font-num">
            <span>$${p.base} → $${p.portTarget}</span>
            <span>${p.totalSessions} Sessions</span>
          </div>
          <div class="flex gap-2 pt-1 border-t border-slate-100 text-xs">
            ${!isActive ? `<button onclick="handleSwitchProfile('${p.id}')" class="px-2 py-1 bg-slate-800 text-white rounded font-semibold text-[11px]">Select Active</button>` : ''}
            <button onclick="handleLoadProfileIntoWizard('${p.id}')" class="px-2 py-1 border border-slate-300 rounded font-semibold text-[11px]">Edit in Wizard</button>
            ${appState.profiles.length > 1 ? `<button onclick="handleDeleteProfile('${p.id}')" class="px-2 py-1 text-red-600 hover:bg-red-50 rounded font-semibold text-[11px]">Delete</button>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  // Sync inputs
  const syncKeyInp = document.getElementById('syncKeyInput');
  const firebaseCfgInp = document.getElementById('firebaseCfgInput');
  const webhookUrlInp = document.getElementById('webhookUrlInput');

  if (syncKeyInp) syncKeyInp.value = appState.syncKey;
  if (firebaseCfgInp) firebaseCfgInp.value = appState.firebaseCfg;
  if (webhookUrlInp) webhookUrlInp.value = appState.webhookUrl;
}

/**
 * Module 3: Trade Journal (Section 4.3)
 */
function renderTradeJournalModule() {
  const profile = getActiveProfile();

  // Populate session selectors
  const sessionSel = document.getElementById('tradeSessionSelect');
  const modalSessionSel = document.getElementById('modalTradeSessionSelect');
  const filterSel = document.getElementById('tradeHistorySessionFilter');

  [sessionSel, modalSessionSel].forEach(sel => {
    if (sel) {
      sel.innerHTML = '';
      for (let s = 1; s <= profile.totalSessions; s++) {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = `Session ${s}`;
        if (s === appState.activeSession) opt.selected = true;
        sel.appendChild(opt);
      }
    }
  });

  if (filterSel) {
    const currentVal = filterSel.value || 'all';
    filterSel.innerHTML = '<option value="all">All Sessions</option>';
    for (let s = 1; s <= profile.totalSessions; s++) {
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
    tbody.innerHTML = `<tr><td colspan="11" class="text-center py-6 text-slate-400">No trade logs found for selected filter.</td></tr>`;
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
  if (elOpenClosed) elOpenClosed.textContent = `${a.closedCount} / ${a.openCount}`;
  if (elWinRate) elWinRate.textContent = `${a.winRate.toFixed(1)}%`;
  if (elAvgReturn) elAvgReturn.textContent = formatPercent(a.avgReturn);
  if (elRealized) {
    elRealized.textContent = formatCurrencyPnL(a.totalPnL);
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

  const sessionsLeft = Math.max(1, profile.totalSessions - appState.activeSession + 1);
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
  const goal = appState.milestoneCfg.savingsGoal || 5000;
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
  const base = profile ? profile.base : 100;
  const floor = appState.milestoneCfg.reserveFloor || 100;
  const goal = appState.milestoneCfg.savingsGoal || 5000;

  // Step 1: Recoup Start Deposit
  const b1 = document.getElementById('milestoneStep1Badge');
  const p1 = document.getElementById('milestoneStep1Progress');
  if (p1) p1.textContent = `${formatCurrency(totalVault)} / ${formatCurrency(base)}`;
  if (b1) {
    if (totalVault >= base) {
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
    if (totalVault >= floor) {
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
    if (totalVault >= goal) {
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
  const N = profile.totalSessions;
  const startBal = profile.base;
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
  if (elCircle) elCircle.textContent = score;
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
      <line x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}" stroke="#e2e8f0" stroke-width="1" />
      <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${h - pad}" stroke="#e2e8f0" stroke-width="1" />
      <polyline fill="none" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round" points="${ptsWealth}" />
      <polyline fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-dasharray="4,2" points="${ptsDesk}" />
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
    const color = d.pnl >= 0 ? '#10b981' : '#ef4444';
    return `<rect x="${x}" y="${y}" width="${barWidth}" height="${Math.max(2, barH)}" fill="${color}" rx="2" />`;
  }).join('');

  container.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}">
      <line x1="${pad}" y1="${zeroY}" x2="${w - pad}" y2="${zeroY}" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3,3" />
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
  const tabs = ['tracker', 'config', 'trades', 'milestones', 'stats'];
  tabs.forEach(t => {
    const content = document.getElementById(`tabContent${capitalize(t)}`);
    const btn = document.getElementById(`nav${capitalize(t)}Btn`);
    if (content) content.classList.remove('active');
    if (btn) {
      btn.className = 'px-4 py-2.5 text-slate-600 hover:text-slate-900 border-b-2 border-transparent whitespace-nowrap';
    }
  });

  const activeContent = document.getElementById(`tabContent${capitalize(tabName)}`);
  const activeBtn = document.getElementById(`nav${capitalize(tabName)}Btn`);
  if (activeContent) activeContent.classList.add('active');
  if (activeBtn) {
    activeBtn.className = 'px-4 py-2.5 text-emerald-600 border-b-2 border-emerald-600 font-bold whitespace-nowrap';
  }

  // Refresh module data
  refreshAllViews();
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
    activeBtn.className = 'px-3 py-2 text-sm font-semibold text-emerald-700 border-b-2 border-emerald-600';
  }

  if (subtab === 'calendar') renderCalendarView();
  if (subtab === 'tfg') renderTotalFinancialGoal();
}

function switchConfigSubTab(subtab) {
  const subtabs = ['active', 'wizard', 'sync', 'reset'];
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
    activeBtn.className = 'px-4 py-2 text-sm font-semibold text-emerald-700 border-b-2 border-emerald-600';
  }
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
    activeBtn.className = 'px-4 py-2 text-sm font-semibold text-emerald-700 border-b-2 border-emerald-600';
  }

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
    activeBtn.className = 'px-4 py-2 text-sm font-semibold text-emerald-700 border-b-2 border-emerald-600';
  }

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

  if (val === '' || isNaN(val)) {
    delete appState.logs[s];
    delete appState.timestamps[s];
  } else {
    appState.logs[s] = parseFloat(val);
    appState.timestamps[s] = new Date().toISOString();
  }

  saveStateToStorage();
  renderDailyDesk();
  render3PaceTargetsSection();
  renderHeaderAndTopBar();
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
  document.getElementById('quickEditBaseInput').value = profile.base;
  document.getElementById('quickEditTargetInput').value = profile.portTarget;
  openModalDialog('quickEditParamsModal');
}

function handleQuickEditApply() {
  const base = parseFloat(document.getElementById('quickEditBaseInput').value) || 100;
  const target = parseFloat(document.getElementById('quickEditTargetInput').value) || 7000;

  const profile = getActiveProfile();
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
  const name = document.getElementById('genName').value || '30-Day Growth Ladder';
  const base = parseFloat(document.getElementById('genBase').value) || 100;
  const target = parseFloat(document.getElementById('genTarget').value) || 7000;
  const sessions = parseInt(document.getElementById('genSessions').value) || 28;
  const startDate = document.getElementById('genStartDate').value || new Date().toISOString().split('T')[0];

  const profile = getActiveProfile();
  profile.name = name;
  profile.base = base;
  profile.portTarget = target;
  profile.targetBalance = target;
  profile.totalSessions = sessions;
  profile.startDate = startDate;
  profile.sessions = generateRoadmapSessions(
    profile.curveType || 'tri_pace_independent',
    base,
    target,
    sessions,
    profile.withdrawalTarget,
    profile.withdrawalDays
  );

  saveStateToStorage();
  refreshAllViews();
  openModal({
    title: 'Quick Apply Successful',
    message: `Updated active challenge "${name}" ($${base} → $${target}, ${sessions} sessions).`
  });
}

function setSetupStep(step) {
  [1, 2, 3].forEach(s => {
    const el = document.getElementById(`wizardStep${s}`);
    const ind = document.getElementById(`stepIndicator${s}`);
    if (el) el.classList.add('hidden');
    if (ind) ind.className = 'px-2 py-0.5 rounded-full font-bold bg-slate-200 text-slate-600';
  });

  const activeEl = document.getElementById(`wizardStep${step}`);
  const activeInd = document.getElementById(`stepIndicator${step}`);
  if (activeEl) activeEl.classList.remove('hidden');
  if (activeInd) activeInd.className = 'px-2 py-0.5 rounded-full font-bold bg-emerald-600 text-white';

  if (step === 3) {
    renderWizardPreview();
  }
}

function handleCurveTypeChange(type) {
  const cashoutBox = document.getElementById('wizardCashoutSettings');
  if (cashoutBox) {
    if (type === 'port_target_withdrawal') {
      cashoutBox.classList.remove('hidden');
    } else {
      cashoutBox.classList.add('hidden');
    }
  }
}

function renderWizardPreview() {
  const previewBox = document.getElementById('wizardCheckpointsPreview');
  if (!previewBox) return;

  const base = parseFloat(document.getElementById('genBase').value) || 100;
  const target = parseFloat(document.getElementById('genTarget').value) || 7000;
  const sessions = parseInt(document.getElementById('genSessions').value) || 28;
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
  const name = document.getElementById('genName').value || 'Custom Challenge';
  const base = parseFloat(document.getElementById('genBase').value) || 100;
  const target = parseFloat(document.getElementById('genTarget').value) || 7000;
  const sessions = parseInt(document.getElementById('genSessions').value) || 28;
  const startDate = document.getElementById('genStartDate').value || new Date().toISOString().split('T')[0];
  const curveType = document.getElementById('genCurveType').value || 'tri_pace_independent';
  const withdrawalTarget = parseFloat(document.getElementById('genWithdrawalTarget')?.value) || 0;
  const withdrawalDays = parseInt(document.getElementById('genWithdrawalDays')?.value) || sessions;
  const skimMode = !!document.getElementById('genSkimMode')?.checked;

  const newSessions = generateRoadmapSessions(curveType, base, target, sessions, withdrawalTarget, withdrawalDays);

  if (updateActive) {
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
  appState.activeProfileId = profileId;
  saveStateToStorage();
  refreshAllViews();
}

function handleLoadProfileIntoWizard(profileId) {
  const p = appState.profiles.find(pr => pr.id === profileId);
  if (!p) return;

  document.getElementById('genName').value = p.name;
  document.getElementById('genBase').value = p.base;
  document.getElementById('genTarget').value = p.portTarget;
  document.getElementById('genSessions').value = p.totalSessions;
  document.getElementById('genStartDate').value = p.startDate;
  document.getElementById('genCurveType').value = p.curveType || 'tri_pace_independent';

  handleCurveTypeChange(p.curveType || 'tri_pace_independent');
  if (document.getElementById('genWithdrawalTarget')) document.getElementById('genWithdrawalTarget').value = p.withdrawalTarget || 0;
  if (document.getElementById('genWithdrawalDays')) document.getElementById('genWithdrawalDays').value = p.withdrawalDays || p.totalSessions;
  if (document.getElementById('genSkimMode')) document.getElementById('genSkimMode').checked = !!p.skimMode;

  switchConfigSubTab('wizard');
  setSetupStep(1);
}

function handleDeleteProfile(profileId) {
  if (appState.profiles.length <= 1) {
    openModal({ title: 'Cannot Delete', message: 'You must have at least one challenge profile.' });
    return;
  }

  openModal({
    title: 'Confirm Profile Deletion',
    message: 'Are you sure you want to delete this challenge profile? Historical logs will be preserved.',
    confirmText: 'Delete Profile',
    onConfirm: () => {
      appState.profiles = appState.profiles.filter(p => p.id !== profileId);
      if (appState.activeProfileId === profileId) {
        appState.activeProfileId = appState.profiles[0].id;
      }
      saveStateToStorage();
      refreshAllViews();
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
    elNet.textContent = formatCurrencyPnL(net);
    elNet.className = `text-base font-bold font-num ${net >= 0 ? 'text-emerald-600' : 'text-red-600'}`;
  }
  if (elRet) {
    elRet.textContent = `(${formatPercent(ret)})`;
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
  document.getElementById('modalTradeFeesInput').value = '0.50';
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
  const floor = appState.milestoneCfg.reserveFloor || 100;
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
  appState.milestoneCfg.savingsGoal = parseFloat(document.getElementById('milestoneGoalInput').value) || 5000;
  appState.milestoneCfg.reserveFloor = parseFloat(document.getElementById('milestoneFloorInput').value) || 100;
  appState.milestoneCfg.strategy = document.getElementById('milestoneStrategySelect').value || 'gradual';

  saveStateToStorage();
  refreshAllViews();
  openModal({ title: 'Settings Saved', message: 'Milestone and reserve floor settings updated.' });
}

// ==========================================
// 11. CLOUD SYNC & DATA INTEGRATIONS
// ==========================================

function debounceCloudSync() {
  if (cloudSyncTimeout) clearTimeout(cloudSyncTimeout);
  cloudSyncTimeout = setTimeout(() => {
    pushStateToCloud();
  }, 500);
}

function pushStateToCloud() {
  // 1. Firebase sync if active
  if (firestoreDb && appState.syncKey) {
    const statusBadge = document.getElementById('firebaseStatusBadge');
    const headerBadge = document.getElementById('headerSyncStatus');
    if (statusBadge) { statusBadge.textContent = 'Syncing...'; statusBadge.className = 'badge badge-amber text-[10px]'; }
    if (headerBadge) { headerBadge.textContent = 'Cloud: Syncing...'; headerBadge.className = 'badge badge-amber'; }

    const payload = {
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
      updatedAt: new Date().toISOString()
    };

    firestoreDb.collection('users').doc(appState.syncKey).set(payload, { merge: true })
      .then(() => {
        if (statusBadge) { statusBadge.textContent = 'Online'; statusBadge.className = 'badge badge-green text-[10px]'; }
        if (headerBadge) { headerBadge.textContent = 'Cloud: Online'; headerBadge.className = 'badge badge-green'; }
      })
      .catch(err => {
        console.warn('Firestore sync failed:', err);
        if (statusBadge) { statusBadge.textContent = 'Error'; statusBadge.className = 'badge badge-red text-[10px]'; }
      });
  }
}

function handleSaveFirebaseConfig() {
  const cfgStr = document.getElementById('firebaseCfgInput').value;
  const syncKey = document.getElementById('syncKeyInput').value;

  appState.firebaseCfg = cfgStr;
  appState.syncKey = syncKey || 'dcniper_portfolio';
  saveStateToStorage(true);

  initFirebaseSync();
}

function initFirebaseSync() {
  if (!appState.firebaseCfg || !window.firebase) return;

  try {
    const config = JSON.parse(appState.firebaseCfg);
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    firestoreDb = firebase.firestore();

    const statusBadge = document.getElementById('firebaseStatusBadge');
    const headerBadge = document.getElementById('headerSyncStatus');
    if (statusBadge) { statusBadge.textContent = 'Connecting...'; statusBadge.className = 'badge badge-amber text-[10px]'; }

    if (firestoreUnsubscribe) firestoreUnsubscribe();

    firestoreUnsubscribe = firestoreDb.collection('users').doc(appState.syncKey).onSnapshot(doc => {
      if (doc.exists) {
        const data = doc.data();
        if (data && data.updatedAt) {
          // If remote is newer, merge safely
          if (data.profiles) appState.profiles = data.profiles;
          if (data.activeProfileId) appState.activeProfileId = data.activeProfileId;
          if (data.logs) appState.logs = Object.assign({}, appState.logs, data.logs);
          if (data.vaultLedger) appState.vaultLedger = data.vaultLedger;
          if (data.bills) appState.bills = data.bills;
          if (data.tradeLogs) appState.tradeLogs = data.tradeLogs;
          saveStateToStorage(true);
          refreshAllViews();
        }
      }
      if (statusBadge) { statusBadge.textContent = 'Online'; statusBadge.className = 'badge badge-green text-[10px]'; }
      if (headerBadge) { headerBadge.textContent = 'Cloud: Online'; headerBadge.className = 'badge badge-green'; }
    }, err => {
      console.warn('Firestore listener error:', err);
      if (statusBadge) { statusBadge.textContent = 'Error'; statusBadge.className = 'badge badge-red text-[10px]'; }
    });
  } catch (err) {
    console.error('Invalid Firebase JSON config:', err);
    openModal({ title: 'Config Error', message: 'The provided Firebase config is not valid JSON.' });
  }
}

function handleManualCloudSync() {
  pushStateToCloud();
  openModal({ title: 'Cloud Sync', message: 'Manual sync dispatched to remote cloud storage.' });
}

function handleSaveWebhookUrl() {
  appState.webhookUrl = document.getElementById('webhookUrlInput').value;
  saveStateToStorage();
  openModal({ title: 'Webhook Saved', message: 'Google Sheets webhook URL has been saved.' });
}

function handleSyncToSheets() {
  if (!appState.webhookUrl) {
    openModal({ title: 'Missing Webhook URL', message: 'Enter a valid Google Apps Script Web App URL first.' });
    return;
  }

  const profile = getActiveProfile();
  const payload = {
    profileName: profile.name,
    activeSession: appState.activeSession,
    currentDeskBalance: getCurrentDeskBalance(),
    vaultTotal: getVaultTotalBalance(),
    logs: appState.logs,
    timestamp: new Date().toISOString()
  };

  fetch(appState.webhookUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(() => {
    openModal({ title: 'Pushed to Google Sheets', message: 'Data dispatched successfully to your Google Sheet webhook!' });
  }).catch(err => {
    openModal({ title: 'Sync Failed', message: 'Error pushing to Google Sheets webhook: ' + err.message });
  });
}

function exportDataToCsv() {
  const profile = getActiveProfile();
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

function copyFirestoreRulesToClipboard() {
  const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;
  navigator.clipboard.writeText(rules).then(() => {
    openModal({ title: 'Rules Copied', message: 'Firestore security rules copied to clipboard!' });
  });
}

function openAppsScriptModal() {
  const code = `function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Portfolio_Logs") || ss.insertSheet("Portfolio_Logs");
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Profile", "Session", "Desk Balance", "Vault Total"]);
    }
    
    sheet.appendRow([
      new Date(),
      data.profileName,
      data.activeSession,
      data.currentDeskBalance,
      data.vaultTotal
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;
  document.getElementById('appsScriptCodeText').value = code;
  openModalDialog('appsScriptModal');
}

function copyAppsScriptCode() {
  const text = document.getElementById('appsScriptCodeText').value;
  navigator.clipboard.writeText(text).then(() => {
    openModal({ title: 'Code Copied', message: 'Google Apps Script code copied to clipboard!' });
  });
}

function openLinkSheetModal() {
  document.getElementById('modalSyncKeyInput').value = appState.syncKey;
  document.getElementById('modalFirebaseCfgInput').value = appState.firebaseCfg;
  document.getElementById('modalWebhookUrlInput').value = appState.webhookUrl;
  openModalDialog('sheetSyncModal');
}

function handleSaveSyncModal() {
  appState.syncKey = document.getElementById('modalSyncKeyInput').value;
  appState.firebaseCfg = document.getElementById('modalFirebaseCfgInput').value;
  appState.webhookUrl = document.getElementById('modalWebhookUrlInput').value;
  saveStateToStorage(true);
  initFirebaseSync();
  closeModal('sheetSyncModal');
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
      const idx = appState.profiles.findIndex(p => p.id === 'default_28');
      if (idx !== -1) {
        appState.profiles[idx] = Object.assign({}, DEFAULT_PROFILE);
      } else {
        appState.profiles.unshift(Object.assign({}, DEFAULT_PROFILE));
      }
      appState.activeProfileId = 'default_28';
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
        if (data.milestoneCfg) appState.milestoneCfg = data.milestoneCfg;
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
}

window.addEventListener('DOMContentLoaded', () => {
  loadStateFromStorage();
  refreshAllViews();
  initFirebaseSync();
});
