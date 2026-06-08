import Link from "next/link";
import { Scissors } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white px-4">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="p-4 bg-zinc-800 rounded-full">
          <Scissors className="w-10 h-10 text-amber-400" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">ברוך הבא</h1>
        <p className="text-zinc-400 text-lg">
          קבע תור בקלות ובמהירות. בחר שירות, שעה, ושלם פיקדון.
        </p>
        <Link href="/book" className="inline-flex items-center justify-center h-11 px-8 rounded-lg bg-amber-400 hover:bg-amber-500 text-black font-bold w-full transition-colors">
          קבע תור עכשיו
        </Link>
        <Link href="/login" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
          כניסה לאזור הניהול
        </Link>
      </div>
    </main>
  );
}
