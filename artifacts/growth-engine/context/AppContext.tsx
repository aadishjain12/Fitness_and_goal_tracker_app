import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  AppData, BadmintonLog, CustomTask, JobApp, SmokingSettings, PrivacySettings,
  generateId, getTodayStr, loadData, saveData
} from '@/lib/storage';

interface AppContextType {
  data: AppData;
  isLoading: boolean;
  setSmokeFreeStart: (date: string | null) => Promise<void>;
  updateSmokingSettings: (s: Partial<SmokingSettings>) => Promise<void>;
  logBadminton: (completed: boolean, reason?: string) => Promise<void>;
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

  const setSmokeFreeStart = async (date: string | null) => {
    await persist({ ...data, smokeFreeStart: date });
  };

  const updateSmokingSettings = async (s: Partial<SmokingSettings>) => {
    await persist({ ...data, smokingSettings: { ...data.smokingSettings, ...s } });
  };

  const logBadminton = async (completed: boolean, reason?: string) => {
    const today = getTodayStr();
    const filtered = data.badmintonLogs.filter(l => l.date !== today);
    const newLog: BadmintonLog = { date: today, completed, reason };
    await persist({ ...data, badmintonLogs: [...filtered, newLog] });
  };

  const addJobApp = async (app: Omit<JobApp, 'id' | 'date'>) => {
    const newApp: JobApp = { ...app, id: generateId(), date: new Date().toISOString() };
    await persist({ ...data, jobApps: [...data.jobApps, newApp] });
  };

  const updateJobApp = async (id: string, updates: Partial<JobApp>) => {
    const apps = data.jobApps.map(a => a.id === id ? { ...a, ...updates } : a);
    await persist({ ...data, jobApps: apps });
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
    await persist({ ...data, stoicCommitments: [...filtered, newCommitment], todayCommitmentDone: true });
  };

  const togglePrivacy = async () => {
    await persist({ ...data, privacy: { ...data.privacy, enabled: !data.privacy.enabled } });
  };

  const updateCodename = async (key: string, value: string) => {
    await persist({ ...data, privacy: { ...data.privacy, codenames: { ...data.privacy.codenames, [key]: value } } });
  };

  return (
    <AppContext.Provider value={{
      data, isLoading, setSmokeFreeStart, updateSmokingSettings,
      logBadminton,
      addJobApp, updateJobApp, removeJobApp,
      addTask, toggleTask, removeTask,
      saveAuditReport, commitToday, togglePrivacy, updateCodename,
      refreshData,
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
