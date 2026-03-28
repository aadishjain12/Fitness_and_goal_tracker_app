import AsyncStorage from '@react-native-async-storage/async-storage';

export type HabitState = 'victorious' | 'resilient' | 'lapsed';

export interface BadmintonLog {
  date: string;
  completed: boolean;
  reason?: string;
  bounceBackSeen?: boolean;
  habitState?: HabitState;
}

export interface EnergyEvent {
  id: string;
  date: string;
  delta: number;
  source: string;
  label: string;
}

export interface JobApp {
  id: string;
  company: string;
  position: string;
  status: 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected';
  date: string;
  notes?: string;
  taskOfDaySeen?: boolean;
}

export interface CustomTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  completedAt?: string;
  category?: string;
}

export interface StoicCommitment {
  date: string;
  quoteAuthor: string;
  commitment: string;
}

export interface SmokingSettings {
  cigsPerDay: number;
  costPerPack: number;
  cigsPerPack: number;
}

export interface PrivacySettings {
  enabled: boolean;
  codenames: Record<string, string>;
}

export interface AppData {
  smokeFreeStart: string | null;
  smokingSettings: SmokingSettings;
  badmintonLogs: BadmintonLog[];
  jobApps: JobApp[];
  tasks: CustomTask[];
  lastAuditDate: string | null;
  lastAuditReport: any | null;
  onboardingDone: boolean;
  stoicCommitments: StoicCommitment[];
  todayCommitmentDone: boolean;
  privacy: PrivacySettings;
  username: string;
  focusType: string;
  energyLevel: number;
  energyEvents: EnergyEvent[];
}

const STORAGE_KEY = '@growth_engine_v2';

const DEFAULT_DATA: AppData = {
  smokeFreeStart: null,
  smokingSettings: { cigsPerDay: 10, costPerPack: 12, cigsPerPack: 20 },
  badmintonLogs: [],
  jobApps: [],
  tasks: [],
  lastAuditDate: null,
  lastAuditReport: null,
  onboardingDone: false,
  stoicCommitments: [],
  todayCommitmentDone: false,
  privacy: { enabled: false, codenames: { badminton: 'Project Agility', cigarettes: 'Project Air', career: 'Project Ascend' } },
  username: '',
  focusType: 'Career Switcher',
  energyLevel: 70,
  energyEvents: [],
};

export async function loadData(): Promise<AppData> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      const parsed = JSON.parse(json);
      return { ...DEFAULT_DATA, ...parsed };
    }
  } catch {}
  return { ...DEFAULT_DATA };
}

export async function saveData(data: AppData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getStreakInfo(logs: BadmintonLog[]): { current: number; best: number; todayLogged: boolean } {
  const completed = logs.filter(l => l.completed).map(l => l.date).sort();
  const today = getTodayStr();
  const todayLogged = logs.some(l => l.date === today);
  
  let current = 0;
  let best = 0;
  let streak = 0;
  
  const dateSet = new Set(completed);
  const d = new Date();
  
  for (let i = 0; i < 365; i++) {
    const ds = d.toISOString().slice(0, 10);
    if (dateSet.has(ds)) {
      streak++;
      if (streak > best) best = streak;
      if (i < 2) current = streak;
    } else {
      if (i === 0) {
        d.setDate(d.getDate() - 1);
        continue;
      }
      if (current === 0 && streak > 0 && i <= 1) current = streak;
      streak = 0;
    }
    d.setDate(d.getDate() - 1);
  }

  return { current, best, todayLogged };
}

export function getSmokeFreeTime(start: string | null): {
  days: number; hours: number; minutes: number; seconds: number; totalSeconds: number;
} {
  if (!start) return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
  const diff = Date.now() - new Date(start).getTime();
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, totalSeconds };
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function getResilienceRating(logs: BadmintonLog[]): {
  rating: number; grade: string; label: string; total: number; victorious: number; resilient: number; lapsed: number;
} {
  const logged = logs.filter(l => l.habitState);
  const total = logged.length;
  if (total === 0) return { rating: 0, grade: 'N/A', label: 'No data yet', total: 0, victorious: 0, resilient: 0, lapsed: 0 };
  const victorious = logged.filter(l => l.habitState === 'victorious').length;
  const resilient = logged.filter(l => l.habitState === 'resilient').length;
  const lapsed = logged.filter(l => l.habitState === 'lapsed').length;
  const score = ((victorious * 1 + resilient * 0.6) / total) * 100;
  const rating = Math.round(score);
  let grade = 'F';
  let label = 'Just Starting';
  if (rating >= 90) { grade = 'S'; label = 'Stoic Master'; }
  else if (rating >= 75) { grade = 'A'; label = 'Resilient Warrior'; }
  else if (rating >= 60) { grade = 'B'; label = 'Steady Builder'; }
  else if (rating >= 45) { grade = 'C'; label = 'In Recovery'; }
  else if (rating >= 25) { grade = 'D'; label = 'Struggling'; }
  return { rating, grade, label, total, victorious, resilient, lapsed };
}

export const ENERGY_VALUES = {
  badmintonPlayed: 25,
  badmintonResilient: 12,
  stoicCommit: 10,
  addJob: -15,
  moveToInterview: -20,
  lapseHabit: -10,
} as const;

export function clampEnergy(level: number): number {
  return Math.max(0, Math.min(100, Math.round(level)));
}

export function getSmokingROI(start: string | null, settings: SmokingSettings): {
  moneySaved: number;
  lifeMinutesRegained: number;
  cigsAvoided: number;
} {
  if (!start) return { moneySaved: 0, lifeMinutesRegained: 0, cigsAvoided: 0 };
  const days = (Date.now() - new Date(start).getTime()) / 86400000;
  const cigsAvoided = Math.floor(days * settings.cigsPerDay);
  const costPerCig = settings.costPerPack / settings.cigsPerPack;
  const moneySaved = cigsAvoided * costPerCig;
  const lifeMinutesRegained = cigsAvoided * 11;
  return { moneySaved, lifeMinutesRegained, cigsAvoided };
}

export function applyPrivacy(text: string, privacy: PrivacySettings): string {
  if (!privacy.enabled) return text;
  let out = text;
  Object.entries(privacy.codenames).forEach(([key, code]) => {
    const regex = new RegExp(key, 'gi');
    out = out.replace(regex, code);
  });
  return out;
}
