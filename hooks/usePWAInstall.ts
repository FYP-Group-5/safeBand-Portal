"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const INSTALL_KEY = "safeband_pwa_installed";

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    console.log("[PWA Install] Hook initialized");
    
    // Function to check if app is installed
    const checkIfInstalled = () => {
      if (typeof window === 'undefined') return false;
      
      // Method 1: Check display mode (works when app is opened as PWA)
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      
      // Method 2: Check iOS standalone
      const isIOSStandalone = (window.navigator as any).standalone === true;
      
      // Method 3: Check Android referrer
      const isAndroidApp = typeof document !== 'undefined' && document.referrer.includes("android-app://");
      
      // Method 4: Check localStorage flag (persists across browser sessions)
      const wasInstalled = typeof localStorage !== 'undefined' && localStorage.getItem(INSTALL_KEY) === "true";
      
      const installed = isStandalone || isIOSStandalone || isAndroidApp || wasInstalled;
      
      console.log("[PWA Install] Installation check:", {
        isStandalone,
        isIOSStandalone,
        isAndroidApp,
        wasInstalled,
        installed
      });
      
      return installed;
    };

    // Initial check
    const installed = checkIfInstalled();
    setIsInstalled(installed);
    
    if (installed) {
      console.log("[PWA Install] App already installed");
    } else {
      console.log("[PWA Install] App not installed, listening for install prompt");
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("[PWA Install] beforeinstallprompt event fired!");
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      // If beforeinstallprompt fires, app is NOT installed
      // Clear the localStorage flag in case user uninstalled
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(INSTALL_KEY);
      }
      setIsInstalled(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for successful installation
    const handleAppInstalled = () => {
      console.log("[PWA Install] App installed successfully!");
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsInstallable(false);
      // Mark as installed in localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(INSTALL_KEY, "true");
      }
    };

    window.addEventListener("appinstalled", handleAppInstalled);
    
    // Check for related apps API (more reliable for checking if installed)
    if (typeof navigator !== 'undefined' && 'getInstalledRelatedApps' in navigator) {
      (navigator as any).getInstalledRelatedApps().then((relatedApps: any[]) => {
        console.log("[PWA Install] Related apps:", relatedApps);
        if (relatedApps && relatedApps.length > 0) {
          console.log("[PWA Install] App is installed (via getInstalledRelatedApps)");
          setIsInstalled(true);
          setIsInstallable(false);
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(INSTALL_KEY, "true");
          }
        }
      }).catch((err: any) => {
        console.log("[PWA Install] getInstalledRelatedApps not available or failed:", err);
      });
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (typeof window === 'undefined') return { outcome: "error" as const };

    console.log("[PWA Install] installApp called");
    console.log("[PWA Install] deferredPrompt:", deferredPrompt);
    console.log("[PWA Install] isInstalled:", isInstalled);
    console.log("[PWA Install] isInstallable:", isInstallable);

    if (!deferredPrompt) {
      console.log("[PWA Install] No deferred prompt available");
      // If no install prompt available, try to redirect to dashboard
      // (useful for iOS or already installed scenarios)
      if (isInstalled) {
        console.log("[PWA Install] Redirecting to dashboard (already installed)");
        window.location.href = "/dashboard";
        return { outcome: "already-installed" as const };
      }
      console.log("[PWA Install] Install not available - showing fallback message");
      // For browsers that don't support install prompt (Safari, Firefox)
      if (typeof window !== 'undefined' && typeof alert !== 'undefined') {
        alert(
          "To install SafeBand:\n\n" +
          "Chrome/Edge: Click the install icon in the address bar\n" +
          "Safari iOS: Tap Share → Add to Home Screen\n" +
          "Firefox: Open menu → Install"
        );
      }
      return { outcome: "not-available" as const };
    }

    try {
      console.log("[PWA Install] Showing install prompt...");
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      console.log("[PWA Install] User choice:", choiceResult.outcome);

      if (choiceResult.outcome === "accepted") {
        setDeferredPrompt(null);
        setIsInstallable(false);
        // Redirect to dashboard after a short delay
        console.log("[PWA Install] Redirecting to dashboard in 1 second...");
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = "/dashboard";
          }
        }, 1000);
      }

      return choiceResult;
    } catch (error) {
      console.error("[PWA Install] Error during installation:", error);
      return { outcome: "error" as const };
    }
  };

  return {
    isInstalled,
    isInstallable,
    installApp,
  };
}
