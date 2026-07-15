"use client";

import { EmergencyProvider } from "@/lib/emergency-context";
import BottomNavigation from "./components/BottomNavigation";
import ToastContainer from "@/components/ui/ToastContainer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EmergencyProvider role="user">
      <ToastContainer />
      {children}
      <BottomNavigation />
    </EmergencyProvider>
  );
}
