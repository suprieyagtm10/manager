import { Staff, Shift, Leave, Availability, ShiftRule, StaffRole, ShiftType } from "./types";
import { addDays, subDays, startOfDay, setHours, setMinutes } from "date-fns";

const today = startOfDay(new Date());

// Mock Staff Data
export const mockStaff: Staff[] = [
  {
    id: "s1",
    name: "Sarah Johnson",
    role: "nurse",
    phone: "0412 345 678",
    email: "sarah.johnson@email.com",
    employmentType: "full-time",
    preferredShifts: ["morning", "evening"],
    maxWeeklyHours: 38,
    isActive: true,
    notes: "Senior nurse, can supervise",
    createdAt: subDays(today, 365),
  },
  {
    id: "s2",
    name: "Michael Chen",
    role: "nurse",
    phone: "0423 456 789",
    email: "michael.chen@email.com",
    employmentType: "full-time",
    preferredShifts: ["evening", "night"],
    maxWeeklyHours: 38,
    isActive: true,
    notes: "Night shift preferred",
    createdAt: subDays(today, 200),
  },
  {
    id: "s3",
    name: "Emma Williams",
    role: "pca",
    phone: "0434 567 890",
    email: "emma.williams@email.com",
    employmentType: "part-time",
    preferredShifts: ["morning"],
    maxWeeklyHours: 24,
    isActive: true,
    notes: "Available weekdays only",
    createdAt: subDays(today, 150),
  },
  {
    id: "s4",
    name: "James Brown",
    role: "pca",
    phone: "0445 678 901",
    email: "james.brown@email.com",
    employmentType: "casual",
    preferredShifts: ["morning", "evening"],
    maxWeeklyHours: 20,
    isActive: true,
    notes: "University student",
    createdAt: subDays(today, 100),
  },
  {
    id: "s5",
    name: "Lisa Thompson",
    role: "pca",
    phone: "0456 789 012",
    email: "lisa.thompson@email.com",
    employmentType: "full-time",
    preferredShifts: ["morning", "evening", "night"],
    maxWeeklyHours: 38,
    isActive: true,
    notes: "",
    createdAt: subDays(today, 300),
  },
  {
    id: "s6",
    name: "David Martinez",
    role: "kitchen",
    phone: "0467 890 123",
    email: "david.martinez@email.com",
    employmentType: "full-time",
    preferredShifts: ["morning", "kitchen-afternoon"],
    maxWeeklyHours: 38,
    isActive: true,
    notes: "Head cook",
    createdAt: subDays(today, 400),
  },
  {
    id: "s7",
    name: "Amy Wilson",
    role: "kitchen",
    phone: "0478 901 234",
    email: "amy.wilson@email.com",
    employmentType: "part-time",
    preferredShifts: ["kitchen-afternoon"],
    maxWeeklyHours: 20,
    isActive: true,
    notes: "",
    createdAt: subDays(today, 80),
  },
  {
    id: "s8",
    name: "Robert Taylor",
    role: "nurse",
    phone: "0489 012 345",
    email: "robert.taylor@email.com",
    employmentType: "casual",
    preferredShifts: ["night"],
    maxWeeklyHours: 24,
    isActive: true,
    notes: "Night shift only",
    createdAt: subDays(today, 50),
  },
  {
    id: "s9",
    name: "Jennifer Davis",
    role: "pca",
    phone: "0490 123 456",
    email: "jennifer.davis@email.com",
    employmentType: "full-time",
    preferredShifts: ["morning", "evening"],
    maxWeeklyHours: 38,
    isActive: false,
    notes: "Currently on extended leave",
    createdAt: subDays(today, 500),
  },
  {
    id: "s10",
    name: "Kevin Anderson",
    role: "kitchen",
    phone: "0401 234 567",
    email: "kevin.anderson@email.com",
    employmentType: "casual",
    preferredShifts: ["morning"],
    maxWeeklyHours: 16,
    isActive: true,
    notes: "Weekend availability",
    createdAt: subDays(today, 30),
  },
];

