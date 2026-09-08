import { MachineData } from '../types';
import { initialMachineData, turbidityHistory } from '../data/mockData';

const STORAGE_KEY = 'draintrack_machine_data_v1';

const getStoredMachineData = (): MachineData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load machine data from localStorage', e);
  }
  return initialMachineData;
};

const saveMachineData = (data: MachineData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save machine data to localStorage', e);
  }
};

let machineStore: MachineData = getStoredMachineData();

export const machineDataService = {
  async getLatest(): Promise<MachineData> {
    return { ...machineStore };
  },

  async getTurbidityHistory() {
    return [...turbidityHistory];
  },

  async updateMachineState(updates: Partial<MachineData>): Promise<MachineData> {
    const now = new Date();
    machineStore = {
      ...machineStore,
      ...updates,
      recorded_at: `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
    };
    saveMachineData(machineStore);
    return { ...machineStore };
  },

  async togglePump(): Promise<MachineData> {
    const nextPump = machineStore.pump_status === 'ON' ? 'OFF' : 'ON';
    return this.updateMachineState({ pump_status: nextPump });
  },

  async toggleBrush(): Promise<MachineData> {
    const nextBrush = machineStore.brush_status === 'ON' ? 'OFF' : 'ON';
    return this.updateMachineState({ brush_status: nextBrush });
  },

  async toggleMachineStatus(): Promise<MachineData> {
    const nextStatus = machineStore.machine_status === 'RUNNING' ? 'IDLE' : 'RUNNING';
    return this.updateMachineState({
      machine_status: nextStatus,
      pump_status: nextStatus === 'RUNNING' ? 'ON' : 'OFF',
      brush_status: nextStatus === 'RUNNING' ? 'ON' : 'OFF'
    });
  },

  async updateTelemetry(turbidity: number, distance_travelled: number): Promise<MachineData> {
    return this.updateMachineState({
      turbidity,
      distance_travelled
    });
  },

  resetDefaults(): void {
    machineStore = initialMachineData;
    saveMachineData(machineStore);
  }
};
