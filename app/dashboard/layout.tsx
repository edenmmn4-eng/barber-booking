import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Scissors, CalendarDays, Settings, LogOut } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("shop_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <aside className="w-64 bg-zinc-900 border-l border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Scissors className="w-6 h-6 text-amber-400" />
            <span className="font-bold text-lg">{profile?.shop_name ?? "לוח הניהול"}</span>
          </div>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white">
            <CalendarDays className="w-5 h-5" />
            <span>תורים</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white">
            <Settings className="w-5 h-5" />
            <span>הגדרות</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white w-full">
              <LogOut className="w-5 h-5" />
              <span>יציאה</span>
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
