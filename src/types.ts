export type UserRole = 'ADMIN' | 'WORKER' | 'CITIZEN';

export interface Taluk {
  taluk_id: string;
  taluk_name: string;
  district: string;
}

export interface Ward {
  ward_id: string;
  taluk_id: string;
  ward_number: number;
  ward_name: string;
}

export interface Zone {
  zone_id: string;
  ward_id: string;
  zone_code: string; // e.g. 'Zone A'
  zone_name: string;
}

export type WorkerAvailability = 'Available' | 'Busy' | 'Off-duty';
export type VerificationStatus = 'Verified' | 'Pending' | 'Rejected';

export interface Worker {
  worker_id: string;
  worker_code: string;
  worker_name: string;
  phone: string;
  email: string;
  zone_id: string;
  latitude: number;
  longitude: number;
  availability: WorkerAvailability;
  verification_status: VerificationStatus;
  user_id: string;
  active_job_id?: string;
  total_completed_jobs: number;
  total_distance_km: number;
  total_machine_hours: number;
}

export type DrainageCondition = 'Good' | 'Moderate' | 'Dirty' | 'Blocked' | 'Critical';

export interface DrainageLocation {
  drainage_id: string;
  zone_id: string;
  taluk_name: string;
  ward_name: string;
  location_name: string;
  latitude: number;
  longitude: number;
  condition: DrainageCondition;
  last_cleaned: string;
  current_status: string;
  length_meters: number;
  depth_meters: number;
}

export type ComplaintSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type ComplaintStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Resolved';

export interface Complaint {
  complaint_id: string;
  drainage_id: string;
  location_name: string;
  ward_name: string;
  zone_code: string;
  problem_type: string;
  description: string;
  severity: ComplaintSeverity;
  reported_by: string;
  reporter_phone?: string;
  status: ComplaintStatus;
  reported_at: string;
  assigned_worker_id?: string;
  assigned_worker_name?: string;
  photo_url?: string;
}

export type JobStatus = 'Assigned' | 'Accepted' | 'Travelling' | 'Working' | 'Completed' | 'Verified';

export interface Job {
  job_id: string;
  complaint_id: string;
  worker_id: string;
  worker_name?: string;
  worker_code?: string;
  drainage_id: string;
  location_name: string;
  ward_name: string;
  zone_code: string;
  problem_type: string;
  severity: ComplaintSeverity;
  assigned_at: string;
  accepted_at?: string;
  started_at?: string;
  completed_at?: string;
  job_status: JobStatus;
  estimated_distance_km: number;
  notes?: string;
}

export interface MachineData {
  data_id: string;
  job_id: string;
  turbidity: number; // NTU optical sensor
  water_level: number; // cm water level sensor
  machine_status: 'RUNNING' | 'IDLE' | 'STOPPED' | 'ERROR';
  pump_status: 'ON' | 'OFF';
  brush_status: 'ON' | 'OFF'; // rotating brush (not cutters)
  distance_travelled: number; // meters from wheel encoder
  latitude: number;
  longitude: number;
  recorded_at: string;
  battery_level?: number;
  gas_sensor_ppm?: number; // optional gas sensor (e.g. H2S / toxic sewer gas)
  filtration_status?: string; // mesh, sand, activated carbon filtration
}

export interface WorkLog {
  log_id: string;
  job_id: string;
  worker_id: string;
  worker_name: string;
  worker_code: string;
  location_name: string;
  start_time: string;
  end_time: string;
  work_duration_minutes: number;
  machine_runtime_minutes: number;
  distance_travelled: number; // meters from wheel encoder
  // The system records these signals for combined work verification:
  gps_location?: { latitude: number; longitude: number };
  turbidity?: number; // NTU
  water_level?: number; // cm
  pump_status?: 'ON' | 'OFF';
  brush_status?: 'ON' | 'OFF';
  machine_status?: 'RUNNING' | 'IDLE' | 'STOPPED' | 'ERROR';
  gas_sensor_ppm?: number;
  work_verified: boolean;
  verification_method: string;
  created_at: string;
  telemetry_points?: {
    gps_verified: boolean;
    machine_verified: boolean;
    wheel_encoder_verified: boolean;
    time_verified: boolean;
    turbidity_improved: boolean;
  };
}

export type PaymentStatus = 'Pending' | 'Approved' | 'Paid' | 'Rejected';

export interface Payment {
  payment_id: string;
  worker_id: string;
  worker_name: string;
  worker_code: string;
  job_id: string;
  work_log_id: string;
  location_name: string;
  amount: number; // INR
  payment_status: PaymentStatus;
  approved_by?: string;
  approved_at?: string;
  paid_at?: string;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  worker_id?: string;
  phone?: string;
}
