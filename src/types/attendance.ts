export interface AttendanceRecord {
  id: string;
  city: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  date: string;
  timestamp: number;
}

export const ATTENDANCE_STORAGE_KEY = "dyad-attendance-v1";

export function createAttendanceId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

export function loadAttendanceRecords(): AttendanceRecord[] {
  const saved = localStorage.getItem(ATTENDANCE_STORAGE_KEY);

  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved) as AttendanceRecord[];

    return parsed
      .filter((item) => item && typeof item.id === "string")
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch {
    return [];
  }
}

export function saveAttendanceRecords(records: AttendanceRecord[]) {
  localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(records));
}