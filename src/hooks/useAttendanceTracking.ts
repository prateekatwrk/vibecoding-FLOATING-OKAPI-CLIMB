import * as React from "react";
import {
  ATTENDANCE_STORAGE_KEY,
  type AttendanceRecord,
  loadAttendanceRecords,
} from "@/types/attendance";

const TRACKING_INTERVAL_MS = 3 * 60 * 60 * 1000;
const WORK_START_HOUR = 10;
const WORK_END_HOUR = 19;

function isWithinWorkHours(date: Date) {
  const hour = date.getHours();
  return hour >= WORK_START_HOUR && hour < WORK_END_HOUR;
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

export function useAttendanceTracking() {
  const [records, setRecords] = React.useState<AttendanceRecord[]>(loadAttendanceRecords());
  const [trackingEnabled, setTrackingEnabled] = React.useState(false);
  const [lastCheckMessage, setLastCheckMessage] = React.useState("Location tracking is ready.");

  const saveCurrentLocation = React.useCallback(() => {
    if (!navigator.geolocation) {
      setLastCheckMessage("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const now = new Date();
        const latestRecord = getLatestRecord(records);
        const lastCapture = latestRecord?.timestamp ?? 0;
        const shouldSave = now.getTime() - lastCapture >= TRACKING_INTERVAL_MS;

        if (!shouldSave) {
          setLastCheckMessage("Location checked. Next save is due in 3 hours.");
          return;
        }

        const newRecord: AttendanceRecord = {
          id: `${Date.now()}`,
          city: getCityName(position),
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy ?? null,
          date: now.toLocaleString(),
          timestamp: now.getTime(),
        };

        const nextRecords = [newRecord, ...records].sort(
          (a, b) => b.timestamp - a.timestamp,
        );

        setRecords(nextRecords);
        localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(nextRecords));
        setLastCheckMessage("Location saved for attendance.");
      },
      () => {
        setLastCheckMessage("Could not access your current location.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10 * 60 * 1000,
        timeout: 20 * 1000,
      },
    );
  }, [records]);

  React.useEffect(() => {
    if (!trackingEnabled) {
      return;
    }

    const checkNow = () => {
      if (isWithinWorkHours(new Date())) {
        saveCurrentLocation();
      } else {
        setLastCheckMessage("Outside work hours. Tracking will resume at 10 AM.");
      }
    };

    checkNow();

    const intervalId = window.setInterval(checkNow, 10 * 60 * 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [trackingEnabled, saveCurrentLocation]);

  const startTracking = React.useCallback(() => {
    if (!navigator.geolocation) {
      setLastCheckMessage("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setTrackingEnabled(true);
        setLastCheckMessage("Location tracking started.");
        saveCurrentLocation();
      },
      () => {
        setLastCheckMessage("Please allow location permission to start tracking.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10 * 60 * 1000,
        timeout: 20 * 1000,
      },
    );
  }, [saveCurrentLocation]);

  const stopTracking = React.useCallback(() => {
    setTrackingEnabled(false);
    setLastCheckMessage("Location tracking stopped.");
  }, []);

  return {
    records,
    trackingEnabled,
    lastCheckMessage,
    startTracking,
    stopTracking,
  };
}