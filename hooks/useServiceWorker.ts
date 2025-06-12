"use client";

import { useEffect } from "react";

export default function useServiceWorker() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      // Only register on homepage for testing
      if (window.location.pathname === "/") {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            console.log("SW registered: ", registration);

            // Handle updates
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (
                    newWorker.state === "installed" &&
                    navigator.serviceWorker.controller
                  ) {
                    // New update available
                    console.log("New content is available; please refresh.");
                  }
                });
              }
            });

            // Listen for messages from service worker
            navigator.serviceWorker.addEventListener("message", (event) => {
              console.log("SW message:", event.data);
            });

            // Check if SW is controlling the page
            if (navigator.serviceWorker.controller) {
              console.log("SW is controlling the page");
            } else {
              console.log("SW is not controlling the page");
            }
          })
          .catch((error) => {
            console.log("SW registration failed: ", error);
          });
      }
    }
  }, []);
}
