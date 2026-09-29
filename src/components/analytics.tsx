"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const SCRIPT_SRC = "https://mc.yandex.ru/metrika/tag.js";

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void;
  }
}

function getCounterId(counter: string): number | null {
  const id = counter.trim();
  if (!id || id === "0") return null;
  const num = Number(id);
  return Number.isFinite(num) && num > 0 ? num : null;
}

export function Analytics({ counter }: { counter: string }) {
  const pathname = usePathname();
  const counterId = getCounterId(counter);
  const initialized = useRef(false);

  useEffect(() => {
    if (!counterId || initialized.current) return;
    initialized.current = true;

    if (!window.ym) {
      const script = document.createElement("script");
      script.async = true;
      script.src = SCRIPT_SRC;
      const onLoad = () => {
        window.ym?.(counterId, "init", {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
        });
        const url = window.location.pathname + window.location.search;
        window.ym?.(counterId, "hit", url);
      };
      script.addEventListener("load", onLoad);
      document.head.appendChild(script);
    } else {
      window.ym?.(counterId, "init", {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
      });
    }
  }, [counterId]);

  useEffect(() => {
    if (!counterId) return;
    const url = pathname + window.location.search;
    window.ym?.(counterId, "hit", url);
  }, [pathname, counterId]);

  return null;
}