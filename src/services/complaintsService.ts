import { Complaint, ComplaintStatus, ComplaintSeverity } from '../types';
import { initialComplaints } from '../data/mockData';

const STORAGE_KEY = 'draintrack_complaints_v1';

const getStoredComplaints = (): Complaint[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load complaints from localStorage', e);
  }
  return initialComplaints;
};

const saveComplaints = (complaints: Complaint[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  } catch (e) {
    console.warn('Failed to save complaints to localStorage', e);
  }
};

let complaintsStore: Complaint[] = getStoredComplaints();

export const complaintsService = {
  async getAll(): Promise<Complaint[]> {
    return [...complaintsStore];
  },

  async getById(id: string): Promise<Complaint | undefined> {
    return complaintsStore.find((c) => c.complaint_id === id);
  },

  async create(newComplaint: Omit<Complaint, 'complaint_id' | 'reported_at' | 'status'>): Promise<Complaint> {
    const year = new Date().getFullYear();
    const count = complaintsStore.length + 1;
    const complaint_id = `CMP-${year}-${String(count).padStart(3, '0')}`;
    const now = new Date();
    const reported_at = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const complaint: Complaint = {
      ...newComplaint,
      complaint_id,
      status: 'Pending',
      reported_at
    };

    complaintsStore = [complaint, ...complaintsStore];
    saveComplaints(complaintsStore);
    return complaint;
  },

  async updateStatus(complaintId: string, status: ComplaintStatus, assignedWorker?: { id: string; name: string }): Promise<Complaint | undefined> {
    complaintsStore = complaintsStore.map((c) => {
      if (c.complaint_id === complaintId) {
        return {
          ...c,
          status,
          assigned_worker_id: assignedWorker ? assignedWorker.id : c.assigned_worker_id,
          assigned_worker_name: assignedWorker ? assignedWorker.name : c.assigned_worker_name
        };
      }
      return c;
    });
    saveComplaints(complaintsStore);
    return complaintsStore.find((c) => c.complaint_id === complaintId);
  },

  async updateSeverity(complaintId: string, severity: ComplaintSeverity): Promise<Complaint | undefined> {
    complaintsStore = complaintsStore.map((c) => (c.complaint_id === complaintId ? { ...c, severity } : c));
    saveComplaints(complaintsStore);
    return complaintsStore.find((c) => c.complaint_id === complaintId);
  },

  resetDefaults(): void {
    complaintsStore = initialComplaints;
    saveComplaints(complaintsStore);
  }
};
