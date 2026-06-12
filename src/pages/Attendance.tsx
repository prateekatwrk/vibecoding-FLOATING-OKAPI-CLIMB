"use client";

import * as React from "react";
import BackButton from "@/components/BackButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Navigation,
} from "lucide-react";
import { useAttendanceTrackingStatus } from "@/components/AttendanceTrackingProvider";
import { type AttendanceRecord } from "@/types/attendance";

function AttendanceEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
        <MapPin className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-slate-950">
        No attendance records yet
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        Attendance tracking is automatic. Records will appear here once location is
        saved during work hours.
      </p>
    </div>
  );
}

function AttendanceRecordCard({ record }: { record: AttendanceRecord }) {
  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-indigo-600" />
              <h3 className="font-semibold text-slate-950">{record.city}</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600">{record.date}</p>
            <p className="mt-1 text-xs text-slate-400">
              {record.latitude.toFixed(6)}, {record.longitude.toFixed(6)}
            </p>
          </div>

          <div className="rounded-2xl bg-indigo-50 px-3 py-2 text-right">
            <p className="text-xs font-medium text-indigo-700">Accuracy</p>
            <p className="mt-1 text-sm font-semibold text-indigo-900">
              {record.accuracy ? `${Math.round(record.accuracy)}m` : "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const Attendance = () => {
  const {
    records,
    trackingEnabled,
    lastCheckMessage,
    nextSaveLabel,
    isWorkHoursNow,
  } = useAttendanceTrackingStatus();

  const today = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const statusLabel = trackingEnabled
    ? isWorkHoursNow
      ? "Auto tracking on"
      : "Waiting for 10 AM"
    : "Permission needed";

  const statusClassName = trackingEnabled
    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
    : "border-amber-200 bg-amber-50 text-amber-900";

  const pillClassName = trackingEnabled
    ? "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200"
    : "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200";

  return (
    <>
      <BackButton className="m-4" />
      <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[380px_1fr] lg:items-start">
          <section className="space-y-4">
            <Card className="overflow-hidden border-indigo-100 shadow-xl shadow-indigo-100/60">
              <CardHeader className="pb-4">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
                  <Navigation className="h-6 w-6" />
                </div>
                <CardTitle className="text-3xl tracking-tight">
                  Attendance
                </CardTitle>
                <CardDescription>
                  Automatic location tracking for work hours.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="rounded-2xl bg-slate-100 p-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Today</p>
                      <p className="text-lg font-bold text-slate-950">{today}</p>
                    </div>
                  </div>
                </div>

                <div className={`rounded-2xl border p-4 ${statusClassName}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold">Attendance tracking</p>
                        <p className="mt-1 text-sm leading-6 opacity-90">
                          {lastCheckMessage}
                        </p>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${pillClassName}`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <p className="text-xs font-medium text-slate-500">
                        Next save
                      </p>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-950">
                      {nextSaveLabel}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <p className="text-xs font-medium text-slate-500">
                        Work window
                      </p>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-950">
                      10 AM – 7 PM
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                    <p className="text-sm leading-6 text-amber-900">
                      Tracking is automatic from 10 AM to 7 PM and saves one
                      location record about every 3 hours. The history is stored
                      locally in this app.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <CardTitle>Attendance history</CardTitle>
                    <CardDescription>
                      {records.length} saved location record
                      {records.length === 1 ? "" : "s"}.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {records.length === 0 ? (
                  <AttendanceEmptyState />
                ) : (
                  <div className="grid gap-3">
                    {records.map((record) => (
                      <AttendanceRecordCard key={record.id} record={record} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </>
  );
};