// Generate shifts for the week
function generateShifts(): Shift[] {
  const shifts: Shift[] = [];
  const shiftTypes: ShiftType[] = ["morning", "evening", "night", "kitchen-afternoon"];
  const roles: StaffRole[] = ["nurse", "pca", "kitchen"];

  for (let dayOffset = -3; dayOffset <= 10; dayOffset++) {
    const date = addDays(today, dayOffset);

    // Morning shifts - all roles
    shifts.push({
      id: `shift-${dayOffset}-morning-nurse`,
      date,
      shiftType: "morning",
      startTime: "07:00",
      endTime: "15:00",
      roleRequired: "nurse",
      assignedStaffId: dayOffset % 2 === 0 ? "s1" : "s2",
      assignedStaffName: dayOffset % 2 === 0 ? "Sarah Johnson" : "Michael Chen",
      status: "filled",
      notes: "",
    });

    shifts.push({
      id: `shift-${dayOffset}-morning-pca1`,
      date,
      shiftType: "morning",
      startTime: "07:00",
      endTime: "15:00",
      roleRequired: "pca",
      assignedStaffId: "s3",
      assignedStaffName: "Emma Williams",
      status: "filled",
      notes: "",
    });

    shifts.push({
      id: `shift-${dayOffset}-morning-pca2`,
      date,
      shiftType: "morning",
      startTime: "07:00",
      endTime: "15:00",
      roleRequired: "pca",
      assignedStaffId: dayOffset === 2 ? null : "s5",
      assignedStaffName: dayOffset === 2 ? null : "Lisa Thompson",
      status: dayOffset === 2 ? "unfilled" : "filled",
      notes: dayOffset === 2 ? "Need replacement" : "",
    });

    shifts.push({
      id: `shift-${dayOffset}-morning-kitchen`,
      date,
      shiftType: "morning",
      startTime: "07:00",
      endTime: "15:00",
      roleRequired: "kitchen",
      assignedStaffId: "s6",
      assignedStaffName: "David Martinez",
      status: "filled",
      notes: "",
    });

    // Kitchen afternoon shift
    shifts.push({
      id: `shift-${dayOffset}-kitchen-afternoon`,
      date,
      shiftType: "kitchen-afternoon",
      startTime: "15:00",
      endTime: "19:00",
      roleRequired: "kitchen",
      assignedStaffId: dayOffset === 3 ? null : "s7",
      assignedStaffName: dayOffset === 3 ? null : "Amy Wilson",
      status: dayOffset === 3 ? "urgent" : "filled",
      notes: dayOffset === 3 ? "Urgent - need coverage" : "",
    });

    // Evening shifts
    shifts.push({
      id: `shift-${dayOffset}-evening-nurse`,
      date,
      shiftType: "evening",
      startTime: "15:00",
      endTime: "23:00",
      roleRequired: "nurse",
      assignedStaffId: "s2",
      assignedStaffName: "Michael Chen",
      status: "filled",
      notes: "",
    });

    shifts.push({
      id: `shift-${dayOffset}-evening-pca`,
      date,
      shiftType: "evening",
      startTime: "15:00",
      endTime: "23:00",
      roleRequired: "pca",
      assignedStaffId: dayOffset === 1 ? null : "s4",
      assignedStaffName: dayOffset === 1 ? null : "James Brown",
      status: dayOffset === 1 ? "unfilled" : "filled",
      notes: "",
    });

    // Night shifts
    shifts.push({
      id: `shift-${dayOffset}-night-nurse`,
      date,
      shiftType: "night",
      startTime: "23:00",
      endTime: "07:00",
      roleRequired: "nurse",
      assignedStaffId: "s8",
      assignedStaffName: "Robert Taylor",
      status: "filled",
      notes: "",
    });

    shifts.push({
      id: `shift-${dayOffset}-night-pca`,
      date,
      shiftType: "night",
      startTime: "23:00",
      endTime: "07:00",
      roleRequired: "pca",
      assignedStaffId: "s5",
      assignedStaffName: "Lisa Thompson",
      status: "filled",
      notes: "",
    });
  }

  return shifts;
}

export const mockShifts: Shift[] = generateShifts();

