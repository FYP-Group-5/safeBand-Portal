"use client";

import { EmergencyProvider } from "@/lib/emergency-context";
import ToastContainer from "@/components/ui/ToastContainer";

export default function ResponderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EmergencyProvider role="responder">
      <ToastContainer />
      {children}
    </EmergencyProvider>
  );
}
