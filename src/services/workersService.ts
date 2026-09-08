import { Worker, WorkerAvailability, VerificationStatus } from '../types';
import { initialWorkers } from '../data/mockData';

const STORAGE_KEY = 'draintrack_workers_v1';

const getStoredWorkers = (): Worker[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load workers from localStorage', e);
  }
  return initialWorkers;
};

const saveWorkers = (workers: Worker[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workers));
  } catch (e) {
    console.warn('Failed to save workers to localStorage', e);
  }
};

let workersStore: Worker[] = getStoredWorkers();

export const workersService = {
  async getAll(): Promise<Worker[]> {
    return [...workersStore];
  },

  async getById(id: string): Promise<Worker | undefined> {
    return workersStore.find((w) => w.worker_id === id);
  },

  async addWorker(newWorker: Omit<Worker, 'worker_id' | 'total_completed_jobs' | 'total_distance_km' | 'total_machine_hours'>): Promise<Worker> {
    const id = `W-${String(workersStore.length + 1).padStart(2, '0')}`;
    const worker: Worker = {
      ...newWorker,
      worker_id: id,
      total_completed_jobs: 0,
      total_distance_km: 0,
      total_machine_hours: 0
    };
    workersStore = [worker, ...workersStore];
    saveWorkers(workersStore);
    return worker;
  },

  async updateAvailability(workerId: string, availability: WorkerAvailability): Promise<Worker | undefined> {
    workersStore = workersStore.map((w) => (w.worker_id === workerId ? { ...w, availability } : w));
    saveWorkers(workersStore);
    return workersStore.find((w) => w.worker_id === workerId);
  },

  async updateVerification(workerId: string, verification_status: VerificationStatus): Promise<Worker | undefined> {
    workersStore = workersStore.map((w) => (w.worker_id === workerId ? { ...w, verification_status } : w));
    saveWorkers(workersStore);
    return workersStore.find((w) => w.worker_id === workerId);
  },

  async assignActiveJob(workerId: string, jobId: string): Promise<Worker | undefined> {
    workersStore = workersStore.map((w) =>
      w.worker_id === workerId ? { ...w, active_job_id: jobId, availability: 'Busy' as WorkerAvailability } : w
    );
    saveWorkers(workersStore);
    return workersStore.find((w) => w.worker_id === workerId);
  },

  async clearActiveJob(workerId: string, incrementCompleted = true, addedKm = 0.5, addedHours = 1.2): Promise<Worker | undefined> {
    workersStore = workersStore.map((w) =>
      w.worker_id === workerId
        ? {
            ...w,
            active_job_id: undefined,
            availability: 'Available' as WorkerAvailability,
            total_completed_jobs: incrementCompleted ? w.total_completed_jobs + 1 : w.total_completed_jobs,
            total_distance_km: +(w.total_distance_km + addedKm).toFixed(1),
            total_machine_hours: +(w.total_machine_hours + addedHours).toFixed(1)
          }
        : w
    );
    saveWorkers(workersStore);
    return workersStore.find((w) => w.worker_id === workerId);
  },

  resetDefaults(): void {
    workersStore = initialWorkers;
    saveWorkers(workersStore);
  }
};
