import { Badge } from "@/components/ui/badge";
import { AppointmentStatus } from "@/types";

const labels: Record<AppointmentStatus, string> = {
  pending: "ממתין",
  confirmed: "מאושר",
  cancelled: "בוטל",
  completed: "הושלם",
  no_show: "לא הגיע",
};

const variants: Record<AppointmentStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  confirmed: "default",
  cancelled: "destructive",
  completed: "secondary",
  no_show: "destructive",
};

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
