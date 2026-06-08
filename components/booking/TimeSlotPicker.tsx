"use client";

import { useState, useEffect } from "react";
import { Service } from "@/types";
import { Button } from "@/components/ui/button";
import { getAvailableSlots } from "@/actions/booking";
import { ChevronRight, ChevronLeft } from "lucide-react";

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toISODate(date: Date) {
  return date.toISOString().split("T")[0];
}

const DAY_NAMES = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

export function TimeSlotPicker({
  shopId,
  service,
  onSelect,
  onBack,
}: {
  shopId: string;
  service: Service;
  onSelect: (date: string, time: string) => void;
  onBack: () => void;
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const weekStart = addDays(today, weekOffset * 7);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    getAvailableSlots(shopId, selectedDate, service.duration_minutes).then((s) => {
      setSlots(s);
      setLoading(false);
    });
  }, [selectedDate, shopId, service.duration_minutes]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">בחר תאריך ושעה</h2>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-zinc-400">
          חזור
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
          disabled={weekOffset === 0} className="border-zinc-700 text-zinc-300">
          <ChevronRight className="w-4 h-4" />
        </Button>
        <div className="flex-1 grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const iso = toISODate(day);
            const isPast = day < today && toISODate(day) !== toISODate(today);
            return (
              <button
                key={iso}
                disabled={isPast}
                onClick={() => setSelectedDate(iso)}
                className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs transition-all
                  ${isPast ? "opacity-30 cursor-not-allowed" : "hover:bg-zinc-800 cursor-pointer"}
                  ${selectedDate === iso ? "bg-amber-400 text-black font-bold hover:bg-amber-500" : "bg-zinc-900 text-zinc-300"}`}
              >
                <span>{DAY_NAMES[day.getDay()]}</span>
                <span className="font-semibold text-sm mt-0.5">{day.getDate()}</span>
              </button>
            );
          })}
        </div>
        <Button variant="outline" size="icon" onClick={() => setWeekOffset((w) => w + 1)}
          className="border-zinc-700 text-zinc-300">
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      {selectedDate && (
        <div>
          {loading ? (
            <p className="text-zinc-400 text-sm">טוען שעות...</p>
          ) : slots.length === 0 ? (
            <p className="text-zinc-400 text-sm">אין שעות פנויות ביום זה</p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {slots.map((slot) => (
                <Button
                  key={slot}
                  variant="outline"
                  onClick={() => onSelect(selectedDate, slot)}
                  className="border-zinc-700 text-zinc-300 hover:bg-amber-400 hover:text-black hover:border-amber-400"
                >
                  {slot}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
