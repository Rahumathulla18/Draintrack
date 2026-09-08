import { WorkLog } from '../types';
import { initialWorkLogs } from '../data/mockData';

const STORAGE_KEY = 'draintrack_work_logs_v1';

const getStoredWorkLogs = (): WorkLog[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load work logs from localStorage', e);
  }
  return initialWorkLogs;
};

const saveWorkLogs = (logs: WorkLog[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.warn('Failed to save work logs to localStorage', e);
  }
};

let workLogsStore: WorkLog[] = getStoredWorkLogs();

export const workLogsService = {
  async getAll(): Promise<WorkLog[]> {
    return [...workLogsStore];
  },

  async getById(id: string): Promise<WorkLog | undefined> {
    return workLogsStore.find((l) => l.log_id === id);
  },

  async getByJobId(jobId: string): Promise<WorkLog | undefined> {
    return workLogsStore.find((l) => l.job_id === jobId);
  },

  async createLog(newLog: Omit<WorkLog, 'log_id' | 'created_at'>): Promise<WorkLog> {
    const log_id = `LOG-${900 + workLogsStore.length + 1}`;
    const now = new Date();
    const created_at = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const log: WorkLog = {
      ...newLog,
      log_id,
      created_at
    };

    workLogsStore = [log, ...workLogsStore];
    saveWorkLogs(workLogsStore);
    return log;
  },

  async verifyLog(logId: string): Promise<WorkLog | undefined> {
    workLogsStore = workLogsStore.map((l) => {
      if (l.log_id === logId) {
        return {
          ...l,
          work_verified: true,
          telemetry_points: {
            gps_verified: true,
            machine_verified: true,
            wheel_encoder_verified: true,
            time_verified: true,
            turbidity_improved: true
          }
        };
      }
      return l;
    });

    saveWorkLogs(workLogsStore);
    return workLogsStore.find((l) => l.log_id === logId);
  },

  resetDefaults(): void {
    workLogsStore = initialWorkLogs;
    saveWorkLogs(workLogsStore);
  }
};
