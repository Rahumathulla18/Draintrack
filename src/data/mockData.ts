import {
  Taluk,
  Ward,
  Zone,
  Worker,
  DrainageLocation,
  Complaint,
  Job,
  MachineData,
  WorkLog,
  Payment,
  AuthUser
} from '../types';

export const mockTaluks: Taluk[] = [
  { taluk_id: 'taluk-1', taluk_name: 'Bengaluru East', district: 'Bengaluru Urban' },
  { taluk_id: 'taluk-2', taluk_name: 'Bengaluru South', district: 'Bengaluru Urban' }
];

export const mockWards: Ward[] = [
  { ward_id: 'ward-01', taluk_id: 'taluk-1', ward_number: 112, ward_name: 'Indiranagar' },
  { ward_id: 'ward-02', taluk_id: 'taluk-1', ward_number: 113, ward_name: 'Halasuru' },
  { ward_id: 'ward-03', taluk_id: 'taluk-2', ward_number: 147, ward_name: 'Koramangala' },
  { ward_id: 'ward-04', taluk_id: 'taluk-2', ward_number: 152, ward_name: 'BTM Layout' }
];

export const mockZones: Zone[] = [
  { zone_id: 'zone-a', ward_id: 'ward-01', zone_code: 'Zone A', zone_name: 'Indiranagar Commercial Corridor' },
  { zone_id: 'zone-b', ward_id: 'ward-02', zone_code: 'Zone B', zone_name: 'Halasuru Lake Catchment' },
  { zone_id: 'zone-c', ward_id: 'ward-03', zone_code: 'Zone C', zone_name: 'Koramangala 4th Block Drain Network' },
  { zone_id: 'zone-d', ward_id: 'ward-04', zone_code: 'Zone D', zone_name: 'BTM Ring Road Storm Drain' }
];

export const initialDrainageLocations: DrainageLocation[] = [
  {
    drainage_id: 'DR-101',
    zone_id: 'zone-a',
    taluk_name: 'Bengaluru East',
    ward_name: 'Indiranagar',
    location_name: '100ft Road Cross - Drain J14',
    latitude: 12.9784,
    longitude: 77.6408,
    condition: 'Blocked',
    last_cleaned: '2026-08-20',
    current_status: 'Severe Silt & Plastic Accumulation',
    length_meters: 350,
    depth_meters: 1.8
  },
  {
    drainage_id: 'DR-102',
    zone_id: 'zone-a',
    taluk_name: 'Bengaluru East',
    ward_name: 'Indiranagar',
    location_name: 'Double Road Main Storm Canal',
    latitude: 12.9721,
    longitude: 77.6355,
    condition: 'Dirty',
    last_cleaned: '2026-08-29',
    current_status: 'Moderate Sludge Flow',
    length_meters: 520,
    depth_meters: 2.2
  },
  {
    drainage_id: 'DR-103',
    zone_id: 'zone-b',
    taluk_name: 'Bengaluru East',
    ward_name: 'Halasuru',
    location_name: 'Bazaar Street Culvert #4',
    latitude: 12.9832,
    longitude: 77.6251,
    condition: 'Critical',
    last_cleaned: '2026-08-12',
    current_status: 'Complete Water Stagnation & Overflow',
    length_meters: 280,
    depth_meters: 1.5
  },
  {
    drainage_id: 'DR-104',
    zone_id: 'zone-c',
    taluk_name: 'Bengaluru South',
    ward_name: 'Koramangala',
    location_name: '80ft Road 4th Block Box Drain',
    latitude: 12.9345,
    longitude: 77.6268,
    condition: 'Good',
    last_cleaned: '2026-09-04',
    current_status: 'Free Flowing, Turbidity Normal',
    length_meters: 610,
    depth_meters: 2.5
  },
  {
    drainage_id: 'DR-105',
    zone_id: 'zone-c',
    taluk_name: 'Bengaluru South',
    ward_name: 'Koramangala',
    location_name: 'Sony World Junction Sub-Drain',
    latitude: 12.9362,
    longitude: 77.6329,
    condition: 'Moderate',
    last_cleaned: '2026-08-30',
    current_status: 'Partial sediment layer',
    length_meters: 410,
    depth_meters: 1.6
  },
  {
    drainage_id: 'DR-106',
    zone_id: 'zone-d',
    taluk_name: 'Bengaluru South',
    ward_name: 'BTM Layout',
    location_name: '7th Cross Lake View Underground Channel',
    latitude: 12.9165,
    longitude: 77.6101,
    condition: 'Good',
    last_cleaned: '2026-09-03',
    current_status: 'Mechanically Desilted and Verified',
    length_meters: 480,
    depth_meters: 2.0
  }
];

