"use client";

import { useState } from "react";
import { formatPhoneDigits } from "@/lib/phone-mask";
import { Input } from "@/components/ui/input";

export function PhoneInput({
  name = "phone",
  defaultValue = "",
}: {
  name?: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <Input
      type="tel"
      name={name}
      inputMode="tel"
      autoComplete="tel"
      required
      value={value}
      onChange={(e) => setValue(formatPhoneDigits(e.target.value))}
      placeholder="+7 (___) ___-__-__"
      className="h-10 bg-white"
    />
  );
}
