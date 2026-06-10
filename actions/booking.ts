"use server";

import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { z } from "zod";

const BookingSchema = z.object({
  shop_id: z.string().uuid(),
  service_id: z.string().uuid(),
  client_name: z.string().min(2),
  client_phone: z.string().min(9),
  client_email: z.string().email().optional().or(z.literal("")),
  appointment_date: z.string(),
  appointment_time: z.string(),
  notes: z.string().optional(),
});

export async function createBooking(formData: unknown) {
  const parsed = BookingSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: "נתונים לא תקינים" };
  }

  const data = parsed.data;
  const supabase = await createClient();

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("*")
    .eq("id", data.service_id)
    .single();

  if (serviceError || !service) {
    return { error: "השירות לא נמצא" };
  }

  const { data: existing } = await supabase
    .from("appointments")
    .select("id")
    .eq("shop_id", data.shop_id)
    .eq("appointment_date", data.appointment_date)
    .eq("appointment_time", data.appointment_time)
    .single();

  if (existing) {
    return { error: "השעה הזו כבר תפוסה, אנא בחר שעה אחרת" };
  }

  let paymentIntentId: string | null = null;
  const stripeConfigured = process.env.STRIPE_SECRET_KEY?.startsWith("sk_");

  if (service.deposit_amount > 0 && stripeConfigured) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: service.deposit_amount,
        currency: "ils",
        metadata: {
          shop_id: data.shop_id,
          service_id: data.service_id,
          client_name: data.client_name,
          client_phone: data.client_phone,
          appointment_date: data.appointment_date,
          appointment_time: data.appointment_time,
        },
      });
      paymentIntentId = paymentIntent.id;
    } catch {
      // Stripe not available - continue without payment
    }
  }

  const { error } = await supabase
    .from("appointments")
    .insert({
      ...data,
      client_email: data.client_email || null,
      payment_intent_id: paymentIntentId,
      status: (service.deposit_amount > 0 && stripeConfigured) ? "pending" : "confirmed",
    });

  if (error) {
    console.error("Supabase insert error:", JSON.stringify(error));
    return { error: "שגיאה ביצירת התור: " + error.message };
  }

  return {
    success: true,
    appointment: null,
    requiresPayment: service.deposit_amount > 0,
    paymentIntentId,
    depositAmount: service.deposit_amount,
  };
}

export async function getAvailableSlots(
  shopId: string,
  date: string,
  durationMinutes: number
) {
  const supabase = await createClient();
  const dayOfWeek = new Date(date).getDay();

  const { data: hours } = await supabase
    .from("working_hours")
    .select("*")
    .eq("shop_id", shopId)
    .eq("day_of_week", dayOfWeek)
    .single();

  if (!hours || !hours.is_open) return [];

  const { data: override } = await supabase
    .from("availability_overrides")
    .select("*")
    .eq("shop_id", shopId)
    .eq("date", date)
    .single();

  if (override?.is_closed) return [];

  const openTime = override?.open_time ?? hours.open_time;
  const closeTime = override?.close_time ?? hours.close_time;

  const { data: booked } = await supabase
    .from("appointments")
    .select("appointment_time")
    .eq("shop_id", shopId)
    .eq("appointment_date", date)
    .neq("status", "cancelled");

  const bookedTimes = new Set(booked?.map((b) => b.appointment_time) ?? []);

  const slots: string[] = [];
  const [openH, openM] = openTime.split(":").map(Number);
  const [closeH, closeM] = closeTime.split(":").map(Number);

  let current = openH * 60 + openM;
  const end = closeH * 60 + closeM;

  while (current + durationMinutes <= end) {
    const h = String(Math.floor(current / 60)).padStart(2, "0");
    const m = String(current % 60).padStart(2, "0");
    const slot = `${h}:${m}:00`;
    if (!bookedTimes.has(slot)) slots.push(`${h}:${m}`);
    current += durationMinutes;
  }

  return slots;
}
