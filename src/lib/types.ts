export type FichajeStatus = "idle" | "working" | "paused";

export type RequestStatus = "pendiente" | "aprobada" | "rechazada";

export type RequestType = "vacaciones" | "permiso" | "ausencia_horas" | "baja_medica";

export interface Employee {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  weeklyHours: number;
  isAdmin: boolean;
  joinDate: string;
  phone?: string;
  vacationDays: number;
  vacationUsed: number;
}

export interface FichajeEvent {
  id: string;
  employeeId: string;
  type: "entrada" | "salida" | "inicio_pausa" | "fin_pausa";
  timestamp: string;
  location?: { lat: number; lng: number; address?: string };
  notes?: string;
}

export interface WorkSession {
  id: string;
  employeeId: string;
  date: string;
  entryTime: string;
  exitTime?: string;
  breaks: Array<{ start: string; end?: string }>;
  totalMinutes: number;
  status: "active" | "paused" | "completed";
}

export interface VacationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: RequestType;
  startDate: string;
  endDate: string;
  days: number;
  status: RequestStatus;
  notes?: string;
  attachment?: string;      // base64 data URL
  attachmentName?: string;  // original filename
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface DayStats {
  date: string;
  hoursWorked: number;
  breakMinutes: number;
  overtime: number;
  target: number;
}

export interface WeekStats {
  weekLabel: string;
  totalHours: number;
  targetHours: number;
  days: DayStats[];
}

export interface MonthStats {
  month: string;
  totalHours: number;
  targetHours: number;
  daysWorked: number;
  workingDays: number;
  overtimeHours: number;
  weeklyData: { day: string; hours: number; target: number }[];
}

export interface AdminStats {
  totalEmployees: number;
  workingNow: number;
  onBreak: number;
  totalHoursToday: number;
  pendingRequests: number;
  absentToday: number;
}

export interface LiveEmployee {
  id: string;
  name: string;
  avatar: string;
  status: "working" | "paused" | "absent";
  entryTime?: string;
  elapsedMinutes?: number;
  department: string;
}
