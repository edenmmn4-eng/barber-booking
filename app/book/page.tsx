import { createClient } from "@/lib/supabase/server";
import { BookingFlow } from "@/components/booking/BookingFlow";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ shop?: string }>;
}) {
  const { shop: shopId } = await searchParams;

  if (!shopId) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
        <p className="text-zinc-400">קישור לא תקין. בקש קישור ישיר מהספר שלך.</p>
      </main>
    );
  }

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", shopId)
    .eq("is_active", true)
    .single();

  if (!profile) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
        <p className="text-zinc-400">הספרייה לא נמצאה.</p>
      </main>
    );
  }

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("shop_id", shopId)
    .eq("is_active", true)
    .order("display_order");

  return (
    <main className="min-h-screen bg-zinc-950 text-white py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{profile.shop_name}</h1>
          {profile.address && <p className="text-zinc-400 mt-1">{profile.address}</p>}
        </div>
        <BookingFlow shopId={shopId} services={services ?? []} />
      </div>
    </main>
  );
}
