"use client";

import { useState } from "react";
import { Service } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createBooking } from "@/actions/booking";
import { toast } from "sonner";

function formatPrice(cents: number) {
  return `₪${(cents / 100).toFixed(0)}`;
}

export function ClientForm({
  shopId,
  service,
  date,
  time,
  onSuccess,
  onBack,
}: {
  shopId: string;
  service: Service;
  date: string;
  time: string;
  onSuccess: (name: string) => void;
  onBack: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await createBooking({
      shop_id: shopId,
      service_id: service.id,
      client_name: form.name,
      client_phone: form.phone,
      client_email: form.email,
      appointment_date: date,
      appointment_time: `${time}:00`,
      notes: form.notes,
    });

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    toast.success("התור נקבע בהצלחה!");
    onSuccess(form.name);
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">פרטי הלקוח</h2>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-zinc-400">חזור</Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-4 flex flex-col gap-1">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">שירות</span>
            <span className="text-white font-medium">{service.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">תאריך</span>
            <span className="text-white">{date}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">שעה</span>
            <span className="text-white">{time}</span>
          </div>
          {service.deposit_amount > 0 && (
            <div className="flex justify-between text-sm border-t border-zinc-800 pt-2 mt-1">
              <span className="text-zinc-400">פיקדון לתשלום</span>
              <span className="text-amber-400 font-bold">{formatPrice(service.deposit_amount)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name" className="text-zinc-300">שם מלא *</Label>
          <Input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white" placeholder="ישראל ישראלי" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone" className="text-zinc-300">טלפון (WhatsApp) *</Label>
          <Input id="phone" required value={form.phone} onChange={(e) => update("phone", e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white" placeholder="05XXXXXXXX" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-zinc-300">אימייל (אופציונלי)</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white" placeholder="you@example.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notes" className="text-zinc-300">הערות (אופציונלי)</Label>
          <Input id="notes" value={form.notes} onChange={(e) => update("notes", e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white" placeholder="בקשות מיוחדות..." />
        </div>
        <Button type="submit" disabled={loading}
          className="bg-amber-400 hover:bg-amber-500 text-black font-bold mt-2">
          {loading ? "שולח..." : service.deposit_amount > 0 ? `קבע תור ושלם ${formatPrice(service.deposit_amount)}` : "קבע תור"}
        </Button>
      </form>
    </div>
  );
}
