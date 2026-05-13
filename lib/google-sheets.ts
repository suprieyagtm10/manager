// Google Sheets API Integration
// This module provides functions to read/write data from Google Sheets
// Currently using mock data, but structured for easy API integration

import { Staff, Shift, Leave, Availability, ShiftRule } from "./types";

// Configuration
const SHEET_NAMES = {
  staff: "Staff",
  roster: "Roster",
  availability: "Availability",
  leave: "Leave",
  shiftRules: "ShiftRules",
};

// Connection status type
export interface SyncStatus {
  isConnected: boolean;
  lastSynced: Date | null;
  error: string | null;
}

// Mock sync status
let syncStatus: SyncStatus = {
  isConnected: false,
  lastSynced: null,
  error: null,
};

// Check connection status
export async function checkConnection(): Promise<SyncStatus> {
  // In production, this would verify the Google Sheets API connection
  const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
  
  if (!sheetId) {
    return {
      isConnected: false,
      lastSynced: null,
      error: "Google Sheet ID not configured",
    };
  }

  // Simulate connection check
  return {
    isConnected: true,
    lastSynced: new Date(),
    error: null,
  };
}

// Sync all data from Google Sheets
export async function syncFromSheets(): Promise<{
  success: boolean;
  message: string;
  data?: {
    staff: Staff[];
    shifts: Shift[];
    leave: Leave[];
    availability: Availability[];
    rules: ShiftRule[];
  };
}> {
  // In production, this would fetch data from Google Sheets API
  // For now, return mock success
  
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
  
  syncStatus = {
    isConnected: true,
    lastSynced: new Date(),
    error: null,
  };

  return {
    success: true,
    message: "Data synced successfully from Google Sheets",
  };
}

// Sync all data to Google Sheets
export async function syncToSheets(data: {
  staff?: Staff[];
  shifts?: Shift[];
  leave?: Leave[];
  availability?: Availability[];
}): Promise<{ success: boolean; message: string }> {
  // In production, this would write data to Google Sheets API
  
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
  
  syncStatus = {
    isConnected: true,
    lastSynced: new Date(),
    error: null,
  };

  return {
    success: true,
    message: "Data synced successfully to Google Sheets",
  };
}

// Staff operations
export async function addStaffToSheet(staff: Staff): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true, message: "Staff added to Google Sheets" };
}

export async function updateStaffInSheet(staff: Staff): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true, message: "Staff updated in Google Sheets" };
}

export async function deleteStaffFromSheet(staffId: string): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true, message: "Staff archived in Google Sheets" };
}

// Roster operations
export async function addShiftToSheet(shift: Shift): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true, message: "Shift added to Google Sheets" };
}

export async function updateShiftInSheet(shift: Shift): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true, message: "Shift updated in Google Sheets" };
}

export async function deleteShiftFromSheet(shiftId: string): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true, message: "Shift deleted from Google Sheets" };
}

// Leave operations
export async function addLeaveToSheet(leave: Leave): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true, message: "Leave added to Google Sheets" };
}

export async function updateLeaveInSheet(leave: Leave): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true, message: "Leave updated in Google Sheets" };
}

// Availability operations
export async function addAvailabilityToSheet(availability: Availability): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true, message: "Availability added to Google Sheets" };
}

// Get sync status
export function getSyncStatus(): SyncStatus {
  return syncStatus;
}

// Reset sync status (for testing)
export function resetSyncStatus(): void {
  syncStatus = {
    isConnected: false,
    lastSynced: null,
    error: null,
  };
}
