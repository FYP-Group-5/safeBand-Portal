"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useEffect, useState } from "react";
import InstallButton from "@/components/InstallButton";

export default function DebugPWA() {
  const { isInstalled, isInstallable, installApp } = usePWAInstall();
  const [logs, setLogs] = useState<string[]>([]);
  const [swRegistered, setSwRegistered] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    // Check if service worker is registered
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        setSwRegistered(registrations.length > 0);
        addLog(`Service Worker registrations: ${registrations.length}`);
        registrations.forEach((reg, index) => {
          addLog(`  [${index}] ${reg.scope}`);
        });
      });
    } else {
      addLog("Service Worker not supported");
    }

    // Check manifest
    if (typeof document !== 'undefined') {
      const manifestLink = document.querySelector('link[rel="manifest"]');
      if (manifestLink) {
        addLog(`Manifest found: ${manifestLink.getAttribute("href")}`);
      } else {
        addLog("No manifest link found");
      }
    }

    // Check HTTPS
    const isSecure =
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    addLog(
      `Secure context: ${isSecure} (${window.location.protocol}//${window.location.hostname})`,
    );

    // Check localStorage flag
    if (typeof localStorage !== 'undefined') {
      const installFlag = localStorage.getItem("safeband_pwa_installed");
      addLog(`localStorage install flag: ${installFlag || "not set"}`);
    }

    // Listen for beforeinstallprompt
    const listener = (e: Event) => {
      addLog("beforeinstallprompt event fired!");
    };
    window.addEventListener("beforeinstallprompt", listener);

    return () => {
      window.removeEventListener("beforeinstallprompt", listener);
    };
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleClearData = () => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    localStorage.removeItem("safeband_pwa_installed");
    addLog("Cleared localStorage install flag");
    window.location.reload();
  };

  const handleForceInstalled = () => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    localStorage.setItem("safeband_pwa_installed", "true");
    addLog("Set localStorage install flag to true");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">PWA Install Debug</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-bold text-lg mb-2">Installed</h2>
            <p
              className={`text-3xl ${isInstalled ? "text-green-600" : "text-red-600"}`}
            >
              {isInstalled ? "YES" : "NO"}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-bold text-lg mb-2">Installable</h2>
            <p
              className={`text-3xl ${isInstallable ? "text-green-600" : "text-red-600"}`}
            >
              {isInstallable ? "YES" : "NO"}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-bold text-lg mb-2">Service Worker</h2>
            <p
              className={`text-3xl ${swRegistered ? "text-green-600" : "text-red-600"}`}
            >
              {swRegistered ? "YES" : "NO"}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="font-bold text-lg mb-4">Test Install Button</h2>
          <InstallButton size="lg">Install SafeBand</InstallButton>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="font-bold text-lg mb-4">Developer Tools</h2>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleClearData}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold"
            >
              Clear Install Flag
            </button>
            <button
              onClick={handleForceInstalled}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Force "Installed" State
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = "/";
                }
              }}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
            >
              Go to Home Page
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Use these buttons to test different installation states
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-4">Debug Logs</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p>No logs yet...</p>
            ) : (
              logs.map((log, index) => <div key={index}>{log}</div>)
            )}
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h2 className="font-bold text-lg mb-2">How It Works</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <strong>Installed detection:</strong> Checks display-mode,
              localStorage flag, and iOS/Android modes
            </li>
            <li>
              <strong>localStorage flag:</strong> Persists across sessions so we
              know if user installed the app
            </li>
            <li>
              <strong>beforeinstallprompt:</strong> Clears the flag when it
              fires (meaning app was uninstalled)
            </li>
            <li>
              <strong>appinstalled event:</strong> Sets the flag when
              installation succeeds
            </li>
          </ul>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h2 className="font-bold text-lg mb-2">Testing Scenarios</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              <strong>Fresh visit:</strong> Installed=NO, Installable=YES (after
              prompt fires)
            </li>
            <li>
              <strong>After installing:</strong> Installed=YES, Installable=NO,
              localStorage flag set
            </li>
            <li>
              <strong>Visiting in browser after install:</strong> Installed=YES
              (from localStorage)
            </li>
            <li>
              <strong>After uninstalling:</strong> beforeinstallprompt fires,
              clears flag, Installed=NO
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
