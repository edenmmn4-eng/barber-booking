import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/dashboard/SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("shop_name, address, phone")
    .eq("id", user!.id)
    .single();

  const bookingLink = `https://barber-booking-xi-pied.vercel.app/book?shop=${user!.id}`;

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">הגדרות</h1>
        <p className="text-zinc-400 mt-1">ניהול פרטי הספרייה</p>
      </div>
      <SettingsForm profile={profile} bookingLink={bookingLink} />
    </div>
  );
}
