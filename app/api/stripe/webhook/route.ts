import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { sendBookingConfirmation } from "@/lib/whatsapp";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const supabase = await createServiceClient();

    const { data: appointment } = await supabase
      .from("appointments")
      .update({ status: "confirmed", deposit_paid: intent.amount_received })
      .eq("payment_intent_id", intent.id)
      .select("*, service:services(*)")
      .single();

    if (appointment && !appointment.whatsapp_sent_at) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("shop_name, address")
        .eq("id", appointment.shop_id)
        .single();

      try {
        await sendBookingConfirmation(
          appointment,
          appointment.service,
          profile?.shop_name ?? "הספר",
          profile?.address ?? null
        );
        await supabase
          .from("appointments")
          .update({ whatsapp_sent_at: new Date().toISOString() })
          .eq("id", appointment.id);
      } catch (e) {
        console.error("WhatsApp failed:", e);
      }
    }
  }

  return NextResponse.json({ received: true });
}
