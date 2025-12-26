import { useLocalStorage } from './useLocalStorage';

export interface HydrationLog {
  date: string;
  glasses: number;
  goal: number;
}

export interface SleepLog {
  date: string;
  hours: number;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  bedTime: string;
  wakeTime: string;
}

export interface WellnessData {
  hydrationLogs: HydrationLog[];
  sleepLogs: SleepLog[];
  dailyWaterGoal: number;
  dailySleepGoal: number;
  hydrationReminders: boolean;
  meditationMinutes: number;
}

const defaultData: WellnessData = {
  hydrationLogs: [],
  sleepLogs: [],
  dailyWaterGoal: 8,
  dailySleepGoal: 8,
  hydrationReminders: true,
  meditationMinutes: 0,
};

export function useWellness() {
  const [data, setData] = useLocalStorage<WellnessData>('fitfeast_wellness', defaultData);

  const getTodaysHydration = (): HydrationLog => {
    const today = new Date().toISOString().split('T')[0];
    const existing = data.hydrationLogs.find(l => l.date === today);
    return existing || { date: today, glasses: 0, goal: data.dailyWaterGoal };
  };

  const addWaterGlass = () => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => {
      const existingIndex = prev.hydrationLogs.findIndex(l => l.date === today);
      if (existingIndex >= 0) {
        const updated = [...prev.hydrationLogs];
        updated[existingIndex] = {
          ...updated[existingIndex],
          glasses: updated[existingIndex].glasses + 1,
        };
        return { ...prev, hydrationLogs: updated };
      }
      return {
        ...prev,
        hydrationLogs: [...prev.hydrationLogs, { date: today, glasses: 1, goal: prev.dailyWaterGoal }],
      };
    });
  };

  const removeWaterGlass = () => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => {
      const existingIndex = prev.hydrationLogs.findIndex(l => l.date === today);
      if (existingIndex >= 0 && prev.hydrationLogs[existingIndex].glasses > 0) {
        const updated = [...prev.hydrationLogs];
        updated[existingIndex] = {
          ...updated[existingIndex],
          glasses: updated[existingIndex].glasses - 1,
        };
        return { ...prev, hydrationLogs: updated };
      }
      return prev;
    });
  };

  const logSleep = (hours: number, quality: SleepLog['quality'], bedTime: string, wakeTime: string) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => {
      const existingIndex = prev.sleepLogs.findIndex(l => l.date === today);
      const newLog: SleepLog = { date: today, hours, quality, bedTime, wakeTime };
      if (existingIndex >= 0) {
        const updated = [...prev.sleepLogs];
        updated[existingIndex] = newLog;
        return { ...prev, sleepLogs: updated };
      }
      return { ...prev, sleepLogs: [...prev.sleepLogs.slice(-29), newLog] };
    });
  };

  const getTodaysSleep = (): SleepLog | null => {
    const today = new Date().toISOString().split('T')[0];
    return data.sleepLogs.find(l => l.date === today) || null;
  };

  const getWeeklyHydration = (): HydrationLog[] => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const existing = data.hydrationLogs.find(l => l.date === date);
      return existing || { date, glasses: 0, goal: data.dailyWaterGoal };
    });
  };

  const getWeeklySleep = (): SleepLog[] => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const existing = data.sleepLogs.find(l => l.date === date);
      return existing || { date, hours: 0, quality: 'fair' as const, bedTime: '', wakeTime: '' };
    });
  };

  const addMeditationMinutes = (minutes: number) => {
    setData(prev => ({
      ...prev,
      meditationMinutes: prev.meditationMinutes + minutes,
    }));
  };

  const setDailyWaterGoal = (glasses: number) => {
    setData(prev => ({ ...prev, dailyWaterGoal: glasses }));
  };

  const toggleHydrationReminders = () => {
    setData(prev => ({ ...prev, hydrationReminders: !prev.hydrationReminders }));
  };

  return {
    ...data,
    getTodaysHydration,
    addWaterGlass,
    removeWaterGlass,
    logSleep,
    getTodaysSleep,
    getWeeklyHydration,
    getWeeklySleep,
    addMeditationMinutes,
    setDailyWaterGoal,
    toggleHydrationReminders,
  };
}
