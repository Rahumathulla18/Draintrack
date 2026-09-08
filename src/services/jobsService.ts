import { Job, JobStatus, Complaint } from '../types';
import { initialJobs } from '../data/mockData';

const STORAGE_KEY = 'draintrack_jobs_v1';

const getStoredJobs = (): Job[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load jobs from localStorage', e);
  }
  return initialJobs;
};

const saveJobs = (jobs: Job[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch (e) {
    console.warn('Failed to save jobs to localStorage', e);
  }
};

let jobsStore: Job[] = getStoredJobs();

export const jobsService = {
  async getAll(): Promise<Job[]> {
    return [...jobsStore];
  },

  async getById(id: string): Promise<Job | undefined> {
    return jobsStore.find((j) => j.job_id === id);
  },

  async getByWorkerId(workerId: string): Promise<Job[]> {
    return jobsStore.filter((j) => j.worker_id === workerId);
  },

  async createJobFromComplaint(
    complaint: Complaint,
    worker: { worker_id: string; worker_name: string; worker_code: string; distance_km: number }
  ): Promise<Job> {
    const job_id = `JOB-${300 + jobsStore.length + 1}`;
    const now = new Date();
    const assigned_at = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newJob: Job = {
      job_id,
      complaint_id: complaint.complaint_id,
      worker_id: worker.worker_id,
      worker_name: worker.worker_name,
      worker_code: worker.worker_code,
      drainage_id: complaint.drainage_id,
      location_name: complaint.location_name,
      ward_name: complaint.ward_name,
      zone_code: complaint.zone_code,
      problem_type: complaint.problem_type,
      severity: complaint.severity,
      assigned_at,
      job_status: 'Assigned',
      estimated_distance_km: worker.distance_km,
      notes: `Automated dispatch via DrainTrack Job Dispatcher to ${worker.worker_name}`
    };

    jobsStore = [newJob, ...jobsStore];
    saveJobs(jobsStore);
    return newJob;
  },

  async updateJobStatus(jobId: string, status: JobStatus, additionalData?: Partial<Job>): Promise<Job | undefined> {
    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    jobsStore = jobsStore.map((j) => {
      if (j.job_id === jobId) {
        const updated: Job = {
          ...j,
          ...additionalData,
          job_status: status
        };

        if (status === 'Accepted' && !updated.accepted_at) {
          updated.accepted_at = timeStr;
        } else if (status === 'Working' && !updated.started_at) {
          updated.started_at = timeStr;
        } else if (status === 'Completed' && !updated.completed_at) {
          updated.completed_at = timeStr;
        }

        return updated;
      }
      return j;
    });

    saveJobs(jobsStore);
    return jobsStore.find((j) => j.job_id === jobId);
  },

  resetDefaults(): void {
    jobsStore = initialJobs;
    saveJobs(jobsStore);
  }
};
