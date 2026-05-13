// Staff Types
export type StaffRole = "nurse" | "pca" | "kitchen";
export type EmploymentType = "full-time" | "part-time" | "casual";
export type ShiftType = "morning" | "kitchen-afternoon" | "evening" | "night";

export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  email: string;
  employmentType: EmploymentType;
  preferredShifts: ShiftType[];
  maxWeeklyHours: number;
  isActive: boolean;
  notes: string;
  createdAt: Date;
}

// Shift Types
export interface Shift {
  id: string;
  date: Date;
  shiftType: ShiftType;
  startTime: string;
  endTime: string;
  roleRequired: StaffRole;
  assignedStaffId: string | null;
  assignedStaffName: string | null;
  status: "filled" | "unfilled" | "urgent";
  notes: string;
}

// Leave Types
export type LeaveType = "annual" | "sick" | "personal" | "unpaid" | "emergency";
export type LeaveStatus = "pending" | "approved" | "rejected" | "emergency";

export interface Leave {
  id: string;
  staffId: string;
  staffName: string;
  role: StaffRole;
  startDate: Date;
  endDate: Date;
  leaveType: LeaveType;
  reason: string;
  status: LeaveStatus;
  createdAt: Date;
}

// Availability Types
export interface Availability {
  id: string;
  staffName: string;
  role: StaffRole;
  startDate: Date;
  endDate: Date;
  availableDates: Date[];
  unavailableDates: Date[];
  preferredShifts: ShiftType[];
  notes: string;
  submittedAt: Date;
}

// Shift Rules
export interface ShiftRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

// Staff Suggestion Types
export type SuggestionRank = "best-match" | "available" | "warning" | "not-suitable";

export interface StaffSuggestion {
  staff: Staff;
  rank: SuggestionRank;
  warnings: string[];
  weeklyHoursAssigned: number;
}

// Shift Configuration
export const SHIFT_CONFIG: Record<ShiftType, { label: string; startTime: string; endTime: string; roles: StaffRole[] }> = {
  morning: {
    label: "Morning",
    startTime: "07:00",
    endTime: "15:00",
    roles: ["nurse", "pca", "kitchen"],
  },
  "kitchen-afternoon": {
    label: "Kitchen Afternoon",
    startTime: "15:00",
    endTime: "19:00",
    roles: ["kitchen"],
  },
  evening: {
    label: "Evening",
    startTime: "15:00",
    endTime: "23:00",
    roles: ["nurse", "pca"],
  },
  night: {
    label: "Night",
    startTime: "23:00",
    endTime: "07:00",
    roles: ["nurse", "pca"],
  },
};

// Role Configuration
export const ROLE_CONFIG: Record<StaffRole, { label: string; color: string; bgColor: string; textColor: string }> = {
  nurse: {
    label: "Nurse",
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  pca: {
    label: "PCA",
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  kitchen: {
    label: "Kitchen",
    color: "orange",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
  },
};

// Status Configuration
export const STATUS_CONFIG = {
  filled: { label: "Filled", bgColor: "bg-green-100", textColor: "text-green-700" },
  unfilled: { label: "Unfilled", bgColor: "bg-gray-100", textColor: "text-gray-700" },
  urgent: { label: "Urgent", bgColor: "bg-red-100", textColor: "text-red-700" },
};

export const LEAVE_STATUS_CONFIG = {
  pending: { label: "Pending", bgColor: "bg-yellow-100", textColor: "text-yellow-700" },
  approved: { label: "Approved", bgColor: "bg-green-100", textColor: "text-green-700" },
  rejected: { label: "Rejected", bgColor: "bg-red-100", textColor: "text-red-700" },
  emergency: { label: "Emergency", bgColor: "bg-red-100", textColor: "text-red-700" },
};