export const initialWorkers: Worker[] = [
  {
    worker_id: 'W-01',
    worker_code: 'W001',
    worker_name: 'Ramesh Kumar',
    phone: '+91 98450 21980',
    email: 'ramesh.k@draintrack.gov.in',
    zone_id: 'zone-a',
    latitude: 12.9772,
    longitude: 77.6415,
    availability: 'Available',
    verification_status: 'Verified',
    user_id: 'usr-w1',
    active_job_id: undefined,
    total_completed_jobs: 48,
    total_distance_km: 14.8,
    total_machine_hours: 62.5
  },
  {
    worker_id: 'W-02',
    worker_code: 'W002',
    worker_name: 'Suresh Gowda',
    phone: '+91 97312 45890',
    email: 'suresh.g@draintrack.gov.in',
    zone_id: 'zone-b',
    latitude: 12.9818,
    longitude: 77.6272,
    availability: 'Busy',
    verification_status: 'Verified',
    user_id: 'usr-w2',
    active_job_id: 'JOB-301',
    total_completed_jobs: 35,
    total_distance_km: 11.2,
    total_machine_hours: 44.0
  },
  {
    worker_id: 'W-03',
    worker_code: 'W003',
    worker_name: 'Manjunath Reddy',
    phone: '+91 99008 12345',
    email: 'manjunath.r@draintrack.gov.in',
    zone_id: 'zone-a',
    latitude: 12.9740,
    longitude: 77.6380,
    availability: 'Available',
    verification_status: 'Verified',
    user_id: 'usr-w3',
    active_job_id: undefined,
    total_completed_jobs: 52,
    total_distance_km: 18.1,
    total_machine_hours: 71.0
  },
  {
    worker_id: 'W-04',
    worker_code: 'W004',
    worker_name: 'Anand Shinde',
    phone: '+91 96114 77821',
    email: 'anand.s@draintrack.gov.in',
    zone_id: 'zone-c',
    latitude: 12.9350,
    longitude: 77.6300,
    availability: 'Available',
    verification_status: 'Pending',
    user_id: 'usr-w4',
    active_job_id: undefined,
    total_completed_jobs: 8,
    total_distance_km: 2.9,
    total_machine_hours: 10.5
  },
  {
    worker_id: 'W-05',
    worker_code: 'W005',
    worker_name: 'Pradeep Nayak',
    phone: '+91 94481 60233',
    email: 'pradeep.n@draintrack.gov.in',
    zone_id: 'zone-d',
    latitude: 12.9180,
    longitude: 77.6120,
    availability: 'Off-duty',
    verification_status: 'Verified',
    user_id: 'usr-w5',
    active_job_id: undefined,
    total_completed_jobs: 29,
    total_distance_km: 9.4,
    total_machine_hours: 38.0
  }
];

