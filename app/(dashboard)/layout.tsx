"use client";

import { EmergencyProvider } from "@/lib/emergency-context";
import BottomNavigation from "./components/BottomNavigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EmergencyProvider role="user">
      {children}
      <BottomNavigation />
    </EmergencyProvider>
  );
}
