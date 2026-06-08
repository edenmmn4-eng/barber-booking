"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateAppointmentStatus } from "@/actions/appointments";
import { AppointmentStatus } from "@/types";
import { toast } from "sonner";

const nextStatus: Partial<Record<AppointmentStatus, AppointmentStatus>> = {
  pending: "confirmed",
  confirmed: "completed",
};

const nextLabel: Partial<Record<AppointmentStatus, string>> = {
  pending: "אשר",
  confirmed: "סמן כהושלם",
};

export function UpdateStatusButton({
  appointmentId,
  currentStatus,
}: {
  appointmentId: string;
  currentStatus: AppointmentStatus;
}) {
  const [loading, setLoading] = useState(false);
  const next = nextStatus[currentStatus];
  if (!next) return null;

  async function handleUpdate() {
    setLoading(true);
    const result = await updateAppointmentStatus(appointmentId, next!);
    if (result.error) toast.error(result.error);
    else toast.success("הסטטוס עודכן");
    setLoading(false);
  }

  return (
    <Button size="sm" variant="outline" onClick={handleUpdate} disabled={loading}
      className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs">
      {loading ? "..." : nextLabel[currentStatus]}
    </Button>
  );
}