export const initialComplaints: Complaint[] = [
  {
    complaint_id: 'CMP-2026-001',
    drainage_id: 'DR-101',
    location_name: '100ft Road Cross - Drain J14',
    ward_name: 'Indiranagar',
    zone_code: 'Zone A',
    problem_type: 'Severe Sludge Clog & Waterlogging',
    description: 'Black sludge overflow onto pedestrian footpath after evening showers. Odor is unbearable.',
    severity: 'Critical',
    reported_by: 'Kavitha S. (Resident)',
    reporter_phone: '+91 98860 11223',
    status: 'Pending',
    reported_at: '2026-09-05 04:15 AM'
  },
  {
    complaint_id: 'CMP-2026-002',
    drainage_id: 'DR-103',
    location_name: 'Bazaar Street Culvert #4',
    ward_name: 'Halasuru',
    zone_code: 'Zone B',
    problem_type: 'Solid Plastic Waste & Silt Blockage',
    description: 'Culvert inlet choked with plastic bags and heavy silt. Water level rising fast.',
    severity: 'High',
    reported_by: 'Syed Arshad (Shopkeeper)',
    reporter_phone: '+91 98451 99882',
    status: 'In Progress',
    reported_at: '2026-09-05 02:40 AM',
    assigned_worker_id: 'W-02',
    assigned_worker_name: 'Suresh Gowda (W002)'
  },
  {
    complaint_id: 'CMP-2026-003',
    drainage_id: 'DR-102',
    location_name: 'Double Road Main Storm Canal',
    ward_name: 'Indiranagar',
    zone_code: 'Zone A',
    problem_type: 'Foul Odor & Stagnant Sewage',
    description: 'Sluggish drain flow near the bus stop, mosquito breeding hotspot.',
    severity: 'Medium',
    reported_by: 'Rohan Deshmukh',
    reporter_phone: '+91 97400 44556',
    status: 'Assigned',
    reported_at: '2026-09-04 18:20 PM',
    assigned_worker_id: 'W-01',
    assigned_worker_name: 'Ramesh Kumar (W001)'
  },
  {
    complaint_id: 'CMP-2026-004',
    drainage_id: 'DR-105',
    location_name: 'Sony World Junction Sub-Drain',
    ward_name: 'Koramangala',
    zone_code: 'Zone C',
    problem_type: 'Overflow during Rain',
    description: 'Roadside drain grating blocked with dry leaves and plastic cups.',
    severity: 'Medium',
    reported_by: 'Deepa Hegde',
    reporter_phone: '+91 99160 88771',
    status: 'Pending',
    reported_at: '2026-09-04 14:10 PM'
  },
  {
    complaint_id: 'CMP-2026-005',
    drainage_id: 'DR-104',
    location_name: '80ft Road 4th Block Box Drain',
    ward_name: 'Koramangala',
    zone_code: 'Zone C',
    problem_type: 'Routine Silt Maintenance',
    description: 'Scheduled pre-monsoon mechanical desilting and water clarity check.',
    severity: 'Low',
    reported_by: 'Ward Health Inspector 147',
    reporter_phone: '+91 94480 33441',
    status: 'Resolved',
    reported_at: '2026-09-04 09:00 AM',
    assigned_worker_id: 'W-03',
    assigned_worker_name: 'Manjunath Reddy (W003)'
  },
  {
    complaint_id: 'CMP-2026-006',
    drainage_id: 'DR-106',
    location_name: '7th Cross Lake View Underground Channel',
    ward_name: 'BTM Layout',
    zone_code: 'Zone D',
    problem_type: 'Heavy Silt Accumulation',
    description: 'DrainTrack machine desilting completed with telemetry log submitted.',
    severity: 'High',
    reported_by: 'Citizen Forum BTM',
    reporter_phone: '+91 98452 77119',
    status: 'Resolved',
    reported_at: '2026-09-03 11:30 AM',
    assigned_worker_id: 'W-05',
    assigned_worker_name: 'Pradeep Nayak (W005)'
  }
];

