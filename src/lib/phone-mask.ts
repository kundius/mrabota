"use client";

export function formatPhoneDigits(digits: string): string {
  let n = digits.replace(/\D/g, "");
  if (n.startsWith("8")) n = n.slice(1);
  else if (n.startsWith("7")) n = n.slice(1);
  n = n.slice(0, 10);

  let out = "+7";
  if (n.length > 0) out += ` (${n.slice(0, 3)}`;
  if (n.length > 3) out += `) ${n.slice(3, 6)}`;
  if (n.length > 6) out += `-${n.slice(6, 8)}`;
  if (n.length > 8) out += `-${n.slice(8, 10)}`;
  return out;
}