"use client";

import * as React from "react";
import { useAttendanceTracking } from "@/hooks/useAttendanceTracking";

type AttendanceTrackingContextValue = ReturnType<typeof useAttendanceTracking>;

const AttendanceTrackingContext =
  React.createContext<AttendanceTrackingContextValue | null>(null);

interface AttendanceTrackingProviderProps {
  children: React.ReactNode;
}

export function AttendanceTrackingProvider({
  children,
}: AttendanceTrackingProviderProps) {
  const value = useAttendanceTracking();

  return (
    <AttendanceTrackingContext.Provider value={value}>
      {children}
    </AttendanceTrackingContext.Provider>
  );
}

export function useAttendanceTrackingStatus() {
  const context = React.useContext(AttendanceTrackingContext);

  if (!context) {
    throw new Error(
      "useAttendanceTrackingStatus must be used within AttendanceTrackingProvider",
    );
  }

  return context;
}