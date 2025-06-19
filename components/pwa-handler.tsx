"use client";

import { useEffect } from "react";

export default function PWAHandler() {
  useEffect(() => {
    if (
      "serviceWorker" in navigator &&
      process.env.NODE_ENV !== "development"
    ) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").then(
          function (registration) {
            // Registration success
            console.log(
              "Service Worker registration successful with scope: ",
              registration.scope
            );
          },
          function (err) {
            // Registration fail
            console.log("Service Worker registration failed: ", err);
          }
        );
      });
    }
  }, []);

  return null;
}
