import Link from "next/link";
import { Briefcase } from "lucide-react";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="На главную"
      className={cn("flex items-center gap-2.5", className)}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-600 text-white">
        <Briefcase size={20} aria-hidden="true" />
      </span>
      <span className="flex flex-col text-[15px] font-bold leading-none tracking-tight text-zinc-900 sm:flex-row sm:items-baseline sm:text-lg">
        <span>Вакансии</span>
        <span
          aria-hidden="true"
          className="mx-1 hidden select-none text-brand-600 sm:inline"
        >
          ·
        </span>
        <span>Ногинск</span>
      </span>    </Link>
  );
}