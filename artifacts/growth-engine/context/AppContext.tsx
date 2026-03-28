import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  AppData, BadmintonLog, CustomTask, EnergyEvent, HabitState, JobApp,
  SmokingSettings, PrivacySettings,
  ENERGY_VALUES, clampEnergy,
  generateId, getTodayStr, loadData, saveData,
} from '@/lib/storage';

interface AppContextType {
  data: AppData;
  isLoading: boolean;
  completeOnboarding: (username: string, focusType: string) => Promise<void>;
  setSmokeFreeStart: (date: string | null) => Promise<void>;
  updateSmokingSettings: (s: Partial<SmokingSettings>) => Promise<void>;
  logBadminton: (state: HabitState, reason?: string) => Promise<void>;
  addJobApp: (app: Omit<JobApp, 'id' | 'date'>) => Promise<void>;
  updateJobApp: (id: string, updates: Partial<JobApp>) => Promise<void>;
  removeJobApp: (id: string) => Promise<void>;
  addTask: (task: Omit<CustomTask, 'id' | 'createdAt' | 'completed'>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  saveAuditReport: (report: any) => Promise<void>;
  commitToday: (commitment: string, quoteAuthor: string) => Promise<void>;
  togglePrivacy: () => Promise<void>;
  updateCodename: (key: string, value: string) => Promise<void>;
  gainEnergy: (source: keyof typeof ENERGY_VALUES, label: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>({
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
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    const loaded = await loadData();
    const today = getTodayStr();
    const todayCommitmentDone = loaded.stoicCommitments.some(c => c.date === today);
    setData({ ...loaded, todayCommitmentDone });
    setIsLoading(false);
  }, []);

  useEffect(() => { refreshData(); }, [refreshData]);

  const persist = async (newData: AppData) => {
    setData(newData);
    await saveData(newData);
  };

  const addEnergyEvent = (d: AppData, source: keyof typeof ENERGY_VALUES, label: string): AppData => {
    const delta = ENERGY_VALUES[source];
    const newLevel = clampEnergy(d.energyLevel + delta);
    const event: EnergyEvent = { id: generateId(), date: new Date().toISOString(), delta, source, label };
    const events = [event, ...d.energyEvents].slice(0, 50);
    return { ...d, energyLevel: newLevel, energyEvents: events };
  };

  const completeOnboarding = async (username: string, focusType: string) => {
    await persist({ ...data, username, focusType, onboardingDone: true });
  };

  const setSmokeFreeStart = async (date: string | null) => {
    await persist({ ...data, smokeFreeStart: date });
  };

  const updateSmokingSettings = async (s: Partial<SmokingSettings>) => {
    await persist({ ...data, smokingSettings: { ...data.smokingSettings, ...s } });
  };

  const logBadminton = async (state: HabitState, reason?: string) => {
    const today = getTodayStr();
    const filtered = data.badmintonLogs.filter(l => l.date !== today);
    const completed = state !== 'lapsed';
    const newLog: BadmintonLog = { date: today, completed, reason, habitState: state };
    let updated: AppData = { ...data, badmintonLogs: [...filtered, newLog] };
    if (state === 'victorious') updated = addEnergyEvent(updated, 'badmintonPlayed', 'Badminton session — Victorious!');
    else if (state === 'resilient') updated = addEnergyEvent(updated, 'badmintonResilient', 'Pivot Protocol — Neural pathway preserved');
    else updated = addEnergyEvent(updated, 'lapseHabit', 'Missed session — energy drained');
    await persist(updated);
  };

  const addJobApp = async (app: Omit<JobApp, 'id' | 'date'>) => {
    const newApp: JobApp = { ...app, id: generateId(), date: new Date().toISOString() };
    let updated: AppData = { ...data, jobApps: [...data.jobApps, newApp] };
    if (app.status === 'applied') updated = addEnergyEvent(updated, 'addJob', `Applied to ${app.company}`);
    await persist(updated);
  };

  const updateJobApp = async (id: string, updates: Partial<JobApp>) => {
    const apps = data.jobApps.map(a => a.id === id ? { ...a, ...updates } : a);
    let updated: AppData = { ...data, jobApps: apps };
    if (updates.status === 'interview') updated = addEnergyEvent(updated, 'moveToInterview', `Interview stage — high stakes`);
    await persist(updated);
  };

  const removeJobApp = async (id: string) => {
    await persist({ ...data, jobApps: data.jobApps.filter(a => a.id !== id) });
  };

  const addTask = async (task: Omit<CustomTask, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: CustomTask = { ...task, id: generateId(), createdAt: new Date().toISOString(), completed: false };
    await persist({ ...data, tasks: [...data.tasks, newTask] });
  };

  const toggleTask = async (id: string) => {
    const tasks = data.tasks.map(t => t.id === id
      ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined }
      : t
    );
    await persist({ ...data, tasks });
  };

  const removeTask = async (id: string) => {
    await persist({ ...data, tasks: data.tasks.filter(t => t.id !== id) });
  };

  const saveAuditReport = async (report: any) => {
    await persist({ ...data, lastAuditReport: report, lastAuditDate: new Date().toISOString() });
  };

  const commitToday = async (commitment: string, quoteAuthor: string) => {
    const today = getTodayStr();
    const filtered = data.stoicCommitments.filter(c => c.date !== today);
    const newCommitment = { date: today, quoteAuthor, commitment };
    let updated: AppData = { ...data, stoicCommitments: [...filtered, newCommitment], todayCommitmentDone: true };
    updated = addEnergyEvent(updated, 'stoicCommit', 'Daily Spark committed');
    await persist(updated);
  };

  const togglePrivacy = async () => {
    await persist({ ...data, privacy: { ...data.privacy, enabled: !data.privacy.enabled } });
  };

  const updateCodename = async (key: string, value: string) => {
    await persist({ ...data, privacy: { ...data.privacy, codenames: { ...data.privacy.codenames, [key]: value } } });
  };

  const gainEnergy = async (source: keyof typeof ENERGY_VALUES, label: string) => {
    const updated = addEnergyEvent(data, source, label);
    await persist(updated);
  };

  return (
    <AppContext.Provider value={{
      data, isLoading,
      completeOnboarding, setSmokeFreeStart, updateSmokingSettings,
      logBadminton,
      addJobApp, updateJobApp, removeJobApp,
      addTask, toggleTask, removeTask,
      saveAuditReport, commitToday, togglePrivacy, updateCodename,
      gainEnergy, refreshData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
