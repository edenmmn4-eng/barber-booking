"use client";

import { Service } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Scissors } from "lucide-react";

function formatPrice(cents: number) {
  return `₪${(cents / 100).toFixed(0)}`;
}

export function ServiceSelector({
  services,
  onSelect,
}: {
  services: Service[];
  onSelect: (service: Service) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">בחר שירות</h2>
      {services.length === 0 && (
        <p className="text-zinc-400">אין שירותים זמינים כרגע.</p>
      )}
      {services.map((service) => (
        <Card
          key={service.id}
          onClick={() => onSelect(service)}
          className="bg-zinc-900 border-zinc-800 hover:border-amber-400 cursor-pointer transition-all hover:bg-zinc-800"
        >
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-800 rounded-lg">
                <Scissors className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-white">{service.name}</p>
                {service.description && (
                  <p className="text-zinc-400 text-sm">{service.description}</p>
                )}
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  <span className="text-zinc-500 text-xs">{service.duration_minutes} דקות</span>
                </div>
              </div>
            </div>
            <div className="text-left">
              <p className="font-bold text-amber-400 text-lg">{formatPrice(service.price)}</p>
              {service.deposit_amount > 0 && (
                <p className="text-zinc-500 text-xs">פיקדון: {formatPrice(service.deposit_amount)}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