// Mock Leave Data
export const mockLeave: Leave[] = [
  {
    id: "l1",
    staffId: "s3",
    staffName: "Emma Williams",
    role: "pca",
    startDate: addDays(today, 5),
    endDate: addDays(today, 12),
    leaveType: "annual",
    reason: "Family vacation",
    status: "approved",
    createdAt: subDays(today, 14),
  },
  {
    id: "l2",
    staffId: "s6",
    staffName: "David Martinez",
    role: "kitchen",
    startDate: addDays(today, 20),
    endDate: addDays(today, 22),
    leaveType: "personal",
    reason: "Personal appointment",
    status: "pending",
    createdAt: subDays(today, 3),
  },
  {
    id: "l3",
    staffId: "s1",
    staffName: "Sarah Johnson",
    role: "nurse",
    startDate: subDays(today, 2),
    endDate: today,
    leaveType: "sick",
    reason: "Unwell",
    status: "emergency",
    createdAt: subDays(today, 2),
  },
  {
    id: "l4",
    staffId: "s4",
    staffName: "James Brown",
    role: "pca",
    startDate: addDays(today, 30),
    endDate: addDays(today, 35),
    leaveType: "annual",
    reason: "University exams",
    status: "approved",
    createdAt: subDays(today, 7),
  },
];

// Mock Availability Data
export const mockAvailability: Availability[] = [
  {
    id: "a1",
    staffName: "Emma Williams",
    role: "pca",
    startDate: today,
    endDate: addDays(today, 14),
    availableDates: [today, addDays(today, 1), addDays(today, 2), addDays(today, 3), addDays(today, 4)],
    unavailableDates: [addDays(today, 5), addDays(today, 6)],
    preferredShifts: ["morning"],
    notes: "No weekends",
    submittedAt: subDays(today, 5),
  },
  {
    id: "a2",
    staffName: "James Brown",
    role: "pca",
    startDate: today,
    endDate: addDays(today, 14),
    availableDates: [addDays(today, 5), addDays(today, 6), addDays(today, 7)],
    unavailableDates: [today, addDays(today, 1), addDays(today, 2), addDays(today, 3), addDays(today, 4)],
    preferredShifts: ["morning", "evening"],
    notes: "Weekends only this period",
    submittedAt: subDays(today, 3),
  },
  {
    id: "a3",
    staffName: "Kevin Anderson",
    role: "kitchen",
    startDate: today,
    endDate: addDays(today, 7),
    availableDates: [addDays(today, 5), addDays(today, 6)],
    unavailableDates: [],
    preferredShifts: ["morning"],
    notes: "Weekend shifts preferred",
    submittedAt: subDays(today, 1),
  },
];

// Mock Shift Rules
export const mockShiftRules: ShiftRule[] = [
  {
    id: "r1",
    name: "No Double Booking",
    description: "Staff cannot be assigned to overlapping shifts on the same day",
    isActive: true,
  },
  {
    id: "r2",
    name: "Night-Morning Gap",
    description: "At least 10 hours rest required between night shift and next shift",
    isActive: true,
  },
  {
    id: "r3",
    name: "Weekly Hour Limit",
    description: "Staff cannot exceed their maximum weekly hours",
    isActive: true,
  },
  {
    id: "r4",
    name: "Role Matching",
    description: "Staff can only be assigned to shifts matching their role",
    isActive: true,
  },
  {
    id: "r5",
    name: "Leave Check",
    description: "Staff cannot be assigned during approved leave periods",
    isActive: true,
  },
  {
    id: "r6",
    name: "Availability Check",
    description: "Prioritize staff availability when making assignments",
    isActive: true,
  },
];

// Helper functions to get data
export function getStaffById(id: string): Staff | undefined {
  return mockStaff.find((s) => s.id === id);
}

export function getActiveStaff(): Staff[] {
  return mockStaff.filter((s) => s.isActive);
}

export function getStaffByRole(role: StaffRole): Staff[] {
  return mockStaff.filter((s) => s.role === role && s.isActive);
}

export function getShiftsByDate(date: Date): Shift[] {
  return mockShifts.filter(
    (s) => startOfDay(s.date).getTime() === startOfDay(date).getTime()
  );
}

export function getUnfilledShifts(): Shift[] {
  return mockShifts.filter((s) => s.status === "unfilled" || s.status === "urgent");
}

export function getUpcomingLeave(): Leave[] {
  return mockLeave.filter(
    (l) => l.endDate >= today && (l.status === "approved" || l.status === "emergency")
  );
}

export function getPendingLeave(): Leave[] {
  return mockLeave.filter((l) => l.status === "pending");
}
