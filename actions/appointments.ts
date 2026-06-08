"use server";

import { createClient } from "@/lib/supabase/server";
import { AppointmentStatus } from "@/types";
import { revalidatePath } from "next/cache";

export async function getAppointments(date?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "לא מחובר" };

  let query = supabase
    .from("appointments")
    .select("*, service:services(*)")
    .eq("shop_id", user.id)
    .order("appointment_date", { ascending: true })
    .order("appointment_time", { ascending: true });

  if (date) query = query.eq("appointment_date", date);

  const { data, error } = await query;
  if (error) return { error: error.message };
  return { data };
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "לא מחובר" };

  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", appointmentId)
    .eq("shop_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getServices(shopId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("shop_id", shopId)
    .eq("is_active", true)
    .order("display_order");

  if (error) return { error: error.message };
  return { data };
}
