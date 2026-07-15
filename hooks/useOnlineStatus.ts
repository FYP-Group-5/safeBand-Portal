"use client";

import { useState, useEffect, useRef } from "react";

function getGlobal(): any {
  try {
    return typeof globalThis !== "undefined" ? (globalThis as any) : null;
  } catch {
    return null;
  }
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const isOnlineRef = useRef(true);

  useEffect(() => {
    const g = getGlobal();
    if (g?.navigator) {
      setIsOnline(g.navigator.onLine);
      isOnlineRef.current = g.navigator.onLine;
    }

    const goOnline = () => {
      setIsOnline(true);
      isOnlineRef.current = true;
    };
    const goOffline = () => {
      setIsOnline(false);
      isOnlineRef.current = false;
    };

    if (g) {
      g.addEventListener("online", goOnline);
      g.addEventListener("offline", goOffline);
    }

    return () => {
      if (g) {
        g.removeEventListener("online", goOnline);
        g.removeEventListener("offline", goOffline);
      }
    };
  }, []);

  return { isOnline, isOnlineRef };
}
