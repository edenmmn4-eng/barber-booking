"use client";

import { useState } from "react";
import { Service } from "@/types";
import { ServiceSelector } from "./ServiceSelector";
import { TimeSlotPicker } from "./TimeSlotPicker";
import { ClientForm } from "./ClientForm";
import { Check } from "lucide-react";

type Step = "service" | "time" | "details" | "done";

const steps: { id: Step; label: string }[] = [
  { id: "service", label: "שירות" },
  { id: "time", label: "שעה" },
  { id: "details", label: "פרטים" },
];

export function BookingFlow({ shopId, services }: { shopId: string; services: Service[] }) {
  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [confirmedName, setConfirmedName] = useState("");

  const currentIndex = steps.findIndex((s) => s.id === step);

  if (step === "done") {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-16">
        <div className="p-4 bg-green-500/20 rounded-full">
          <Check className="w-12 h-12 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold">התור נקבע בהצלחה!</h2>
        <p className="text-zinc-400">שלום {confirmedName}, נשלח אליך אישור בוואטסאפ.</p>
        <p className="text-zinc-500 text-sm">
          {selectedDate} · {selectedTime} · {selectedService?.name}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors
              ${i < currentIndex ? "bg-amber-400 text-black" : i === currentIndex ? "bg-amber-400 text-black" : "bg-zinc-800 text-zinc-500"}`}>
              {i < currentIndex ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-sm ${i === currentIndex ? "text-white" : "text-zinc-500"}`}>{s.label}</span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-zinc-700 mx-1" />}
          </div>
        ))}
      </div>

      {step === "service" && (
        <ServiceSelector
          services={services}
          onSelect={(service) => {
            setSelectedService(service);
            setStep("time");
          }}
        />
      )}

      {step === "time" && selectedService && (
        <TimeSlotPicker
          shopId={shopId}
          service={selectedService}
          onSelect={(date, time) => {
            setSelectedDate(date);
            setSelectedTime(time);
            setStep("details");
          }}
          onBack={() => setStep("service")}
        />
      )}

      {step === "details" && selectedService && (
        <ClientForm
          shopId={shopId}
          service={selectedService}
          date={selectedDate}
          time={selectedTime}
          onSuccess={(name) => {
            setConfirmedName(name);
            setStep("done");
          }}
          onBack={() => setStep("time")}
        />
      )}
    </div>
  );
}
