import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BadmintonLog {
  date: string;
  completed: boolean;
  reason?: string;
  bounceBackSeen?: boolean;
}

export interface JobApp {
  id: string;
  company: string;
  position: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
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

export interface AppData {
  smokeFreeStart: string | null;
  badmintonLogs: BadmintonLog[];
  jobApps: JobApp[];
  tasks: CustomTask[];
  lastAuditDate: string | null;
  lastAuditReport: any | null;
  onboardingDone: boolean;
}

const STORAGE_KEY = '@growth_engine_v2';

export async function loadData(): Promise<AppData> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) return JSON.parse(json);
  } catch {}
  return {
    smokeFreeStart: null,
    badmintonLogs: [],
    jobApps: [],
    tasks: [],
    lastAuditDate: null,
    lastAuditReport: null,
    onboardingDone: false,
  };
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
