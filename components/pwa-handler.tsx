"use client";

import useServiceWorker from "@/hooks/useServiceWorker";

export default function PWAHandler() {
  useServiceWorker();

  // This component doesn't render anything
  return null;
}