export const initialJobs: Job[] = [
  {
    job_id: 'JOB-301',
    complaint_id: 'CMP-2026-002',
    worker_id: 'W-02',
    worker_name: 'Suresh Gowda',
    worker_code: 'W002',
    drainage_id: 'DR-103',
    location_name: 'Bazaar Street Culvert #4',
    ward_name: 'Halasuru',
    zone_code: 'Zone B',
    problem_type: 'Solid Plastic Waste & Silt Blockage',
    severity: 'High',
    assigned_at: '2026-09-05 03:00 AM',
    accepted_at: '2026-09-05 03:10 AM',
    started_at: '2026-09-05 03:30 AM',
    job_status: 'Working',
    estimated_distance_km: 1.5,
    notes: 'DrainTrack Unit DT-02 connected. Rotating desilting brush engaged.'
  },
  {
    job_id: 'JOB-302',
    complaint_id: 'CMP-2026-003',
    worker_id: 'W-01',
    worker_name: 'Ramesh Kumar',
    worker_code: 'W001',
    drainage_id: 'DR-102',
    location_name: 'Double Road Main Storm Canal',
    ward_name: 'Indiranagar',
    zone_code: 'Zone A',
    problem_type: 'Foul Odor & Stagnant Sewage',
    severity: 'Medium',
    assigned_at: '2026-09-05 04:30 AM',
    accepted_at: '2026-09-05 04:45 AM',
    started_at: undefined,
    job_status: 'Travelling',
    estimated_distance_km: 0.8,
    notes: 'Worker in transit with portable machine on tricycle mount.'
  },
  {
    job_id: 'JOB-303',
    complaint_id: 'CMP-2026-001',
    worker_id: 'W-03',
    worker_name: 'Manjunath Reddy',
    worker_code: 'W003',
    drainage_id: 'DR-101',
    location_name: '100ft Road Cross - Drain J14',
    ward_name: 'Indiranagar',
    zone_code: 'Zone A',
    problem_type: 'Severe Sludge Clog & Waterlogging',
    severity: 'Critical',
    assigned_at: '2026-09-05 05:00 AM',
    accepted_at: undefined,
    job_status: 'Assigned',
    estimated_distance_km: 1.2,
    notes: 'Awaiting worker acceptance on terminal.'
  },
  {
    job_id: 'JOB-304',
    complaint_id: 'CMP-2026-005',
    worker_id: 'W-03',
    worker_name: 'Manjunath Reddy',
    worker_code: 'W003',
    drainage_id: 'DR-104',
    location_name: '80ft Road 4th Block Box Drain',
    ward_name: 'Koramangala',
    zone_code: 'Zone C',
    problem_type: 'Routine Silt Maintenance',
    severity: 'Low',
    assigned_at: '2026-09-04 09:15 AM',
    accepted_at: '2026-09-04 09:20 AM',
    started_at: '2026-09-04 09:40 AM',
    completed_at: '2026-09-04 11:15 AM',
    job_status: 'Verified',
    estimated_distance_km: 2.1,
    notes: 'Turbidity reduced from 850 NTU to 190 NTU. Verified by municipal telemetry.'
  },
  {
    job_id: 'JOB-305',
    complaint_id: 'CMP-2026-006',
    worker_id: 'W-05',
    worker_name: 'Pradeep Nayak',
    worker_code: 'W005',
    drainage_id: 'DR-106',
    location_name: '7th Cross Lake View Underground Channel',
    ward_name: 'BTM Layout',
    zone_code: 'Zone D',
    problem_type: 'Heavy Silt Accumulation',
    severity: 'High',
    assigned_at: '2026-09-03 12:00 PM',
    accepted_at: '2026-09-03 12:10 PM',
    started_at: '2026-09-03 12:35 PM',
    completed_at: '2026-09-03 02:45 PM',
    job_status: 'Completed',
    estimated_distance_km: 3.4,
    notes: 'Work completed, telemetry uploaded, pending administrative payment clearance.'
  }
];

