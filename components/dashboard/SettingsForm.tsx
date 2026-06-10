"use client";

import { useState } from "react";
import { updateProfile } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

interface Props {
  profile: { shop_name: string; address: string; phone?: string } | null;
  bookingLink: string;
}

export function SettingsForm({ profile, bookingLink }: Props) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);
    if (result.error) {
      toast.error("שגיאה: " + result.error);
    } else {
      toast.success("ההגדרות נשמרו בהצלחה");
    }
    setLoading(false);
  }

  function copyLink() {
    navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">קישור ההזמנה שלך</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-400 text-sm mb-3">שלח את הקישור הזה ללקוחות שלך</p>
          <div className="flex gap-2">
            <Input
              readOnly
              value={bookingLink}
              className="bg-zinc-800 border-zinc-700 text-zinc-300 text-sm"
            />
            <Button
              type="button"
              variant="outline"
              onClick={copyLink}
              className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">פרטי הספרייה</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="shop_name" className="text-zinc-300">שם הספרייה</Label>
              <Input
                id="shop_name"
                name="shop_name"
                defaultValue={profile?.shop_name ?? ""}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Eden Barber Shop"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="address" className="text-zinc-300">כתובת</Label>
              <Input
                id="address"
                name="address"
                defaultValue={profile?.address ?? ""}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="תל אביב, רחוב הרצל 1"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone" className="text-zinc-300">טלפון</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={profile?.phone ?? ""}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="050-0000000"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-400 hover:bg-amber-500 text-black font-bold mt-2 w-fit"
            >
              {loading ? "שומר..." : "שמור שינויים"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
