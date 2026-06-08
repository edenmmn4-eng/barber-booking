import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentStatusBadge } from "@/components/dashboard/AppointmentStatusBadge";
import { UpdateStatusButton } from "@/components/dashboard/UpdateStatusButton";
import { Appointment } from "@/types";

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const today = new Date().toISOString().split("T")[0];

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*, service:services(*)")
    .eq("shop_id", user!.id)
    .gte("appointment_date", today)
    .order("appointment_date")
    .order("appointment_time");

  const todayAppts = appointments?.filter((a) => a.appointment_date === today) ?? [];
  const upcomingAppts = appointments?.filter((a) => a.appointment_date > today) ?? [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">לוח תורים</h1>
        <p className="text-zinc-400 mt-1">ניהול התורים הקרובים</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard title="היום" value={todayAppts.length} />
        <StatCard title="הקרובים" value={upcomingAppts.length} />
        <StatCard title="ממתינים לאישור" value={appointments?.filter(a => a.status === "pending").length ?? 0} />
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">תורים להיום</h2>
        {todayAppts.length === 0 ? (
          <p className="text-zinc-500">אין תורים להיום</p>
        ) : (
          <div className="flex flex-col gap-3">
            {todayAppts.map((appt) => <AppointmentCard key={appt.id} appointment={appt} />)}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">תורים קרובים</h2>
        {upcomingAppts.length === 0 ? (
          <p className="text-zinc-500">אין תורים קרובים</p>
        ) : (
          <div className="flex flex-col gap-3">
            {upcomingAppts.map((appt) => <AppointmentCard key={appt.id} appointment={appt} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-zinc-400 text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <span className="text-4xl font-bold text-white">{value}</span>
      </CardContent>
    </Card>
  );
}

function AppointmentCard({ appointment }: { appointment: Appointment & { service: { name: string; price: number } } }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-white">{appointment.client_name}</span>
          <span className="text-zinc-400 text-sm">{appointment.service?.name}</span>
          <span className="text-zinc-500 text-sm">
            {appointment.appointment_date} · {appointment.appointment_time.slice(0, 5)}
          </span>
          {appointment.client_phone && (
            <span className="text-zinc-500 text-sm">{appointment.client_phone}</span>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <AppointmentStatusBadge status={appointment.status} />
          <UpdateStatusButton appointmentId={appointment.id} currentStatus={appointment.status} />
        </div>
      </CardContent>
    </Card>
  );
}