export const initialMachineData: MachineData = {
  data_id: 'MTR-8891',
  job_id: 'JOB-301',
  turbidity: 420, // NTU (optical sensor reading)
  water_level: 68, // cm (water-level sensor)
  machine_status: 'RUNNING',
  pump_status: 'ON',
  brush_status: 'ON', // rotating brush
  distance_travelled: 24.6, // meters (wheel encoder)
  latitude: 12.9832,
  longitude: 77.6251,
  recorded_at: '2026-09-05 05:35:10 AM',
  battery_level: 84,
  gas_sensor_ppm: 0, // optional gas sensor: 0 ppm (Safe)
  filtration_status: 'Mesh, Sand & Activated Carbon Active'
};

export const turbidityHistory = [
  { timestamp: '03:30 AM', turbidity: 850, label: 'Initial Stagnant Sludge' },
  { timestamp: '03:50 AM', turbidity: 650, label: 'Mechanical Brush Agitation' },
  { timestamp: '04:15 AM', turbidity: 420, label: 'Suction Pump & Flushed' },
  { timestamp: '04:40 AM', turbidity: 190, label: 'Water Clarity Restored' }
];

export const initialWorkLogs: WorkLog[] = [
  {
    log_id: 'LOG-901',
    job_id: 'JOB-304',
    worker_id: 'W-03',
    worker_name: 'Manjunath Reddy',
    worker_code: 'W003',
    location_name: '80ft Road 4th Block Box Drain',
    start_time: '2026-09-04 09:40 AM',
    end_time: '2026-09-04 11:15 AM',
    work_duration_minutes: 95,
    machine_runtime_minutes: 82,
    distance_travelled: 54.2,
    gps_location: { latitude: 12.9348, longitude: 77.6258 },
    turbidity: 190,
    water_level: 18,
    pump_status: 'OFF',
    brush_status: 'OFF',
    machine_status: 'STOPPED',
    gas_sensor_ppm: 0,
    work_verified: true,
    verification_method: 'IoT Machine Telemetry + GPS + Wheel Encoder',
    created_at: '2026-09-04 11:20 AM',
    telemetry_points: {
      gps_verified: true,
      machine_verified: true,
      wheel_encoder_verified: true,
      time_verified: true,
      turbidity_improved: true
    }
  },
  {
    log_id: 'LOG-902',
    job_id: 'JOB-305',
    worker_id: 'W-05',
    worker_name: 'Pradeep Nayak',
    worker_code: 'W005',
    location_name: '7th Cross Lake View Underground Channel',
    start_time: '2026-09-03 12:35 PM',
    end_time: '2026-09-03 02:45 PM',
    work_duration_minutes: 130,
    machine_runtime_minutes: 110,
    distance_travelled: 78.5,
    gps_location: { latitude: 12.9165, longitude: 77.6101 },
    turbidity: 182,
    water_level: 15,
    pump_status: 'OFF',
    brush_status: 'OFF',
    machine_status: 'STOPPED',
    gas_sensor_ppm: 0,
    work_verified: true,
    verification_method: 'IoT Machine Telemetry + GPS + Wheel Encoder',
    created_at: '2026-09-03 02:50 PM',
    telemetry_points: {
      gps_verified: true,
      machine_verified: true,
      wheel_encoder_verified: true,
      time_verified: true,
      turbidity_improved: true
    }
  },
  {
    log_id: 'LOG-903',
    job_id: 'JOB-301',
    worker_id: 'W-02',
    worker_name: 'Suresh Gowda',
    worker_code: 'W002',
    location_name: 'Bazaar Street Culvert #4',
    start_time: '2026-09-05 03:30 AM',
    end_time: 'In Progress...',
    work_duration_minutes: 65,
    machine_runtime_minutes: 58,
    distance_travelled: 24.6,
    gps_location: { latitude: 12.9832, longitude: 77.6251 },
    turbidity: 420,
    water_level: 68,
    pump_status: 'ON',
    brush_status: 'ON',
    machine_status: 'RUNNING',
    gas_sensor_ppm: 0,
    work_verified: false,
    verification_method: 'Active IoT Telemetry Stream (Unfinished)',
    created_at: '2026-09-05 03:30 AM',
    telemetry_points: {
      gps_verified: true,
      machine_verified: true,
      wheel_encoder_verified: true,
      time_verified: false,
      turbidity_improved: true
    }
  }
];

