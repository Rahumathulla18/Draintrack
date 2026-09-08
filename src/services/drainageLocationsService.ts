import { DrainageLocation, DrainageCondition } from '../types';
import { initialDrainageLocations } from '../data/mockData';

const STORAGE_KEY = 'draintrack_drainage_locations_v1';

const getStoredDrainages = (): DrainageLocation[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load drainages from localStorage', e);
  }
  return initialDrainageLocations;
};

const saveDrainages = (drainages: DrainageLocation[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drainages));
  } catch (e) {
    console.warn('Failed to save drainages to localStorage', e);
  }
};

let drainagesStore: DrainageLocation[] = getStoredDrainages();

export const drainageLocationsService = {
  async getAll(): Promise<DrainageLocation[]> {
    return [...drainagesStore];
  },

  async getById(id: string): Promise<DrainageLocation | undefined> {
    return drainagesStore.find((d) => d.drainage_id === id);
  },

  async addDrainage(newDrainage: Omit<DrainageLocation, 'drainage_id'>): Promise<DrainageLocation> {
    const drainage_id = `DR-${100 + drainagesStore.length + 1}`;
    const drainage: DrainageLocation = {
      ...newDrainage,
      drainage_id
    };

    drainagesStore = [drainage, ...drainagesStore];
    saveDrainages(drainagesStore);
    return drainage;
  },

  async updateCondition(drainageId: string, condition: DrainageCondition, statusText?: string): Promise<DrainageLocation | undefined> {
    const now = new Date().toISOString().slice(0, 10);
    drainagesStore = drainagesStore.map((d) => {
      if (d.drainage_id === drainageId) {
        return {
          ...d,
          condition,
          current_status: statusText || d.current_status,
          last_cleaned: condition === 'Good' ? now : d.last_cleaned
        };
      }
      return d;
    });

    saveDrainages(drainagesStore);
    return drainagesStore.find((d) => d.drainage_id === drainageId);
  },

  resetDefaults(): void {
    drainagesStore = initialDrainageLocations;
    saveDrainages(drainagesStore);
  }
};
