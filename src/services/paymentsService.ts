import { Payment, PaymentStatus } from '../types';
import { initialPayments } from '../data/mockData';

const STORAGE_KEY = 'draintrack_payments_v1';

const getStoredPayments = (): Payment[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load payments from localStorage', e);
  }
  return initialPayments;
};

const savePayments = (payments: Payment[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
  } catch (e) {
    console.warn('Failed to save payments to localStorage', e);
  }
};

let paymentsStore: Payment[] = getStoredPayments();

export const paymentsService = {
  async getAll(): Promise<Payment[]> {
    return [...paymentsStore];
  },

  async getById(id: string): Promise<Payment | undefined> {
    return paymentsStore.find((p) => p.payment_id === id);
  },

  async getByWorkerId(workerId: string): Promise<Payment[]> {
    return paymentsStore.filter((p) => p.worker_id === workerId);
  },

  async createPayment(newPayment: Omit<Payment, 'payment_id' | 'created_at'>): Promise<Payment> {
    const payment_id = `PAY-${700 + paymentsStore.length + 1}`;
    const now = new Date();
    const created_at = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const payment: Payment = {
      ...newPayment,
      payment_id,
      created_at
    };

    paymentsStore = [payment, ...paymentsStore];
    savePayments(paymentsStore);
    return payment;
  },

  async approvePayment(paymentId: string, approvedBy: string): Promise<Payment | undefined> {
    const now = new Date();
    const approved_at = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    paymentsStore = paymentsStore.map((p) => {
      if (p.payment_id === paymentId) {
        return {
          ...p,
          payment_status: 'Approved' as PaymentStatus,
          approved_by: approvedBy,
          approved_at
        };
      }
      return p;
    });

    savePayments(paymentsStore);
    return paymentsStore.find((p) => p.payment_id === paymentId);
  },

  async markAsPaid(paymentId: string): Promise<Payment | undefined> {
    const now = new Date();
    const paid_at = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    paymentsStore = paymentsStore.map((p) => {
      if (p.payment_id === paymentId) {
        return {
          ...p,
          payment_status: 'Paid' as PaymentStatus,
          paid_at
        };
      }
      return p;
    });

    savePayments(paymentsStore);
    return paymentsStore.find((p) => p.payment_id === paymentId);
  },

  async rejectPayment(paymentId: string, reason?: string): Promise<Payment | undefined> {
    paymentsStore = paymentsStore.map((p) => {
      if (p.payment_id === paymentId) {
        return {
          ...p,
          payment_status: 'Rejected' as PaymentStatus
        };
      }
      return p;
    });

    savePayments(paymentsStore);
    return paymentsStore.find((p) => p.payment_id === paymentId);
  },

  async createFromWorkLog(log: { log_id: string; worker_id: string; worker_name: string; worker_code: string; job_id: string; location_name: string }, amount: number = 2800): Promise<Payment> {
    return this.createPayment({
      worker_id: log.worker_id,
      worker_name: log.worker_name,
      worker_code: log.worker_code,
      job_id: log.job_id,
      location_name: log.location_name,
      amount,
      payment_status: 'Pending'
    });
  },

  resetDefaults(): void {
    paymentsStore = initialPayments;
    savePayments(paymentsStore);
  }
};