export const initialPayments: Payment[] = [
  {
    payment_id: 'PAY-701',
    worker_id: 'W-03',
    worker_name: 'Manjunath Reddy',
    worker_code: 'W003',
    job_id: 'JOB-304',
    work_log_id: 'LOG-901',
    location_name: '80ft Road 4th Block Box Drain',
    amount: 1450,
    payment_status: 'Paid',
    approved_by: 'Executive Engineer M. Sharma',
    approved_at: '2026-09-04 03:15 PM',
    paid_at: '2026-09-04 05:00 PM',
    created_at: '2026-09-04 11:25 AM'
  },
  {
    payment_id: 'PAY-702',
    worker_id: 'W-05',
    worker_name: 'Pradeep Nayak',
    worker_code: 'W005',
    job_id: 'JOB-305',
    work_log_id: 'LOG-902',
    location_name: '7th Cross Lake View Underground Channel',
    amount: 1850,
    payment_status: 'Approved',
    approved_by: 'Assistant Executive Engineer K. Rao',
    approved_at: '2026-09-04 10:30 AM',
    paid_at: undefined,
    created_at: '2026-09-03 03:00 PM'
  },
  {
    payment_id: 'PAY-703',
    worker_id: 'W-02',
    worker_name: 'Suresh Gowda',
    worker_code: 'W002',
    job_id: 'JOB-301',
    work_log_id: 'LOG-903',
    location_name: 'Bazaar Street Culvert #4',
    amount: 1600,
    payment_status: 'Pending',
    approved_by: undefined,
    approved_at: undefined,
    paid_at: undefined,
    created_at: '2026-09-05 04:00 AM'
  },
  {
    payment_id: 'PAY-704',
    worker_id: 'W-01',
    worker_name: 'Ramesh Kumar',
    worker_code: 'W001',
    job_id: 'JOB-280',
    work_log_id: 'LOG-879',
    location_name: 'CMH Road Storm Channel',
    amount: 1200,
    payment_status: 'Paid',
    approved_by: 'Executive Engineer M. Sharma',
    approved_at: '2026-09-02 04:00 PM',
    paid_at: '2026-09-02 06:30 PM',
    created_at: '2026-09-02 01:10 PM'
  },
  {
    payment_id: 'PAY-705',
    worker_id: 'W-04',
    worker_name: 'Anand Murthy',
    worker_code: 'W004',
    job_id: 'JOB-272',
    work_log_id: 'LOG-864',
    location_name: 'Sampige Road Box Drain',
    amount: 1100,
    payment_status: 'Rejected',
    approved_by: 'Assistant Executive Engineer K. Rao',
    approved_at: '2026-09-01 02:00 PM',
    paid_at: undefined,
    created_at: '2026-09-01 11:00 AM'
  }
];

export const demoUsers: Record<string, AuthUser> = {
  admin: {
    id: 'usr-admin-1',
    email: 'commissioner@bbmp.gov.in',
    name: 'Dr. V. Rajesh (Commissioner / Municipal Admin)',
    role: 'ADMIN'
  },
  worker: {
    id: 'usr-w1',
    email: 'ramesh.k@draintrack.gov.in',
    name: 'Ramesh Kumar (Worker W001)',
    role: 'WORKER',
    worker_id: 'W-01',
    phone: '+91 98450 21980'
  },
  citizen: {
    id: 'usr-cit-1',
    email: 'kavitha.resident@gmail.com',
    name: 'Kavitha S. (Citizen)',
    role: 'CITIZEN',
    phone: '+91 98860 11223'
  }
};
