import * as React from "react";
import {
  ATTENDANCE_STORAGE_KEY,
  type AttendanceRecord,
  loadAttendanceRecords,
} from "@/types/attendance";

export const TRACKING_INTERVAL_MS = 3 * 60 * 60 * 1000;
const CHECK_INTERVAL_MS = 60 * 1000;
const WORK_START_MINUTES = 10 * 60;
const WORK_END_MINUTES = 19 * 60;

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 10 * 60 * 1000,
  timeout: 20 * 1000,
};

function isWithinWorkHours(date: Date) {
  const timeInMinutes = date.getHours() * 60 + date.getMinutes();
  return timeInMinutes >= WORK_START_MINUTES && timeInMinutes <= WORK_END_MINUTES;
}

function getLatestRecord(records: AttendanceRecord[]) {
  return records.reduce<AttendanceRecord | null>((latest, record) => {
    if (!latest || record.timestamp > latest.timestamp) {
      return record;
    }
    return latest;
  }, null);
}

function getCityName(geolocationPosition: GeolocationPosition) {
  const { latitude, longitude } = geolocationPosition.coords;

  if (latitude >= 28.4 && latitude <= 29.1 && longitude >= 76.8 && longitude <= 77.4) {
    return "Delhi";
  }
  if (latitude >= 18.8 && latitude <= 19.3 && longitude >= 72.6 && longitude <= 73.1) {
    return "Mumbai";
  }
  if (latitude >= 12.8 && latitude <= 13.2 && longitude >= 77.4 && longitude <= 77.8) {
    return "Bengaluru";
  }
  if (latitude >= 22.4 && latitude <= 22.7 && longitude >= 88.2 && longitude <= 88.5) {
    return "Kolkata";
  }
  if (latitude >= 17.2 && latitude <= 17.6 && longitude >= 78.3 && longitude <= 78.6) {
    return "Hyderabad";
  }
  return "Unknown City";
}

function formatDurationUntilNextSave(remainingMs: number) {
  const totalMinutes = Math.max(1, Math.ceil(remainingMs / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${minutes}m`;
}

function getNextEligibleSaveTime(now: Date, lastCapture: number) {
  const dueTime = lastCapture > 0 ? lastCapture + TRACKING_INTERVAL_MS : now.getTime();
  const candidate = new Date(Math.max(dueTime, now.getTime()));

  while (!isWithinWorkHours(candidate)) {
    candidate.setTime(candidate.getTime() + 60 * 60 * 1000);
  }

  return candidate.getTime();
}

function getNextSaveLabel(nowTime: number, lastCapture: number) {
  const nextSaveTime = getNextEligibleSaveTime(new Date(nowTime), lastCapture);
  const remaining = nextSaveTime - nowTime;

  if (remaining <= 0) {
    return "Next save now";
  }
  return `Next save in ${formatDurationUntilNextSave(remaining)}`;
}

export function useAttendanceTracking() {
  const [records, setRecords] = React.useState<AttendanceRecord[]>(loadAttendanceRecords);
  const [trackingEnabled, setTrackingEnabled] = React.useState(false);
  const [lastCheckMessage, setLastCheckMessage] = React.useState("Auto tracking is starting.");
  const [nextSaveLabel, setNextSaveLabel] = React.useState("Waiting for first automatic save.");

  // Persist records
  React.useEffect(() => {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  // Core function to capture location
  const captureLocation = React.useCallback(() => {
    const now = new Date();

    if (!isWithinWorkHours(now)) {
      setLastCheckMessage("Outside work hours. Auto tracking will resume at 10 AM.");
      setNextSaveLabel("Starts at 10 AM");
      return;
    }

    if (!navigator.geolocation) {
      setLastCheckMessage("Geolocation is not supported by this browser.");
      setTrackingEnabled(false);
      setNextSaveLabel("Unavailable");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nowTime = Date.now();

        setRecords((current) => {
          const latest = getLatestRecord(current);
          const lastCapture = latest?.timestamp ?? 0;

          // Respect the 3‑hour interval
          if (lastCapture && nowTime - lastCapture < TRACKING_INTERVAL_MS) {
            setNextSaveLabel(getNextSaveLabel(nowTime, lastCapture));
            setLastCheckMessage("Location checked. Waiting for the next 3‑hour save.");
            return current;
          }

          const newRecord: AttendanceRecord = {
            id: `${nowTime}`,
            city: getCityName(position),
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy ?? null,
            date: new Date(nowTime).toLocaleString(),
            timestamp: nowTime,
          };

          const updated = [newRecord, ...current].sort((a, b) => b.timestamp - a.timestamp);
          setNextSaveLabel(getNextSaveLabel(nowTime, newRecord.timestamp));
          setLastCheckMessage("Location saved for attendance.");
          return updated;
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLastCheckMessage("Location permission denied. Please enable location access in your browser settings.");
        } else {
          setLastCheckMessage("Could not get your location. Please check your connection.");
        }
        setTrackingEnabled(false);
        setNextSaveLabel("Permission needed");
      },
      GEOLOCATION_OPTIONS,
    );
  }, []);

  // Start tracking on mount – this will immediately request permission
  React.useEffect(() => {
    if (!navigator.geolocation) {
      setLastCheckMessage("Geolocation is not supported by this browser.");
      setNextSaveLabel("Unavailable");
      return;
    }

    setTrackingEnabled(true);
    setLastCheckMessage("Requesting location permission...");
    setNextSaveLabel("Waiting for permission");
    captureLocation(); // triggers the browser permission prompt
  }, [captureLocation]);

  // Periodic checks while tracking is enabled
  React.useEffect(() => {
    if (!trackingEnabled) return;

    const intervalId = window.setInterval(captureLocation, CHECK_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [trackingEnabled, captureLocation]);

  // Re‑request when the tab becomes visible
  React.useEffect(() => {
    const onVisibility = () => {
      if (!document.hidden && trackingEnabled) {
        captureLocation();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [trackingEnabled, captureLocation]);

  return {
    records,
    trackingEnabled,
    lastCheckMessage,
    nextSaveLabel,
    isWorkHoursNow: isWithinWorkHours(new Date()),
  };
}